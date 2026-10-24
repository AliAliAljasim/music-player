"use strict";
// Electron shell for b·side. The page has to load from http://localhost:8000:
// that is the origin registered with Google OAuth, and the YouTube player
// refuses to embed from file://. So the app serves its own files there.
const { app, BrowserWindow, Menu, Tray, dialog, globalShortcut, ipcMain, screen, shell } = require('electron');
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
const USER_AGENT = app.userAgentFallback.replace(/ (Electron|b-side)\/\S+/g, '');

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

function setupDesktop(win, ws) {
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
    { label: now.title ? (now.title + (now.artist ? ' — ' + now.artist : '')).slice(0, 60) : 'b·side', enabled: false },
    { type: 'separator' },
    { label: now.playing ? 'Pause' : 'Play', click: () => send('toggle') },
    { label: 'Next', click: () => send('next') },
    { label: 'Previous', click: () => send('prev') },
    { type: 'separator' },
    { label: 'Show b·side', click: showWindow },
    { label: 'Quit', click: () => { quitting = true; app.quit(); } }
  ]));
  if (tray) {
    tray.setToolTip('b·side');
    buildMenu();
    tray.on('click', showWindow);
  }
  ipcMain.on('bside:now-playing', (e, info) => {
    if (e.sender !== win.webContents || !info) return;
    now = { title: String(info.title || ''), artist: String(info.artist || ''), playing: !!info.playing };
    if (!tray) return;
    tray.setToolTip((now.title ? now.title + (now.artist ? ' — ' + now.artist : '') : 'b·side').slice(0, 127));
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
      saveWindowState(ws);
    }
    return settings();
  });

  return { showWindow, startHidden: fromLogin && d.startInTray };
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
  const desktop = setupDesktop(win, ws);
  // Opened at sign-in with "tray only": stay hidden until the tray icon is clicked.
  win.once('ready-to-show', () => { if (!desktop.startHidden) win.show(); });
  win.showFromTray = desktop.showWindow;

  // Remember where each mode's window was left.
  let saveTimer = null;
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
    if (e.sender !== win.webContents) return;
    const mode = on ? 'compact' : 'full';
    if (mode === ws.mode) return;
    clearTimeout(saveTimer);
    if (!win.isMaximized() && !win.isFullScreen()) ws[ws.mode] = currentBounds(win, ws.mode);
    applyMode(win, ws, mode);
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

  win.loadURL(`http://localhost:${PORT}/`);
  return win;
}

// Same id the installer gives the Start menu shortcut, so the running window
// groups with a pinned taskbar icon.
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
      dialog.showErrorBox('b·side', err.code === 'EADDRINUSE'
        ? `Port ${PORT} is already in use. Close whatever is using it (another b·side, or a dev server) and try again.`
        : String(err));
      return app.quit();
    }
    mainWin = createWindow();
  });
  app.on('window-all-closed', () => app.quit());
}
