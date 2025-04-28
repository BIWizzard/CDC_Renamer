# App Icon Creation Guide for CDC File Renamer

For a professional desktop application, you'll need properly formatted icons for each platform. This guide explains how to create these icons from your source artwork.

## Required Icon Formats

### Windows
- `.ico` format
- Recommended sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
- File: `assets/icons/icon.ico`

### macOS
- `.icns` format
- Requires multiple resolutions: 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024
- File: `assets/icons/icon.icns`

### Linux
- `.png` format
- Recommended sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256, 512x512, 1024x1024
- Main file: `assets/icons/icon.png` (usually 512x512)

## Icon Creation Tools

You can use these tools to create the required icon formats:

1. **For macOS ICNS**: 
   - Use Image2Icon (macOS app)
   - Or iconutil command-line tool

2. **For Windows ICO**:
   - Use IcoFX or IconWorkshop
   - Online converters like ConvertICO

3. **For All Platforms**:
   - Use Electron Icon Maker 
   - Install with: `npm install -g electron-icon-maker`
   - Use with: `electron-icon-maker --input=/path/to/source.png --output=./assets/icons`

## Creating Icons from the KGiQ Logo

1. Start with a high-resolution version of the KGiQ logo (at least 1024x1024)
2. Ensure it has a transparent background (PNG format)
3. Make sure the logo fits well in a square format with appropriate padding
4. Use one of the tools mentioned above to generate all required sizes

## Manual Method with ImageMagick

If you prefer a manual approach, you can use ImageMagick:

    # Install ImageMagick
    # For Windows: Use the installer from https://imagemagick.org/script/download.php
    # For macOS: brew install imagemagick
    # For Linux: sudo apt-get install imagemagick

    # Generate PNG files of different sizes
    magick convert source.png -resize 16x16 icon_16x16.png
    magick convert source.png -resize 32x32 icon_32x32.png
    magick convert source.png -resize 48x48 icon_48x48.png
    magick convert source.png -resize 64x64 icon_64x64.png
    magick convert source.png -resize 128x128 icon_128x128.png
    magick convert source.png -resize 256x256 icon_256x256.png
    magick convert source.png -resize 512x512 icon_512x512.png
    magick convert source.png -resize 1024x1024 icon_1024x1024.png

    # Create ICO file for Windows
    magick convert icon_16x16.png icon_32x32.png icon_48x48.png icon_64x64.png icon_128x128.png icon_256x256.png icon.ico

    # For macOS ICNS, you'll need additional steps using iconutil

Make sure these icons are placed in the `assets/icons/` directory as specified in the package.json configuration.

## Platform-Specific Requirements

### Windows
Windows displays icons at various sizes in File Explorer, the taskbar, and application windows. The ICO file should contain multiple image sizes to accommodate different display scenarios.

### macOS
macOS is particularly strict about icon requirements. For best results, your ICNS file should:
- Include all required resolutions
- Have proper transparency
- Use the sRGB color profile

### Linux
Linux distributions typically use PNG files for icons. Your application should include icons of various sizes for different display contexts.

## Testing Your Icons

After creating your icons, test them thoroughly:
1. Build the application for each target platform
2. Check how the icon appears in the taskbar/dock
3. Verify the icon in File Explorer/Finder
4. Test on high-DPI/Retina displays if possible

## Troubleshooting

If your icons aren't appearing correctly:
- Make sure the paths in package.json are correct
- Verify that your icon files are actually in the specified locations
- Check that the formats are valid (ICO, ICNS, PNG)
- Rebuild the application with `npm run package -- --rebuild`

Following this guide will ensure your CDC File Renamer application has professional, consistent icons across all platforms.