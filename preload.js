const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendMessage: (message) => ipcRenderer.invoke("ipc-to-flask-message", message),
  onMessage: (callback) =>
    ipcRenderer.on("ipc-from-flask-message", (_, data) => callback(data)),
});
