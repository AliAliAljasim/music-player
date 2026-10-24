"use strict";
// Electron shell for Groove. The page has to load from http://localhost:8000:
// that is the origin registered with Google OAuth, and the YouTube player
// refuses to embed from file://. So the app serves its own files there.
const { app, BrowserWindow, Menu, Tray, dialog, globalShortcut, ipcMain, screen, shell, webFrameMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const FILES = {
  '/': ['index.html', 'text/html'],
  '/index.html': ['index.html', 'text/html'],
  '/app.js': ['app.js', 'text/javascript'],
  '/youtube.js': ['youtube.js', 'text/javascript'],
  '/config.js': ['config.js', 'text/javascript'],
  '/style.css': ['style.css', 'text/css']
};

// Google refuses sign-in from user agents that identify as Electron.
const USER_AGENT = app.userAgentFallback.replace(/ (Electron|Groove|b-side)\/\S+/g, '');

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const entry = FILES[new URL(req.url, 'http://localhost').pathname];
      if (!entry) { res.writeHead(404); return res.end(); }
      fs.readFile(path.join(__dirname, entry[0]), (err, data) => {
        if (err) { res.writeHead(500); return res.end(); }
        res.writeHead(200, { 'Content-Type': entry[1] + '; charset=utf-8' });
        res.end(data);
      });
    });
    server.once('error', reject);
    server.listen(PORT, 'localhost', resolve);
  });
}

const isGoogleAuth = (url) => /^https:\/\/accounts\.google\.com\//.test(url);

// ---------- window modes ----------
// "full" is the normal app; "compact" is a thin strip (the page switches to
// its compact layout when the window is that short). Each mode remembers its
// own size and position, and the app reopens in the last mode used.

const FULL = { width: 1280, height: 820, minWidth: 380, minHeight: 560 };
const COMPACT = { width: 480, height: 72, minWidth: 320, maxWidth: 900 };
const windowFile = () => path.join(app.getPath('userData'), 'window.json');

function loadWindowState() {
  try {
    return JSON.parse(fs.readFileSync(windowFile(), 'utf8'));
  } catch (e) {
    return { mode: 'full' };
  }
}

function saveWindowState(ws) {
  try { fs.writeFileSync(windowFile(), JSON.stringify(ws)); } catch (e) { /* not fatal */ }
}

// Saved bounds are only reused if they still land on a connected display.
function onScreen(b) {
  return !!b && screen.getAllDisplays().some(({ workArea: a }) =>
    b.x < a.x + a.width && b.x + b.width > a.x && b.y < a.y + a.height && b.y + b.height > a.y);
}

// Keep a window entirely inside the work area of the display it is mostly
// on: no bigger than that area, and not hanging off its edges.
function fitToScreen(b) {
  const a = screen.getDisplayMatching(b).workArea;
  const width = Math.round(Math.min(b.width, a.width));
  const height = Math.round(Math.min(b.height, a.height));
  return {
    x: Math.round(Math.min(Math.max(b.x, a.x), a.x + a.width - width)),
    y: Math.round(Math.min(Math.max(b.y, a.y), a.y + a.height - height)),
    width, height
  };
}

// Window opacity per mode (Settings → Appearance, or right-click the strip).
const opacityFor = (ws, mode) => { const o = ws.opacity && ws.opacity[mode]; return typeof o === 'number' ? Math.min(1, Math.max(0.3, o)) : 1; };

const stripWidth = (w) => Math.round(Math.min(Math.max(w || COMPACT.width, COMPACT.minWidth), COMPACT.maxWidth));

// Measured sizes of a frameless window can come back scaled when monitors use
// different display scaling, and saving them made the windows drift (the strip
// shrank, the full window grew). So the strip's height is never measured, and
// every saved size is fitted back onto a screen.
function currentBounds(win, mode) {
  const b = win.getBounds();
  return mode === 'compact'
    ? { x: b.x, y: b.y, width: stripWidth(b.width), height: COMPACT.height }
    : fitToScreen(b);
}

// First compact strip: bottom-right corner of the display the window is on.
function defaultCompactBounds(win) {
  const a = screen.getDisplayMatching(win.getBounds()).workArea;
  return { x: a.x + a.width - COMPACT.width - 24, y: a.y + a.height - COMPACT.height - 64, width: COMPACT.width, height: COMPACT.height };
}

