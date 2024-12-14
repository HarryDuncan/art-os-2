import { IPC_COMMANDS } from "../consts/ipc.consts";
import { onMessage, sendMessage } from "../ipc";
import { useEffect, useState } from "react";

export const useInitializeIPC = () => {
  const [isInitializedCalled, setIsInitializedCalled] =
    useState<boolean>(false);

  useEffect(() => {
    if (!isInitializedCalled) {
      const messageData = { command: IPC_COMMANDS.INITIALIZE_IPC };
      sendMessage(messageData);
      onMessage(IPC_COMMANDS.INITIALIZE_IPC, (message) => {
        console.log(message);
      });
      setIsInitializedCalled(true);
    }
  }, []);
};
