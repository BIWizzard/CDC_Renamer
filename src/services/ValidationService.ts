// src/services/ValidationService.ts
export class ValidationService {
    static validateSourceDirectory(path: string): string | null {
      if (!path) {
        return 'Source directory is required';
      }
      return null;
    }
  
    static validateTargetDirectory(path: string): string | null {
      if (!path) {
        return 'Target directory is required';
      }
      return null;
    }
  
    static validateTimestamp(timestamp: string): string | null {
      // Basic timestamp format validation
      const timestampRegex = /_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.txt$/;
      if (!timestampRegex.test(timestamp)) {
        return 'Invalid timestamp format. Expected format: _YYYY-MM-DD_HH-MM-SS.txt';
      }
      return null;
    }
  
    static validateRegexPattern(pattern: string): string | null {
      try {
        // Test if pattern is a valid regex
        new RegExp(pattern);
        return null;
      } catch (error) {
        return 'Invalid regular expression pattern';
      }
    }
  }