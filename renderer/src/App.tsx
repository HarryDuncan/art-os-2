import React, { useState } from "react";
import { useInitializeIPC } from "./ipc-hooks/useInitialize";

const App = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  useInitializeIPC();
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Electron-Python IPC with React & TypeScript</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Message to Python"
      />

      <div style={{ marginTop: "1rem" }}>
        <h2>Messages:</h2>
        <pre>{messages.join("\n")}</pre>
      </div>
    </div>
  );
};

export default App;
