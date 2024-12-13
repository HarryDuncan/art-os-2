const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");

require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"), // Ensure Electron reloads when files change
});

let pythonProcess;

app.on("ready", () => {
  // Create the main window
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: __dirname + "/preload.js",
    },
  });

  mainWindow.loadURL("http://localhost:3000");

  // Start the Python backend
  pythonProcess = spawn("python", [__dirname + "/backend/script.py"]);

  // Handle messages from Python
  pythonProcess.stdout.on("data", (data) => {
    const message = data.toString().trim();
    try {
      const jsonResponse = JSON.parse(message);
      mainWindow.webContents.send("python-message", jsonResponse);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      mainWindow.webContents.send("python-message", {
        error: "Invalid JSON format",
        raw: message,
      });
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.log("error");
    console.error("Python Error:", data.toString());
  });

  app.on("will-quit", () => {
    pythonProcess.kill(); // Ensure the Python process exits with the app
  });
});

ipcMain.on("renderer-message", (_event, message) => {
  const jsonMessage = JSON.stringify(message);
  pythonProcess.stdin.write(jsonMessage + "\n");
});
