"use strict";
// What the page needs from the shell: switching between the full window and
// the compact strip, and the window buttons/dragging (the window is frameless).
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bsideShell', {
  setCompact: (on) => ipcRenderer.send('bside:set-compact', !!on),
  minimize: () => ipcRenderer.send('bside:window', 'minimize'),
  toggleMaximize: () => ipcRenderer.send('bside:window', 'maximize'),
  close: () => ipcRenderer.send('bside:window', 'close'),
  dragStart: () => ipcRenderer.send('bside:drag-start'),
  dragMove: (dx, dy) => ipcRenderer.send('bside:drag-move', dx, dy),
  onMaximizedChange: (fn) => ipcRenderer.on('bside:maximized', (e, on) => fn(!!on)),
  settings: (patch) => ipcRenderer.invoke('bside:settings', patch || null),
  onCommand: (fn) => ipcRenderer.on('bside:command', (e, cmd) => fn(cmd)),
  setNowPlaying: (info) => ipcRenderer.send('bside:now-playing', info),
  setOutputGain: (g) => ipcRenderer.send('bside:gain', g),
  mixer: {
    available: () => ipcRenderer.invoke('bside:has-mixer'),
    set: (level, muted) => ipcRenderer.send('bside:mixer-set', level, muted),
    onChange: (fn) => ipcRenderer.on('bside:mixer', (e, v) => fn(v))
  },
  // Google sign-in runs in the main process (see setupAuth in main.js).
  auth: {
    info: () => ipcRenderer.sendSync('bside:auth-info'),
    call: (action) => ipcRenderer.invoke('bside:auth', action)
  },
  showStripMenu: (info) => ipcRenderer.send('bside:strip-menu', info),
  onSettingsChanged: (fn) => ipcRenderer.on('bside:settings-changed', (e, s) => fn(s)),
  updates: {
    status: () => ipcRenderer.invoke('bside:update', 'status'),
    check: () => ipcRenderer.invoke('bside:update', 'check'),
    download: () => ipcRenderer.invoke('bside:update', 'download'),
    install: () => ipcRenderer.invoke('bside:update', 'install'),
    onStatus: (fn) => ipcRenderer.on('bside:update', (e, s) => fn(s))
  }
});
