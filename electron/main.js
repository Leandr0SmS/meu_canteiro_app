const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');

let mainWindow;
let backendMainProcess = null;
let backendCanteiroProcess = null;

const isDev = process.argv.includes('--dev');

// Caminhos dos backends Node.js
const backendMainPath = app.isPackaged
  ? path.join(process.resourcesPath, 'backend-node', 'meu_canteiro_back_end', 'src', 'app.js')
  : path.join(__dirname, '..', 'backend-node', 'meu_canteiro_back_end', 'src', 'app.js');

const backendCanteiroPath = app.isPackaged
  ? path.join(process.resourcesPath, 'backend-node', 'agroforestry_systems_design', 'src', 'app.js')
  : path.join(__dirname, '..', 'backend-node', 'agroforestry_systems_design', 'src', 'app.js');

async function startBackends() {
  // Inicia o backend principal
  backendMainProcess = spawn('node', [backendMainPath], {
    cwd: path.dirname(backendMainPath),
    stdio: 'inherit',
    shell: true
  });
  backendMainProcess.on('error', (err) => {
    console.error('[Main Backend] Failed to start:', err);
  });

  // Inicia o backend agroforestry_systems_design
  backendCanteiroProcess = spawn('node', [backendCanteiroPath], {
    cwd: path.dirname(backendCanteiroPath),
    stdio: 'inherit',
    shell: true
  });
  backendCanteiroProcess.on('error', (err) => {
    console.error('[Canteiro Backend] Failed to start:', err);
  });

  // Aguarda os backends subirem
  return new Promise((resolve) => setTimeout(resolve, 2000));
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
