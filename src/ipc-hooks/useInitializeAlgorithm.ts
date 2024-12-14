import { IPC_COMMANDS } from "consts/ipc.consts";
import { onMessage, sendMessage } from "ipc";
import { useCallback, useState } from "react";

export const useInitializeAlgorithm = () => {
  const [isInitializedCalled, setIsInitializedCalled] =
    useState<boolean>(false);

  const initializeAlgorithm = useCallback(
    (algorithm) => {
      const messageData = {
        command: IPC_COMMANDS.INITIALIZE_ALGORITHM,
        data: algorithm,
      };
      sendMessage(messageData);
      onMessage(IPC_COMMANDS.INITIALIZE_ALGORITHM, (message) => {
        console.log(message);
      });
      setIsInitializedCalled(true);
    },
    [setIsInitializedCalled]
  );

  return { initializeAlgorithm };
};
