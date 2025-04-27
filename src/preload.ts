// src/preload.ts
import { ipcRenderer } from 'electron';

// With contextIsolation disabled, we can directly attach
// our API to the window object
window.electronAPI = {
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  executePowerShell: (script: string) => ipcRenderer.invoke('execute-powershell', script)
};

// Ensure TypeScript knows about our additions to the window object
declare global {
  interface Window {
    electronAPI: {
      selectDirectory: () => Promise<string | null>;
      executePowerShell: (script: string) => Promise<string>;
    }
  }
}