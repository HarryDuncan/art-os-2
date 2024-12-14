import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const rootDiv = document.getElementById("root") as HTMLElement;
if (rootDiv) {
  const root = ReactDOM.createRoot(rootDiv);
  root.render(<App />);
}
