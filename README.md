# 💰 Finance Tracker

A beautiful, modern personal finance management app built with React Native and Expo. Track your expenses, income, and budgets with an elegant, user-friendly interface.

![Finance Tracker](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)
![Expo](https://img.shields.io/badge/Expo-~54.0.9-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-~5.9.2-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

### 📊 **Financial Overview**
- **Real-time Dashboard** - Beautiful financial summary with animated charts
- **Balance Tracking** - Total income, expenses, and net balance
- **Trend Indicators** - Visual progress indicators and percentage changes
- **Quick Actions** - Fast transaction entry with modal interface

### 💳 **Transaction Management**
- **Income & Expense Tracking** - Categorize and track all financial transactions
- **Smart Categories** - Pre-defined categories with custom icons and colors
- **Date Grouping** - Transactions organized by date for easy browsing
- **Search & Filter** - Find transactions quickly with intuitive search

### 🎯 **Budget Management**
- **Budget Creation** - Set spending limits for different categories
- **Progress Tracking** - Visual progress bars with percentage completion
- **Status Indicators** - Color-coded budget status (on track, warning, over budget)
- **Real-time Updates** - Budgets update automatically as you spend

### 🎨 **Beautiful UI/UX**
- **Modern Design** - Clean, professional interface with purple gradient theme
- **Smooth Animations** - React Native Reanimated for fluid transitions
- **Loading Screens** - Beautiful animated loading states for all screens
- **Splash Screen** - Professional app startup with custom animations
- **Dark/Light Mode** - Automatic theme switching based on system preferences

### 📱 **Cross-Platform**
- **iOS & Android** - Native performance on both platforms
- **Web Support** - Works in browsers for development and testing
- **Responsive Design** - Optimized for all screen sizes
- **Safe Area Handling** - Proper spacing for notches and status bars

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/finance-tracker.git
   cd finance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🏗️ Build for Production

### Android APK
```bash
# Build APK for testing
npm run build:android

# Or using EAS CLI directly
eas build --platform android --profile preview
```

### iOS App
```bash
# Build iOS app
npm run build:ios

# Or using EAS CLI directly
eas build --platform ios --profile preview
```

### Build All Platforms
```bash
npm run build:all
```

## 📁 Project Structure

```
finance-tracker/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Dashboard screen
│   │   ├── transactions.tsx # Transactions screen
│   │   └── budgets.tsx    # Budgets screen
│   └── _layout.tsx        # Root layout with splash screen
├── components/            # Reusable UI components
│   ├── LoadingScreen.tsx  # Loading screen component
│   ├── SplashScreen.tsx   # App splash screen
│   ├── BalanceCard.tsx    # Financial balance cards
│   ├── ModernCard.tsx     # Modern card component
│   └── ...               # Other UI components
├── hooks/                 # Custom React hooks
│   └── useFinance.ts      # Finance data management
├── lib/                   # Utility libraries
│   ├── financeStorage.ts  # AsyncStorage operations
│   └── sampleData.ts      # Sample data for demo
├── types/                 # TypeScript type definitions
│   └── finance.ts         # Finance-related types
└── constants/             # App constants
    └── theme.ts           # Theme colors and styles
```

## 🛠️ Technologies Used

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **React Native Reanimated** - Smooth animations
- **AsyncStorage** - Local data persistence
- **Expo Router** - File-based routing
- **React Navigation** - Navigation library
- **Expo Linear Gradient** - Beautiful gradients
- **React Native Safe Area Context** - Safe area handling

## 📱 Screenshots

### Dashboard
- Financial overview with balance cards
- Recent transactions list
- Top expense categories
- Quick action buttons

### Transactions
- Categorized transaction list
- Add new transactions
- Search and filter options
- Date-based grouping

### Budgets
- Budget creation and management
- Progress tracking with visual bars
- Status indicators
- Category-based budgets

## 🎨 Customization

### Theme Colors
Edit `constants/theme.ts` to customize the app's color scheme:

```typescript
export const Colors = {
  light: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    // ... other colors
  },
  dark: {
    primary: '#4c1d95',
    secondary: '#7c3aed',
    // ... other colors
  }
};
```

### Adding New Categories
Update `types/finance.ts` to add new transaction categories:

```typescript
export const DEFAULT_CATEGORIES = [
  { name: 'Food', type: 'expense', color: '#ef4444', icon: 'restaurant' },
  { name: 'Transport', type: 'expense', color: '#3b82f6', icon: 'car' },
  // ... add your categories
];
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [React Native](https://reactnative.dev/) for cross-platform development
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for smooth animations
- [Expo Vector Icons](https://docs.expo.dev/guides/icons/) for beautiful icons

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [Expo documentation](https://docs.expo.dev/)
- Review the [React Native documentation](https://reactnative.dev/docs/getting-started)

---

**Made with ❤️ using React Native and Expo**