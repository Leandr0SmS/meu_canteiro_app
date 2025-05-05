const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');
const fs = require('fs');

// Main application window
let mainWindow;
// Backend process handlers
let backendMainProcess = null;
let backendCanteiroProcess = null;

// Check if running in development mode
const isDev = process.argv.includes('--dev');

// Define the path to the embedded Python interpreter
const embedPythonPath = app.isPackaged
  ? path.join(app.getPath('userData'), 'resources', 'backend', 'python-embed', 'python.exe')
  : path.join(__dirname, '..', 'backend', 'python-embed', 'python.exe');

// Backend configurations for both APIs
const backends = [
  {
    name: 'Main API',
    path: app.isPackaged
      ? path.join(app.getPath('userData'), 'resources', 'backend', 'meu_canteiro_back_end')
      : path.join(__dirname, '..', 'backend', 'meu_canteiro_back_end'),
    port: 5000
  },
  {
    name: 'Canteiro API',
    path: app.isPackaged
      ? path.join(app.getPath('userData'), 'resources', 'backend', 'agroforestry_systems_design')
      : path.join(__dirname, '..', 'backend', 'agroforestry_systems_design'),
    port: 5001
  }
];

// Start backend servers for both APIs
async function startBackend() {
  // Log important paths for debugging
  console.log('Python Path:', embedPythonPath);
  console.log('Is Packaged:', app.isPackaged);
  console.log('User Data Path:', app.getPath('userData'));

  // If running in packaged mode, copy resources to user directory
  if (app.isPackaged) {
    const resourcesPath = process.resourcesPath;
    const userDataPath = path.join(app.getPath('userData'), 'resources');

    // Create user data directory if it doesn't exist
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    // Copy resources if they don't already exist
    if (!fs.existsSync(embedPythonPath)) {
      const srcPath = path.join(resourcesPath, 'backend');
      const destPath = path.join(userDataPath, 'backend');
      
      // Helper function to copy directory recursively
      const copyDir = (src, dest) => {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        const entries = fs.readdirSync(src, { withFileTypes: true });
        
        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          
          if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };

      copyDir(srcPath, destPath);
    }
  }

  // Start each backend server
  for (const backend of backends) {
    try {
      const pythonPath = path.join(backend.path, 'venv', 'Scripts', 'python.exe');
      
      // Start Python server using cmd.exe
      const startServer = spawn(pythonPath, ['app.py'], {
        cwd: backend.path,
        shell: true,
        windowsHide: true, // Hide cmd window
        env: {
          ...process.env,
          PYTHONPATH: backend.path
        }
      });

      // Handle server output
      startServer.stdout.on('data', (data) => {
        console.log(`[${backend.name}] ${data}`);
      });

      // Handle server errors
      startServer.stderr.on('data', (data) => {
        console.error(`[${backend.name}] Error: ${data}`);
      });

      // Store process reference based on port
      if (backend.port === 5000) {
        backendMainProcess = startServer;
      } else if (backend.port === 5001) {
        backendCanteiroProcess = startServer;
      }

    } catch (error) {
      console.error(`[${backend.name}] Failed to start:`, error);
    }
  }

  // Wait for servers to start
  return new Promise((resolve) => setTimeout(resolve, 3000));
}

// Create and display the main Electron window
async function createWindow() {
  // Start backend servers before creating window
  await startBackend();

  // Create browser window
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

  // Load frontend
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

  // Handle window closure
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when app is ready
app.whenReady().then(createWindow);

// Quit app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create window when app is activated (macOS)
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
        // Force kill process tree on Windows, normal termination on other platforms
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', proc.pid, '/f', '/t'], {
            windowsHide: true
          });
        } else {
          proc.kill('SIGTERM');
        }
      } catch (error) {
        console.error('Failed to terminate process:', error);
      }
    }
  });
});
