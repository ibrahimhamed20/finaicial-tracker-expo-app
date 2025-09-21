# Build Instructions for Finance Tracker App

## Prerequisites

1. **Install EAS CLI**:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure EAS** (if not already done):
   ```bash
   eas build:configure
   ```

## Building the App

### For Android APK (Recommended for testing)

1. **Build APK**:
   ```bash
   npm run build:android
   ```
   or
   ```bash
   eas build --platform android --profile preview
   ```

2. **Download APK**:
   - The build will provide a download link
   - Download and install on Android device

### For iOS (Requires Apple Developer Account)

1. **Build iOS**:
   ```bash
   npm run build:ios
   ```
   or
   ```bash
   eas build --platform ios
   ```

2. **Install on iOS**:
   - Use TestFlight for distribution
   - Or install directly via Xcode

### Build All Platforms

```bash
npm run build:all
```

## App Information

### App Details
- **Name**: Finance Tracker
- **Package ID**: com.financetracker.app
- **Version**: 1.0.0
- **Description**: Your personal financial assistant for tracking expenses, income, and budgets

### Icon Assets
- All required icon files are in `assets/images/`
- Main icon: `icon.png` (1024x1024)
- Android icons: `android-icon-*.png`
- Splash icon: `splash-icon.png`

## Build Profiles

### Development
- For testing with Expo Go
- Includes development tools

### Preview
- For internal testing
- Android: Generates APK file
- iOS: Generates IPA file

### Production
- For app store submission
- Optimized and minified

## Troubleshooting

### Common Issues

1. **Build fails with icon errors**:
   - Ensure all icon files are 1024x1024 pixels
   - Check file formats (PNG)
   - Verify file paths in app.json

2. **Android build fails**:
   - Check Android package name
   - Ensure versionCode is set
   - Verify signing configuration

3. **iOS build fails**:
   - Check bundle identifier
   - Ensure Apple Developer account is linked
   - Verify provisioning profiles

### Getting Help

1. Check Expo documentation: https://docs.expo.dev/
2. EAS Build docs: https://docs.expo.dev/build/introduction/
3. Community support: https://forums.expo.dev/

## Next Steps After Building

1. **Test the APK/IPA** on real devices
2. **Update icons** if needed (replace files in assets/images/)
3. **Submit to stores** using `eas submit` commands
4. **Update version** in app.json for new releases
