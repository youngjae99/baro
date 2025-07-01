# BARO - AR-based Real-time Price Comparison React Native App

A mobile application that uses AR technology to provide real-time price comparisons when users scan products and labels with their camera.

## Project Structure

```
src/
├── screens/      # Screen components
├── components/   # Reusable components
├── navigation/   # Navigation configuration
├── services/     # API and external service integration
├── utils/        # Utility functions
└── assets/       # Images, fonts, and other resources
```

## Installed Key Packages

### Navigation
- `@react-navigation/native`: Core navigation library
- `@react-navigation/native-stack`: Stack navigation
- `react-native-screens`: Navigation performance optimization
- `react-native-safe-area-context`: Safe area management

### Camera and AR
- `react-native-camera`: Basic camera functionality
- `react-native-vision-camera`: High-performance camera features

### State Management and Storage
- `@react-native-async-storage/async-storage`: Local data storage

### Animation and Gestures
- `react-native-reanimated`: High-performance animations
- `react-native-gesture-handler`: Gesture handling

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- Xcode for iOS development (macOS)
- Android Studio for Android development

### Installation and Running

1. Install dependencies
```bash
npm install
```

2. Install iOS dependencies (macOS)
```bash
cd ios && pod install
```

3. Run the app
```bash
# iOS
npm run ios

# Android
npm run android
```

## Key Features

- AR-based product scanning
- Real-time price comparison
- Product information storage
- Price alert settings
- User reviews and ratings

## Development Environment

- React Native 0.79.2
- TypeScript
- iOS 13.0+
- Android 6.0+

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
