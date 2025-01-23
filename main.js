const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const { Worker } = require("worker_threads");

require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"), // Ensure Electron reloads when files change
});
let bodyPixWorker = null;

app.on("ready", () => {
  // Create the main window
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      preload: __dirname + "/preload.js",
    },
  });
  mainWindow.loadURL("http://127.0.0.1:8000/");
  mainWindow.loadURL("http://localhost:3000");

  ipcMain.handle("start-bodypix", async (event) => {
    return new Promise(async (resolve, reject) => {
      bodyPixWorker = new Worker(
        path.join(__dirname, "/src/ai-workers/bodypixWorker.js")
      );

      bodyPixWorker.on("message", (data) => {
        if (data.type === "completed") {
          resolve(data.result); // Send the result back to the renderer
        }
        if (data.type === "new-measurement") {
          event.sender.send("new-measurement", data.result);
        }
        if (data.type === "error") {
          console.log(data.error);
        }
      });

      bodyPixWorker.on("error", (error) => {
        console.warn("Error occurred");
        console.warn(error.message);
      });

      bodyPixWorker.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
        bodyPixWorker = null; // Reset reference when the worker exits
      });

      bodyPixWorker.postMessage("init");
    });
  });

  // Stop the worker when requested
  ipcMain.handle("stop-bodypix", async () => {
    if (bodyPixWorker) {
      bodyPixWorker.postMessage("terminate");
      bodyPixWorker = null; // Clean up the reference
      return { success: true };
    }
    return { success: false, error: "No worker running" };
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
