// @ts-nocheck
export const sendMessage = (message) => {
  window.electronAPI?.sendMessage(message);
};

export const onMessage = (
  command: string,
  callback: (message: string) => void
) => {
  window.electronAPI?.onMessage((returnedMessage) => {
    console.log(returnedMessage);
    if (returnedMessage.command === command) {
      callback(returnedMessage);
    }
  });
};
