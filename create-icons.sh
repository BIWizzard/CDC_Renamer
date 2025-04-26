#!/bin/bash
# Script to generate app icons for all platforms

# Create necessary directories
mkdir -p assets/icons/temp

# Use the correct path to your source image
SOURCE_IMAGE="assets/KGiQ-Logo-spread-transparent.svg"  # or .png

# Generate PNG files of different sizes
echo "Generating PNG files..."
magick convert "$SOURCE_IMAGE" -resize 16x16 assets/icons/temp/icon_16x16.png
magick convert "$SOURCE_IMAGE" -resize 32x32 assets/icons/temp/icon_32x32.png
magick convert "$SOURCE_IMAGE" -resize 48x48 assets/icons/temp/icon_48x48.png
magick convert "$SOURCE_IMAGE" -resize 64x64 assets/icons/temp/icon_64x64.png
magick convert "$SOURCE_IMAGE" -resize 128x128 assets/icons/temp/icon_128x128.png
magick convert "$SOURCE_IMAGE" -resize 256x256 assets/icons/temp/icon_256x256.png
magick convert "$SOURCE_IMAGE" -resize 512x512 assets/icons/temp/icon_512x512.png
magick convert "$SOURCE_IMAGE" -resize 1024x1024 assets/icons/temp/icon_1024x1024.png

# Create ICO file for Windows
echo "Creating Windows ICO file..."
magick convert assets/icons/temp/icon_16x16.png assets/icons/temp/icon_32x32.png \
        assets/icons/temp/icon_48x48.png assets/icons/temp/icon_64x64.png \
        assets/icons/temp/icon_128x128.png assets/icons/temp/icon_256x256.png \
        assets/icons/icon.ico

# Copy main PNG icon for Linux
echo "Creating Linux icon..."
cp assets/icons/temp/icon_512x512.png assets/icons/icon.png

# For macOS ICNS (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Creating macOS ICNS file..."
    mkdir -p assets/icons/temp.iconset
    cp assets/icons/temp/icon_16x16.png assets/icons/temp.iconset/icon_16x16.png
    cp assets/icons/temp/icon_32x32.png assets/icons/temp.iconset/icon_16x16@2x.png
    cp assets/icons/temp/icon_32x32.png assets/icons/temp.iconset/icon_32x32.png
    cp assets/icons/temp/icon_64x64.png assets/icons/temp.iconset/icon_32x32@2x.png
    cp assets/icons/temp/icon_128x128.png assets/icons/temp.iconset/icon_128x128.png
    cp assets/icons/temp/icon_256x256.png assets/icons/temp.iconset/icon_128x128@2x.png
    cp assets/icons/temp/icon_256x256.png assets/icons/temp.iconset/icon_256x256.png
    cp assets/icons/temp/icon_512x512.png assets/icons/temp.iconset/icon_256x256@2x.png
    cp assets/icons/temp/icon_512x512.png assets/icons/temp.iconset/icon_512x512.png
    cp assets/icons/temp/icon_1024x1024.png assets/icons/temp.iconset/icon_512x512@2x.png
    iconutil -c icns -o assets/icons/icon.icns assets/icons/temp.iconset
else
    echo "Not on macOS, skipping ICNS creation."
    echo "Please create the ICNS file on a macOS system or use an online converter."
fi

# Clean up temporary files
echo "Cleaning up..."
rm -rf assets/icons/temp
rm -rf assets/icons/temp.iconset

echo "Icon generation complete!"