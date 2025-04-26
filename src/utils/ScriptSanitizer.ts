/**
 * Utility class for sanitizing PowerShell scripts to prevent command injection and unsafe operations
 */
export class ScriptSanitizer {
    /**
     * List of potentially dangerous PowerShell commands that should be blocked
     */
    private static dangerousCommands: string[] = [
      'Remove-Item', 'rm', 'del', 'rmdir', 'rd', 'format',
      'Clear-Content', 'Invoke-Expression', 'iex', 'Invoke-Command',
      'Invoke-WebRequest', 'wget', 'curl', 'Start-Process',
      'New-Service', 'Stop-Service', 'Remove-Service',
      'Set-ExecutionPolicy', 'reg delete', 'reg add',
      'net user', 'net localgroup', 'Get-Credential', 'Enable-PSRemoting',
      'Out-File', 'Set-Content', 'Add-Content', // Only allow specific output paths
      'Start-Job', 'Invoke-RestMethod', 'Start-Service',
      'Start-ScheduledTask', 'Register-ScheduledTask', 'Out-Default'
    ];
  
    /**
     * List of allowed commands for file operations within our application
     */
    private static allowedCommands: string[] = [
      'Get-ChildItem', 'Test-Path', 'Copy-Item', 'Join-Path',
      'New-Item', 'Get-Content', 'Select-Object', 'Where-Object',
      'ForEach-Object', 'Out-Null'
    ];
  
    /**
     * Paths that scripts are allowed to work with
     */
    private static validPathPatterns: RegExp[] = [
      // Direct string paths in quotes
      /["'](.*?)["']/g,
      // Variables that likely contain paths
      /\$\w+Path/g,
      // Join-Path parameters
      /Join-Path\s+-Path\s+(.*?)\s+-ChildPath/g
    ];
  
    /**
     * Sanitize a PowerShell script to ensure it's safe to execute
     * @param script - The script to sanitize
     * @returns The sanitized script or throws an error if unsafe
     */
    public static sanitize(script: string): string {
      // Check for dangerous commands
      for (const command of this.dangerousCommands) {
        if (new RegExp(`\\b${command}\\b`, 'i').test(script)) {
          throw new Error(`Script contains prohibited command: ${command}`);
        }
      }
  
      // Ensure the script only uses allowed commands
      const commandPattern = /(?:^|\s+)([\w-]+)(?:\s+|$)/g;
      let match;
      while ((match = commandPattern.exec(script)) !== null) {
        const command = match[1];
        if (
          !command.startsWith('$') && // Skip variables
          !command.match(/^[0-9.]+$/) && // Skip numbers
          !['if', 'else', 'elseif', 'foreach', 'while', 'switch', 'function', 'return', 'param', 'begin', 'process', 'end'].includes(command.toLowerCase()) && // Skip language constructs
          !this.allowedCommands.some(allowed => allowed.toLowerCase() === command.toLowerCase()) // Check if it's in the allowed list
        ) {
          throw new Error(`Script contains unallowed command: ${command}`);
        }
      }
  
      // Extract all paths mentioned in the script to validate them
      let allMatches: string[] = [];
      this.validPathPatterns.forEach(pattern => {
        const matches = script.match(pattern);
        if (matches) {
          allMatches = allMatches.concat(matches);
        }
      });
  
      // Validate that file operations are done on expected paths
      // This is a simple check and would need to be expanded in a real implementation
      if (allMatches.length > 0) {
        // Perform path validation logic here
        // For example, ensure paths don't contain suspicious patterns
        const suspiciousPatterns = ['../', '..\\', '~/', '~\\', '/bin/', '/etc/', 'C:\\Windows\\', 'System32'];
        
        for (const match of allMatches) {
          for (const pattern of suspiciousPatterns) {
            if (match.includes(pattern)) {
              throw new Error(`Script contains suspicious path pattern: ${pattern}`);
            }
          }
        }
      }
  
      // The script passed all our checks
      return script;
    }
  }