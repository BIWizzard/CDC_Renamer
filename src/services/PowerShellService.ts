// PowerShellService.ts
import * as nodePowershell from 'node-powershell';

export class PowerShellService {
  // Instead of trying to instantiate the PowerShell class directly,
  // we'll use a simpler approach with child_process
  
  async executeCommand(script: string): Promise<string> {
    try {
      // Use the child_process module to execute PowerShell commands directly
      const { exec } = require('child_process');
      
      return new Promise((resolve, reject) => {
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
  }

  // No need for a dispose method with this approach
}