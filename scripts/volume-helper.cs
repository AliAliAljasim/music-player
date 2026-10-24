// Groove volume helper (Windows). Keeps Groove's entries in the Windows
// volume mixer in step with the app's own volume slider, in both directions.
//
// Groove's sound comes out of several processes (Chromium plays audio from a
// separate audio-service process), and Windows gives it one mixer entry per
// output device. This helper finds every session belonging to Groove's
// processes on every active output device and:
//   - sets their volume/mute when the app asks ("set 0.42 0" on stdin),
//   - gives a newly appearing session (e.g. headphones just connected) the
//     app's level,
//   - reports a change made in the mixer ("vol 0.42 0" on stdout) and copies
//     it to Groove's sessions on the other devices.
// The app sends its process ids with "pids 1,2,3"; "list" prints the sessions
// found ("session <key> <volume> <mute>", then "end"). The helper exits when
// stdin closes (the app quit). Compiled at build time with the .NET Framework
// csc (C# 5), so it has no dependencies.

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Runtime.InteropServices;
using System.Threading;

namespace GrooveVolume
{
    [ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")]
    class MMDeviceEnumeratorCom { }

    [ComImport, Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IMMDeviceEnumerator
    {
        int EnumAudioEndpoints(int dataFlow, int stateMask, out IMMDeviceCollection devices);
    }

    [ComImport, Guid("0BD7A1BE-7A1A-44DB-8397-CC5392387B5E"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IMMDeviceCollection
    {
        int GetCount(out uint count);
        int Item(uint index, out IMMDevice device);
    }

    [ComImport, Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IMMDevice
    {
        int Activate(ref Guid iid, int clsCtx, IntPtr activationParams, [MarshalAs(UnmanagedType.IUnknown)] out object iface);
        int OpenPropertyStore(int access, out IntPtr properties);
        int GetId([MarshalAs(UnmanagedType.LPWStr)] out string id);
    }

    [ComImport, Guid("77AA99A0-1BD6-484F-8BC7-2C654C9A9B6F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IAudioSessionManager2
    {
        int GetAudioSessionControl(IntPtr sessionGuid, int flags, out IntPtr control);
        int GetSimpleAudioVolume(IntPtr sessionGuid, int flags, out IntPtr volume);
        int GetSessionEnumerator(out IAudioSessionEnumerator sessions);
    }

    [ComImport, Guid("E2F5BB11-0570-40CA-ACDD-3AA01277DEE8"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IAudioSessionEnumerator
    {
        int GetCount(out int count);
        int GetSession(int index, out IAudioSessionControl2 session);
    }

    [ComImport, Guid("BFB7FF88-7239-4FC9-8FA2-07C950BE9C6D"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IAudioSessionControl2
    {
        // IAudioSessionControl
        int GetState(out int state);
        int GetDisplayName([MarshalAs(UnmanagedType.LPWStr)] out string name);
        int SetDisplayName([MarshalAs(UnmanagedType.LPWStr)] string name, ref Guid context);
        int GetIconPath([MarshalAs(UnmanagedType.LPWStr)] out string path);
        int SetIconPath([MarshalAs(UnmanagedType.LPWStr)] string path, ref Guid context);
        int GetGroupingParam(out Guid param);
        int SetGroupingParam(ref Guid param, ref Guid context);
        int RegisterAudioSessionNotification(IntPtr notification);
        int UnregisterAudioSessionNotification(IntPtr notification);
        // IAudioSessionControl2
        int GetSessionIdentifier([MarshalAs(UnmanagedType.LPWStr)] out string id);
        int GetSessionInstanceIdentifier([MarshalAs(UnmanagedType.LPWStr)] out string id);
        int GetProcessId(out uint pid);
    }

    [ComImport, Guid("87CE5498-68D6-44E5-9215-6DA47EF883D8"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface ISimpleAudioVolume
    {
        int SetMasterVolume(float level, ref Guid context);
        int GetMasterVolume(out float level);
        int SetMute(int mute, ref Guid context);
        int GetMute(out int mute);
    }

    class Program
    {
        const int eRender = 0, DEVICE_STATE_ACTIVE = 1, CLSCTX_ALL = 23;
        static readonly Guid IID_IAudioSessionManager2 = new Guid("77AA99A0-1BD6-484F-8BC7-2C654C9A9B6F");
        static Guid ourContext = new Guid("6A0F2D4E-5B1C-4E7A-9C3D-2B8E7F1A4D60");
        static readonly CultureInfo inv = CultureInfo.InvariantCulture;

        static readonly object gate = new object();
        static HashSet<uint> pids = new HashSet<uint>();
        static float target = -1;      // the app's level, 0..1 (-1 until the app says)
        static bool targetMute = false;
        static bool dirty = false;     // the app sent a new level to apply
        static bool listRequested = false;
        static string lastError = null;
        // Last volume/mute seen per session, to spot changes made in the mixer.
        static Dictionary<string, float> seenVol = new Dictionary<string, float>();
        static Dictionary<string, bool> seenMute = new Dictionary<string, bool>();

        [MTAThread]
        static void Main()
        {
            var reader = new Thread(ReadCommands);
            reader.IsBackground = true;
            reader.Start();
            var enumerator = (IMMDeviceEnumerator)new MMDeviceEnumeratorCom();
            while (reader.IsAlive)
            {
                // A device can vanish mid-scan; report it (once per message) and try again.
                try { Poll(enumerator); }
                catch (Exception e) { if (e.Message != lastError) { lastError = e.Message; Console.Error.WriteLine("error " + e.GetType().Name + ": " + e.Message); } }
                Thread.Sleep(250);
            }
        }

        static void ReadCommands()
        {
            string line;
            while ((line = Console.ReadLine()) != null)
            {
                var parts = line.Trim().Split(' ');
                lock (gate)
                {
                    if (parts[0] == "pids" && parts.Length > 1)
                    {
                        var set = new HashSet<uint>();
                        foreach (var p in parts[1].Split(',')) { uint v; if (uint.TryParse(p, out v)) set.Add(v); }
                        pids = set;
                    }
                    else if (parts[0] == "list")
                    {
                        listRequested = true;
                    }
                    else if (parts[0] == "set" && parts.Length > 2)
                    {
                        float v;
                        if (float.TryParse(parts[1], NumberStyles.Float, inv, out v))
                        {
                            target = Math.Max(0f, Math.Min(1f, v));
                            targetMute = parts[2] == "1";
                            dirty = true;
                        }
                    }
                }
            }
        }

        class Session { public string Key; public ISimpleAudioVolume Volume; }

        static List<Session> FindSessions(IMMDeviceEnumerator enumerator, HashSet<uint> ours)
        {
            var found = new List<Session>();
            IMMDeviceCollection devices;
            enumerator.EnumAudioEndpoints(eRender, DEVICE_STATE_ACTIVE, out devices);
            uint count;
            devices.GetCount(out count);
            for (uint i = 0; i < count; i++)
            {
                IMMDevice device;
                devices.Item(i, out device);
                string deviceId;
                device.GetId(out deviceId);
                object o;
                var iid = IID_IAudioSessionManager2;
                if (device.Activate(ref iid, CLSCTX_ALL, IntPtr.Zero, out o) != 0) continue;
                IAudioSessionEnumerator sessions;
                ((IAudioSessionManager2)o).GetSessionEnumerator(out sessions);
                int n;
                sessions.GetCount(out n);
                for (int s = 0; s < n; s++)
                {
                    IAudioSessionControl2 control;
                    sessions.GetSession(s, out control);
                    uint pid;
                    control.GetProcessId(out pid);
                    if (!ours.Contains(pid)) continue;
                    string instance;
                    control.GetSessionInstanceIdentifier(out instance);
                    found.Add(new Session { Key = deviceId + "|" + instance, Volume = (ISimpleAudioVolume)control });
                }
            }
            return found;
        }

        static void Read(Session s, out float v, out bool m)
        {
            int mute;
            s.Volume.GetMasterVolume(out v);
            s.Volume.GetMute(out mute);
            m = mute != 0;
        }

        static string Fmt(float v, bool m) { return v.ToString("0.000", inv) + " " + (m ? "1" : "0"); }

        static void Poll(IMMDeviceEnumerator enumerator)
        {
            HashSet<uint> ours;
            float want;
            bool wantMute, apply, list;
            lock (gate) { ours = pids; want = target; wantMute = targetMute; apply = dirty; dirty = false; list = listRequested; listRequested = false; }
            if (ours.Count == 0) return;

            var sessions = FindSessions(enumerator, ours);
            if (list)
            {
                foreach (var s in sessions) { float v; bool m; Read(s, out v, out m); Console.WriteLine("session " + s.Key.Replace(' ', '_') + " " + Fmt(v, m)); }
                Console.WriteLine("end");
                Console.Out.Flush();
            }
            if (want < 0) return;

            // A change made in the mixer since the last look wins over the app's
            // level (unless the app has just sent a newer one).
            if (!apply)
            {
                foreach (var s in sessions)
                {
                    float v; bool m;
                    Read(s, out v, out m);
                    float before;
                    if (seenVol.TryGetValue(s.Key, out before) && (Math.Abs(v - before) > 0.002f || m != seenMute[s.Key]))
                    {
                        want = v; wantMute = m; apply = true;
                        lock (gate) { if (!dirty) { target = v; targetMute = m; } }
                        Console.WriteLine("vol " + Fmt(v, m));
                        Console.Out.Flush();
                        break;
                    }
                }
            }

            foreach (var s in sessions)
            {
                float v; bool m;
                Read(s, out v, out m);
                bool isNew = !seenVol.ContainsKey(s.Key);
                if ((apply || isNew) && (Math.Abs(v - want) > 0.002f || m != wantMute))
                {
                    s.Volume.SetMasterVolume(want, ref ourContext);
                    s.Volume.SetMute(wantMute ? 1 : 0, ref ourContext);
                    v = want; m = wantMute;
                }
                seenVol[s.Key] = v;
                seenMute[s.Key] = m;
            }
        }
    }
}
