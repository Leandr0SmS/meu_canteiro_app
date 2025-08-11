const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');
const net = require('net');

let mainWindow;
let backendMainProcess = null;
let backendCanteiroProcess = null;

const isDev = process.argv.includes('--dev');

// DEBUG: NodePath
console.log('DEBUG: Node path')
function findNodeExe() {
  const fs = require('fs');
  if (!app.isPackaged) {
    return process.execPath;
  }

  const possiblePaths = [
    path.join(process.resourcesPath, 'node.exe'),
    path.join(app.getAppPath(), '..', 'node.exe'),
    path.join(process.resourcesPath, '..', 'node.exe')
  ];

  for (const nodePath of possiblePaths) {
    if (fs.existsSync(nodePath)) {
      console.log('DEBUG: Found node.exe at:', nodePath);
      return nodePath;
    }
  }
  
  throw new Error('Could not find node.exe in any expected location');
}

const nodePath = findNodeExe();

// DEBUG: Início do processo Electron
console.log('DEBUG: Electron main process iniciado');

const backendMainPath = app.isPackaged
  ? path.join(process.resourcesPath, 'backend', 'meu_canteiro_back_end', 'src', 'app.js')
  : path.join(__dirname, '..', 'backend', 'meu_canteiro_back_end', 'src', 'app.js');

const backendCanteiroPath = app.isPackaged
  ? path.join(process.resourcesPath, 'backend', 'agroforestry_systems_design', 'src', 'app.js')
  : path.join(__dirname, '..', 'backend', 'agroforestry_systems_design', 'src', 'app.js');

// Add error handler for unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

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
  try {
    const fs = require('fs');
    
    // DEBUG: Verificando caminhos base
    console.log('DEBUG: process.resourcesPath:', process.resourcesPath);
    console.log('DEBUG: app.getAppPath():', app.getAppPath());
    console.log('DEBUG: __dirname:', __dirname);
    console.log('DEBUG: process.cwd():', process.cwd());
    
    // DEBUG: Verificando node.exe
    console.log('DEBUG: Procurando node.exe em:', nodePath);
    if (!fs.existsSync(nodePath)) {
      console.error('DEBUG: node.exe não encontrado!');
      throw new Error(`node.exe not found at: ${nodePath}`);
    }
    console.log('DEBUG: node.exe encontrado!');

    // DEBUG: Verificando backend paths
    console.log('DEBUG: Verificando backend principal em:', backendMainPath);
    if (!fs.existsSync(backendMainPath)) {
      console.error('DEBUG: Backend principal não encontrado!');
      throw new Error(`Main backend not found at: ${backendMainPath}`);
    }
    console.log('DEBUG: Backend principal encontrado!');

    console.log('DEBUG: Verificando backend canteiro em:', backendCanteiroPath);
    if (!fs.existsSync(backendCanteiroPath)) {
      console.error('DEBUG: Backend canteiro não encontrado!');
      throw new Error(`Canteiro backend not found at: ${backendCanteiroPath}`);
    }
    console.log('DEBUG: Backend canteiro encontrado!');

    // DEBUG: Iniciando processos
    console.log('DEBUG: Iniciando backend principal com:');
    console.log('- Executável:', nodePath);
    console.log('- Script:', path.basename(backendMainPath));
    console.log('- Diretório:', path.dirname(backendMainPath));
    
    backendMainProcess = spawn(nodePath, [path.basename(backendMainPath)], {
      cwd: path.dirname(backendMainPath),
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: app.isPackaged ? 'production' : 'development' }
    });

    console.log('DEBUG: Iniciando backend canteiro com:');
    console.log('- Executável:', nodePath);
    console.log('- Script:', path.basename(backendCanteiroPath));
    console.log('- Diretório:', path.dirname(backendCanteiroPath));

    backendCanteiroProcess = spawn(nodePath, [path.basename(backendCanteiroPath)], {
      cwd: path.dirname(backendCanteiroPath),
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: app.isPackaged ? 'production' : 'development' }
    });

    // DEBUG: Aguardando backends subirem
    console.log('DEBUG: Aguardando backends subirem...');
    await Promise.all([
      waitForPort(5000, '127.0.0.1', 30000),
      waitForPort(5001, '127.0.0.1', 30000)
    ]);

    console.log('DEBUG: Backends prontos!');
  } catch (error) {
    console.error('DEBUG: Erro detalhado ao iniciar backends:', error);
    throw error;
  }
}

async function createWindow() {
  try {
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

    const frontendPath = app.isPackaged
      ? path.join(process.resourcesPath, 'frontend', 'meu_canteiro_front_end', 'index.html')
      : path.join(__dirname, '..', 'frontend', 'meu_canteiro_front_end', 'index.html');

    console.log('DEBUG: Carregando frontend:', frontendPath);
    mainWindow.loadFile(frontendPath);  // Use loadFile em vez de loadURL

    if (isDev) {
      mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
      // DEBUG: Janela principal fechada
      console.log('DEBUG: Janela principal fechada');
      mainWindow = null;
    });
  } catch (error) {
    console.error('Erro fatal ao iniciar aplicação:', error);
    app.quit();
  }
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
