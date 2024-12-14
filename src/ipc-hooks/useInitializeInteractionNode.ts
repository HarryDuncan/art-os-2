import { IPC_COMMANDS } from "../consts/ipc.consts";
import { sendMessage, onMessage } from "../ipc";
import { useState, useEffect } from "react";

export const useInitializeInteractionNode = () => {
  const [isInitializedCalled, setIsInitializedCalled] =
    useState<boolean>(false);

  useEffect(() => {
    console.log("test");
    if (!isInitializedCalled) {
      const messageData = { command: IPC_COMMANDS.INITIALIZE_INTERACTION_NODE };
      sendMessage(messageData);
      onMessage(IPC_COMMANDS.INITIALIZE_INTERACTION_NODE, (message) => {
        console.log(message);
      });
      setIsInitializedCalled(true);
    }
  }, []);
};
