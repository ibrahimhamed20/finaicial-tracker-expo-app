# App Icon Guide

## Required Icon Sizes

### Main App Icon (icon.png)
- **Size**: 1024x1024 pixels
- **Format**: PNG
- **Background**: Transparent or solid color
- **Design**: Should work well at small sizes (down to 29x29)

### Android Icons

#### android-icon-foreground.png
- **Size**: 1024x1024 pixels
- **Format**: PNG
- **Background**: Transparent
- **Design**: Main icon design (will be placed on adaptive background)

#### android-icon-background.png
- **Size**: 1024x1024 pixels
- **Format**: PNG
- **Background**: Solid color (#6366f1)
- **Design**: Background for adaptive icon

#### android-icon-monochrome.png
- **Size**: 1024x1024 pixels
- **Format**: PNG
- **Background**: Transparent
- **Design**: Monochrome version for Android 13+ theming

### iOS Icons
- Uses the main `icon.png` (1024x1024)
- iOS will automatically generate all required sizes

### Splash Screen Icon (splash-icon.png)
- **Size**: 1024x1024 pixels
- **Format**: PNG
- **Background**: Transparent
- **Design**: Should work well on gradient background

## Design Recommendations

### For Finance Tracker App:
1. **Main Symbol**: Money bag, dollar sign, or chart icon
2. **Colors**: Use your app's purple theme (#6366f1)
3. **Style**: Modern, clean, professional
4. **Contrast**: Ensure good visibility on both light and dark backgrounds

### Icon Design Tools:
- **Figma**: Free, web-based design tool
- **Canva**: Easy-to-use with templates
- **Adobe Illustrator**: Professional vector design
- **Online generators**: Many free tools available

## Current Status
✅ All required icon files are present in `assets/images/`
✅ App configuration updated with proper names and identifiers
✅ Ready for building!

## Next Steps
1. Replace existing icons with your custom designs
2. Run `npx expo prebuild` to generate native code
3. Build with `eas build --platform android` or `eas build --platform ios`
