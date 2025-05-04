const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let backendMainProcess = null;
let backendCanteiroProcess = null;

const isDev = process.argv.includes('--dev');

// Define the path to the embedded Python interpreter
const embedPythonPath = app.isPackaged
  ? path.join(process.resourcesPath, 'backend', 'python-embed', 'python.exe')
  : path.join(__dirname, '..', 'backend', 'python-embed', 'python.exe');

// Backend configurations
const backends = [
  {
    name: 'Main API',
    path: app.isPackaged
      ? path.join(process.resourcesPath, 'backend', 'meu_canteiro_back_end')
      : path.join(__dirname, '..', 'backend', 'meu_canteiro_back_end'),
    port: 5000
  },
  {
    name: 'Canteiro API',
    path: app.isPackaged
      ? path.join(process.resourcesPath, 'backend', 'agroforestry_systems_design')
      : path.join(__dirname, '..', 'backend', 'agroforestry_systems_design'),
    port: 5001
  }
];

// Start backend servers for both APIs
async function startBackend() {
  console.log('Python Path:', embedPythonPath);
  console.log('Is Packaged:', app.isPackaged);
  console.log('Resource Path:', process.resourcesPath);

  if (!fs.existsSync(embedPythonPath)) {
    console.error('Python not found at:', embedPythonPath);
    throw new Error(`Embedded Python not found at: ${embedPythonPath}`);
  }

  for (const backend of backends) {
    try {
      const venvPath = path.join(backend.path, 'venv');

      // Create virtual environment if it doesn't exist
      if (!fs.existsSync(venvPath)) {
        console.log(`[${backend.name}] Creating virtualenv...`);
        await new Promise((resolve, reject) => {
          const createVenv = spawn(embedPythonPath, ['-m', 'venv', 'venv'], {
            cwd: backend.path,
            stdio: 'inherit'
          });
          createVenv.on('close', (code) => code === 0 ? resolve() : reject(new Error('Failed to create virtualenv')));
        });
      } else {
        console.log(`[${backend.name}] Virtualenv already exists.`);
      }

      console.log(`[${backend.name}] Installing dependencies...`);
      const pythonVenvPath = path.join(venvPath, 'Scripts', 'python.exe');
      if (!fs.existsSync(pythonVenvPath)) {
        throw new Error(`[${backend.name}] python.exe not found in virtualenv.`);
      }

      // Install dependencies using pip
      await new Promise((resolve, reject) => {
        const installDeps = spawn(pythonVenvPath, ['-m', 'pip', 'install', '-r', 'requirements.txt'], {
          cwd: backend.path,
          stdio: 'inherit'
        });
        installDeps.on('close', (code) => code === 0 ? resolve() : reject(new Error('Dependency installation failed')));
      });

      console.log(`[${backend.name}] Starting backend server...`);
      const proc = spawn(pythonVenvPath, ['app.py'], {
        cwd: backend.path,
        stdio: 'pipe'
      });

      // Output logs for debugging
      proc.stdout.on('data', (data) => console.log(`[${backend.name}] stdout: ${data.toString()}`));
      proc.stderr.on('data', (data) => console.error(`[${backend.name}] stderr: ${data.toString()}`));
      proc.on('close', (code) => console.log(`[${backend.name}] exited with code ${code}`));

      // Save process handle
      if (backend.port === 5000) backendMainProcess = proc;
      else if (backend.port === 5001) backendCanteiroProcess = proc;

    } catch (error) {
      console.error(`[${backend.name}] Startup error: ${error.message}`);
      console.error(error.stack);
    }
  }

  // Wait a few seconds to let servers start
  return new Promise((resolve) => setTimeout(resolve, 3000));
}

// Create and display the main Electron window
async function createWindow() {
  await startBackend();

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

  // Load frontend from local HTML file
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

// Quit app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create a window when app is reactivated (macOS)
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Clean up backend processes on exit
app.on('quit', () => {
  console.log('Shutting down backend processes...');
  [backendMainProcess, backendCanteiroProcess].forEach((proc) => {
    if (proc) {
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', proc.pid, '/f', '/t']);
        } else {
          proc.kill('SIGTERM');
        }
      } catch (error) {
        console.error('Failed to terminate process:', error);
      }
    }
  });
});
