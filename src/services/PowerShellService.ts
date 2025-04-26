// src/services/PowerShellService.ts
export class PowerShellService {
  async executeCommand(script: string): Promise<string> {
    try {
      console.log('PowerShellService: Attempting to execute script via electronAPI');
      
      if (window.electronAPI) {
        const api = window.electronAPI as any;
        
        if (typeof api.executePowerShell === 'function') {
          console.log('Sending script to main process:', script);
          return await api.executePowerShell(script);
        } else {
          throw new Error('executePowerShell method is not available');
        }
      } else {
        throw new Error('Electron API not available');
      }
    } catch (error) {
      console.error('PowerShell execution error:', error);
      throw error;
    }
  }

  // Add this method to make it compatible with the new code
  async executePowerShell(script: string): Promise<string> {
    // This simply calls your existing executeCommand method
    return this.executeCommand(script);
  }
}

// Add this to make TypeScript aware of the window.electronAPI property
declare global {
  interface Window {
    electronAPI: {
      selectDirectory: () => Promise<string | null>;
      executePowerShell: (script: string) => Promise<string>;
    }
  }
}