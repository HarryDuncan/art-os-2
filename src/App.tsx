import React, { useState } from "react";
import { useInitializeIPC } from "./ipc-hooks/useInitialize";
import { useInitializeInteractionNode } from "./ipc-hooks/useInitializeInteractionNode";
import { useInitializeAlgorithm } from "./ipc-hooks/useInitializeAlgorithm";
import {
  BODY_PIX_DEFAULT_ALGORITHM,
  POSENET_DEFAULT_ALGORITHM,
} from "./consts/algorithm.consts";
import { useRunAlgorithm } from "ipc-hooks/useRunAlgorithm";

const App = () => {
  const [input, setInput] = useState("");
  useInitializeIPC();
  useInitializeInteractionNode();
  const { runAlgorithm } = useRunAlgorithm();
  const { initializeAlgorithm } = useInitializeAlgorithm();
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Electron-Python IPC with React & TypeScript</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Message to Python"
      />
      <button onClick={(e) => initializeAlgorithm(BODY_PIX_DEFAULT_ALGORITHM)}>
        Init
      </button>
      <button onClick={runAlgorithm}>run</button>
      <div style={{ marginTop: "1rem" }}>
        <h2>Messages:</h2>
      </div>
    </div>
  );
};

export default App;
