import React, { useState, useEffect } from 'react';
import { sendMessage, onMessage } from './ipc';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    onMessage((message) => {
      console.log(message)
      setMessages((prev) => [...prev, message])});
  }, []);

  const handleSend = () => {
    sendMessage(input);
    setInput('');
  };



  return (
    <div style={{ padding: '1rem' }}>
      <h1>Electron-Python IPC with React & TypeScript</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Message to Python"
      />
      <button onClick={handleSend}>Send</button>
      <div style={{ marginTop: '1rem' }}>
        <h2>Messages:</h2>
        <pre>{messages.join('\n')}</pre>
      </div>
    </div>
  );
};

export default App;
