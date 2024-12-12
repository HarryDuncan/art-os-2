import { IPC_COMMANDS } from "../consts/ipc.consts";
import { onMessage, sendMessage } from "../ipc";
import { useCallback, useEffect, useState } from "react";

export const useInitializeIPC = () => {
  const [isIPCInitialized, setIsIPCInitialized] = useState<boolean>(false);
  const initialize = useCallback(() => {
    if (!isIPCInitialized) {
      const messageData = { command: IPC_COMMANDS.INITIALIZE_IPC };
      sendMessage(messageData);
    }
  }, [isIPCInitialized]);

  useEffect(() => {
    initialize();
    onMessage(IPC_COMMANDS.INITIALIZE_IPC, (message) => {
      console.log(message);
    });
  }, [initialize]);
};
