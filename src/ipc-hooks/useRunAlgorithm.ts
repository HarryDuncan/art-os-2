import { IPC_COMMANDS } from "consts/ipc.consts";
import { onMessage, sendMessage } from "ipc";
import { useCallback, useState } from "react";

export const useRunAlgorithm = () => {
  const [isInitializedCalled, setIsInitializedCalled] =
    useState<boolean>(false);

  const runAlgorithm = useCallback(() => {
    const messageData = {
      command: IPC_COMMANDS.RUN_ALGORITHM,
    };
    sendMessage(messageData);
    onMessage(IPC_COMMANDS.RUN_ALGORITHM, (message) => {
      console.log(message);
    });
    setIsInitializedCalled(true);
  }, [setIsInitializedCalled]);

  return { runAlgorithm };
};
