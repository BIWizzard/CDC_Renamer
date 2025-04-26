import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import * as fs from 'fs';
import { ScriptSanitizer } from './utils/ScriptSanitizer';

const execPromise = promisify(exec);

// Environment detection
const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object to avoid garbage collection
let mainWindow: BrowserWindow | null = null;

/**
 * Creates the main application window
 */
function createWindow() {
  // Create the browser window with secure defaults
  mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      // Additional security settings
      sandbox: true,
      webSecurity: true
    }
  });

  // Load the index.html file
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  });
  
  mainWindow.loadURL(startUrl);

  // Open DevTools only in development mode
  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
    console.log('Running in development mode');
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });
}

// Create window when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();
  
  // Set application menu (can be customized further)
  // This is where you would set up a custom menu for production
});

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

/**
 * Handle directory selection using native dialog
 * Returns selected directory path or null if canceled
 */
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

/**
 * Execute PowerShell scripts with enhanced security
 * Uses a safer spawning method with proper error handling
 */
ipcMain.handle('execute-powershell', async (event, script: string): Promise<string> => {
  try {
    // Log commands only in development mode
    if (isDevelopment) {
      console.log('Main process: Executing PowerShell command:', script);
    }
    
    // Sanitize script to prevent command injection and other security issues
    script = ScriptSanitizer.sanitize(script);
    
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
        if (isDevelopment) {
          console.log('PowerShell process exited with code:', code);
          console.log('stdout:', stdout);
          
          if (stderr) {
            console.error('stderr:', stderr);
          }
        }
        
        if (code !== 0) {
          reject(new Error(`PowerShell exited with code ${code}: ${stderr}`));
        } else {
          resolve(stdout);
        }
      });
      
      child.on('error', (err: Error) => {
        if (isDevelopment) {
          console.error('Failed to start PowerShell process:', err);
        }
        reject(err);
      });
    });
  } catch (error) {
    if (isDevelopment) {
      console.error('PowerShell execution error in main process:', error);
    }
    throw error;
  }
});