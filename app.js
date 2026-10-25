"use strict";
(() => {
  const ACCENT = '#E0A458';
  const SHOW_BACKDROP_PREF = true;

  const GROOVES = 'repeating-radial-gradient(circle at 50% 50%, rgba(0,0,0,.16) 0 1px, rgba(0,0,0,0) 1px 3px)';
  const SHEEN = 'conic-gradient(from 20deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,.16) 30deg, rgba(255,255,255,0) 60deg, rgba(255,255,255,0) 180deg, rgba(255,255,255,.12) 210deg, rgba(255,255,255,0) 240deg)';
  const RINGS = 'radial-gradient(circle closest-side, rgba(0,0,0,0) 0 34%, rgba(0,0,0,.22) 34% 40%, rgba(0,0,0,0) 40% 55%, rgba(255,255,255,.08) 55% 55.5%, rgba(0,0,0,0) 55.5% 68%, rgba(255,255,255,.08) 68% 68.5%, rgba(0,0,0,0) 68.5% 81%, rgba(255,255,255,.08) 81% 81.5%, rgba(0,0,0,0) 81.5% 96.5%, rgba(255,255,255,.06) 96.5% 100%)';

  const PALETTES = [
    ['#E2462F', '#F2B33D', '#1E2A78', '#F6EEDC'], ['#2B4C7E', '#F28F3B', '#16233D', '#F4E9D8'],
    ['#4C8C6B', '#F2D16B', '#1F3A2E', '#F3EEE2'], ['#6B3FA0', '#FF8FAB', '#1B1035', '#F6E9F0'],
    ['#E8A33D', '#C2410C', '#3B2A1A', '#FFF4DC'], ['#1F6F8B', '#99E1D9', '#0B2E3A', '#EAF7F5'],
    ['#B23A48', '#FCB9B2', '#461220', '#FFF0EE'], ['#2E2E2E', '#E9D758', '#F25F5C', '#F5F5F0']
  ];

  const VINYLS = [
    { name: 'Midnight Black', style: 'solid', c: ['#141414'] },
    { name: 'Oxblood', style: 'clear', c: ['#6E1423'] },
    { name: 'Cherry Splatter', style: 'splatter', c: ['#C1121F', '#F6EEDC', '#141414'] },
    { name: 'Tangerine Haze', style: 'smoke', c: ['#F28C28', '#FFD29A'] },
    { name: 'Mustard Marble', style: 'marble', c: ['#E3B23C', '#FFF4DC', '#9C6B12'] },
    { name: 'Lemonade', style: 'splatter', c: ['#F4E04D', '#FFFFFF', '#F28C28'] },
    { name: 'Seafoam Swirl', style: 'swirl', c: ['#7BD3C1', '#EAF7F5'] },
    { name: 'Forest Smoke', style: 'smoke', c: ['#2D6A4F', '#0B1F16'] },
    { name: 'Lime Splatter', style: 'opaque-splatter', c: ['#A7C957', '#141414', '#F6EEDC'] },
    { name: 'Ocean Split', style: 'half', c: ['#1D4E89', '#5FA8D3'] },
    { name: 'Cobalt Galaxy', style: 'galaxy', c: ['#1B2A6B', '#FFFFFF', '#99E1D9'] },
    { name: 'Sky Clear', style: 'clear', c: ['#9AD1F5'] },
    { name: 'Lilac Marble', style: 'marble', c: ['#B79CED', '#F6E9F0', '#6B3FA0'] },
    { name: 'Ultraviolet', style: 'splatter', c: ['#5A189A', '#FF8FAB', '#F6E9F0'] },
    { name: 'Bubblegum Eye', style: 'inner', c: ['#FF8FAB', '#FFF0EE'] },
    { name: 'Coke Bottle', style: 'clear', c: ['#BFD8C6'] },
    { name: 'Bone Splatter', style: 'opaque-splatter', c: ['#EFE6D2', '#141414', '#B23A48'] },
    { name: 'Rust Pinwheel', style: 'pinwheel', c: ['#B5562D', '#F4E9D8'] },
    { name: 'Grey Smoke', style: 'smoke', c: ['#8D99AE', '#2E2E2E'] },
    { name: 'Gold Rush', style: 'metallic', c: ['#C9A227', '#FFF1B8', '#7A5C10'] }
  ];

  const SPOTS = [[28,22,2.4,1],[64,16,1.5,2],[80,40,3,1],[17,60,2,2],[40,82,2.6,1],[73,76,1.8,1],[88,62,1.3,2],[12,36,1.4,1],[55,8,1.2,1],[22,78,1.1,2],[60,90,1.6,2],[91,28,1.1,1],[33,10,0.9,2],[8,50,1,1],[84,85,1.2,1],[47,94,0.9,1]];

  const DATA = [
    { name: 'Liked music', color: '#D9A441', tracks: [['Paper Lanterns', 'Marlow Ives', 214], ['Slow Static', 'Halden', 248], ['Coastline FM', 'The Quiet Hours', 197], ['Glass Orchard', 'Juno Vale', 231], ['Second Light', 'Oren & the Fields', 263], ['Night Bus', 'Kiko Marsh', 182], ['Low Tide Radio', 'Halden', 225], ['Velvet Margin', 'Ana Sorel', 241]] },
    { name: 'Late night', color: '#4F7FA0', tracks: [['Neon Rain', 'Sable Drive', 256], ['3 A.M. Kitchen', 'Marlow Ives', 203], ['Afterglow', 'Juno Vale', 238], ['Empty Platform', 'The Quiet Hours', 271], ['Moth', 'Ana Sorel', 189], ['Streetlight Hymn', 'Kiko Marsh', 244]] },
    { name: 'Sunday morning', color: '#9AAA6A', tracks: [['Linen', 'Oren & the Fields', 199], ['Toast & Honey', 'Juno Vale', 176], ['Open Window', 'Halden', 228], ['Green Room', 'Ana Sorel', 214], ['Slow Walk Home', 'Marlow Ives', 252]] },
    { name: 'Focus', color: '#C8553D', tracks: [['Grid', 'Sable Drive', 312], ['Quiet Engine', 'The Quiet Hours', 287], ['Margins', 'Halden', 265], ['Ink', 'Kiko Marsh', 241], ['Long Division', 'Sable Drive', 298], ['White Space', 'Ana Sorel', 276], ['Tessellate', 'Halden', 254]] },
    { name: 'Road trip', color: '#8A6BA0', tracks: [['Mile Marker', 'Oren & the Fields', 221], ['Rearview', 'Marlow Ives', 207], ['Desert Wire', 'Sable Drive', 239], ['Gas Station Sunrise', 'Kiko Marsh', 218], ['Hundred Miles of Static', 'The Quiet Hours', 266], ['Windows Down', 'Juno Vale', 194]] },
    { name: 'Rainy days', color: '#4E9484', tracks: [['Grey Sweater', 'Ana Sorel', 233], ['Puddles', 'Juno Vale', 185], ['Fogged', 'Halden', 247], ['Umbrella Song', 'Oren & the Fields', 212], ['Tin Roof', 'Kiko Marsh', 229]] },
    { name: 'Throwbacks', color: '#B9774A', tracks: [['Cassette Summer', 'Marlow Ives', 219], ['Mixtape No. 4', 'Sable Drive', 236], ['Rewind', 'The Quiet Hours', 201], ['Old Phone Number', 'Juno Vale', 224], ['Polaroid', 'Ana Sorel', 208], ['Arcade Lights', 'Kiko Marsh', 243]] },
    { name: 'Wind down', color: '#7D8AA6', tracks: [['Lamp Off', 'Halden', 281], ['Breathing Room', 'Ana Sorel', 258], ['Soft Focus', 'Oren & the Fields', 236], ['Goodnight, Harbour', 'The Quiet Hours', 302]] }
  ];

  // ---------- state ----------
  // Player.dc.html imports Main with start-view="player": land on the turntable.

  // Playback preferences, remembered between visits. fade and crossfade are seconds (0 = off).
  const PREFS_KEY = 'bside.prefs';
  const PREFS = { shuffle: false, repeat: 'off', volume: 80, muted: false, fade: 1.5, crossfade: 0, lyrics: false, sortKey: '', sortDir: 1, keys: {} };

  function loadPrefs() {
    try {
      const p = JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
      return Object.fromEntries(Object.keys(PREFS).filter((k) => typeof p[k] === typeof PREFS[k]).map((k) => [k, p[k]]));
    } catch (e) {
      return {}; // storage unavailable: defaults
    }
  }

  const state = {
    view: 'player', openId: 1, plId: 1, idx: 2, pos: 0,
    playing: false, pick: null, rpm: 33, zoom: 1,
    account: null, syncing: false, ytError: '', panel: null, volumeHint: false,
    qTrack: null, menu: null, sleep: null, listFilter: '',
    search: { q: '', ytQ: '', yt: null, loading: false, error: '' },
    ...PREFS, ...loadPrefs()
  };

  const yt = window.BSideYouTube;
  const SAMPLE = DATA.slice();
  const PL_COLORS = DATA.map((p) => p.color);

  function setState(patch) {
    Object.assign(state, patch);
    render();
  }

  function setPrefs(patch) {
    setState(patch);
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(Object.fromEntries(Object.keys(PREFS).map((k) => [k, state[k]]))));
    } catch (e) { /* storage unavailable: settings last this session */ }
  }

  // Volume follows a decibel curve, the way loudness is heard: 1% is about
  // -50 dB (a whisper), 50% is -25 dB, 100% is full, and 0 is silent. In the
  // desktop app the curve is applied precisely inside the YouTube player
  // (see main.js); in a plain browser the player's whole-number volume is
  // the closest it can get.
  const VOLUME_FLOOR_DB = -50;
  const volumeGain = (v) => (v <= 0 ? 0 : Math.pow(10, (VOLUME_FLOOR_DB * (1 - v / 100)) / 20));

  // In the installed app Groove's slider is also its Windows volume-mixer
  // entry: the mixer shows the same number (it applies volume/100 itself),
  // mute is shared, and the player makes up the rest of the curve.
  let mixer = false;

  function applyVolume(fromMixer) {
    const v = state.muted ? 0 : state.volume;
    const g = volumeGain(v);
    if (mixer) {
      if (!fromMixer) shell.mixer.set(state.volume / 100, state.muted);
      yt.setVolume(state.volume > 0 ? 100 : 0);
      shell.setOutputGain(state.volume > 0 ? volumeGain(state.volume) / (state.volume / 100) : 0);
    } else if (shell && shell.setOutputGain) {
      yt.setVolume(v > 0 ? 100 : 0);
      shell.setOutputGain(g);
    } else {
      yt.setVolume(v > 0 ? Math.max(1, Math.round(100 * g)) : 0);
    }
  }

  // ---------- toasts ----------
  // A small card at the top right: a title, an optional detail line (the
  // song, or what went wrong) and an icon for the kind: ok, like, info or
  // error. Errors stay longer; hovering keeps any toast up. `opts.id`
  // replaces a toast with the same id (the volume, a YouTube error) instead
  // of stacking another; `opts.sticky` keeps it until closed or replaced.
  const TOAST_ICONS = {
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>',
    like: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"></path></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 11v6"></path><path d="M12 7.2v.1"></path></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 6.5v7"></path><path d="M12 17.3v.1"></path></svg>'
  };
  const TOAST_MAX = 3;
  const toastTimers = new WeakMap();

  function dismissToast(node) {
    if (!node || node.classList.contains('leaving')) return;
    clearTimeout(toastTimers.get(node));
    node.classList.add('leaving');
    setTimeout(() => node.remove(), 180);
  }

  function notify(title, detail = '', kind = 'ok', opts = {}) {
    const box = document.getElementById('toasts');
    if (!box) return;
    const old = opts.id && box.querySelector('[data-id="' + opts.id + '"]');
    const node = document.createElement('div');
    node.className = 'toast ' + kind;
    node.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    if (opts.id) node.dataset.id = opts.id;
    node.innerHTML = '<span class="toast-icon">' + (TOAST_ICONS[kind] || TOAST_ICONS.ok) + '</span><span class="toast-text"><span class="toast-title"></span><span class="toast-detail"></span></span>' +
      '<button class="toast-close" aria-label="Close"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M1 1l8 8M9 1L1 9"></path></svg></button>';
    node.querySelector('.toast-title').textContent = title;
    const d = node.querySelector('.toast-detail');
    if (detail) d.textContent = detail; else d.remove();
    if (detail) node.title = detail;
    node.querySelector('.toast-close').addEventListener('click', () => dismissToast(node));
    const ms = kind === 'error' ? 8000 : 4000;
    const arm = () => { if (!opts.sticky) toastTimers.set(node, setTimeout(() => dismissToast(node), ms)); };
    node.addEventListener('mouseenter', () => clearTimeout(toastTimers.get(node)));
    node.addEventListener('mouseleave', arm);
    if (old) { clearTimeout(toastTimers.get(old)); old.replaceWith(node); node.style.animation = 'none'; } else box.prepend(node);
    arm();
    [...box.querySelectorAll('.toast:not(.leaving)')].slice(TOAST_MAX).forEach(dismissToast);
  }

  // ---------- play order ----------
  // `order` lists the current playlist's track indexes in the order they
  // play: as listed, or shuffled with the starting track first.

  let order = [];
  const blocked = new Set(); // video ids YouTube refused to play here

  // A playlist's songs in display/play order: as listed, or sorted by the
  // column you picked (title, artist or length; ties keep playlist order).
  // Sorting is this app's view only; the playlist on YouTube is unchanged.
  const fold = (x) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const SORT_VALUE = { title: (t) => fold(t[0]), artist: (t) => fold(t[1]), time: (t) => t[2] };

  function playlistOrder(plId) {
    const tr = DATA[plId].tracks, idx = [...tr.keys()], val = SORT_VALUE[state.sortKey];
    if (!val) return idx;
    return idx.sort((a, b) => {
      const x = val(tr[a]), y = val(tr[b]);
      return (x < y ? -1 : x > y ? 1 : 0) * state.sortDir || a - b;
    });
  }

  function buildOrder(plId, first) {
    order = playlistOrder(plId);
    if (!state.shuffle) return;
    order.splice(first, 1);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    order.unshift(first);
  }

  function isBlocked(plId, i) {
    const id = DATA[plId].tracks[i][3];
    return !!id && blocked.has(id);
  }

  // Up to `count` playable tracks after (dir 1) or before (dir -1) the
  // current one in play order; `wrap` carries on past the ends.
  function walk(dir, count, wrap) {
    const n = order.length, p = order.indexOf(state.idx), out = [];
    for (let k = 1; k < n && out.length < count; k++) {
      const q = p + dir * k;
      if (!wrap && (q < 0 || q >= n)) break;
      const j = order[((q % n) + n) % n];
      if (!isBlocked(state.plId, j)) out.push(j);
    }
    return out;
  }

  // ---------- queue ----------
  // "Play next" / "Add to queue" songs (and songs played from search) play
  // ahead of the playlist. While one plays it is `state.qTrack`; the playlist
  // position (plId/idx) stays put, so the playlist carries on from there once
  // the queue runs out.

  let userQueue = []; // tracks waiting to play, in order
  // A removed song still playing as a one-off: the playlist's current song
  // (idx) is then the next one to play, not one already played.
  let carryOn = null;

  const playable = (t) => !(t[3] && blocked.has(t[3]));

  // The song playing now: a queued one, or the playlist's current song.
  function nowTrack() { return state.qTrack || DATA[state.plId].tracks[state.idx]; }

  // Where to go next. `auto`: the song finished (repeat applies, and with
  // repeat off the playlist can end). Returns { repeat } | { queue } |
  // { idx } | null for the end of the playlist.
  function nextMove(auto, ignoreRepeatOne) {
    if (auto && !ignoreRepeatOne && state.repeat === 'one' && playable(nowTrack())) return { repeat: true };
    while (userQueue.length && !playable(userQueue[0])) userQueue.shift();
    if (userQueue.length) return { queue: true };
    if (state.qTrack && state.qTrack === carryOn && playable(DATA[state.plId].tracks[state.idx])) return { idx: state.idx };
    const [j] = walk(1, 1, !auto || state.repeat === 'all');
    if (j != null) return { idx: j };
    // After a queued song the playlist's own song is next, even if it's the only one.
    if (state.qTrack && playable(DATA[state.plId].tracks[state.idx])) return { idx: state.idx };
    return auto && state.repeat === 'all' && playable(nowTrack()) ? { repeat: true } : null;
  }

  // Apply a move to the state (no player calls) and return the new song.
  function applyMove(m) {
    if (!(m && m.repeat)) carryOn = null;
    if (m && m.repeat) setState({ pos: 0 });
    else if (m && m.queue) setState({ qTrack: userQueue.shift(), pos: 0, pick: null });
    else if (m) setState({ qTrack: null, idx: m.idx, pos: 0, pick: null });
    else setState({ qTrack: null, idx: order[0], pos: 0, playing: false, pick: null });
    return nowTrack();
  }

  // ---------- helpers (ported from the design's Component class) ----------

  function fmt(s) {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  // Next takes from the queue first and wraps around the playlist. Previous
  // during a queued song goes back to the playlist's song; otherwise it wraps,
  // except going back past the first song with shuffle off.
  function step(d) {
    if (d > 0) {
      const m = nextMove(false);
      if (m) applyMove(m); else setState({ pos: 0 });
    } else if (state.qTrack) {
      setState({ qTrack: null, pos: 0, pick: null });
    } else {
      const [j] = walk(-1, 1, state.shuffle);
      setState({ idx: j == null ? state.idx : j, pos: 0, pick: null });
    }
    ytSync(0);
  }

  // With shuffle off, previous stops at the first song: still a restart if
  // it has played a few seconds, then greyed out.
  function canGoBack() {
    return !!state.qTrack || state.shuffle || state.pos > 3 || walk(-1, 1, false).length > 0;
  }

  // The current track finished (or couldn't play): move on, or stop at the end.
  function advance(m = nextMove(true)) {
    applyMove(m);
    ytSync(0);
  }

  // ---------- sleep timer ----------
  // After N minutes the music fades out slowly and pauses; "end of song" lets
  // the current song finish (no crossfade) and stops there.

  const SLEEP_FADE_MS = 8000;

  function setSleep(v) {
    if (v === 'end') setState({ sleep: { end: true } });
    else if (+v > 0) setState({ sleep: { min: +v, at: Date.now() + v * 60000 } });
    else setState({ sleep: null });
  }

  function sleepNow() {
    setState({ sleep: null, playing: false });
    if (nowTrack()[3]) yt.player.pause(SLEEP_FADE_MS);
    notify('Sleep timer', 'Music stopped.', 'info');
  }

  // A song played to the end: the sleep timer may stop here, otherwise move on.
  function songEnded() {
    if (state.sleep && state.sleep.end) {
      setState({ sleep: null, playing: false, pos: 0 });
      notify('Sleep timer', 'Music stopped.', 'info');
      return;
    }
    advance();
  }

  // keepOrder: jumping within the current queue (Up next) keeps the shuffle.
  function play(plId, idx, keepOrder) {
    if (plId !== state.plId || !keepOrder) buildOrder(plId, idx);
    setState({ plId, idx, qTrack: null, pos: 0, playing: true, view: 'player', pick: null });
    ytSync(0);
  }

  // A song from outside the playlist order (search, or picked from the queue).
  function playNow(track) {
    setState({ qTrack: track, pos: 0, playing: true, pick: null });
    ytSync(0);
  }

  function enqueue(track, next) {
    if (next) userQueue.unshift(track); else userQueue.push(track);
    notify(next ? 'Playing next' : 'Added to queue', track[0]);
  }

  // ---------- changing playlists ----------
  // Songs are changed on YouTube and in the loaded copy, so no refresh is
  // needed. Changing the playlist that's playing keeps the play position
  // (idx and order are track indexes, so they shift with the change).

  const ownPlaylists = () => (state.account ? DATA.filter((p) => p.id && p.id !== 'LM') : []);
  // Each playlist keeps its own copy of a track, with its own item id (t[5]).
  const entryOf = (track, itemId) => [...track.slice(0, 5), itemId || ''];

  function insertTrack(p, track, at) {
    p.tracks.splice(at, 0, track);
    if (DATA[state.plId] !== p) return;
    if (at <= state.idx) state.idx++;
    if (state.shuffle) { order = order.map((j) => (j >= at ? j + 1 : j)); order.push(at); } else order = playlistOrder(state.plId);
  }

  // The playing playlist can't lose its last song (nothing would be current).
  const isLastPlaying = (p) => DATA[state.plId] === p && p.tracks.length === 1;

  // Removing the song that's playing lets it finish as a one-off (like a
  // queued song); the playlist then carries on with the song after it in
  // play order. Without one (it was last) it goes on from the song before.
  function removeTrack(p, i) {
    if (DATA[state.plId] === p) {
      const shift = (j) => (j > i ? j - 1 : j);
      if (i === state.idx) {
        if (!state.qTrack) state.qTrack = p.tracks[i];
        const k = order.indexOf(i), after = order[k + 1];
        state.idx = after != null ? shift(after) : shift(order[k - 1] != null ? order[k - 1] : 0);
        carryOn = after != null ? state.qTrack : null;
      } else if (i < state.idx) {
        state.idx--;
      }
      p.tracks.splice(i, 1);
      order = order.filter((j) => j !== i).map(shift);
    } else {
      p.tracks.splice(i, 1);
    }
    if (!p.tracks.length) dropPlaylist(DATA.indexOf(p));
  }

  // An emptied playlist leaves the library (Groove doesn't list empty ones).
  function dropPlaylist(k) {
    DATA.splice(k, 1);
    const patch = {};
    if (state.plId > k) patch.plId = state.plId - 1;
    const plId = patch.plId != null ? patch.plId : state.plId;
    if (state.openId === k) { patch.openId = plId; if (state.view === 'list') patch.view = 'home'; }
    else if (state.openId > k) patch.openId = state.openId - 1;
    Object.assign(state, patch);
  }

  async function addToPlaylist(track, p) {
    if (p.tracks.some((t) => t[3] === track[3])) { notify('Already in ' + p.name, track[0], 'info'); return; }
    let itemId;
    try {
      itemId = await yt.addToPlaylist(p.id, track[3]);
    } catch (e) {
      notify('Couldn’t add to ' + p.name, e.message, 'error');
      return;
    }
    if (!DATA.includes(p)) return; // library reloaded meanwhile
    insertTrack(p, entryOf(track, itemId), p.tracks.length);
    notify('Added to ' + p.name, track[0]);
    render();
  }

  async function removeFromPlaylist(p, track) {
    if (p.id === 'LM') { toggleLike(track); return; }
    if (isLastPlaying(p)) { notify('Can’t remove the last song', 'It’s playing from ' + p.name + '. Play another playlist first.', 'error'); return; }
    try {
      await yt.removeFromPlaylist(p.id, track[3], track[5]);
    } catch (e) {
      notify('Couldn’t remove from ' + p.name, e.message, 'error');
      return;
    }
    const i = p.tracks.indexOf(track); // the list may have changed meanwhile
    if (!DATA.includes(p) || i < 0) return;
    if (isLastPlaying(p)) { render(); return; } // gone on YouTube; vanishes here on the next refresh
    removeTrack(p, i);
    notify('Removed from ' + p.name, track[0]);
    render();
  }

  // ---------- likes ----------
  // A song is liked when it's in Liked music. Liking puts it at the top, the
  // way YouTube Music lists it; unliking takes it out.

  const likedPlaylist = () => DATA.find((p) => p.id === 'LM');
  const canLike = (t) => !!(state.account && t && t[3]);
  const liking = new Set(); // video ids with a rating on its way
  let likedIds = { tracks: null, n: -1, ids: new Set() };

  function isLiked(t) {
    const lm = likedPlaylist();
    if (!lm || !t || !t[3]) return false;
    if (likedIds.tracks !== lm.tracks || likedIds.n !== lm.tracks.length) likedIds = { tracks: lm.tracks, n: lm.tracks.length, ids: new Set(lm.tracks.map((x) => x[3])) };
    return likedIds.ids.has(t[3]);
  }

  async function toggleLike(track) {
    if (!canLike(track) || liking.has(track[3])) return;
    const like = !isLiked(track);
    let lm = likedPlaylist();
    if (!like && isLastPlaying(lm)) { notify('Can’t remove the last song', 'It’s playing from Liked music. Play another playlist first.', 'error'); return; }
    liking.add(track[3]);
    render();
    try {
      await yt.rate(track[3], like);
    } catch (e) {
      notify(like ? 'Couldn’t like this song' : 'Couldn’t unlike this song', e.message, 'error');
      return;
    } finally {
      liking.delete(track[3]);
      render();
    }
    lm = likedPlaylist();
    if (like && !isLiked(track)) {
      if (!lm) {
        lm = { id: 'LM', name: 'Liked music', color: PL_COLORS[0], tracks: [], cover: null };
        DATA.unshift(lm);
        state.plId++;
        state.openId++;
      }
      insertTrack(lm, entryOf(track), 0);
    } else if (!like && lm) {
      const i = lm.tracks.findIndex((t) => t[3] === track[3]);
      if (i >= 0 && !isLastPlaying(lm)) removeTrack(lm, i);
    }
    notify(like ? 'Added to Liked music' : 'Removed from Liked music', track[0], like ? 'like' : 'ok');
    render();
  }

  // ---------- recently played ----------
  // YouTube songs that played for 10 seconds or more, newest first, kept on
  // this computer. A song played again moves back to the top.

  const RECENT_KEY = 'bside.recent';
  const RECENT_MAX = 50;
  const RECENT_SHOWN = 5;
  const trackKey = (t) => t[3] || t[0] + '\n' + t[1];
  let recent = (() => {
    try {
      const r = JSON.parse(localStorage.getItem(RECENT_KEY));
      return Array.isArray(r) ? r.filter((x) => x && Array.isArray(x.t) && x.t[3]) : [];
    } catch (e) { return []; }
  })();
  let recentNoted = recent.length ? trackKey(recent[0].t) : '';
  let recentAll = false;

  function saveRecent() {
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(recent)); } catch (e) { /* storage unavailable */ }
  }

  function noteRecent() {
    const t = nowTrack();
    if (!state.playing || state.pos < 10 || !t || !t[3] || trackKey(t) === recentNoted) return;
    recentNoted = trackKey(t);
    recent = [{ t: t.slice(0, 5), at: Date.now() }, ...recent.filter((r) => trackKey(r.t) !== recentNoted)].slice(0, RECENT_MAX);
    saveRecent();
  }

  function ago(at) {
    const m = Math.floor((Date.now() - at) / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return m + ' min ago';
    const h = Math.floor(m / 60);
    if (h < 24) return h + (h === 1 ? ' hour ago' : ' hours ago');
    const d = Math.floor(h / 24);
    return d === 1 ? 'Yesterday' : d + ' days ago';
  }

  async function addToNewPlaylist(track, name) {
    let p;
    try {
      const made = await yt.createPlaylist(name);
      p = { id: made.id, name: made.name, color: PL_COLORS[DATA.length % PL_COLORS.length], tracks: [], cover: null };
    } catch (e) {
      notify('Couldn’t make the playlist', e.message, 'error');
      return;
    }
    DATA.push(p);
    let itemId;
    try {
      itemId = await yt.addToPlaylist(p.id, track[3]);
    } catch (e) {
      notify('Made “' + p.name + '” but couldn’t add the song', e.message, 'error');
      render();
      return;
    }
    if (DATA.includes(p)) insertTrack(p, entryOf(track, itemId), p.tracks.length);
    notify('Made “' + p.name + '”', 'Added ' + track[0]);
    render();
  }

  // ---------- YouTube ----------
  // Tracks from YouTube carry a video id (t[3]); mirror state onto the player.
  // Sample tracks have none, so the simulated clock keeps driving them.

  let ytLoaded = null;
  const fadeMs = () => state.fade * 1000;

  function ytSync(seekTo) {
    const t = nowTrack();
    if (!t[3]) return;
    if (ytLoaded !== t[3]) {
      ytLoaded = t[3];
      yt.player.load(t[3], state.pos, state.playing, fadeMs());
      render();
      return;
    }
    // Same song: pause and resume are instant. Fades are for songs starting
    // (including restarting from 0:00) and for skipping away.
    if (state.playing) {
      if (seekTo != null) yt.player.seek(seekTo);
      yt.player.play(seekTo === 0 ? fadeMs() : 0);
    } else {
      yt.player.pause(0).then((paused) => { if (paused && seekTo != null) yt.player.seek(seekTo); });
    }
  }

  // Swap in a library. `spot` (playlist id, video id, position) is the song to
  // land on: the saved one at startup, the current one on a refresh. Without
  // one, or if it's gone, start at the top of the first playlist.
  function useLibrary(lists, spot) {
    const wasLoaded = ytLoaded;
    DATA.splice(0, DATA.length, ...lists.map((p, i) => ({ id: p.id, name: p.name, color: PL_COLORS[i % PL_COLORS.length], tracks: p.tracks, cover: p.cover })));
    if (spot && Array.isArray(spot.queue)) userQueue = spot.queue;
    let plId = spot ? DATA.findIndex((p) => p.id && p.id === spot.pl) : -1;
    let idx = plId >= 0 ? DATA[plId].tracks.findIndex((t) => t[3] && t[3] === spot.vid) : -1;
    const qTrack = spot && Array.isArray(spot.qt) ? spot.qt : null;
    if (idx < 0) {
      if (!qTrack) {
        ytLoaded = null;
        buildOrder(0, 0);
        setState({ openId: 0, plId: 0, idx: 0, qTrack: null, pos: 0, playing: false, pick: null });
        return;
      }
      plId = 0; idx = 0;
    }
    const now = qTrack || DATA[plId].tracks[idx];
    // A refresh mid-song finds the same video still on the player: leave it be.
    const same = wasLoaded === now[3];
    if (!same) ytLoaded = null;
    const pos = Math.max(0, Math.min(Math.floor(spot.pos || 0), now[2] - 1));
    buildOrder(plId, idx);
    setState({ openId: plId, plId, idx, qTrack, pick: null, ...(same ? {} : { pos, playing: !!spot.play }) });
    if (!same) ytSync();
  }

  // ---------- resume ----------
  // The song and position are saved as you listen, so the next launch (or the
  // restart after an update) picks up where you left off.

  const RESUME_KEY = 'bside.resume';
  let resumeJson = '';
  let restarting = false; // set when restarting to update: keep playing afterwards

  function currentSpot() {
    const pl = DATA[state.plId], t = pl.tracks[state.idx];
    if (!pl.id || !t[3]) return null;
    return { pl: pl.id, vid: t[3], pos: state.pos, qt: state.qTrack, queue: userQueue.slice(0, 200) };
  }

  function savedSpot() {
    try { return JSON.parse(localStorage.getItem(RESUME_KEY)); } catch (e) { return null; }
  }

  // Only YouTube songs are saved; the sample playlists never overwrite them.
  function saveSpot() {
    const spot = currentSpot();
    if (!spot) return;
    const json = JSON.stringify({ ...spot, play: restarting && state.playing });
    if (json === resumeJson) return;
    resumeJson = json;
    try { localStorage.setItem(RESUME_KEY, json); } catch (e) { /* storage unavailable */ }
  }

  // ---------- crossfade ----------
  // Near the end of a YouTube track, start the next one on the second deck
  // and blend the two over `crossfade` seconds.

  let xfStarted = 0;

  function maybeCrossfade(t) {
    const xf = state.crossfade;
    if (!xf || (state.sleep && state.sleep.end) || Date.now() - xfStarted < xf * 1000 + 3000) return;
    const dur = yt.player.duration() || t[2];
    if (dur < xf * 2 + 10 || dur - yt.player.time() > xf) return;
    const m = nextMove(true);
    if (!m) return;
    const next = m.repeat ? nowTrack() : m.queue ? userQueue[0] : DATA[state.plId].tracks[m.idx];
    if (!next[3]) return;
    xfStarted = Date.now();
    ytLoaded = next[3];
    applyMove(m);
    yt.player.crossfade(next[3], xf * 1000);
  }

  // ---------- unplayable tracks ----------
  // Some videos can't be embedded, or are gone. Remember them for this
  // session and skip to the next playable track.

  const PLAY_ERRORS = { 100: 'has been removed or made private', 101: "can't be played outside YouTube", 150: "can't be played outside YouTube" };

  function onPlayError(code) {
    const t = nowTrack();
    if (!t[3]) return;
    blocked.add(t[3]);
    if (!state.playing) { render(); return; }
    // Repeat-one doesn't apply to a track that can't play.
    const m = nextMove(true, true);
    if (!m || (m.idx === state.idx && !state.qTrack)) {
      setState({ playing: false });
      if (state.qTrack) notify('Skipped “' + t[0] + '”', 'It ' + (PLAY_ERRORS[code] || 'couldn’t be played') + '.', 'error');
      else notify('Nothing here can play', 'None of the songs in this playlist can be played here.', 'error');
      return;
    }
    notify('Skipped “' + t[0] + '”', 'It ' + (PLAY_ERRORS[code] || 'couldn’t be played') + '.', 'error');
    advance(m);
  }

  // First load (startup or a new sign-in) lands on the saved song; a refresh
  // keeps whatever is playing.
  async function syncYouTube() {
    const first = !state.account;
    setState({ syncing: true, ytError: '' });
    try {
      const [account, lists] = await Promise.all([yt.profile(), yt.library()]);
      yt.ensurePlayer();
      if (lists.length) useLibrary(lists, first ? savedSpot() : currentSpot());
      setState({ account, syncing: false, ...(first ? { view: 'home' } : {}), ytError: lists.length ? '' : 'No playlists or liked music found on this account.' });
    } catch (e) {
      setState({ syncing: false, account: yt.signedIn() ? state.account : null, ytError: e.message });
    }
  }

  async function connectYouTube() {
    setState({ ytError: '' });
    if (yt.signInInBrowser) notify('Finish signing in', 'Google opened in your browser.', 'info');
    try {
      await yt.signIn();
    } catch (e) {
      setState({ ytError: e.message });
      return;
    }
    syncYouTube();
  }

  function disconnectYouTube() {
    if (!window.confirm('Sign out of YouTube Music?')) return;
    yt.signOut();
    useLibrary(SAMPLE);
    setState({ account: null, ytError: '' });
  }

  function rgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function dist(a, b) {
    const p = rgb(a), q = rgb(b);
    const rm = (p[0] + q[0]) / 2, dr = p[0] - q[0], dg = p[1] - q[1], db = p[2] - q[2];
    return Math.sqrt((2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db);
  }

  function closestVinyl(hex) {
    let best = VINYLS[0], bd = Infinity;
    VINYLS.forEach((v) => { const d = dist(hex, v.c[0]); if (d < bd) { bd = d; best = v; } });
    return best;
  }

  function dots(cols, scale) {
    return SPOTS.map((s, i) => {
      const r = s[2] * scale;
      return 'radial-gradient(circle at ' + s[0] + '% ' + s[1] + '%, ' + cols[i % cols.length] + ' 0 ' + r + '%, rgba(0,0,0,0) ' + (r + 0.5) + '%)';
    }).join(', ');
  }

  function vinylBody(v) {
    const a = v.c[0], b = v.c[1] || a, c = v.c[2] || b;
    const clear = (x) => 'radial-gradient(circle at 50% 50%, ' + x + 'E0 0 62%, ' + x + 'B8 62% 100%)';
    const blob = (x, w, h, px, py, al) => 'radial-gradient(ellipse ' + w + '% ' + h + '% at ' + px + '% ' + py + '%, ' + x + (al || '') + ' 0%, ' + x + '00 100%)';
    const flat = (x) => 'linear-gradient(' + x + ', ' + x + ')';
    let body;
    switch (v.style) {
      case 'solid': body = flat(a); break;
      case 'clear': body = clear(a); break;
      case 'splatter': body = dots([b, c], 1) + ', ' + clear(a); break;
      case 'opaque-splatter': body = dots([b, c], 1) + ', ' + flat(a); break;
      case 'galaxy': body = dots([b, c], 0.45) + ', ' + flat(a); break;
      case 'marble': body = [blob(b, 45, 22, 30, 28), blob(b, 30, 40, 74, 62), blob(c, 35, 18, 40, 80), blob(b, 22, 30, 82, 22), blob(c, 20, 20, 18, 60)].join(', ') + ', ' + flat(a); break;
      case 'smoke': body = [blob(b, 55, 35, 28, 30, 'CC'), blob(b, 40, 50, 72, 66, 'AA'), blob(b, 45, 30, 50, 88, '88')].join(', ') + ', ' + clear(a); break;
      case 'half': body = 'linear-gradient(90deg, ' + a + ' 0 50%, ' + b + ' 50% 100%)'; break;
      case 'inner': body = 'radial-gradient(circle at 50% 50%, ' + b + ' 0 46%, ' + a + ' 46.5% 100%)'; break;
      case 'swirl': body = 'repeating-conic-gradient(from 0deg, ' + a + ' 0deg, ' + b + ' 30deg, ' + a + ' 60deg)'; break;
      case 'pinwheel': body = 'repeating-conic-gradient(' + a + ' 0 22.5deg, ' + b + ' 22.5deg 45deg)'; break;
      case 'metallic': body = 'conic-gradient(from 30deg, ' + a + ', ' + b + ', ' + a + ', ' + c + ', ' + a + ', ' + b + ', ' + a + ')'; break;
      default: body = clear(a);
    }
    return body;
  }

  function vinylBg(v) { return SHEEN + ', ' + GROOVES + ', ' + vinylBody(v); }
  function vinylDisc(v) { return RINGS + ', ' + GROOVES + ', ' + vinylBody(v); }

  // ---------- thumbnail colours ----------
  // Sample the visible (square-cropped) part of a YouTube thumbnail and take
  // its dominant colour, so the auto-matched pressing follows the real cover.

  const thumbColors = new Map(); // url -> { main, second } | 'pending' | null

  function hex(c) { return '#' + c.map((x) => Math.round(x).toString(16).padStart(2, '0')).join('').toUpperCase(); }
  function mix(a, b, t) { const p = rgb(a), q = rgb(b); return hex(p.map((x, i) => x + (q[i] - x) * t)); }

  function dominant(img, boxed) {
    const N = 32;
    const side = Math.min(img.naturalWidth, img.naturalHeight) / (boxed ? 1.34 : 1);
    const cv = document.createElement('canvas');
    cv.width = cv.height = N;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, N, N);
    const px = ctx.getImageData(0, 0, N, N).data;
    // Bucket at 4 bits per channel; favour saturated, mid-bright pixels so
    // black bars and white backgrounds don't win.
    const buckets = new Map();
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i], g = px[i + 1], b = px[i + 2];
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const sat = mx ? (mx - mn) / mx : 0;
      const w = (0.15 + sat) * (mx < 28 || mn > 235 ? 0.2 : 1);
      const k = (r >> 4) << 8 | (g >> 4) << 4 | (b >> 4);
      const e = buckets.get(k) || { w: 0, r: 0, g: 0, b: 0 };
      e.w += w; e.r += r * w; e.g += g * w; e.b += b * w;
      buckets.set(k, e);
    }
    const ranked = [...buckets.values()].sort((x, y) => y.w - x.w).map((e) => hex([e.r / e.w, e.g / e.w, e.b / e.w]));
    if (!ranked.length) return null;
    const main = ranked[0];
    const second = ranked.find((c) => dist(c, main) > 150) || mix(main, '#FFFFFF', 0.5);
    return { main, second };
  }

  function thumbColor(thumb) {
    const hit = thumbColors.get(thumb.url);
    if (hit !== undefined) return hit === 'pending' ? null : hit;
    thumbColors.set(thumb.url, 'pending');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let c = null;
      try { c = dominant(img, thumb.size !== 'cover'); } catch (e) { /* tainted canvas: keep palette */ }
      thumbColors.set(thumb.url, c);
      if (c) render();
    };
    img.onerror = () => thumbColors.set(thumb.url, null);
    img.src = thumb.url;
    return null;
  }

  function artFor(plId, idx, pick) {
    return trackArt(DATA[plId].tracks[idx] || [], plId * 3 + idx, pick);
  }

  function trackArt(track, seed, pick) {
    // YouTube tracks use their thumbnail as the cover (and its colours, once
    // sampled); samples get generated art from the fixed palettes.
    const thumb = track[4];
    const tc = thumb && thumbColor(thumb);
    const [c1, c2, c3, c4] = tc
      ? [tc.main, tc.second, mix(tc.main, '#000000', 0.7), mix(tc.main, '#FFFFFF', 0.85)]
      : PALETTES[seed % PALETTES.length];
    const coverBg = thumb
      ? 'url(' + JSON.stringify(thumb.url) + ') center / ' + thumb.size + ' no-repeat, ' + c3
      : 'radial-gradient(circle at 70% 52%, ' + c2 + ' 0 25%, rgba(0,0,0,0) 25.4%), linear-gradient(162deg, ' + c1 + ' 0 60%, ' + c3 + ' 60% 100%)';
    const vinyl = pick != null ? VINYLS[pick] : closestVinyl(c1);
    return { c1, c2, c3, c4, coverBg, hasThumb: !!thumb, vinylBg: vinylBg(vinyl), vinylDisc: vinylDisc(vinyl), vinylName: vinyl.name };
  }

  // ---------- playlist covers ----------
  // YouTube playlists use their own cover; ones without (Liked music) get a
  // 2x2 mosaic of their first song covers, like YouTube Music's auto covers.
  // The record behind the sleeve takes the cover's main colour. Sample
  // playlists keep their flat colour and printed name.

  function playlistArt(p) {
    const thumbs = [];
    const seen = new Set();
    for (const t of p.tracks) {
      if (thumbs.length === 4) break;
      if (t[4] && !seen.has(t[4].url)) { seen.add(t[4].url); thumbs.push(t[4]); }
    }
    const tiles = p.cover ? [p.cover] : thumbs.length >= 4 ? thumbs : thumbs.slice(0, 1);
    const tc = tiles.length ? thumbColor(tiles[0]) : null;
    return { color: tc ? tc.main : p.color, tiles };
  }

  // Paint a sleeve: cover art tiles if there are any, otherwise the flat
  // colour (and, on grid tiles, the printed name).
  function paintSleeve(node, pl, nameNode) {
    const key = JSON.stringify([pl.tiles, pl.color]);
    if (node.dataset.key === key) return;
    node.dataset.key = key;
    node.classList.toggle('has-art', pl.tiles.length > 0);
    node.classList.toggle('mosaic', pl.tiles.length === 4);
    node.querySelectorAll('.sleeve-tile').forEach((n) => n.remove());
    node.style.background = pl.tiles.length ? '#1A1816' : pl.color;
    pl.tiles.forEach((t, i) => {
      const tile = document.createElement('span');
      tile.className = 'sleeve-tile';
      if (pl.tiles.length === 4) { tile.style.left = (i % 2) * 50 + '%'; tile.style.top = (i >> 1) * 50 + '%'; }
      tile.style.background = 'url(' + JSON.stringify(t.url) + ') center / ' + t.size + ' no-repeat';
      node.appendChild(tile);
    });
    if (nameNode) nameNode.classList.toggle('hidden', pl.tiles.length > 0);
  }

  // ---------- derived view-model ----------

  function computeVals() {
    const s = state;
    const accent = ACCENT;
    const backdrop = SHOW_BACKDROP_PREF;
    const total = (pl) => pl.tracks.reduce((a, t) => a + t[2], 0);

    const playlists = DATA.map((p, i) => ({
      idx: i, name: p.name, ...playlistArt(p),
      countLabel: p.tracks.length + (p.tracks.length === 1 ? ' song' : ' songs'), lengthLabel: Math.round(total(p) / 60) + ' min'
    }));

    // The open playlist in sort order, narrowed by the filter box.
    const words = fold(s.listFilter).split(/\s+/).filter(Boolean);
    const openTracks = playlistOrder(s.openId).filter((i) => {
      const t = DATA[s.openId].tracks[i];
      return !words.length || words.every((w) => fold(t[0] + ' ' + t[1]).includes(w));
    }).map((i, k) => {
      const t = DATA[s.openId].tracks[i];
      const isNow = !s.qTrack && s.openId === s.plId && i === s.idx;
      return {
        idx: i, num: k + 1, title: t[0], artist: t[1], time: fmt(t[2]),
        color: isNow ? accent : '#EEE8DF', numColor: isNow ? accent : '#8F887E',
        bg: isNow ? 'rgba(255,255,255,.03)' : '',
        showNow: isNow, blocked: isBlocked(s.openId, i)
      };
    });

    const cur = nowTrack();
    const art = s.qTrack ? trackArt(cur, cur[0].length, s.pick) : artFor(s.plId, s.idx, s.pick);
    const views = [['Library', 'home'], ['Now playing', 'player']];
    const navActive = s.view === 'list' ? 'home' : s.view;

    return {
      accent, playlists, openTracks, art,
      openPl: playlists[s.openId],
      nav: views.map(([label, v]) => ({
        label, view: v,
        active: navActive === v,
        color: navActive === v ? '#F6F1EA' : (s.view === 'player' ? 'rgba(255,255,255,.75)' : '#A39C92')
      })),
      crate: VINYLS.map((v, i) => {
        const on = v.name === art.vinylName;
        return {
          idx: i, name: v.name, hex: v.c[0], style: v.style.replace('-', ' '), bg: vinylBg(v), on, scale: on ? 1.04 : 1,
          ring: on ? '0 0 0 3px #131211, 0 0 0 5px ' + accent + ', 0 14px 30px rgba(0,0,0,.5)' : '0 10px 24px rgba(0,0,0,.45)'
        };
      }),
      coverHex: art.c1,
      isPicked: s.pick != null,
      matchLabel: s.pick != null ? 'Your pick: ' + art.vinylName : 'Auto-matched: ' + art.vinylName,
      now: { title: cur[0], artist: cur[1], time: fmt(cur[2]) },
      isHome: s.view === 'home', isList: s.view === 'list', isPlayer: s.view === 'player', isCrate: s.view === 'crate',
      showBackdrop: s.view === 'player' && backdrop,
      showMini: s.view !== 'player',
      headerLine: s.view === 'player' ? 'rgba(255,255,255,.12)' : '#262320',
      playing: s.playing,
      spinState: s.playing ? 'running' : 'paused',
      armAngle: (s.playing || s.pos > 0) ? (27.8 + 20.9 * Math.min(1, s.pos / cur[2])).toFixed(2) : -3,
      armShadow: s.playing ? 'drop-shadow(3px 5px 2.5px rgba(0,0,0,.45))' : 'drop-shadow(10px 18px 7px rgba(0,0,0,.3))',
      stageZoom: s.zoom,
      spinDur: s.rpm === 45 ? '4.4s' : '6s',
      rpmLabel: s.rpm === 45 ? '45' : '33⅓',
      posLabel: fmt(s.pos),
      progressPct: (s.pos / cur[2] * 100).toFixed(2) + '%'
    };
  }

  // ---------- actions ----------

  const actions = {
    goHome: () => setState({ view: 'home' }),
    openPlayer: () => setState({ view: 'player' }),
    openCrate: () => setState({ view: 'crate' }),
    autoMatch: () => setState({ pick: null }),
    playOpen: () => play(state.openId, state.shuffle ? Math.floor(Math.random() * DATA[state.openId].tracks.length) : playlistOrder(state.openId)[0]),
    // Column headers: first click sorts ascending, second descending, third
    // back to the playlist's own order. A playing playlist follows along.
    sortBy: (key) => {
      const same = state.sortKey === key;
      const next = !same ? { sortKey: key, sortDir: 1 } : state.sortDir === 1 ? { sortKey: key, sortDir: -1 } : { sortKey: '', sortDir: 1 };
      setPrefs(next);
      if (!state.shuffle) { buildOrder(state.plId, state.idx); render(); }
    },
    toggle: () => { setState({ playing: !state.playing }); ytSync(); },
    next: () => step(1),
    prev: () => {
      if (!canGoBack()) return;
      if (state.pos > 3) { setState({ pos: 0 }); ytSync(0); } else step(-1);
    },
    openPlaylist: (i) => { refs.listFilter.value = ''; setState({ view: 'list', openId: i, listFilter: '' }); },
    playTrack: (plId, idx, keepOrder) => play(plId, idx, keepOrder),
    toggleShuffle: () => {
      state.shuffle = !state.shuffle;
      buildOrder(state.plId, state.idx);
      setPrefs({});
    },
    setRepeat: (r) => setPrefs({ repeat: r }),
    cycleRepeat: () => setPrefs({ repeat: { off: 'all', all: 'one' }[state.repeat] || 'off' }),
    setVolume: (v) => { setPrefs({ volume: v, muted: false }); applyVolume(); },
    toggleMute: () => {
      if (state.muted || state.volume === 0) setPrefs({ muted: false, volume: state.volume || 50 });
      else setPrefs({ muted: true });
      applyVolume();
    },
    setFade: (s) => setPrefs({ fade: s }),
    setCrossfade: (s) => setPrefs({ crossfade: s }),
    // Scroll on the compact player: nudge the volume and show it briefly.
    nudgeVolume: (d) => {
      const v = Math.max(0, Math.min(100, (state.muted ? 0 : state.volume) + d));
      actions.setVolume(v);
      clearTimeout(volumeHintTimer);
      setState({ volumeHint: true });
      volumeHintTimer = setTimeout(() => setState({ volumeHint: false }), 1200);
    },
    // The queue and settings drop down under their buttons; one at a time.
    togglePanel: (name) => {
      if (state.panel === name) { setState({ panel: null }); return; }
      const btn = name === 'queue' ? refs.btnQueue : refs.btnSettings;
      const panel = name === 'queue' ? refs.queuePanel : refs.settingsPanel;
      const r = btn.getBoundingClientRect();
      panel.style.top = (r.bottom + 8) + 'px';
      panel.style.right = Math.max(8, window.innerWidth - r.right) + 'px';
      setState({ panel: name });
    },
    openCrateFromSettings: () => setState({ view: 'crate', panel: null }),
    // Electron only: resize the window between the full app and the thin strip.
    setCompact: (on) => { if (shell) shell.setCompact(on); },
    pickVinyl: (i, auto) => setState({ pick: VINYLS[i].name === auto.name ? null : i }),
    seekFromEvent: (e, el, duration) => {
      const r = el.getBoundingClientRect();
      const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      setState({ pos: Math.floor(f * duration) });
      ytSync(state.pos);
    }
  };

  // ---------- DOM refs ----------

  const el = (id) => document.getElementById(id);
  const refs = {
    backdrop: el('backdrop'),
    topbar: el('topbar'),
    brandDot: el('brand-dot'),
    topnav: el('topnav'),
    topbarRight: el('topbar-right'),
    goHome: el('go-home'),

    playlistsGrid: el('playlists-grid'),

    listBack: el('list-back'), listDiscDot: el('list-disc-dot'), listDiscCover: el('list-disc-cover'),
    listFilter: el('list-filter'), listSortNote: el('list-sort-note'), listColumns: el('list-columns'),
    listTitle: el('list-title'), listSub: el('list-sub'), listPlayAll: el('list-play-all'), listRows: el('list-rows'),

    crateNowCover: el('crate-now-cover'), crateHex: el('crate-hex'), crateMatch: el('crate-match'),
    crateAutoMatch: el('crate-auto-match'), crateGrid: el('crate-grid'),

    minibar: el('minibar'), minibarSeek: el('minibar-seek'), minibarSeekFill: el('minibar-seek-fill'),
    minibarOpen: el('minibar-open'), minibarVinyl: el('minibar-vinyl'), minibarVinylLabel: el('minibar-vinyl-label'),
    minibarCover: el('minibar-cover'), minibarTitle: el('minibar-title'), minibarArtist: el('minibar-artist'),
    minibarTime: el('minibar-time'), miniPrev: el('mini-prev'), miniToggle: el('mini-toggle'), miniNext: el('mini-next'),

    stage: el('stage'), stageInner: el('stage-inner'),
    playerCover: el('player-cover'), playerCoverTitle: el('player-cover-title'), playerCoverArtist: el('player-cover-artist'),
    playerTitle: el('player-title'), playerArtist: el('player-artist'), playerLike: el('player-like'), miniLike: el('mini-like'), playerAdd: el('player-add'), miniAdd: el('mini-add'),
    recentSection: el('recent-section'), recentRows: el('recent-rows'), recentMore: el('recent-more'), recentClear: el('recent-clear'),

    disc: el('disc'), discLabel: el('disc-label'), discTitle: el('disc-title'), discArtist: el('disc-artist'), discRpm: el('disc-rpm'),
    tonearm: el('tonearm'), stylusStripe: el('stylus-stripe'),

    posLabel: el('pos-label'), timeLabel: el('time-label'), seekTrack: el('seek-track'),
    seekFill: el('seek-fill'), seekKnob: el('seek-knob'),
    btnPrev: el('btn-prev'), btnToggle: el('btn-toggle'), btnNext: el('btn-next'),
    btnShuffle: el('btn-shuffle'), btnRepeat: el('btn-repeat'),
    btnCompact: el('btn-compact'), btnSettings: el('btn-settings'), btnQueue: el('btn-queue'),
    queuePanel: el('queue-panel'), qpSource: el('qp-source'), qpList: el('qp-list'), songMenu: el('song-menu'),
    playerDismiss: el('player-dismiss'), playerLyrics: el('player-lyrics'),
    lyrics: el('lyrics'), lyricsLines: el('lyrics-lines'), turntable: document.querySelector('.turntable'),
    windowControls: el('window-controls'), winMin: el('win-min'), winMax: el('win-max'), winClose: el('win-close'),

    settingsPanel: el('settings-panel'), spShuffle: el('sp-shuffle'), spRepeat: el('sp-repeat'),
    spSleep: el('sp-sleep'), spSleepLeft: el('sp-sleep-left'),
    spMute: el('sp-mute'), spVolume: el('sp-volume'), spVolumeVal: el('sp-volume-val'),
    spFade: el('sp-fade'), spFadeVal: el('sp-fade-val'), spXf: el('sp-xf'), spXfVal: el('sp-xf-val'),
    spPressing: el('sp-pressing'), spPressingDot: el('sp-pressing-dot'), spPressingName: el('sp-pressing-name'),
    spAccount: el('sp-account'),
    spApp: el('sp-app'), spUpdateTitle: el('sp-update-title'), spUpdateSub: el('sp-update-sub'),
    spUpdateBtn: el('sp-update-btn'), spProgress: el('sp-progress'), spProgressFill: el('sp-progress-fill'),

    compact: el('compact'), compactArt: el('compact-art'), compactTitle: el('compact-title'), compactArtist: el('compact-artist'),
    compactPrev: el('compact-prev'), compactToggle: el('compact-toggle'), compactNext: el('compact-next'),
    compactExpand: el('compact-expand'),
    spDesktop: el('sp-desktop'), spLogin: el('sp-login'), spLoginModeRow: el('sp-login-mode-row'), spLoginMode: el('sp-login-mode'),
    spTrayClose: el('sp-tray-close'), spKeys: el('sp-keys'), keysGlobal: el('keys-global'), keysApp: el('keys-app'), keysMsg: el('keys-msg'), keysReset: el('keys-reset'), compactSeek: el('compact-seek'), compactSeekFill: el('compact-seek-fill'),

    splash: el('splash'), scroller: el('scroller'),
    viewSettings: el('view-settings'), settingsBack: el('settings-back'), settingsNav: el('settings-nav'), spMore: el('sp-more'),
    setOpacityCompact: el('set-opacity-compact'), setOpacityCompactVal: el('set-opacity-compact-val'),
    setOpacityFull: el('set-opacity-full'), setOpacityFullVal: el('set-opacity-full-val'),
    searchInput: el('search-input'), viewSearch: el('view-search'),
    searchLibrary: el('search-library'), searchLibraryRows: el('search-library-rows'),
    searchYtHint: el('search-yt-hint'), searchYtRows: el('search-yt-rows'),
    viewHome: el('view-home'), viewList: el('view-list'), viewCrate: el('view-crate'), viewPlayer: el('view-player')
  };

  const PLAY_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#131211"><path d="M7 4.5v15l13-7.5z"></path></svg>';
  const PAUSE_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#131211"><rect x="6" y="5" width="4" height="14" rx="1"></rect><rect x="14" y="5" width="4" height="14" rx="1"></rect></svg>';
  const PLAY_ICON_SM = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#131211"><path d="M7 4.5v15l13-7.5z"></path></svg>';
  const PAUSE_ICON_SM = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#131211"><rect x="6" y="5" width="4" height="14" rx="1"></rect><rect x="14" y="5" width="4" height="14" rx="1"></rect></svg>';
  const ACCOUNT_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EEE8DF" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"></path></svg>';
  const MORE_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>';
  const PLAY_TRI_ROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="#EEE8DF"><path d="M7 4.5v15l13-7.5z"></path></svg>';
  // Mode and volume icons take their size from CSS and their colour from the button.
  const LINE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
  const SHUFFLE_ICON = LINE_SVG + '<path d="M16 3h5v5"></path><path d="M4 20L21 3"></path><path d="M21 16v5h-5"></path><path d="M15 15l6 6"></path><path d="M4 4l5 5"></path></svg>';
  const REPEAT_PATHS = '<path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>';
  const REPEAT_ICONS = {
    off: LINE_SVG + REPEAT_PATHS + '</svg>',
    all: LINE_SVG + REPEAT_PATHS + '</svg>',
    one: LINE_SVG + REPEAT_PATHS + '<text x="12" y="14.5" text-anchor="middle" font-size="7.5" font-weight="700" font-family="DM Mono, monospace" fill="currentColor" stroke="none">1</text></svg>'
  };
  const REPEAT_LABELS = { off: 'Repeat: off', all: 'Repeat: playlist', one: 'Repeat: this song' };
  const WIN_ICON = '<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1">';
  const MAXIMIZE_ICON = WIN_ICON + '<rect x="0.5" y="0.5" width="9" height="9"></rect></svg>';
  const RESTORE_ICON = WIN_ICON + '<rect x="0.5" y="2.5" width="7" height="7"></rect><path d="M2.5 2.5v-2h7v7h-2"></path></svg>';
  const SPEAKER = '<path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"></path>';
  const VOLUME_ICONS = {
    high: LINE_SVG + SPEAKER + '<path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M19 5a10 10 0 0 1 0 14"></path></svg>',
    low: LINE_SVG + SPEAKER + '<path d="M15.5 8.5a5 5 0 0 1 0 7"></path></svg>',
    mute: LINE_SVG + SPEAKER + '<path d="M23 9l-6 6"></path><path d="M17 9l6 6"></path></svg>'
  };

  // Present in the Electron app (preload.js); absent in a plain browser.
  const shell = window.bsideShell || null;
  let volumeHintTimer = 0;

  function setIcon(node, key, html) {
    if (node.dataset.icon === key) return;
    node.dataset.icon = key;
    node.innerHTML = html;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  // Rebuild a list only when its content changes, so the playback tick
  // doesn't replace the buttons under the cursor mid-click.
  function rebuild(node, key, build) {
    if (node.dataset.key === key) return;
    node.dataset.key = key;
    clear(node);
    build();
  }

  // ---------- startup screen ----------
  // Stays up while the library loads (at least ~1s so it never just flashes,
  // at most 8s), then swipes up.

  const SPLASH_MIN_MS = 1100;
  const SPLASH_MAX_MS = 8000;
  let booted = false;
  let splashDone = false;

  function hideSplash(force) {
    if (!booted || splashDone || (!force && state.syncing)) return;
    splashDone = true;
    setTimeout(() => {
      refs.splash.classList.add('done');
      setTimeout(() => refs.splash.remove(), 900);
    }, Math.max(0, SPLASH_MIN_MS - performance.now()));
  }

  // ---------- render ----------

  let pageUnderPlayer = null; // { key, view, scroll }

  function render() {
    noteRecent();
    const v = computeVals();

    document.body.style.setProperty('--accent', v.accent);
    refs.brandDot.style.background = v.accent;
    refs.topbar.style.borderBottomColor = v.headerLine;

    refs.backdrop.classList.toggle('show', v.showBackdrop);
    refs.backdrop.querySelector('.blur').style.background = v.art.coverBg;

    // nav
    rebuild(refs.topnav, JSON.stringify(v.nav), () => v.nav.forEach((n) => {
      const b = document.createElement('button');
      b.textContent = n.label;
      b.style.background = n.active ? 'rgba(255,255,255,.1)' : 'transparent';
      b.style.color = n.color;
      b.addEventListener('click', () => setState({ view: n.view }));
      refs.topnav.appendChild(b);
    }));

    renderAccount();

    // view switching (a new page starts at the top)
    // Opening the player remembers the page under it (and where it was
    // scrolled), so lowering the player goes back there.
    const pageKey = state.view + ':' + state.openId;
    if (refs.scroller.dataset.page !== pageKey) {
      const from = refs.scroller.dataset.page;
      if (state.view === 'player' && from && !from.startsWith('player:')) pageUnderPlayer = { key: from, view: from.split(':')[0], scroll: refs.scroller.scrollTop };
      refs.scroller.dataset.page = pageKey;
      refs.scroller.scrollTop = pageUnderPlayer && pageUnderPlayer.key === pageKey && from && from.startsWith('player:') ? pageUnderPlayer.scroll : 0;
    }
    refs.viewHome.classList.toggle('active', v.isHome);
    refs.viewList.classList.toggle('active', v.isList);
    refs.viewCrate.classList.toggle('active', v.isCrate);
    refs.viewPlayer.classList.toggle('active', v.isPlayer);
    refs.viewSearch.classList.toggle('active', state.view === 'search');
    refs.viewSettings.classList.toggle('active', state.view === 'settings');

    renderHome(v);
    renderList(v);
    renderCrate(v);
    renderPlayer(v);
    renderLyrics();
    renderSearch();
    renderMinibar(v);
    renderLike();
    const back = canGoBack();
    [refs.btnPrev, refs.miniPrev, refs.compactPrev].forEach((b) => { b.disabled = !back; });
    renderSettings(v);
    renderQueue(v);
    renderMenu();
    syncMediaSession();
    saveSpot();
    renderCompact(v);
    hideSplash();
  }

  function renderSettings(v) {
    refs.settingsPanel.classList.toggle('hidden', state.panel !== 'settings');
    // Settings page: hide categories whose section isn't available here.
    refs.settingsNav.querySelectorAll('button').forEach((b) => b.classList.toggle('hidden', el(b.dataset.sec).classList.contains('hidden')));
    refs.btnSettings.classList.toggle('on', state.panel === 'settings');
    refs.btnSettings.setAttribute('aria-expanded', String(state.panel === 'settings'));

    refs.spShuffle.classList.toggle('on', state.shuffle);
    refs.spShuffle.setAttribute('aria-checked', String(state.shuffle));
    refs.spRepeat.querySelectorAll('button').forEach((b) => {
      const on = b.dataset.v === state.repeat;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    });

    const sl = state.sleep;
    refs.spSleep.querySelectorAll('button').forEach((b) => {
      const on = sl ? (b.dataset.v === 'end' ? !!sl.end : +b.dataset.v === sl.min) : b.dataset.v === '0';
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    refs.spSleepLeft.textContent = !sl ? '' : sl.end ? 'Stops after this song'
      : 'Stops in ' + Math.max(1, Math.ceil((sl.at - Date.now()) / 60000)) + ' min';

    const vol = state.muted ? 0 : state.volume;
    const level = vol === 0 ? 'mute' : vol < 50 ? 'low' : 'high';
    setIcon(refs.spMute, level, VOLUME_ICONS[level]);
    refs.spMute.setAttribute('aria-label', vol === 0 ? 'Unmute' : 'Mute');
    refs.spVolume.value = String(vol);
    refs.spVolumeVal.textContent = String(vol);
    refs.spFade.value = String(state.fade);
    refs.spFadeVal.textContent = state.fade ? state.fade + ' s' : 'Off';
    refs.spXf.value = String(state.crossfade);
    refs.spXfVal.textContent = state.crossfade ? state.crossfade + ' s' : 'Off';

    refs.spPressingDot.style.background = v.art.vinylBg;
    refs.spPressingName.textContent = v.art.vinylName + (state.pick != null ? '' : ' · auto');

    rebuild(refs.spAccount, JSON.stringify([state.account, state.syncing]), () => {
      const add = (tag, cls, text) => {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text) n.textContent = text;
        refs.spAccount.appendChild(n);
        return n;
      };
      if (state.syncing) {
        add('span', 'muted', 'Syncing your library…');
      } else if (state.account) {
        const who = add('div', 'sp-account');
        const av = document.createElement('span');
        av.className = 'avatar';
        if (state.account.avatar) {
          const img = document.createElement('img');
          img.src = state.account.avatar;
          img.alt = '';
          img.referrerPolicy = 'no-referrer';
          av.appendChild(img);
        } else {
          av.innerHTML = ACCOUNT_ICON;
        }
        const name = document.createElement('span');
        name.className = 'sp-account-name';
        name.textContent = state.account.name;
        who.append(av, name);
        const row = add('div', 'sp-buttons');
        const refresh = document.createElement('button');
        refresh.className = 'pill pill-ghost';
        refresh.textContent = 'Refresh library';
        refresh.onclick = syncYouTube;
        const out = document.createElement('button');
        out.className = 'pill pill-ghost';
        out.textContent = 'Sign out';
        out.onclick = disconnectYouTube;
        row.append(refresh, out);
      } else {
        add('button', 'yt-connect', 'Connect YouTube Music').onclick = connectYouTube;
      }
    });
  }

  // Now playing, then the queue (Play next / Add to queue), then the rest of
  // the playlist in play order (shuffled order when shuffle is on; wraps
  // around when repeating the playlist).
  function renderQueue(v) {
    refs.queuePanel.classList.toggle('hidden', state.panel !== 'queue');
    refs.btnQueue.classList.toggle('on', state.panel === 'queue');
    refs.btnQueue.setAttribute('aria-expanded', String(state.panel === 'queue'));
    if (state.panel !== 'queue') return;

    const tr = DATA[state.plId].tracks;
    const upcoming = walk(1, tr.length, state.repeat !== 'off');
    refs.qpSource.textContent = state.shuffle ? 'Shuffle on' : '';
    rebuild(refs.qpList, JSON.stringify([state.plId, state.idx, state.qTrack, userQueue, upcoming, v.art.coverBg]), () => {
      const label = (text, action) => {
        const n = document.createElement('div');
        n.className = 'qp-label';
        n.textContent = text;
        if (action) {
          const b = document.createElement('button');
          b.className = 'qp-clear';
          b.textContent = action.text;
          b.addEventListener('click', action.run);
          n.appendChild(b);
        }
        refs.qpList.appendChild(n);
      };
      const row = (t, cover, opts) => {
        const b = document.createElement('div');
        b.className = 'qp-row' + (opts.now ? ' now' : '');
        b.innerHTML = '<span class="qp-cover"></span><span class="qp-meta"><span class="qp-title"></span><span class="qp-artist"></span></span><span class="qp-time"></span>';
        b.querySelector('.qp-cover').style.background = cover;
        b.querySelector('.qp-title').textContent = t[0];
        b.querySelector('.qp-artist').textContent = t[1];
        b.querySelector('.qp-time').textContent = fmt(t[2]);
        if (opts.play) { b.classList.add('clickable'); b.addEventListener('click', opts.play); }
        if (opts.remove) {
          const x = document.createElement('button');
          x.className = 'qp-remove';
          x.setAttribute('aria-label', 'Remove from queue');
          x.title = 'Remove from queue';
          x.innerHTML = '<svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M1 1l8 8M9 1L1 9"></path></svg>';
          x.addEventListener('click', (e) => { e.stopPropagation(); opts.remove(); });
          b.appendChild(x);
        }
        if (opts.track) b.addEventListener('contextmenu', (e) => { e.preventDefault(); openMenu(e.clientX, e.clientY, opts.track); });
        if (opts.dragIndex != null) makeDraggable(b, opts.dragIndex);
        refs.qpList.appendChild(b);
      };
      label('Now playing');
      row(nowTrack(), v.art.coverBg, { now: true });
      if (userQueue.length) {
        label('Next in queue', { text: 'Clear', run: () => { userQueue = []; render(); } });
        userQueue.forEach((t, k) => row(t, trackArt(t, t[0].length).coverBg, {
          play: () => { userQueue.splice(k, 1); playNow(t); },
          remove: () => { userQueue.splice(k, 1); render(); },
          dragIndex: k
        }));
      }
      label('Next from ' + DATA[state.plId].name);
      upcoming.forEach((j) => row(tr[j], artFor(state.plId, j).coverBg, { play: () => actions.playTrack(state.plId, j, true), track: tr[j] }));
      if (!upcoming.length) {
        const end = document.createElement('span');
        end.className = 'qp-end';
        end.textContent = 'Nothing after this song.';
        refs.qpList.appendChild(end);
      }
    });
  }

  // ---------- lyrics ----------
  // From LRCLIB (lrclib.net: free, no key). YouTube titles are tidied up
  // ("Artist - Song (Official Video)") before looking them up; synced lyrics
  // follow the song line by line.

  const lyricsCache = new Map(); // video id -> 'loading' | { synced, lines } | { none } | { instrumental }

  function lyricsQuery(t) {
    let title = t[0]
      .replace(/\s*[([][^)\]]*\b(official|video|audio|lyrics?|visuali[sz]er|m\/?v|hd|hq|4k|remaster(ed)?|explicit|color coded|live)\b[^)\]]*[)\]]/gi, '')
      .replace(/\s*[|｜].*$/, '')
      .replace(/\s+(ft\.?|feat\.?|featuring)\s.*$/i, '')
      .replace(/["“”]/g, '')
      .trim();
    let artist = t[1].replace(/\s*VEVO$/i, '').replace(/\s*-\s*Topic$/i, '').trim();
    const split = title.match(/^(.+?)\s+[-–—]\s+(.+)$/);
    if (split) { artist = split[1].trim(); title = split[2].trim(); }
    return { title, artist };
  }

  function parseLrc(lrc) {
    const lines = [];
    lrc.split('\n').forEach((l) => {
      const m = l.match(/^\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/);
      if (m) lines.push({ t: +m[1] * 60 + +m[2], text: m[3] || '♪' });
    });
    return lines;
  }

  async function lrclib(path, params) {
    const r = await fetch('https://lrclib.net/api/' + path + '?' + new URLSearchParams(params));
    if (r.status === 404) return null;
    if (!r.ok) throw new Error('Lyrics service error ' + r.status);
    return r.json();
  }

  // Best match: drop junk entries (anyone can upload to LRCLIB, and some
  // exact matches are a single placeholder line), then prefer synced lyrics
  // close to the song's length, then the fullest.
  const lineCount = (r) => (r.plainLyrics || r.syncedLyrics || '').split('\n').filter((l) => l.replace(/^\[[^\]]*\]/, '').trim()).length;
  function pickLyrics(results, duration) {
    const usable = results.filter((r) => r && (r.instrumental || lineCount(r) >= 4));
    const close = usable.filter((r) => Math.abs((r.duration || 0) - duration) <= 5);
    const pool = close.length ? close : usable;
    const rank = (r) => (r.syncedLyrics ? 1000 : 0) - Math.abs((r.duration || 0) - duration) * 10 + Math.min(lineCount(r), 99);
    return pool.sort((a, b) => rank(b) - rank(a))[0] || null;
  }

  async function loadLyrics(t) {
    const key = t[3];
    if (!key || lyricsCache.has(key)) return;
    lyricsCache.set(key, 'loading');
    const { title, artist } = lyricsQuery(t);
    let hit = null;
    try {
      // Exact match and two searches at once; pick the best of everything.
      const [exact, byField, byText] = await Promise.all([
        lrclib('get', { track_name: title, artist_name: artist, duration: Math.round(t[2]) }),
        lrclib('search', { track_name: title, artist_name: artist }),
        lrclib('search', { q: artist + ' ' + title })
      ]);
      hit = pickLyrics([exact, ...(byField || []), ...(byText || [])], t[2]);
    } catch (e) {
      lyricsCache.delete(key); // try again next time
      render();
      return;
    }
    lyricsCache.set(key, !hit ? { none: true }
      : hit.instrumental ? { instrumental: true }
      : hit.syncedLyrics ? { synced: true, lines: parseLrc(hit.syncedLyrics) }
      : { synced: false, lines: hit.plainLyrics.split('\n').map((text) => ({ text: text || ' ' })) });
    render();
  }

  function renderLyrics() {
    const on = state.lyrics;
    refs.playerLyrics.classList.toggle('on', on);
    refs.playerLyrics.setAttribute('aria-pressed', String(on));
    refs.lyrics.classList.toggle('hidden', !on);
    refs.turntable.classList.toggle('hidden', on);
    if (!on) return;
    const t = nowTrack();
    if (t[3]) loadLyrics(t);
    const got = t[3] ? lyricsCache.get(t[3]) : { none: true };
    refs.lyrics.classList.toggle('plain', !!got && got !== 'loading' && !got.synced);
    rebuild(refs.lyricsLines, JSON.stringify([t[3] || t[0], got === 'loading' ? 'loading' : !!got && (got.none ? 'none' : got.instrumental ? 'inst' : got.lines.length)]), () => {
      const note = (text) => {
        const n = document.createElement('div');
        n.className = 'lyrics-note';
        n.textContent = text;
        refs.lyricsLines.appendChild(n);
      };
      if (!got || got === 'loading') return note('Finding lyrics…');
      if (got.none) return note('No lyrics found for this song.');
      if (got.instrumental) return note('Instrumental ♪');
      got.lines.forEach((l) => {
        const n = document.createElement('div');
        n.className = 'lyrics-line';
        n.textContent = l.text;
        refs.lyricsLines.appendChild(n);
      });
      refs.lyrics.scrollTop = 0;
      lyricLine = -1;
    });
  }

  // Highlight the line being sung, a few times a second, and keep it centred.
  let lyricLine = -1;
  setInterval(() => {
    if (!state.lyrics || state.view !== 'player') return;
    const t = nowTrack();
    const got = t[3] && lyricsCache.get(t[3]);
    if (!got || !got.synced) return;
    const now = (t[3] ? yt.player.time() : state.pos) + 0.25;
    let k = -1;
    for (let i = 0; i < got.lines.length && got.lines[i].t <= now; i++) k = i;
    if (k === lyricLine) return;
    lyricLine = k;
    const nodes = refs.lyricsLines.children;
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].classList.toggle('now', i === k);
      nodes[i].classList.toggle('past', i < k);
    }
    const cur = nodes[Math.max(0, k)];
    if (cur) refs.lyrics.scrollTop = cur.offsetTop - refs.lyrics.clientHeight / 2 + cur.offsetHeight / 2;
  }, 250);

  // ---------- search ----------
  // Your library is searched as you type; YouTube Music on Enter (each
  // YouTube search uses 1% of the API's daily quota).

  function libraryMatches(q) {
    const words = fold(q).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const out = [], seen = new Set();
    DATA.forEach((pl, plId) => pl.tracks.forEach((t, idx) => {
      if (out.length >= 60) return;
      const hay = fold(t[0] + ' ' + t[1]);
      if (!words.every((w) => hay.includes(w))) return;
      const key = t[3] || plId + ':' + idx;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ plId, idx, track: t });
    }));
    return out;
  }

  async function searchYouTube(q) {
    if (!q.trim() || !state.account) return;
    setState({ search: { ...state.search, ytQ: q, loading: true, error: '', yt: null } });
    try {
      const yt_ = await yt.search(q);
      if (state.search.ytQ === q) setState({ search: { ...state.search, yt: yt_, loading: false } });
    } catch (e) {
      if (state.search.ytQ === q) setState({ search: { ...state.search, loading: false, error: e.message } });
    }
  }

  function resultRow(track, cover, from, play) {
    const row = document.createElement('div');
    row.className = 'result-row' + (playable(track) ? '' : ' blocked');
    row.innerHTML = '<span class="r-cover"></span><span class="r-meta"><span class="r-title"></span><span class="r-artist"></span></span>' +
      '<span class="r-from"></span><span class="r-time"></span>' +
      '<span class="t-more" role="button" tabindex="0" aria-label="More" title="More">' + MORE_ICON + '</span>';
    row.querySelector('.r-cover').style.background = cover;
    row.querySelector('.r-title').textContent = track[0];
    row.querySelector('.r-artist').textContent = track[1];
    row.querySelector('.r-from').textContent = from;
    row.querySelector('.r-time').textContent = fmt(track[2]);
    row.addEventListener('click', (e) => {
      const more = e.target.closest('.t-more');
      if (more) { const r = more.getBoundingClientRect(); openMenu(r.left, r.bottom + 4, track, play); return; }
      play();
    });
    row.addEventListener('contextmenu', (e) => { e.preventDefault(); openMenu(e.clientX, e.clientY, track, play); });
    return row;
  }

  function renderSearch() {
    if (state.view !== 'search') return;
    const sr = state.search;
    const lib = libraryMatches(sr.q);
    refs.searchLibrary.classList.toggle('hidden', !sr.q.trim());
    rebuild(refs.searchLibraryRows, JSON.stringify([sr.q, lib.map((m) => [m.plId, m.idx]), DATA.length]), () => {
      if (!lib.length) {
        const n = document.createElement('div');
        n.className = 'search-empty';
        n.textContent = 'No songs in your playlists match.';
        refs.searchLibraryRows.appendChild(n);
      }
      lib.forEach((m) => refs.searchLibraryRows.appendChild(
        resultRow(m.track, artFor(m.plId, m.idx).coverBg, DATA[m.plId].name, () => actions.playTrack(m.plId, m.idx))));
    });

    refs.searchYtHint.textContent = !state.account ? 'Connect YouTube Music to search it'
      : sr.loading ? 'Searching…'
      : sr.error ? sr.error
      : sr.q.trim() && sr.q !== sr.ytQ ? 'Press Enter to search YouTube Music'
      : '';
    rebuild(refs.searchYtRows, JSON.stringify([sr.ytQ, sr.yt && sr.yt.map((t) => t[3])]), () => {
      if (sr.yt && !sr.yt.length) {
        const n = document.createElement('div');
        n.className = 'search-empty';
        n.textContent = 'No music videos found.';
        refs.searchYtRows.appendChild(n);
      }
      (sr.yt || []).forEach((t) => refs.searchYtRows.appendChild(
        resultRow(t, trackArt(t, t[0].length).coverBg, 'YouTube Music', () => { playNow(t); setState({ view: 'player' }); })));
    });
  }

  // Drag queued songs by their grip to reorder them: drop on the top half of
  // a row to go above it, the bottom half to go below.
  let dragFrom = -1;

  function makeDraggable(row, k) {
    const grip = document.createElement('span');
    grip.className = 'qp-grip';
    grip.title = 'Drag to reorder';
    grip.innerHTML = '<svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor"><circle cx="2.5" cy="3" r="1.4"></circle><circle cx="7.5" cy="3" r="1.4"></circle><circle cx="2.5" cy="8" r="1.4"></circle><circle cx="7.5" cy="8" r="1.4"></circle><circle cx="2.5" cy="13" r="1.4"></circle><circle cx="7.5" cy="13" r="1.4"></circle></svg>';
    row.prepend(grip);
    row.classList.add('queued');
    row.draggable = true;
    const below = (e) => e.clientY > row.getBoundingClientRect().top + row.offsetHeight / 2;
    const clear = () => row.classList.remove('drop-above', 'drop-below');
    row.addEventListener('dragstart', (e) => {
      dragFrom = k;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(k));
      row.classList.add('dragging');
    });
    row.addEventListener('dragend', () => { dragFrom = -1; row.classList.remove('dragging'); });
    row.addEventListener('dragover', (e) => {
      if (dragFrom < 0) return;
      e.preventDefault();
      row.classList.toggle('drop-below', below(e));
      row.classList.toggle('drop-above', !below(e));
    });
    row.addEventListener('dragleave', clear);
    row.addEventListener('drop', (e) => {
      e.preventDefault();
      clear();
      if (dragFrom < 0) return;
      let to = k + (below(e) ? 1 : 0);
      const [t] = userQueue.splice(dragFrom, 1);
      if (dragFrom < to) to--;
      userQueue.splice(to, 0, t);
      dragFrom = -1;
      render();
    });
  }

  // ---------- song menu (right-click or ⋯) ----------

  // `from`: the playlist index the song was picked in, for "Remove from this playlist".
  function openMenu(x, y, track, play, from, page) {
    setState({ menu: { x, y, track, play, from, page } });
  }

  function renderMenu() {
    const m = state.menu;
    refs.songMenu.classList.toggle('hidden', !m);
    if (!m) return;
    // `m.page`: the main list, your playlists, or naming a new one.
    rebuild(refs.songMenu, JSON.stringify([m.track, !!m.play, m.page || '', m.from, isLiked(m.track), DATA.length]), () => {
      const item = (text, run, opts = {}) => {
        const b = document.createElement('button');
        b.textContent = text;
        if (opts.cls) b.className = opts.cls;
        if (opts.title) b.title = opts.title;
        b.addEventListener('click', () => { if (!opts.stay) setState({ menu: null }); run(); });
        (opts.into || refs.songMenu).appendChild(b);
      };
      const page = (to, text, cls) => item(text, () => setState({ menu: { ...m, page: to } }), { cls, stay: true });
      refs.songMenu.classList.toggle('picking', !!m.page);
      if (m.page === 'playlists') {
        page(null, '‹ Add to playlist', 'menu-back');
        const list = document.createElement('div');
        list.className = 'menu-list';
        refs.songMenu.appendChild(list);
        ownPlaylists().forEach((p) => item(p.name, () => addToPlaylist(m.track, p), { into: list, title: p.name }));
        page('new', '+ New playlist…', 'menu-new');
      } else if (m.page === 'new') {
        page('playlists', '‹ New playlist', 'menu-back');
        const form = document.createElement('form');
        form.className = 'menu-form';
        const input = document.createElement('input');
        input.placeholder = 'Playlist name';
        input.maxLength = 150;
        input.setAttribute('aria-label', 'Playlist name');
        const go = document.createElement('button');
        go.textContent = 'Create';
        form.append(input, go);
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = input.value.trim();
          if (!name) return;
          setState({ menu: null });
          addToNewPlaylist(m.track, name);
        });
        refs.songMenu.appendChild(form);
        setTimeout(() => input.focus());
      } else {
        if (m.play) item('Play', m.play);
        item('Play next', () => enqueue(m.track, true));
        item('Add to queue', () => enqueue(m.track, false));
        if (state.account && m.track[3]) page('playlists', 'Add to playlist…');
        if (canLike(m.track)) item(isLiked(m.track) ? 'Remove from Liked music' : 'Add to Liked music', () => toggleLike(m.track));
        const from = DATA[m.from];
        if (state.account && from && from.id && from.id !== 'LM' && from.tracks.includes(m.track)) {
          item('Remove from this playlist', () => removeFromPlaylist(from, m.track), { cls: 'menu-danger' });
        }
      }
    });
    // Keep it on screen.
    const w = refs.songMenu.offsetWidth, h = refs.songMenu.offsetHeight;
    refs.songMenu.style.left = Math.min(m.x, window.innerWidth - w - 8) + 'px';
    refs.songMenu.style.top = Math.min(m.y, window.innerHeight - h - 8) + 'px';
  }

  function renderCompact(v) {
    refs.compactArt.style.background = v.art.coverBg;
    refs.compactTitle.textContent = v.now.title;
    refs.compactArtist.textContent = state.volumeHint ? 'Volume ' + (state.muted ? 0 : state.volume) : v.now.artist;
    refs.compactSeekFill.style.width = v.progressPct;
    refs.compactToggle.innerHTML = v.playing ? PAUSE_ICON_SM : PLAY_ICON_SM;
  }

  let shownYtError = '';

  function renderAccount() {
    // A YouTube problem (sign-in, library) shows as an error toast until it clears.
    if (state.ytError !== shownYtError) {
      shownYtError = state.ytError;
      if (state.ytError) notify('YouTube Music', state.ytError, 'error', { id: 'yt-error', sticky: true });
      else dismissToast(document.querySelector('[data-id="yt-error"]'));
    }
    const key = JSON.stringify([state.account, state.syncing]);
    rebuild(refs.topbarRight, key, () => {
      const add = (tag, cls, text) => {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text) n.textContent = text;
        refs.topbarRight.appendChild(n);
        return n;
      };
      if (state.syncing) add('span', '', 'Syncing YouTube Music…');
      else if (!state.account) add('button', 'yt-connect', 'Connect YouTube Music').onclick = connectYouTube;
    });
  }

  function renderLike() {
    const t = nowTrack(), on = isLiked(t), label = on ? 'Remove from Liked music' : 'Add to Liked music';
    for (const b of [refs.playerLike, refs.miniLike]) {
      b.classList.toggle('hidden', !canLike(t));
      b.classList.toggle('on', on);
      b.disabled = !!(t && liking.has(t[3]));
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', label);
      b.title = label;
    }
    const canAdd = !!(state.account && t && t[3]);
    for (const b of [refs.playerAdd, refs.miniAdd]) b.classList.toggle('hidden', !canAdd);
  }

  function renderRecent() {
    refs.recentSection.classList.toggle('hidden', !recent.length);
    if (!recent.length) return;
    const shown = recentAll ? recent : recent.slice(0, RECENT_SHOWN);
    refs.recentMore.classList.toggle('hidden', recent.length <= RECENT_SHOWN);
    refs.recentMore.textContent = recentAll ? 'Show less' : 'Show all ' + recent.length;
    // Rebuilt each minute too, so "5 min ago" keeps up.
    rebuild(refs.recentRows, JSON.stringify([shown.map((r) => [r.t[3], r.at]), Math.floor(Date.now() / 60000)]), () => shown.forEach((r) => {
      refs.recentRows.appendChild(resultRow(r.t, trackArt(r.t, r.t[0].length).coverBg, ago(r.at), () => { playNow(r.t); setState({ view: 'player' }); }));
    }));
  }

  function renderHome(v) {
    renderRecent();
    rebuild(refs.playlistsGrid, JSON.stringify(v.playlists), () => v.playlists.forEach((pl) => {
      const btn = document.createElement('button');
      btn.className = 'pl-tile';
      btn.innerHTML =
        '<span class="pl-art">' +
          '<span class="pl-disc"><span class="pl-disc-label"></span></span>' +
          '<span class="pl-cover"><span></span></span>' +
        '</span>' +
        '<span class="pl-name"></span>' +
        '<span class="pl-sub"></span>';
      btn.querySelector('.pl-disc-label').style.background = pl.color;
      btn.querySelector('.pl-cover span').textContent = pl.name;
      paintSleeve(btn.querySelector('.pl-cover'), pl, btn.querySelector('.pl-cover span'));
      btn.querySelector('.pl-name').textContent = pl.name;
      btn.querySelector('.pl-sub').textContent = pl.countLabel + ' · ' + pl.lengthLabel;
      btn.addEventListener('click', () => actions.openPlaylist(pl.idx));
      refs.playlistsGrid.appendChild(btn);
    }));
  }

  function renderList(v) {
    refs.listBack.onclick = actions.goHome;
    refs.listDiscDot.style.background = v.openPl.color;
    paintSleeve(refs.listDiscCover, v.openPl);
    refs.listTitle.textContent = v.openPl.name;
    refs.listSub.textContent = v.openPl.countLabel + ' · ' + v.openPl.lengthLabel;
    refs.listPlayAll.onclick = actions.playOpen;

    refs.listColumns.querySelectorAll('.col-sort').forEach((b) => {
      const on = state.sortKey === b.dataset.k;
      b.classList.toggle('on', on);
      b.querySelector('.sort-arrow').textContent = on ? (state.sortDir === 1 ? '▲' : '▼') : '';
      b.title = on ? (state.sortDir === 1 ? 'Click to reverse' : 'Click for playlist order') : 'Sort by ' + b.dataset.k;
    });
    rebuild(refs.listSortNote, JSON.stringify([state.sortKey, state.sortDir, state.listFilter, v.openTracks.length]), () => {
      const parts = [];
      if (state.listFilter.trim()) parts.push(v.openTracks.length + ' of ' + DATA[state.openId].tracks.length + ' songs');
      if (state.sortKey) parts.push('Sorted by ' + { title: 'title', artist: 'artist', time: 'length' }[state.sortKey]);
      refs.listSortNote.textContent = parts.join(' · ');
      if (state.sortKey) {
        const b = document.createElement('button');
        b.textContent = 'Playlist order';
        b.addEventListener('click', () => { setPrefs({ sortKey: '', sortDir: 1 }); if (!state.shuffle) { buildOrder(state.plId, state.idx); render(); } });
        refs.listSortNote.appendChild(b);
      }
    });

    const rowsKey = JSON.stringify([state.openId, v.openTracks, v.art.vinylBg, v.spinState]);
    rebuild(refs.listRows, rowsKey, () => {
      if (!v.openTracks.length) {
        const n = document.createElement('div');
        n.className = 'list-empty';
        n.textContent = 'No songs match.';
        refs.listRows.appendChild(n);
      }
      v.openTracks.forEach((t) => {
      const row = document.createElement('button');
      row.className = 'track-row' + (t.blocked ? ' blocked' : '');
      if (t.blocked) row.title = "This song can't be played here";
      row.style.background = t.bg;
      row.style.color = t.color;
      row.innerHTML =
        '<span class="num-cell"></span>' +
        '<span class="t-title"></span>' +
        '<span class="t-artist"></span>' +
        '<span class="t-time"></span>' +
        '<span class="t-more" role="button" tabindex="0" aria-label="More" title="More">' + MORE_ICON + '</span>';
      const numCell = row.querySelector('.num-cell');
      numCell.style.color = t.numColor;
      if (t.showNow) {
        numCell.innerHTML = '<span class="mini-vinyl"><span></span></span>';
        numCell.querySelector('.mini-vinyl').style.background = v.art.vinylBg;
        numCell.querySelector('.mini-vinyl').style.animationPlayState = v.spinState;
      } else {
        numCell.innerHTML = '<span class="num"></span><span class="play">' + PLAY_TRI_ROW + '</span>';
        numCell.querySelector('.num').textContent = String(t.num);
      }
      row.querySelector('.t-title').textContent = t.title;
      row.querySelector('.t-artist').textContent = t.artist;
      row.querySelector('.t-time').textContent = t.time;
      const track = DATA[state.openId].tracks[t.idx];
      row.addEventListener('click', (e) => {
        if (e.target.closest('.t-more')) { const r = e.target.closest('.t-more').getBoundingClientRect(); openMenu(r.left, r.bottom + 4, track, null, state.openId); return; }
        actions.playTrack(state.openId, t.idx);
      });
      row.addEventListener('contextmenu', (e) => { e.preventDefault(); openMenu(e.clientX, e.clientY, track, null, state.openId); });
      refs.listRows.appendChild(row);
      });
    });
  }

  function renderCrate(v) {
    refs.crateNowCover.style.background = v.art.coverBg;
    refs.crateHex.textContent = v.coverHex;
    refs.crateMatch.textContent = v.matchLabel;
    refs.crateAutoMatch.classList.toggle('hidden', !v.isPicked);
    refs.crateAutoMatch.onclick = actions.autoMatch;

    rebuild(refs.crateGrid, JSON.stringify([v.crate, v.art.c1]), () => v.crate.forEach((vi) => {
      const btn = document.createElement('button');
      btn.className = 'vinyl-tile';
      btn.innerHTML =
        '<span class="vinyl-disc"><span class="vinyl-disc-center"><span></span></span></span>' +
        '<span class="vinyl-meta">' +
          '<span class="vinyl-name"></span>' +
          '<span class="vinyl-hex"><span class="swatch"></span><span class="hex-style"></span></span>' +
          '<span class="vinyl-on hidden">On the platter</span>' +
        '</span>';
      const disc = btn.querySelector('.vinyl-disc');
      disc.style.background = vi.bg;
      disc.style.boxShadow = vi.ring;
      disc.style.transform = 'scale(' + vi.scale + ')';
      btn.querySelector('.vinyl-name').textContent = vi.name;
      btn.querySelector('.swatch').style.background = vi.hex;
      btn.querySelector('.hex-style').textContent = vi.hex + ' · ' + vi.style;
      btn.querySelector('.vinyl-on').classList.toggle('hidden', !vi.on);
      btn.addEventListener('click', () => actions.pickVinyl(vi.idx, closestVinyl(v.art.c1)));
      refs.crateGrid.appendChild(btn);
    }));
  }

  function renderPlayer(v) {
    refs.playerCover.style.background = v.art.coverBg;
    refs.playerCoverTitle.textContent = v.now.title;
    refs.playerCoverTitle.style.color = v.art.c4;
    refs.playerCoverArtist.textContent = v.now.artist;
    refs.playerCoverArtist.style.color = v.art.c4;
    refs.playerCoverTitle.classList.toggle('hidden', v.art.hasThumb);
    refs.playerCoverArtist.classList.toggle('hidden', v.art.hasThumb);

    refs.playerTitle.textContent = v.now.title;
    refs.playerArtist.textContent = v.now.artist;

    // turntable
    refs.disc.style.background = v.art.vinylDisc;
    refs.disc.style.animationDuration = v.spinDur;
    refs.disc.style.animationPlayState = v.spinState;
    refs.disc.onclick = actions.toggle;
    refs.discLabel.style.background = v.art.c4;
    refs.discLabel.style.color = v.art.c3;
    refs.discTitle.textContent = v.now.title;
    refs.discArtist.textContent = v.now.artist;
    refs.discRpm.textContent = v.rpmLabel + ' RPM';

    refs.tonearm.style.transform = 'rotate(' + v.armAngle + 'deg)';
    refs.tonearm.style.filter = v.armShadow;
    refs.stylusStripe.style.background = v.accent;

    refs.stageInner.style.zoom = v.stageZoom;

    refs.posLabel.textContent = v.posLabel;
    refs.timeLabel.textContent = v.now.time;
    refs.seekFill.style.width = v.progressPct;
    refs.seekKnob.style.left = v.progressPct;
    const duration = nowTrack()[2];
    refs.seekTrack.onclick = (e) => actions.seekFromEvent(e, refs.seekTrack, duration);

    refs.btnPrev.onclick = actions.prev;
    refs.btnNext.onclick = actions.next;
    refs.btnToggle.innerHTML = v.playing ? PAUSE_ICON : PLAY_ICON;
    refs.btnToggle.onclick = actions.toggle;

    setIcon(refs.btnShuffle, 'shuffle', SHUFFLE_ICON);
    refs.btnShuffle.classList.toggle('on', state.shuffle);
    refs.btnShuffle.setAttribute('aria-pressed', String(state.shuffle));
    refs.btnShuffle.title = state.shuffle ? 'Shuffle: on' : 'Shuffle: off';
    setIcon(refs.btnRepeat, state.repeat, REPEAT_ICONS[state.repeat] || REPEAT_ICONS.off);
    refs.btnRepeat.classList.toggle('on', state.repeat !== 'off');
    refs.btnRepeat.setAttribute('aria-label', REPEAT_LABELS[state.repeat] || REPEAT_LABELS.off);
    refs.btnRepeat.title = refs.btnRepeat.getAttribute('aria-label');
  }

  function renderMinibar(v) {
    refs.minibar.classList.toggle('show', v.showMini);
    refs.minibarOpen.onclick = actions.openPlayer;
    refs.minibarVinyl.style.background = v.art.vinylBg;
    refs.minibarVinyl.style.animationPlayState = v.spinState;
    refs.minibarVinylLabel.style.background = v.art.c4;
    refs.minibarCover.style.background = v.art.coverBg;
    refs.minibarTitle.textContent = v.now.title;
    refs.minibarArtist.textContent = v.now.artist;
    refs.minibarTime.textContent = v.posLabel + ' / ' + v.now.time;
    refs.minibarSeekFill.style.width = v.progressPct;
    const duration = nowTrack()[2];
    refs.minibarSeek.onclick = (e) => actions.seekFromEvent(e, refs.minibarSeek, duration);
    refs.miniPrev.onclick = actions.prev;
    refs.miniNext.onclick = actions.next;
    refs.miniToggle.innerHTML = v.playing ? PAUSE_ICON_SM : PLAY_ICON_SM;
    refs.miniToggle.onclick = actions.toggle;
  }

  refs.goHome.addEventListener('click', actions.goHome);

  refs.btnSettings.addEventListener('click', () => actions.togglePanel('settings'));
  refs.btnShuffle.addEventListener('click', actions.toggleShuffle);
  refs.btnRepeat.addEventListener('click', actions.cycleRepeat);
  refs.spShuffle.addEventListener('click', actions.toggleShuffle);
  refs.spRepeat.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => actions.setRepeat(b.dataset.v)));
  refs.spMute.addEventListener('click', actions.toggleMute);
  refs.spVolume.addEventListener('input', () => actions.setVolume(Number(refs.spVolume.value)));
  refs.spFade.addEventListener('input', () => actions.setFade(Number(refs.spFade.value)));
  refs.spXf.addEventListener('input', () => actions.setCrossfade(Number(refs.spXf.value)));
  refs.spPressing.addEventListener('click', actions.openCrateFromSettings);

  // The full settings page: opened from the quick panel, back to where you were.
  let viewBeforeSettings = 'home';
  refs.spMore.addEventListener('click', () => {
    if (state.view !== 'settings') viewBeforeSettings = state.view;
    setState({ view: 'settings', panel: null });
  });
  refs.settingsBack.addEventListener('click', () => setState({ view: viewBeforeSettings }));
  refs.settingsNav.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    refs.settingsNav.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
    el(b.dataset.sec).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  refs.spSleep.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => setSleep(b.dataset.v)));

  refs.btnQueue.addEventListener('click', () => actions.togglePanel('queue'));
  refs.listColumns.querySelectorAll('.col-sort').forEach((b) => b.addEventListener('click', () => actions.sortBy(b.dataset.k)));
  refs.listFilter.addEventListener('input', () => setState({ listFilter: refs.listFilter.value }));
  refs.listFilter.addEventListener('keydown', (e) => { if (e.key === 'Escape') { refs.listFilter.value = ''; setState({ listFilter: '' }); refs.listFilter.blur(); } });

  // Search: typing filters your library live; Enter also searches YouTube Music.
  let viewBeforeSearch = 'home';
  refs.searchInput.addEventListener('input', () => {
    const q = refs.searchInput.value;
    if (state.view !== 'search' && q) viewBeforeSearch = state.view;
    setState({ search: { ...state.search, q }, view: q ? 'search' : (state.view === 'search' ? viewBeforeSearch : state.view) });
  });
  refs.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { setState({ view: 'search' }); searchYouTube(refs.searchInput.value.trim()); }
    if (e.key === 'Escape') {
      refs.searchInput.value = '';
      refs.searchInput.blur();
      setState({ search: { ...state.search, q: '' }, view: state.view === 'search' ? viewBeforeSearch : state.view });
    }
  });
  // Lower the player onto the page it was opened from (Library if none).
  refs.playerDismiss.addEventListener('click', () => setState({ view: pageUnderPlayer ? pageUnderPlayer.view : 'home' }));
  refs.playerLyrics.addEventListener('click', () => setPrefs({ lyrics: !state.lyrics }));
  refs.playerLike.addEventListener('click', () => toggleLike(nowTrack()));
  refs.miniLike.addEventListener('click', () => toggleLike(nowTrack()));
  // Straight to the playlist picker for the song that's playing.
  for (const b of [refs.playerAdd, refs.miniAdd]) b.addEventListener('click', () => {
    if (state.menu) { setState({ menu: null }); return; } // a second click closes it
    const r = b.getBoundingClientRect();
    openMenu(r.left, r.bottom + 4, nowTrack(), null, null, 'playlists');
  });
  refs.recentMore.addEventListener('click', () => { recentAll = !recentAll; render(); });
  refs.recentClear.addEventListener('click', () => { recent = []; recentAll = false; saveRecent(); render(); });

  // The song menu closes on any click outside it, Escape, scrolling or resizing.
  document.addEventListener('pointerdown', (e) => {
    if (state.menu && !refs.songMenu.contains(e.target) && !e.target.closest('.t-more, .add-btn')) setState({ menu: null });
  });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && state.menu) setState({ menu: null }); });
  refs.scroller.addEventListener('scroll', () => { if (state.menu) setState({ menu: null }); });
  window.addEventListener('resize', () => { if (state.menu) setState({ menu: null }); });

  // Click outside the open panel, Escape, or a resize closes it.
  document.addEventListener('pointerdown', (e) => {
    if (!state.panel || e.target.closest('#settings-panel, #queue-panel, #btn-settings, #btn-queue')) return;
    setState({ panel: null });
  });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && state.panel) setState({ panel: null }); });
  window.addEventListener('resize', () => { if (state.panel) setState({ panel: null }); });

  // Compact strip (the window is resized to it by the Electron shell).
  refs.btnCompact.classList.toggle('hidden', !shell);
  refs.compactExpand.classList.toggle('hidden', !shell);
  // Right-click the strip for volume, keep on top, opacity, full player, close.
  refs.compact.addEventListener('contextmenu', (e) => {
    if (!shell || !shell.showStripMenu) return;
    e.preventDefault();
    shell.showStripMenu({ volume: state.volume, muted: state.muted });
  });
  refs.btnCompact.addEventListener('click', () => actions.setCompact(true));
  refs.compactExpand.addEventListener('click', () => actions.setCompact(false));
  refs.compactArt.addEventListener('click', () => actions.setCompact(false));
  refs.compactPrev.addEventListener('click', () => actions.prev());
  refs.compactToggle.addEventListener('click', () => actions.toggle());
  refs.compactNext.addEventListener('click', () => actions.next());
  refs.compactSeek.addEventListener('click', (e) => actions.seekFromEvent(e, refs.compactSeek, nowTrack()[2]));
  // The strip has no title bar: drag it by its background. (A CSS drag region
  // would swallow the scroll-wheel volume, so the move is done by hand.)
  refs.compact.addEventListener('pointerdown', (e) => {
    if (!shell || e.button !== 0 || e.target.closest('button, .compact-seek')) return;
    const sx = e.screenX, sy = e.screenY;
    shell.dragStart();
    refs.compact.setPointerCapture(e.pointerId);
    refs.compact.classList.add('dragging');
    const move = (m) => shell.dragMove(m.screenX - sx, m.screenY - sy);
    const end = () => {
      refs.compact.classList.remove('dragging');
      refs.compact.removeEventListener('pointermove', move);
      refs.compact.removeEventListener('pointerup', end);
      refs.compact.removeEventListener('pointercancel', end);
    };
    refs.compact.addEventListener('pointermove', move);
    refs.compact.addEventListener('pointerup', end);
    refs.compact.addEventListener('pointercancel', end);
  });

  // Full window: the top bar is the title bar.
  if (shell) {
    document.body.classList.add('frameless');
    refs.windowControls.classList.remove('hidden');
    const showMaximized = (on) => {
      setIcon(refs.winMax, on ? 'restore' : 'maximize', on ? RESTORE_ICON : MAXIMIZE_ICON);
      refs.winMax.setAttribute('aria-label', on ? 'Restore' : 'Maximize');
      refs.winMax.title = refs.winMax.getAttribute('aria-label');
    };
    showMaximized(false);
    shell.onMaximizedChange(showMaximized);
    refs.winMin.addEventListener('click', () => shell.minimize());
    refs.winMax.addEventListener('click', () => shell.toggleMaximize());
    refs.winClose.addEventListener('click', () => shell.close());
  }

  refs.compact.addEventListener('wheel', (e) => { e.preventDefault(); actions.nudgeVolume(e.deltaY < 0 ? 5 : -5); }, { passive: false });

  // ---------- player stage auto-fit ----------
  // Mirrors the design's ResizeObserver-driven `zoom` fit so the turntable
  // scales to fit the window: down for small ones, up to 1.6x for large ones.
  function fitStage() {
    const el = refs.stage;
    if (!el || !el.clientWidth) return; // hidden view: keep the last fit
    const z = Math.max(0.5, Math.min(1.6, (el.clientWidth - 80) / 1044, (el.clientHeight - 48) / 660));
    const zr = Math.round(z * 1000) / 1000;
    if (zr !== state.zoom) setState({ zoom: zr });
  }
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(fitStage).observe(refs.stage);
  } else {
    window.addEventListener('resize', fitStage);
  }

  // ---------- playback clock ----------
  setInterval(() => {
    if (state.sleep && state.sleep.at) {
      if (Date.now() >= state.sleep.at) { if (state.playing) sleepNow(); else setState({ sleep: null }); }
      else if (state.panel === 'settings') render(); // keep the countdown fresh
    }
    if (!state.playing) return;
    const t = nowTrack();
    if (t[3]) {
      const s = Math.min(Math.floor(yt.player.time()), t[2]);
      if (s !== state.pos) setState({ pos: s });
      maybeCrossfade(t);
      return;
    }
    if (state.pos + 1 >= t[2]) songEnded(); else setState({ pos: state.pos + 1 });
  }, 1000);

  yt.onEnded(songEnded);
  yt.onError(onPlayError);

  // Headphone/media-key pauses reach the YouTube player directly; follow it.
  yt.onPlayState((playing) => { if (playing !== state.playing) setState({ playing }); });

  // ---------- Windows media controls ----------
  // Song info for the Windows media overlay, and media keys / headphone
  // buttons (play, pause, next, previous) routed through the app.
  //
  // Windows sends those buttons to the page's media session, and Chromium
  // gives that to the frame that is playing sound. Without sound of its own
  // the app loses to the hidden YouTube player, which ignores next/previous.
  // So while music plays the app also plays a silent loop, which makes its
  // own handlers below the ones that get the buttons.
  const keepalive = new Audio(silentWav());
  keepalive.loop = true;

  function silentWav() {
    const rate = 8000, n = rate; // one second of 8-bit mono silence
    const b = new DataView(new ArrayBuffer(44 + n));
    const str = (o, x) => [...x].forEach((c, i) => b.setUint8(o + i, c.charCodeAt(0)));
    str(0, 'RIFF'); b.setUint32(4, 36 + n, true); str(8, 'WAVEfmt ');
    b.setUint32(16, 16, true); b.setUint16(20, 1, true); b.setUint16(22, 1, true);
    b.setUint32(24, rate, true); b.setUint32(28, rate, true); b.setUint16(32, 1, true); b.setUint16(34, 8, true);
    str(36, 'data'); b.setUint32(40, n, true);
    for (let i = 0; i < n; i++) b.setUint8(44 + i, 128);
    return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
  }

  const media = navigator.mediaSession;
  if (media) {
    const on = (action, fn) => { try { media.setActionHandler(action, fn); } catch (e) { /* unsupported action */ } };
    on('play', () => { if (!state.playing) actions.toggle(); });
    on('pause', () => { if (state.playing) actions.toggle(); });
    on('nexttrack', () => actions.next());
    on('previoustrack', () => actions.prev());
  }
  let mediaKey = '';
  function syncMediaSession() {
    if (!media || typeof MediaMetadata === 'undefined') return;
    const t = nowTrack();
    const key = state.qTrack ? 'q:' + state.qTrack[3] : state.plId + ':' + state.idx;
    if (key !== mediaKey) {
      mediaKey = key;
      const art = t[4] ? [{ src: t[4].url, sizes: '480x360', type: 'image/jpeg' }] : [];
      media.metadata = new MediaMetadata({ title: t[0], artist: t[1], album: DATA[state.plId].name, artwork: art });
    }
    media.playbackState = state.playing ? 'playing' : 'paused';
    if (state.playing && keepalive.paused) keepalive.play().catch(() => {});
    else if (!state.playing && !keepalive.paused) keepalive.pause();
    // The tray icon's tooltip and menu show the song too.
    const trayKey = key + ':' + state.playing;
    if (shell && shell.setNowPlaying && trayKey !== trayNow) {
      trayNow = trayKey;
      shell.setNowPlaying({ title: t[0], artist: t[1], playing: state.playing });
    }
  }
  let trayNow = '';

  buildOrder(state.plId, state.idx);
  applyVolume();
  render();
  fitStage();
  if (yt.signedIn()) syncYouTube();
  window.addEventListener('beforeunload', saveSpot);

  // ---------- desktop settings (tray, startup, shortcuts, keep on top) ----------
  let desk = null;

  function setSwitch(b, on) {
    b.classList.toggle('on', on);
    b.setAttribute('aria-checked', String(on));
  }

  function renderDesktop() {
    refs.spDesktop.classList.toggle('hidden', !desk);
    document.querySelectorAll('.desktop-only').forEach((n) => n.classList.toggle('hidden', !desk));
    if (!desk) return;
    setSwitch(refs.spLogin, !!desk.openAtLogin);
    refs.spLogin.closest('.sp-line').classList.toggle('disabled', !desk.canStartup);
    refs.spLoginModeRow.classList.toggle('disabled', !desk.openAtLogin);
    refs.spLoginMode.querySelectorAll('button').forEach((b) => b.classList.toggle('on', (b.dataset.v === 'tray') === !!desk.startInTray));
    setSwitch(refs.spTrayClose, !!desk.closeToTray);
    for (const [input, label, value] of [[refs.setOpacityCompact, refs.setOpacityCompactVal, desk.opacityCompact], [refs.setOpacityFull, refs.setOpacityFullVal, desk.opacityFull]]) {
      const pct = Math.round((value || 1) * 100);
      input.value = String(pct);
      label.textContent = pct + '%';
    }
    setSwitch(refs.spKeys, !!desk.shortcuts);
    renderKeys();
  }

  function changeDesktop(patch) {
    return shell.settings(patch).then((s) => { desk = s; renderDesktop(); });
  }

  // ---------- keyboard shortcuts ----------
  // Shortcuts are written as Electron accelerators ("Ctrl+Alt+Space"), so the
  // global ones go to the main process as they are and the in-app ones are
  // matched against the same text built from each key press.
  const GLOBAL_KEYS = [['toggle', 'Play / pause'], ['next', 'Next song'], ['prev', 'Previous song'], ['volup', 'Volume up'], ['voldown', 'Volume down']];
  const APP_KEYS = [['toggle', 'Play / pause', 'Space'], ['search', 'Search', 'Ctrl+F']];
  const MODIFIERS = { Control: 'Ctrl', Alt: 'Alt', Shift: 'Shift' };
  const KEY_LABELS = { Up: '↑', Down: '↓', Left: '←', Right: '→', Escape: 'Esc', MediaPlayPause: 'Play/Pause', MediaNextTrack: 'Next track', MediaPreviousTrack: 'Previous track', MediaStop: 'Stop', VolumeUp: 'Volume up', VolumeDown: 'Volume down', VolumeMute: 'Mute' };
  const CODE_KEYS = {
    Space: 'Space', Enter: 'Enter', Tab: 'Tab', Backspace: 'Backspace', Delete: 'Delete', Insert: 'Insert',
    Home: 'Home', End: 'End', PageUp: 'PageUp', PageDown: 'PageDown', ArrowUp: 'Up', ArrowDown: 'Down', ArrowLeft: 'Left', ArrowRight: 'Right',
    Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']', Backslash: '\\', Semicolon: ';', Quote: "'", Comma: ',', Period: '.', Slash: '/', Backquote: '`',
    NumpadAdd: 'numadd', NumpadSubtract: 'numsub', NumpadMultiply: 'nummult', NumpadDivide: 'numdiv', NumpadDecimal: 'numdec', NumpadEnter: 'Enter',
    MediaPlayPause: 'MediaPlayPause', MediaTrackNext: 'MediaNextTrack', MediaTrackPrevious: 'MediaPreviousTrack', MediaStop: 'MediaStop',
    AudioVolumeUp: 'VolumeUp', AudioVolumeDown: 'VolumeDown', AudioVolumeMute: 'VolumeMute'
  };
  // The key part of an accelerator, from KeyboardEvent.code (layout-independent).
  function keyOf(code) {
    let m;
    if ((m = /^Key([A-Z])$/.exec(code)) || (m = /^Digit(\d)$/.exec(code)) || (m = /^(F\d{1,2})$/.exec(code))) return m[1];
    if ((m = /^Numpad(\d)$/.exec(code))) return 'num' + m[1];
    return CODE_KEYS[code] || '';
  }
  function comboOf(e) {
    const key = keyOf(e.code);
    if (!key) return '';
    return [e.ctrlKey && 'Ctrl', e.altKey && 'Alt', e.shiftKey && 'Shift', key].filter(Boolean).join('+');
  }
  function keyLabel(k) {
    if (KEY_LABELS[k]) return KEY_LABELS[k];
    const m = /^num(\d|add|sub|mult|div|dec)$/.exec(k);
    return m ? 'Num ' + ({ add: '+', sub: '-', mult: '*', div: '/', dec: '.' }[m[1]] || m[1]) : k;
  }
  // The key part is last; a combo never ends in "+" (Equal is "=", numpad + is "numadd").
  const comboKeys = (combo) => (combo ? combo.split('+') : []);
  const appKeys = () => Object.fromEntries(APP_KEYS.map(([cmd, , def]) => [cmd, typeof state.keys[cmd] === 'string' ? state.keys[cmd] : def]));

  // While recording, every key press goes to the recorder. Keys held together
  // make the combination; pressing again after letting go starts over. Esc saves.
  let rec = null; // { group, cmd, mods: Set, key, down: Set, error }
  const KEYS_HINT = 'Click a shortcut, press up to 4 keys, then Esc to save.';

  function startRecording(group, cmd) {
    if (rec) stopRecording();
    rec = { group, cmd, mods: new Set(), key: '', down: new Set(), error: '' };
    if (shell && shell.settings && group === 'global') changeDesktop({ recording: true });
    renderKeys();
  }
  function stopRecording() {
    if (!rec) return;
    const wasGlobal = rec.group === 'global';
    rec = null;
    if (wasGlobal && shell && shell.settings) changeDesktop({ recording: false }); else renderKeys();
  }
  const recCombo = () => (rec ? [...['Ctrl', 'Alt', 'Shift'].filter((m) => rec.mods.has(m)), rec.key].filter(Boolean).join('+') : '');

  function saveRecording() {
    const combo = recCombo();
    if (!combo) return stopRecording(); // nothing pressed: keep the old keys
    const fail = (msg) => { rec.error = msg; renderKeys(); };
    if (!rec.key) return fail('Add a key that isn\'t Ctrl, Alt or Shift');
    const loose = !rec.mods.size && !/^(F\d+|Media\w+|Volume\w+)$/.test(rec.key);
    if (rec.group === 'global' && loose) return fail('Needs Ctrl, Alt or Shift, so typing in other apps still works');
    // The same keys can't do two things.
    const used = [
      ...(desk && desk.keys ? GLOBAL_KEYS.map(([cmd, label]) => ['global', cmd, label, desk.keys[cmd]]) : []),
      ...APP_KEYS.map(([cmd, label]) => ['app', cmd, label, appKeys()[cmd]]),
      ['app', 'esc', 'Close menu or panel', 'Escape']
    ].find(([g, cmd, , k]) => k === combo && !(g === rec.group && cmd === rec.cmd));
    if (used) return fail('Conflicts with ' + (used[0] === 'global' ? 'Global' : 'In Groove') + ' → ' + used[2]);
    const { group, cmd } = rec;
    if (group === 'global') {
      rec = null;
      changeDesktop({ keys: { [cmd]: combo }, recording: false });
    } else {
      setPrefs({ keys: { ...state.keys, [cmd]: combo } });
      stopRecording();
    }
  }

  window.addEventListener('keydown', (e) => {
    if (!rec) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (e.repeat) return;
    if (e.key === 'Escape') return saveRecording();
    if (!rec.down.size) { rec.mods.clear(); rec.key = ''; rec.error = ''; rec.nudged = false; } // a fresh press starts over
    rec.down.add(e.code);
    if (MODIFIERS[e.key]) rec.mods.add(MODIFIERS[e.key]);
    else if (keyOf(e.code)) rec.key = keyOf(e.code);
    renderKeys();
  }, true);
  window.addEventListener('keyup', (e) => { if (rec) { e.preventDefault(); rec.down.delete(e.code); } }, true);
  // Clicking elsewhere with unsaved keys first reminds about Esc; clicking
  // away again, or switching away from the window, cancels.
  document.addEventListener('pointerdown', (e) => {
    if (!rec || e.target.closest('.key-edit')) return;
    if (recCombo() && !rec.error && !rec.nudged) { rec.nudged = true; renderKeys(); } else stopRecording();
  }, true);
  window.addEventListener('blur', stopRecording);

  // The in-app shortcuts. Plain keys are left alone while typing in a field.
  window.addEventListener('keydown', (e) => {
    const combo = comboOf(e);
    if (!combo || e.defaultPrevented) return;
    const t = e.target || {};
    if ((/INPUT|TEXTAREA|SELECT/.test(t.tagName || '') || t.isContentEditable) && !e.ctrlKey && !e.altKey) return;
    const cmd = Object.entries(appKeys()).find(([, k]) => k === combo);
    if (!cmd) return;
    e.preventDefault();
    if (cmd[0] === 'toggle') actions.toggle();
    else if (cmd[0] === 'search') { refs.searchInput.focus(); refs.searchInput.select(); }
  });

  function keyRow(group, cmd, label, combo, opts = {}) {
    const row = document.createElement('div');
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    const recording = rec && rec.group === group && rec.cmd === cmd;
    const shown = recording ? recCombo() : combo;
    const box = opts.fixed ? dd : document.createElement('button');
    if (!opts.fixed) {
      box.className = 'key-edit' + (recording ? ' recording' : '');
      box.setAttribute('aria-label', 'Change shortcut for ' + label + (combo ? ' (now ' + comboKeys(combo).map(keyLabel).join(' + ') + ')' : ''));
      box.addEventListener('click', () => { if (!recording) startRecording(group, cmd); });
      dd.append(box);
    }
    if (recording && !shown) {
      const p = document.createElement('span');
      p.className = 'key-prompt';
      p.textContent = 'Press keys…';
      box.append(p);
    }
    for (const k of comboKeys(shown)) {
      const kbd = document.createElement('kbd');
      kbd.textContent = keyLabel(k);
      box.append(kbd);
    }
    row.append(dt, dd);
    // Problems show under the row they belong to.
    const error = recording ? rec.error : opts.taken ? 'Taken by another app. Click to pick different keys' : '';
    const hint = recording && !error && rec.nudged ? 'Press Esc to save' : '';
    row.classList.toggle('error', !!error);
    if (error || hint) {
      const p = document.createElement('p');
      p.className = 'key-error' + (hint ? ' key-hint' : '');
      p.textContent = error || hint;
      row.append(p);
    }
    return row;
  }

  function renderKeys() {
    if (desk && desk.keys) {
      const taken = desk.shortcuts ? desk.shortcutErrors || [] : [];
      refs.keysGlobal.classList.toggle('off', !desk.shortcuts);
      refs.keysGlobal.replaceChildren(...GLOBAL_KEYS.map(([cmd, label]) => keyRow('global', cmd, label, desk.keys[cmd], { taken: taken.includes(cmd) })));
    }
    const ak = appKeys();
    refs.keysApp.replaceChildren(
      ...APP_KEYS.map(([cmd, label]) => keyRow('app', cmd, label, ak[cmd])),
      keyRow('app', 'esc', 'Close menu or panel, clear search', 'Escape', { fixed: true })
    );
    refs.keysMsg.textContent = rec ? 'Press the new keys, then Esc to save.' : KEYS_HINT;
  }

  refs.keysReset.addEventListener('click', () => {
    stopRecording();
    setPrefs({ keys: {} });
    if (desk && shell && shell.settings) changeDesktop({ keys: null }); else renderKeys();
  });
  renderKeys();

  renderDesktop(); // hides the desktop-only settings until (unless) the shell answers
  // Volume-mixer link: changes made in Windows' mixer move Groove's slider.
  if (shell && shell.mixer) {
    shell.mixer.available().then((ok) => { mixer = !!ok; applyVolume(); });
    shell.mixer.onChange((m) => {
      if (!mixer) return;
      setPrefs({ volume: Math.round(m.level * 100), muted: m.muted });
      applyVolume(true);
    });
  }

  if (shell && shell.settings) {
    shell.settings().then((s) => { desk = s; renderDesktop(); });
    refs.spLogin.addEventListener('click', () => changeDesktop({ openAtLogin: !desk.openAtLogin }));
    refs.spLoginMode.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => changeDesktop({ startInTray: b.dataset.v === 'tray' })));
    refs.spTrayClose.addEventListener('click', () => changeDesktop({ closeToTray: !desk.closeToTray }));
    refs.spKeys.addEventListener('click', () => changeDesktop({ shortcuts: !desk.shortcuts }));
    refs.setOpacityCompact.addEventListener('input', () => changeDesktop({ opacityCompact: Number(refs.setOpacityCompact.value) / 100 }));
    refs.setOpacityFull.addEventListener('input', () => changeDesktop({ opacityFull: Number(refs.setOpacityFull.value) / 100 }));
    if (shell.onSettingsChanged) shell.onSettingsChanged((s) => { desk = s; renderDesktop(); });
    // Global shortcuts and the tray menu.
    shell.onCommand((cmd) => {
      if (cmd && cmd.type === 'volume') actions.setVolume(cmd.value);
      else if (cmd && cmd.type === 'mute') actions.toggleMute();
      else if (cmd === 'toggle') actions.toggle();
      else if (cmd === 'next') actions.next();
      else if (cmd === 'prev') actions.prev();
      else if (cmd === 'volup' || cmd === 'voldown') {
        actions.nudgeVolume(cmd === 'volup' ? 5 : -5);
        notify('Volume ' + (state.muted ? 0 : state.volume), '', 'info', { id: 'volume' });
      }
    });
  }

  // ---------- updates (desktop app only) ----------
  let update = null;
  const UPDATE_VIEW = {
    idle: () => ['Groove ' + update.version, 'Updates come from GitHub', 'Check for updates'],
    latest: () => ['Up to date', '', 'Check for updates'],
    checking: () => ['Checking for updates…', '', null],
    available: (u) => ['Version ' + u.next + ' is available', 'Downloads while you listen', 'Update now'],
    downloading: (u) => ['Downloading ' + u.next + '…', (u.percent || 0) + '% · keep listening', null],
    ready: (u) => ['Version ' + u.next + ' is ready', 'Restarts and carries on playing', 'Restart now'],
    error: (u) => ["Couldn't update", u.message || 'Check your connection', 'Try again']
  };

  function renderUpdate() {
    const view = update && UPDATE_VIEW[update.state];
    refs.spApp.classList.toggle('hidden', !view);
    refs.btnSettings.classList.toggle('has-update', !!update && (update.state === 'available' || update.state === 'ready'));
    if (!view) return;
    const [title, sub, button] = view(update);
    refs.spUpdateTitle.textContent = title;
    refs.spUpdateSub.textContent = sub || 'Groove ' + update.version;
    refs.spUpdateBtn.classList.toggle('hidden', !button);
    refs.spUpdateBtn.classList.toggle('accent', update.state === 'available' || update.state === 'ready');
    refs.spUpdateBtn.textContent = button || '';
    refs.spProgress.classList.toggle('hidden', update.state !== 'downloading');
    refs.spProgressFill.style.width = (update.percent || 0) + '%';
  }

  if (shell && shell.updates) {
    shell.updates.onStatus((s) => { update = s; renderUpdate(); });
    shell.updates.status().then((s) => { update = s; renderUpdate(); });
    refs.spUpdateBtn.addEventListener('click', () => {
      if (!update) return;
      if (update.state === 'available') shell.updates.download();
      else if (update.state === 'ready') {
        // Save the spot with "keep playing" so the restarted app carries on.
        restarting = true;
        saveSpot();
        shell.updates.install();
      } else shell.updates.check();
    });
  }
  booted = true;
  hideSplash();
  setTimeout(() => hideSplash(true), SPLASH_MAX_MS);
})();
