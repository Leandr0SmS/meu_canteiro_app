const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const net = require('net');

let mainWindow;
let backendMainProcess = null;
let backendCanteiroProcess = null;

const isDev = process.argv.includes('--dev');

const nodePath = path.join(process.resourcesPath, 'node.exe');

// DEBUG: Electron main process
console.log('DEBUG: Electron main process started');

const backendMainPath = app.isPackaged
  ? path.join(process.resourcesPath, 'backend', 'meu_canteiro_back_end', 'src', 'app.js')
  : path.join(__dirname, '..', 'backend', 'meu_canteiro_back_end', 'src', 'app.js');

const agroforestrySystemsDesignPath = app.isPackaged
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

    // DEBUG: Iniciando processos
    console.log('DEBUG: Iniciando backend principal com:');
    
    backendMainProcess = spawn(nodePath, [path.basename(backendMainPath)], {
      cwd: path.dirname(backendMainPath),
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: app.isPackaged ? 'production' : 'development' }
    });

    console.log('DEBUG: Iniciando backend canteiro com:');

    backendCanteiroProcess = spawn(nodePath, [path.basename(agroforestrySystemsDesignPath)], {
      cwd: path.dirname(agroforestrySystemsDesignPath),
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
    mainWindow.loadFile(frontendPath);

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

// Adicione esta função para matar processos
function killProcess(proc) {
  if (!proc) return;
  
  try {
    if (process.platform === 'win32') {
      // No Windows, mata o processo e seus filhos
      spawn('taskkill', ['/pid', proc.pid, '/f', '/t'], {
        windowsHide: true,
        detached: true
      }).on('exit', () => {
        console.log(`Process ${proc.pid} killed`);
      });
    } else {
      proc.kill('SIGTERM');
    }
  } catch (error) {
    console.error('Failed to terminate process:', error);
  }
}

// Substitua o handler do 'quit' existente por este
app.on('quit', () => {
  console.log('DEBUG: App quit, matando backends');
  
  // Mata os processos backend
  [backendMainProcess, backendCanteiroProcess].forEach(killProcess);
  
  // Força o processo principal a encerrar após 2 segundos
  setTimeout(() => {
    console.log('DEBUG: Forçando encerramento');
    process.exit(0);
  }, 2000);
});

// Adicione este handler para 'before-quit'
app.on('before-quit', (event) => {
  console.log('DEBUG: before-quit');
  // Mata os processos backend
  [backendMainProcess, backendCanteiroProcess].forEach(killProcess);
});

// DEBUG: Fim do main.js
console.log('DEBUG: Fim do main.js');
