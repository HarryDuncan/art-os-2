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
    console.log(data);
    const message = data.toString().trim();
    try {
      // Attempt to parse the message as JSON
      const jsonResponse = JSON.parse(message);
      console.log(jsonResponse);
      // Send the parsed JSON to the renderer
      mainWindow.webContents.send("python-message", jsonResponse);
    } catch (e) {
      // If there's an error parsing the JSON, send an error message to the renderer
      console.error("Error parsing JSON:", e);
      // Send the raw message to the renderer as error response
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
