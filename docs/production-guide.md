# CDC File Renamer: Production Build and Distribution Guide

This guide outlines the process to build and distribute the CDC File Renamer application for Windows, macOS, and Linux.

## Prerequisites

- Node.js (v14 or later)
- npm (v7 or later)
- Git
- Required platform-specific tools:
  - For Windows: Windows 10 or later
  - For macOS: macOS 10.15 or later, Xcode command line tools
  - For Linux: Debian/Ubuntu or similar

## Step 1: Prepare the Environment

First, ensure all dependencies are installed and up to date:

    # Install dependencies
    npm install

    # Install global tools (if not already installed)
    npm install -g electron-builder electron-forge

## Step 2: Update Version and Metadata

Before building, update the version number in `package.json`:

    {
      "name": "cdc-file-renamer",
      "version": "1.0.0", // Update this as needed
      "description": "CDC File Renamer - Change Data Capture File Management Tool",
      // ... rest of package.json
    }

## Step 3: Prepare App Icons

Ensure you have the required icons in the `assets/icons/` directory:

- `icon.ico` for Windows
- `icon.icns` for macOS
- `icon.png` for Linux

See the Icon Creation Guide for details on creating these files.

## Step 4: Create a Production Build

Build the application for production:

    # Production webpack build
    npm run build

    # Check that the build was successful
    ls -la dist/

## Step 5: Package the Application

Package the application for your target platform:

    # For Windows (creates NSIS installer)
    npm run make -- --platform=win32

    # For macOS (creates DMG)
    npm run make -- --platform=darwin

    # For Linux (creates AppImage and .deb)
    npm run make -- --platform=linux

    # For all platforms (if building on macOS with appropriate tools)
    npm run make

The packaged applications will be created in the `out/` directory.

## Step 6: Code Signing (Recommended for Production)

For a production release, code signing is strongly recommended:

### Windows Code Signing

1. Obtain a code signing certificate from a trusted Certificate Authority
2. Add code signing configuration to `electron-builder.yml` or package.json:

    "build": {
      "win": {
        "certificateFile": "path/to/certificate.pfx",
        "certificatePassword": "password",
        "signingHashAlgorithms": ["sha256"]
      }
    }

### macOS Code Signing and Notarization

1. Obtain an Apple Developer ID certificate
2. Configure code signing in package.json:

    "build": {
      "mac": {
        "hardenedRuntime": true,
        "gatekeeperAssess": false,
        "entitlements": "entitlements.plist",
        "entitlementsInherit": "entitlements.plist",
        "identity": "Developer ID Application: Your Name (Team ID)"
      }
    }

3. For notarization, you'll need to add additional configuration and scripts

## Step 7: Test the Packaged Application

Thoroughly test the packaged application on each target platform:

1. Install the application using the installer
2. Verify all functionality works correctly
3. Test on a clean system if possible
4. Check that file associations work (if applicable)
5. Verify proper error handling and logging

## Step 8: Create GitHub Release (Optional)

If using GitHub, create a new release:

1. Tag the release in Git: `git tag v1.0.0`
2. Push the tag: `git push origin v1.0.0`
3. Create a new release on GitHub, uploading the installers

## Step 9: Automatic Updates (Optional)

For automatic updates, you can use electron-updater:

1. Ensure `electron-updater` is installed
2. Configure update settings in package.json:

    "build": {
      "publish": {
        "provider": "github",
        "owner": "your-github-username",
        "repo": "cdc-file-renamer"
      }
    }

3. Add update code to the main process (main.ts):

    import { autoUpdater } from 'electron-updater';

    // Check for updates
    app.whenReady().then(() => {
      if (process.env.NODE_ENV === 'production') {
        autoUpdater.checkForUpdatesAndNotify();
      }
    });

## Step 10: Distribution

Distribute your application through appropriate channels:

1. Direct download from your website
2. GitHub Releases
3. Enterprise internal distribution
4. App stores (requires additional setup)

## Troubleshooting Common Issues

### Icon Issues

If icons aren't showing up correctly, ensure they're in the correct format and path. You may need to rebuild the application with:

    npm run package -- --rebuild

### Signing Issues

Code signing failures are common. Check that your certificates are valid and properly configured. For Windows, ensure the certificate is in the correct format (PFX).

### PowerShell Execution Policy

On Windows, users may encounter PowerShell execution policy issues. Your application should handle this by setting the appropriate execution policy in the PowerShell command:

    -ExecutionPolicy Bypass

### Path Issues

If assets aren't loading in the packaged app, check the path resolution code to ensure it properly handles both development and production environments.

## Conclusion

Following this guide should result in a production-ready CDC File Renamer application that can be distributed to end users. Remember to thoroughly test on all target platforms and consider setting up automatic updates for a better user experience.