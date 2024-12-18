// @ts-nocheck
export const sendMessage = (message) => {
  window.electronAPI?.sendMessage(message);
};

export const onMessage = (
  command: string,
  callback: (message: string) => void
) => {
  window.electronAPI?.onMessage((returnedMessage) => {
    callback(returnedMessage);
  });
};

export const ipcRenderer = window.electronAPI?.ipcRenderer;
