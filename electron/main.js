const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');
const net = require('net');

let mainWindow;
let backendMainProcess = null;
let backendCanteiroProcess = null;

const isDev = process.argv.includes('--dev');

// Caminhos dos backends Node.js
const backendMainPath = app.isPackaged
  ? path.join(process.resourcesPath, 'backend', 'meu_canteiro_back_end', 'src', 'app.js')
  : path.join(__dirname, '..', 'backend', 'meu_canteiro_back_end', 'src', 'app.js');

const backendCanteiroPath = app.isPackaged
  ? path.join(process.resourcesPath, 'backend', 'agroforestry_systems_design', 'src', 'app.js')
  : path.join(__dirname, '..', 'backend', 'agroforestry_systems_design', 'src', 'app.js');

const nodePath = process.execPath;

function waitForPort(port, host = '127.0.0.1', timeout = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function check() {
      const socket = net.createConnection(port, host);
      socket.on('connect', () => {
        socket.end();
        resolve();
      });
      socket.on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error('Timeout waiting for port ' + port));
        } else {
          setTimeout(check, 200);
        }
      });
    }
    check();
  });
}

async function startBackends() {
  // Inicia o backend principal
  backendMainProcess = spawn(nodePath, [backendMainPath], {
    cwd: path.dirname(backendMainPath),
    stdio: 'inherit'
  });
  backendMainProcess.on('error', (err) => {
    console.error('[Main Backend] Failed to start:', err);
  });

  // Inicia o backend agroforestry_systems_design
  backendCanteiroProcess = spawn(nodePath, [backendCanteiroPath], {
    cwd: path.dirname(backendCanteiroPath),
    stdio: 'inherit',
  });
  backendCanteiroProcess.on('error', (err) => {
    console.error('[Canteiro Backend] Failed to start:', err);
  });

  // Aguarda os backends subirem de verdade (checando as portas)
  await Promise.all([
    waitForPort(5000),
    waitForPort(5001)
  ]);
}

async function createWindow() {
  await startBackends();

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '..', 'frontend', 'meu_canteiro_front_end', 'resources', 'images', 'tree-icon.ico')
  });

  const frontendPath = path.join(__dirname, '..', 'frontend', 'meu_canteiro_front_end', 'index.html');
  mainWindow.loadURL(url.format({
    pathname: frontendPath,
    protocol: 'file:',
    slashes: true
  }));

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

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

app.on('quit', () => {
  [backendMainProcess, backendCanteiroProcess].forEach((proc) => {
    if (proc) {
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', proc.pid, '/f', '/t'], {
            windowsHide: true
          });
        } else {
          proc.kill('SIGTERM');
        }
      } catch (error) {
        console.error('Failed to terminate backend process:', error);
      }
    }
  });
});