function defaultFullBounds(win) {
  const a = screen.getDisplayMatching(win.getBounds()).workArea;
  return fitToScreen({ x: a.x + (a.width - FULL.width) / 2, y: a.y + (a.height - FULL.height) / 2, width: FULL.width, height: FULL.height });
}

function applyMode(win, ws, mode) {
  ws.mode = mode;
  if (win.isFullScreen()) win.setFullScreen(false);
  if (win.isMaximized()) win.unmaximize();
  // Size limits first, so the new bounds aren't clamped by the old ones.
  win.setMinimumSize(1, 1);
  win.setMaximumSize(0, 0);
  if (mode === 'compact') {
    win.setMaximizable(false);
    // Only the strip's position is remembered: it always opens 480 wide, since a
    // remembered width drifted when moved between differently scaled monitors.
    const c = onScreen(ws.compact) ? ws.compact : defaultCompactBounds(win);
    ws.compact = fitToScreen({ x: c.x, y: c.y, width: COMPACT.width, height: COMPACT.height });
    win.setBounds(ws.compact);
    // Width can change; height stays a strip.
    win.setMinimumSize(COMPACT.minWidth, COMPACT.height);
    win.setMaximumSize(COMPACT.maxWidth, COMPACT.height);
  } else {
    win.setMaximizable(true);
    ws.full = onScreen(ws.full) ? fitToScreen(ws.full) : defaultFullBounds(win);
    win.setBounds(ws.full);
    win.setMinimumSize(FULL.minWidth, FULL.minHeight);
  }
  // "Keep on top" is a strip setting; the full window behaves normally.
  win.setAlwaysOnTop(mode === 'compact' && !!ws.pinned);
  win.setOpacity(opacityFor(ws, mode));
  // Landing on a monitor with different scaling can leave the page laid out
  // for the old size until the window is resized; a 1px nudge does that.
  const target = ws[mode];
  setTimeout(() => {
    if (win.isDestroyed() || ws.mode !== mode) return;
    win.setBounds({ ...target, width: target.width + 1 });
    win.setBounds(target);
  }, 120);
  saveWindowState(ws);
}

// ---------- updates ----------
// New versions come from the GitHub repo's releases. The app checks at launch
// and every few hours; downloading only starts when you click Update now (it
// runs in the background, music keeps playing), and the install happens on
// Restart now or the next time the app quits.

function setupUpdates(win) {
  let status = { state: app.isPackaged ? 'idle' : 'unavailable', version: app.getVersion() };
  const set = (patch) => {
    status = { ...status, ...patch };
    if (!win.isDestroyed()) win.webContents.send('bside:update', status);
  };
  ipcMain.handle('bside:update', (e, action) => {
    if (e.sender !== win.webContents || !app.isPackaged) return status;
    if (action === 'check') autoUpdater.checkForUpdates().catch(() => {});
    else if (action === 'download') autoUpdater.downloadUpdate().catch(() => {});
    else if (action === 'install') setImmediate(() => autoUpdater.quitAndInstall(true, true));
    return status;
  });
  if (!app.isPackaged) return; // running from source: nothing to update

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => { if (status.state !== 'downloading' && status.state !== 'ready') set({ state: 'checking' }); });
  autoUpdater.on('update-available', (info) => set({ state: 'available', next: info.version }));
  autoUpdater.on('update-not-available', () => set({ state: 'latest' }));
  autoUpdater.on('download-progress', (p) => set({ state: 'downloading', percent: Math.floor(p.percent) }));
  autoUpdater.on('update-downloaded', (info) => set({ state: 'ready', next: info.version }));
  autoUpdater.on('before-quit-for-update', () => { quitting = true; });
  autoUpdater.on('error', (err) => set({ state: 'error', message: String((err && err.message) || err).split('\n')[0] }));

  const check = () => { if (status.state !== 'downloading' && status.state !== 'ready') autoUpdater.checkForUpdates().catch(() => {}); };
  setTimeout(check, 8000);
  setInterval(check, 6 * 60 * 60 * 1000);
}

// ---------- desktop: tray, startup, shortcuts ----------
// A tray icon while the app runs (click to show, right-click for playback
// controls); optional start at Windows sign-in, as a window or tray-only;
// optional "close keeps playing in the tray"; global Ctrl+Alt shortcuts.

