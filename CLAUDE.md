# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BARO is an AR-based real-time price comparison React Native app that allows users to scan products and labels with their camera to get real-time price comparisons. The app uses AR technology to overlay price information directly onto the camera view.

## Project Structure

This is a monorepo with two main directories:
- `baro_app/` - React Native mobile application
- `baro_server/` - Backend server (if applicable)

The main React Native app is located in `baro_app/` with the following structure:
- `src/screens/` - Screen components (HomeScreen, ARScreen, ScanScreen, ResultScreen)
- `src/navigation/` - Navigation configuration using React Navigation
- `src/components/` - Reusable UI components
- `src/services/` - API and external service integration
- `src/utils/` - Utility functions
- `src/assets/` - Images, fonts, and other resources
- `src/types/` - TypeScript type definitions

## Development Commands

All commands should be run from the `baro_app/` directory:

### Setup
```bash
# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install
# or using bundle
bundle install
bundle exec pod install
```

### Development
```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Lint code
npm run lint

# Run tests
npm test
```

## Key Technologies

- **React Native 0.72.7** with TypeScript
- **React Navigation** (native stack) for navigation
- **@reactvision/react-viro** for AR functionality
- **react-native-vision-camera** for camera features
- **react-native-camera** for basic camera functionality
- **react-native-reanimated** and **react-native-gesture-handler** for animations
- **@react-native-async-storage/async-storage** for local storage

## AR Implementation

The AR functionality is implemented using:
- ViroReact (`@reactvision/react-viro`) for AR scene rendering
- AR plane detection for placing virtual objects
- Real-time product information overlay

## iOS Specific Notes

- Uses CocoaPods for dependency management
- Requires iOS 13.0+ 
- Uses bundle for Ruby gem management
- AR features require ARKit support

## Navigation Structure

The app uses a stack navigator with these main screens:
- Home - Main landing screen with scan options
- AR - AR-based price comparison view
- Scan - Product scanning interface
- Result - Price comparison results

## Testing

- Uses Jest for unit testing
- Test files located in `__tests__/` directory
- Run tests with `npm test`