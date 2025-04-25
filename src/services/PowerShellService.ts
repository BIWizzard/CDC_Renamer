// src/services/PowerShellService.ts
export class PowerShellService {
  async executeCommand(script: string): Promise<string> {
    try {
      // Use a more dynamic approach to access the API
      const electronAPI = (window as any).electronAPI;
      
      if (electronAPI && typeof electronAPI.executePowerShell === 'function') {
        // Use IPC to have the main process execute PowerShell
        return await electronAPI.executePowerShell(script);
      } else {
        // Fallback for development or if API is not available
        console.error('electronAPI.executePowerShell not available');
        
        // Use direct approach as fallback
        const { exec } = require('child_process');
        
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
      }
    } catch (error) {
      console.error('PowerShell execution error:', error);
      throw error;
    }
  }
}