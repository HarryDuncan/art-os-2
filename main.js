const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'), // Ensure Electron reloads when files change
});

let pythonProcess;

app.on('ready', () => {
  // Create the main window
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: __dirname + '/preload.js'
    }
  });

  mainWindow.loadFile('dist/index.html');

  // Start the Python backend
  pythonProcess = spawn('python', [__dirname + '/backend/script.py']);

  // Handle messages from Python
  pythonProcess.stdout.on('data', (data) => {
    const message = data.toString().trim();
    mainWindow.webContents.send('python-message', message); // Send to renderer
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error('Python Error:', data.toString());
  });

  app.on('will-quit', () => {
    pythonProcess.kill(); // Ensure the Python process exits with the app
  });
});

// Listen for messages from renderer and forward to Python
ipcMain.on('renderer-message', (event, message) => {
  pythonProcess.stdin.write(message + '\n');
});
