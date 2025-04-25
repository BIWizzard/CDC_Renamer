import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import * as fs from 'fs';

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
  mainWindow.webContents.openDevTools();

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

// Setup IPC handler for PowerShell execution with robust error handling
ipcMain.handle('execute-powershell', async (event, script: string): Promise<string> => {
  try {
    console.log('Main process: Executing PowerShell command:', script);
    
    // Use a simpler command format to avoid escaping issues
    const child = require('child_process').spawn('powershell.exe', [
      '-NoProfile',
      '-ExecutionPolicy', 'Bypass',
      '-Command', script
    ]);
    
    // Collect output
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });
    
    return new Promise((resolve, reject) => {
      child.on('close', (code: number) => {
        console.log('PowerShell process exited with code:', code);
        console.log('stdout:', stdout);
        
        if (stderr) {
          console.error('stderr:', stderr);
        }
        
        if (code !== 0) {
          reject(new Error(`PowerShell exited with code ${code}: ${stderr}`));
        } else {
          resolve(stdout);
        }
      });
      
      child.on('error', (err: Error) => {
        console.error('Failed to start PowerShell process:', err);
        reject(err);
      });
    });
  } catch (error) {
    console.error('PowerShell execution error in main process:', error);
    throw error;
  }
});