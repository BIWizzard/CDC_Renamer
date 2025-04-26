/**
 * Simple logger service for the CDC File Renamer application
 * In production, logs are only output to file in the user's app data directory
 * In development, logs are also output to console
 */
export class LoggerService {
    private static instance: LoggerService;
    private isDevelopment: boolean;
    private logFilePath: string | null = null;
  
    private constructor() {
      this.isDevelopment = process.env.NODE_ENV !== 'production';
      
      // In a real application, you would set up log file paths
      // For Electron, you might use app.getPath('logs') to get the logs directory
      // For simplicity, we're just using the console in this example
      this.setupLogFile();
    }
  
    /**
     * Get the singleton instance of the LoggerService
     */
    public static getInstance(): LoggerService {
      if (!LoggerService.instance) {
        LoggerService.instance = new LoggerService();
      }
      return LoggerService.instance;
    }
  
    /**
     * Set up log file for production
     * This would typically write to a file in the user's app data directory
     */
    private setupLogFile(): void {
      // In a real application, you would set up log file paths
      // This is a placeholder for actual file-based logging implementation
      if (!this.isDevelopment) {
        try {
          // In a real implementation, you would initialize a file logger here
          // e.g., this.logFilePath = path.join(app.getPath('logs'), 'cdc-file-renamer.log');
          this.logFilePath = null; // This is just a placeholder
        } catch (error) {
          console.error('Failed to set up log file:', error);
        }
      }
    }
  
    /**
     * Log informational message
     * @param message - The message to log
     * @param data - Optional data to include in the log
     */
    public info(message: string, data?: any): void {
      this.log('INFO', message, data);
    }
  
    /**
     * Log warning message
     * @param message - The message to log
     * @param data - Optional data to include in the log
     */
    public warn(message: string, data?: any): void {
      this.log('WARN', message, data);
    }
  
    /**
     * Log error message
     * @param message - The message to log
     * @param error - The error object or data to include
     */
    public error(message: string, error?: any): void {
      this.log('ERROR', message, error);
    }
  
    /**
     * Log debug message (only in development mode)
     * @param message - The message to log
     * @param data - Optional data to include in the log
     */
    public debug(message: string, data?: any): void {
      if (this.isDevelopment) {
        this.log('DEBUG', message, data);
      }
    }
  
    /**
     * Internal log method to handle all logging
     * @param level - Log level (INFO, WARN, ERROR, DEBUG)
     * @param message - The message to log
     * @param data - Optional data to include in the log
     */
    private log(level: string, message: string, data?: any): void {
      const timestamp = new Date().toISOString();
      const logEntry = `[${timestamp}] [${level}] ${message}`;
      
      // Log to console in development mode
      if (this.isDevelopment) {
        switch (level) {
          case 'ERROR':
            console.error(logEntry, data || '');
            break;
          case 'WARN':
            console.warn(logEntry, data || '');
            break;
          case 'DEBUG':
            console.debug(logEntry, data || '');
            break;
          default:
            console.log(logEntry, data || '');
        }
      }
      
      // In a real application, you would also log to file here
      // This is just a placeholder for actual file logging
      if (this.logFilePath) {
        // Example: appendToLogFile(this.logFilePath, `${logEntry} ${data ? JSON.stringify(data) : ''}\n`);
      }
    }
  }
  
  // Export a singleton instance
  export const logger = LoggerService.getInstance();