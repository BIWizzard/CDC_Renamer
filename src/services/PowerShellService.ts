// src/services/PowerShellService.ts
export class PowerShellService {
  async executeCommand(script: string): Promise<string> {
    try {
      console.log('PowerShellService: Attempting to execute script via electronAPI');
      console.log('window.electronAPI exists:', !!window.electronAPI);
      
      if (window.electronAPI) {
        console.log('Available methods:', Object.keys(window.electronAPI));
        
        // Use type assertion to avoid TypeScript errors
        const api = window.electronAPI as any;
        
        if (typeof api.executePowerShell === 'function') {
          console.log('executePowerShell is a function, calling it now');
          return await api.executePowerShell(script);
        } else {
          console.error('executePowerShell is not a function');
          console.log('Type of executePowerShell:', typeof api.executePowerShell);
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