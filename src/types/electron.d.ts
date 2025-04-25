// src/types/electron.d.ts
declare module 'electron' {
    import * as electron from 'electron';
    export = electron;
    
    interface OpenDialogReturnValue {
      canceled: boolean;
      filePaths: string[];
    }
  }