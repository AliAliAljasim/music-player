"use strict";
// Bridge for the mini player's right-click menu window (menu.html).
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('grooveMenu', {
  onState: (fn) => ipcRenderer.on('menu:state', (e, s) => fn(s)),
  size: (height) => ipcRenderer.send('menu:size', height),
  volume: (v) => ipcRenderer.send('menu:volume', v),
  mute: () => ipcRenderer.send('menu:mute'),
  pin: (on) => ipcRenderer.send('menu:pin', !!on),
  opacity: (o) => ipcRenderer.send('menu:opacity', o),
  full: () => ipcRenderer.send('menu:full'),
  quit: () => ipcRenderer.send('menu:quit'),
  hide: () => ipcRenderer.send('menu:hide')
});
