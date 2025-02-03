// @ts-nocheck
export const sendMessage = async (message) => {
  return await window.electronAPI?.sendMessage(message);
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
