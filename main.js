const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");

require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"),
});

let flaskProcess;
let mainWindow;

function startFlask() {
  return new Promise((resolve, reject) => {
    flaskProcess = spawn("python", [path.join(__dirname, "backend", "app.py")]);

    flaskProcess.stdout.on("data", (data) => {
      const message = data.toString().trim();
      console.log("Flask:", message);

      // Detect Flask startup message reliably
      if (
        message.includes("Running on") ||
        message.includes("http://127.0.0.1:5000")
      ) {
        resolve();
      }
    });

    flaskProcess.stderr.on("data", (data) => {
      console.error("Flask Error:", data.toString());
    });

    flaskProcess.on("close", (code) => {
      console.log(`Flask process exited with code ${code}`);
    });

    // Retry connection instead of hard timeout
    let attempts = 0;
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:5000")
        .then(() => {
          clearInterval(interval);
          resolve();
        })
        .catch(() => {
          if (++attempts >= 10) {
            clearInterval(interval);
            reject(new Error("Flask startup timeout"));
          }
        });
    }, 1000);
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadURL("http://127.0.0.1:8000/"); // video stream;
  mainWindow.loadURL("http://localhost:3000"); // app

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startFlask()
    .then(() => {
      createMainWindow();
    })
    .catch((err) => {
      console.error("Failed to start Flask:", err);
      app.quit();
    });
});

app.on("will-quit", () => {
  if (flaskProcess) flaskProcess.kill();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("ipc-to-flask-message", async (_, payload) => {
  const { url, data } = payload;

  try {
    const response = await fetch(`http://127.0.0.1:5000/${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
});