const SHORTCUTS = [
  ['CommandOrControl+Alt+Space', 'toggle'],
  ['CommandOrControl+Alt+Right', 'next'],
  ['CommandOrControl+Alt+Left', 'prev'],
  ['CommandOrControl+Alt+Up', 'volup'],
  ['CommandOrControl+Alt+Down', 'voldown']
];
const LOGIN_ARGS = ['--from-login'];
const fromLogin = process.argv.includes(LOGIN_ARGS[0]);
let quitting = false;
app.on('before-quit', () => { quitting = true; });

function setupDesktop(win, ws, switchMode) {
  const d = ws.desktop = { startInTray: false, closeToTray: false, shortcuts: true, ...(ws.desktop || {}) };
  const send = (cmd) => { if (!win.isDestroyed()) win.webContents.send('bside:command', cmd); };
  const showWindow = () => { if (win.isMinimized()) win.restore(); win.show(); win.focus(); };

  // A tray problem must never stop the window from opening.
  let tray = null;
  try {
    tray = new Tray(path.join(__dirname, 'build', process.platform === 'win32' ? 'icon.ico' : 'icon.png'));
  } catch (e) { /* no tray on this system */ }
  let now = { title: '', artist: '', playing: false };
  const buildMenu = () => tray && tray.setContextMenu(Menu.buildFromTemplate([
    { label: now.title ? (now.title + (now.artist ? ' — ' + now.artist : '')).slice(0, 60) : 'Groove', enabled: false },
    { type: 'separator' },
    { label: now.playing ? 'Pause' : 'Play', click: () => send('toggle') },
    { label: 'Next', click: () => send('next') },
    { label: 'Previous', click: () => send('prev') },
    { type: 'separator' },
    { label: 'Show Groove', click: showWindow },
    { label: 'Quit', click: () => { quitting = true; app.quit(); } }
  ]));
  if (tray) {
    tray.setToolTip('Groove');
    buildMenu();
    tray.on('click', showWindow);
  }
  ipcMain.on('bside:now-playing', (e, info) => {
    if (e.sender !== win.webContents || !info) return;
    now = { title: String(info.title || ''), artist: String(info.artist || ''), playing: !!info.playing };
    if (!tray) return;
    tray.setToolTip((now.title ? now.title + (now.artist ? ' — ' + now.artist : '') : 'Groove').slice(0, 127));
    buildMenu();
  });

  win.on('close', (e) => { if (tray && d.closeToTray && !quitting) { e.preventDefault(); win.hide(); } });

  let shortcutErrors = [];
  const applyShortcuts = () => {
    globalShortcut.unregisterAll();
    shortcutErrors = [];
    if (!d.shortcuts) return;
    for (const [accel, cmd] of SHORTCUTS) {
      let ok = false;
      try { ok = globalShortcut.register(accel, () => send(cmd)); } catch (e) { /* invalid on this system */ }
      if (!ok) shortcutErrors.push(accel.replace('CommandOrControl', 'Ctrl'));
    }
  };
  applyShortcuts();
  app.on('will-quit', () => globalShortcut.unregisterAll());

  // Startup at sign-in only makes sense for the installed app.
  const settings = () => ({
    opacityCompact: opacityFor(ws, 'compact'), opacityFull: opacityFor(ws, 'full'),
    canStartup: app.isPackaged,
    openAtLogin: app.isPackaged && app.getLoginItemSettings({ args: LOGIN_ARGS }).openAtLogin,
    startInTray: d.startInTray, closeToTray: d.closeToTray, shortcuts: d.shortcuts,
    shortcutErrors, pinned: !!ws.pinned
  });
  ipcMain.handle('bside:settings', (e, patch) => {
    if (e.sender !== win.webContents) return settings();
    if (patch) {
      if ('openAtLogin' in patch && app.isPackaged) app.setLoginItemSettings({ openAtLogin: !!patch.openAtLogin, args: LOGIN_ARGS });
      for (const k of ['startInTray', 'closeToTray', 'shortcuts']) if (k in patch) d[k] = !!patch[k];
      if ('shortcuts' in patch) applyShortcuts();
      if ('pinned' in patch) { ws.pinned = !!patch.pinned; win.setAlwaysOnTop(ws.mode === 'compact' && ws.pinned); }
      for (const [key, mode] of [['opacityCompact', 'compact'], ['opacityFull', 'full']]) {
        if (typeof patch[key] !== 'number') continue;
        ws.opacity = { ...(ws.opacity || {}), [mode]: Math.min(1, Math.max(0.3, patch[key])) };
        if (ws.mode === mode) win.setOpacity(opacityFor(ws, mode));
      }
      saveWindowState(ws);
    }
    return settings();
  });

  // Right-click on the mini strip: a native menu, since the 72px window has no
  // room for one of its own.
  const changed = () => { if (!win.isDestroyed()) win.webContents.send('bside:settings-changed', settings()); };
  ipcMain.on('bside:strip-menu', (e, info) => {
    if (e.sender !== win.webContents || !info) return;
    const vol = info.muted ? 0 : Math.round(info.volume);
    const opacity = Math.round(opacityFor(ws, 'compact') * 100);
    Menu.buildFromTemplate([
      { label: 'Volume ' + vol + '%', enabled: false },
      { label: 'Set volume', submenu: [100, 75, 50, 35, 25, 15, 10, 5].map((v) => ({ label: v + '%', type: 'radio', checked: vol === v, click: () => send({ type: 'volume', value: v }) })) },
      { label: info.muted ? 'Unmute' : 'Mute', click: () => send({ type: 'mute' }) },
      { type: 'separator' },
      { label: 'Keep on top', type: 'checkbox', checked: !!ws.pinned, click: (item) => { ws.pinned = item.checked; win.setAlwaysOnTop(ws.mode === 'compact' && ws.pinned); saveWindowState(ws); changed(); } },
      { label: 'Opacity', submenu: [100, 90, 80, 70, 60, 50, 40].map((p) => ({ label: p + '%', type: 'radio', checked: opacity === p, click: () => { ws.opacity = { ...(ws.opacity || {}), compact: p / 100 }; win.setOpacity(p / 100); saveWindowState(ws); changed(); } })) },
      { type: 'separator' },
      { label: 'Open full player', click: () => switchMode('full') },
      { label: 'Close', click: () => win.close() }
    ]).popup({ window: win });
  });

  return { showWindow, startHidden: fromLogin && d.startInTray };
}

