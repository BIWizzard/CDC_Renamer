// src/types/electron-api.d.ts
interface ElectronAPI {
    selectDirectory: () => Promise<string | null>;
    executePowerShell: (script: string) => Promise<string>;
  }
  
  declare global {
    interface Window {
      electronAPI: ElectronAPI;
    }
  }
  
  export {};