// src/utils/AssetPathResolver.ts
/**
 * Utility to resolve asset paths correctly in both development and production
 */
export class AssetPathResolver {
    /**
     * Get the correct path for an asset in both development and production
     * 
     * @param relativePath - The relative path to the asset within the assets directory
     * @returns The correct path to the asset
     */
    public static getAssetPath(relativePath: string): string {
      const isDevelopment = process.env.NODE_ENV !== 'production';
      
      // In development, assets are in the assets directory at the project root
      if (isDevelopment) {
        return `assets/${relativePath}`;
      }
      
      // In production with Electron, assets are typically bundled in one of these locations
      // We'll try a few common ones for Electron apps
      return `./assets/${relativePath}`;
    }
  }