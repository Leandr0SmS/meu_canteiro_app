const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');
const net = require('net');

let mainWindow;
let backendMainProcess = null;
let backendCanteiroProcess = null;

const isDev = process.argv.includes('--dev');

// DEBUG: Início do processo Electron
console.log('DEBUG: Electron main process iniciado');

const backendMainPath = app.isPackaged
  ? path.join(process.resourcesPath, 'backend', 'meu_canteiro_back_end', 'src', 'app.js')
  : path.join(__dirname, '..', 'backend', 'meu_canteiro_back_end', 'src', 'app.js');

const backendCanteiroPath = app.isPackaged
  ? path.join(process.resourcesPath, 'backend', 'agroforestry_systems_design', 'src', 'app.js')
  : path.join(__dirname, '..', 'backend', 'agroforestry_systems_design', 'src', 'app.js');

const nodePath = process.execPath;

function waitForPort(port, host = '127.0.0.1', timeout = 10000) {
  // DEBUG: Esperando porta
  console.log(`DEBUG: Esperando porta ${port} em ${host} por até ${timeout}ms`);
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function check() {
      const socket = net.createConnection(port, host);
      socket.on('connect', () => {
        socket.end();
        // DEBUG: Porta conectada
        console.log(`DEBUG: Porta ${port} conectada!`);
        resolve();
      });
      socket.on('error', () => {
        if (Date.now() - start > timeout) {
          // DEBUG: Timeout porta
          console.error(`DEBUG: Timeout esperando porta ${port}`);
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
  // DEBUG: Iniciando backend principal
  console.log('DEBUG: Iniciando backend principal:', backendMainPath);
  backendMainProcess = spawn(nodePath, [backendMainPath], {
    cwd: path.dirname(backendMainPath),
    stdio: 'inherit'
  });
  backendMainProcess.on('error', (err) => {
    console.error('[Main Backend] Failed to start:', err);
  });

  // DEBUG: Iniciando backend agroforestry_systems_design
  console.log('DEBUG: Iniciando backend agroforestry:', backendCanteiroPath);
  backendCanteiroProcess = spawn(nodePath, [backendCanteiroPath], {
    cwd: path.dirname(backendCanteiroPath),
    stdio: 'inherit',
  });
  backendCanteiroProcess.on('error', (err) => {
    console.error('[Canteiro Backend] Failed to start:', err);
  });

  // DEBUG: Aguardando backends subirem
  console.log('DEBUG: Aguardando backends subirem...');
  await Promise.all([
    waitForPort(5000, '127.0.0.1', 20000),
    waitForPort(5001, '127.0.0.1', 20000)
  ]);
  // DEBUG: Backends prontos
  console.log('DEBUG: Backends prontos!');
}

async function createWindow() {
  // DEBUG: Chamando startBackends
  console.log('DEBUG: Chamando startBackends');
  await startBackends();

  // DEBUG: Criando BrowserWindow
  console.log('DEBUG: Criando BrowserWindow');
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
  // DEBUG: Carregando frontend
  console.log('DEBUG: Carregando frontend:', frontendPath);
  mainWindow.loadURL(url.format({
    pathname: frontendPath,
    protocol: 'file:',
    slashes: true
  }));

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    // DEBUG: Janela principal fechada
    console.log('DEBUG: Janela principal fechada');
    mainWindow = null;
  });
}

// DEBUG: App pronto
app.whenReady().then(() => {
  console.log('DEBUG: app.whenReady');
  createWindow();
});

app.on('window-all-closed', () => {
  // DEBUG: Todas as janelas fechadas
  console.log('DEBUG: Todas as janelas fechadas');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // DEBUG: App ativado
  console.log('DEBUG: App ativado');
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('quit', () => {
  // DEBUG: App quit, matando backends
  console.log('DEBUG: App quit, matando backends');
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

// DEBUG: Fim do main.js
console.log('DEBUG: Fim do main.js');
