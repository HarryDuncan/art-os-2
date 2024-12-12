const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message) => ipcRenderer.send('renderer-message', message),
  onMessage: (callback) => ipcRenderer.on('python-message', (_, data) => callback(data))
});
