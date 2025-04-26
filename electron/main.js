const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');
const fs = require('fs');

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;
let backendProcess = null;

// Check if running in development mode
const isDev = process.argv.includes('--dev');

function startBackend() {
  // Path to the backend directory
  const backendPath = path.join(__dirname, '..', 'backend', 'meu_canteiro_back_end');
  
  // Check if we're running in development mode or production
  let pythonExecutable = 'python';
  if (process.platform === 'win32') {
    pythonExecutable = 'python';
  }

  console.log('Starting backend server...');
  console.log(`Backend path: ${backendPath}`);
  
  // Start the Flask server
  backendProcess = spawn(pythonExecutable, ['app.py'], {
    cwd: backendPath,
    stdio: 'pipe'
  });

  // Log backend output
  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend stdout: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend stderr: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });

  // Give the backend some time to start
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
}

async function createWindow() {
  // Start the backend server
  await startBackend();

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '..', 'frontend', 'meu_canteiro_front_end', 'resources', 'images', 'tree-icon.jpg')
  });

  // Load the frontend
  const frontendPath = path.join(__dirname, '..', 'frontend', 'meu_canteiro_front_end', 'index.html');
  mainWindow.loadURL(url.format({
    pathname: frontendPath,
    protocol: 'file:',
    slashes: true
  }));

  // Open DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Clean up backend process when app is quitting
app.on('quit', () => {
  if (backendProcess) {
    console.log('Killing backend process...');
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', backendProcess.pid, '/f', '/t']);
    } else {
      backendProcess.kill();
    }
  }
});
