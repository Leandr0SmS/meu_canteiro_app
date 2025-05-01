const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');
const fs = require('fs');

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;
let backendMainProcess = null;
let backendCanteiroProcess = null;

// Check if running in development mode
const isDev = process.argv.includes('--dev');

async function startBackend() {

  const embedPythonPath = path.join(__dirname, '..', 'backend', 'python-embed', 'python.exe');
  const getPipScript = path.join(__dirname, '..', 'backend', 'python-embed', 'get-pip.py');

  // Ensure pip is installed in the embedded Python
  if (!fs.existsSync(path.join(__dirname, '..', 'backend', 'python-embed', 'Scripts', 'pip.exe'))) {
    console.log('[Python Embed] Pip not found. Installing pip...');
    await new Promise((resolve, reject) => {
      const installPip = spawn(embedPythonPath, [getPipScript], {
        cwd: path.join(__dirname, '..', 'backend', 'python-embed'),
        shell: true
      });
      installPip.stdout.on('data', (data) => console.log(`[PIP Install] stdout: ${data}`));
      installPip.stderr.on('data', (data) => console.error(`[PIP Install] stderr: ${data}`));
      installPip.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error('Failed to install pip'));
      });
    });
  }

    const backends = [
        {
          name: 'Main API',
          path: path.join(__dirname, '..', 'backend', 'meu_canteiro_back_end'),
          port: 5000
        },
        {
          name: 'Canteiro API',
          path: path.join(__dirname, '..', 'backend', 'agroforestry_systems_design'),
          port: 5001
        }
      ];
    
      for (const backend of backends) {
        const venvPath = path.join(backend.path, 'venv');
    
        // Create virtual environment if it doesn't exist
        if (!fs.existsSync(venvPath)) {
          console.log(`[${backend.name}] Virtual environment not found. Creating one...`);
          await new Promise((resolve, reject) => {
            const createVenv = spawn(embedPythonPath, ['-m', 'venv', 'venv'], { cwd: backend.path, shell: true });
            createVenv.stdout.on('data', (data) => console.log(`[${backend.name}] VENV stdout: ${data}`));
            createVenv.stderr.on('data', (data) => console.error(`[${backend.name}] VENV stderr: ${data}`));
            createVenv.on('close', (code) => code === 0 ? resolve() : reject(new Error('Failed to create virtual environment')));
          });
        }

        await new Promise((resolve, reject) => {
          const installPip = spawn(embedPythonPath, ['get-pip.py'], { cwd: path.join(__dirname, '..', 'backend', 'python-embed') });
        
          installPip.stdout.on('data', (data) => console.log(`[PIP Install] stdout: ${data}`));
          installPip.stderr.on('data', (data) => console.error(`[PIP Install] stderr: ${data}`));
        
          installPip.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error('Failed to install pip'));
          });
        });
    
        // Install required Python packages
        console.log(`[${backend.name}] Installing dependencies...`);
        const pipPath = path.join(venvPath, 'Scripts', 'pip.exe');
        await new Promise((resolve, reject) => {
          const installDeps = spawn(pipPath, ['install', '-r', 'requirements.txt'], { cwd: backend.path, shell: true });
          installDeps.stdout.on('data', (data) => console.log(`[${backend.name}] PIP stdout: ${data}`));
          installDeps.stderr.on('data', (data) => console.error(`[${backend.name}] PIP stderr: ${data}`));
          installDeps.on('close', (code) => code === 0 ? resolve() : reject(new Error('Failed to install dependencies')));
        });
    
        // Start the Flask API server
        console.log(`[${backend.name}] Starting server...`);
        const pythonPath = path.join(venvPath, 'Scripts', 'python.exe');
        const proc = spawn(pythonPath, ['app.py'], {
          cwd: backend.path,
          stdio: 'pipe'
        });
    
        // Log backend outputs
        proc.stdout.on('data', (data) => console.log(`[${backend.name}] stdout: ${data}`));
        proc.stderr.on('data', (data) => console.error(`[${backend.name}] stderr: ${data}`));
        proc.on('close', (code) => console.log(`[${backend.name}] process exited with code ${code}`));
    
        // Save the process reference
        if (backend.port === 5000) {
          backendMainProcess = proc;
        } else if (backend.port === 5001) {
          backendCanteiroProcess = proc;
        }
      }
    
      // Wait a few seconds to make sure the servers are fully up
      return new Promise((resolve) => setTimeout(resolve, 3000));
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

// Clean up backend processes when app quits
app.on('quit', () => {
    console.log('Killing backend processes...');
    [backendMainProcess, backendCanteiroProcess].forEach((proc) => {
      if (proc) {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', proc.pid, '/f', '/t']);
        } else {
          proc.kill();
        }
      }
    });
  });