// ---------- fine volume ----------
// The YouTube player only takes whole-number volumes (1% is its quietest),
// too coarse for a volume curve that should whisper at the bottom. So the
// YouTube frames get a small patch: whatever volume the player sets on its
// <video> is multiplied by Groove's gain, at full precision. The player's
// own volume (and fades) keep working on top.

const GAIN_PATCH = `(() => {
  if (!window.__grooveSetGain) {
    const real = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume');
    const wanted = new WeakMap();
    let gain = 1;
    Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
      configurable: true,
      get() { return wanted.has(this) ? wanted.get(this) : real.get.call(this); },
      set(v) { wanted.set(this, v); real.set.call(this, Math.max(0, Math.min(1, v * gain))); }
    });
    window.__grooveActualVolume = (m) => real.get.call(m);
    window.__grooveSetGain = (g) => {
      gain = g;
      document.querySelectorAll('video, audio').forEach((m) => { m.volume = wanted.has(m) ? wanted.get(m) : real.get.call(m); });
    };
  }
})()`;
const isYouTubeFrame = (f) => !!f && /^https:\/\/www\.youtube(-nocookie)?\.com\/embed\//.test(f.url);

function setupOutputGain(win) {
  let gain = 1;
  const apply = (frame) => frame.executeJavaScript(GAIN_PATCH + `; window.__grooveSetGain(${gain});`).catch(() => {});
  // A YouTube player (re)loaded: patch it and give it the current gain.
  win.webContents.on('did-frame-finish-load', (e, isMain, processId, routingId) => {
    const frame = webFrameMain.fromId(processId, routingId);
    if (isYouTubeFrame(frame)) apply(frame);
  });
  ipcMain.on('bside:gain', (e, g) => {
    if (e.sender !== win.webContents || typeof g !== 'number' || !(g >= 0 && g <= 1)) return;
    gain = g;
    win.webContents.mainFrame.framesInSubtree.filter(isYouTubeFrame).forEach(apply);
  });
}

