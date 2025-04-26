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