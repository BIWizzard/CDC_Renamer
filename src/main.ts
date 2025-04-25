import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Keep a global reference of the window object to avoid garbage collection
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html file
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  });
  
  mainWindow.loadURL(startUrl);

  // Open DevTools in development
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });
}

// Create window when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications to stay open until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window when the dock icon is clicked
  if (mainWindow === null) {
    createWindow();
  }
});

// Setup IPC handlers for directory selection
ipcMain.handle('select-directory', async (): Promise<string | null> => {
  if (!mainWindow) return null;
  
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (result.canceled) {
    return null;
  }
  
  return result.filePaths[0] || null;
});

// Setup IPC handler for PowerShell execution
ipcMain.handle('execute-powershell', async (event, script: string): Promise<string> => {
  try {
    return new Promise<string>((resolve, reject) => {
      // Execute PowerShell with the bypass execution policy
      exec(`powershell -ExecutionPolicy Bypass -Command "${script.replace(/"/g, '\\"')}"`, 
        (error: any, stdout: string, stderr: string) => {
          if (error) {
            console.error(`PowerShell execution error: ${error.message}`);
            reject(error);
            return;
          }
          if (stderr) {
            console.error(`PowerShell stderr: ${stderr}`);
          }
          resolve(stdout);
        }
      );
    });
  } catch (error) {
    console.error('PowerShell execution error:', error);
    throw error;
  }
});