function createWindow() {
  const ws = loadWindowState();
  const win = new BrowserWindow({
    width: FULL.width,
    height: FULL.height,
    minWidth: FULL.minWidth,
    minHeight: FULL.minHeight,
    show: false,
    // No Windows title bar: the page draws its own (top bar in full mode,
    // the whole strip in compact mode).
    frame: false,
    backgroundColor: '#131211',
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'build', 'icon.ico'),
    // Fades and crossfades run on timers, which a hidden window would throttle.
    webPreferences: { contextIsolation: true, sandbox: true, backgroundThrottling: false, preload: path.join(__dirname, 'preload.js') }
  });
  // No menu bar: with one, Alt would pop it open inside the compact strip.
  win.removeMenu();
  applyMode(win, ws, ws.mode === 'compact' ? 'compact' : 'full');
  let saveTimer = null;
  const switchMode = (mode) => {
    if (mode === ws.mode) return;
    clearTimeout(saveTimer);
    if (!win.isMaximized() && !win.isFullScreen()) ws[ws.mode] = currentBounds(win, ws.mode);
    applyMode(win, ws, mode);
  };
  const desktop = setupDesktop(win, ws, switchMode);
  // Opened at sign-in with "tray only": stay hidden until the tray icon is clicked.
  win.once('ready-to-show', () => { if (!desktop.startHidden) win.show(); });
  win.showFromTray = desktop.showWindow;

  // Remember where each mode's window was left.
  const remember = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (win.isDestroyed() || win.isMaximized() || win.isFullScreen() || win.isMinimized()) return;
      ws[ws.mode] = currentBounds(win, ws.mode);
      saveWindowState(ws);
    }, 400);
  };
  win.on('resize', remember);
  win.on('move', remember);

  win.on('maximize', () => win.webContents.send('bside:maximized', true));
  win.on('unmaximize', () => win.webContents.send('bside:maximized', false));

  ipcMain.on('bside:window', (e, action) => {
    if (e.sender !== win.webContents) return;
    if (action === 'minimize') win.minimize();
    else if (action === 'maximize') { if (win.isMaximized()) win.unmaximize(); else win.maximize(); }
    else if (action === 'close') win.close();
  });

  // Dragging the compact strip. The page reports how far the pointer has moved
  // since the press; the size is re-stated on every move so it can't drift.
  let dragFrom = null;
  ipcMain.on('bside:drag-start', (e) => { if (e.sender === win.webContents) dragFrom = currentBounds(win, 'compact'); });
  ipcMain.on('bside:drag-move', (e, dx, dy) => {
    if (e.sender !== win.webContents || !dragFrom) return;
    win.setBounds({ ...dragFrom, x: Math.round(dragFrom.x + dx), y: Math.round(dragFrom.y + dy) });
  });

  ipcMain.on('bside:set-compact', (e, on) => {
    if (e.sender === win.webContents) switchMode(on ? 'compact' : 'full');
  });

  setupUpdates(win);
  win.webContents.setUserAgent(USER_AGENT);

  // Google sign-in opens as a popup and reports back via window.opener, so it
  // stays inside the app; any other link opens in the default browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isGoogleAuth(url)) {
      return { action: 'allow', overrideBrowserWindowOptions: { width: 500, height: 640, frame: true, autoHideMenuBar: true } };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('did-create-window', (child) => child.webContents.setUserAgent(USER_AGENT));
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(`http://localhost:${PORT}/`)) { e.preventDefault(); shell.openExternal(url); }
  });

  setupOutputGain(win);

  win.loadURL(`http://localhost:${PORT}/`);
  return win;
}

// The app was called b·side before 1.4.0, and its settings folder (sign-in,
// preferences, saved song, window positions) still has that name. Keep using
// it: renaming isn't reliable, since Electron's crash reporter has already
// created (and on Windows holds open) the new folder by the time this runs.
function keepOldUserData() {
  const old = path.join(app.getPath('appData'), 'b·side');
  const hasData = (dir) => fs.existsSync(path.join(dir, 'Local Storage')) || fs.existsSync(path.join(dir, 'window.json'));
  if (!hasData(app.getPath('userData')) && hasData(old)) app.setPath('userData', old);
}
keepOldUserData();

// Same id the installer gives the Start menu shortcut, so the running window
// groups with a pinned taskbar icon. (Kept from the b·side days: changing it
// would make Windows treat Groove as a separate app.)
app.setAppUserModelId('com.alialialjasim.bside');

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  let mainWin = null;
  app.on('second-instance', () => {
    if (mainWin && !mainWin.isDestroyed()) mainWin.showFromTray();
  });
  app.whenReady().then(async () => {
    try {
      await startServer();
    } catch (err) {
      dialog.showErrorBox('Groove', err.code === 'EADDRINUSE'
        ? `Port ${PORT} is already in use. Close whatever is using it (another Groove, or a dev server) and try again.`
        : String(err));
      return app.quit();
    }
    mainWin = createWindow();
  });
  app.on('window-all-closed', () => app.quit());
}
