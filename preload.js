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
  updates: {
    status: () => ipcRenderer.invoke('bside:update', 'status'),
    check: () => ipcRenderer.invoke('bside:update', 'check'),
    download: () => ipcRenderer.invoke('bside:update', 'download'),
    install: () => ipcRenderer.invoke('bside:update', 'install'),
    onStatus: (fn) => ipcRenderer.on('bside:update', (e, s) => fn(s))
  }
});
