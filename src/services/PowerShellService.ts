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
}