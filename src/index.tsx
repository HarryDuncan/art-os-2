import ReactDOM from "react-dom/client";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import "./css/global.min.css";
import "@mantine/core/styles.css";

const rootDiv = document.getElementById("root") as HTMLElement;
if (rootDiv) {
  const root = ReactDOM.createRoot(rootDiv);
  root.render(
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  );
}
