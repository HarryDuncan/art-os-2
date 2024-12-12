// @ts-nocheck
export const sendMessage = (message) => {
  window.electronAPI?.sendMessage(message);
};

export const onMessage = (callback: (message: string) => void) => {
  window.electronAPI?.onMessage((returnedMessage: string) => {
    console.log("test");
    callback(returnedMessage);
  });
};
