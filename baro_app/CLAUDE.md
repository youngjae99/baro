# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BARO is an AR-based real-time price comparison React Native app built with Expo SDK 53. The app allows users to scan products using multiple methods (barcode/QR codes, OCR text recognition, and image recognition) and displays real-time price comparisons with AR overlays. The app prioritizes performance with sub-1-second response times and immediate camera activation on launch.

## Architecture

This is an Expo managed workflow project with the following key architectural decisions:

- **Expo Router**: File-based routing system using the `app/` directory structure
- **Tab Navigation**: Bottom tab navigation with Home and Explore tabs via `(tabs)` route group
- **Theming System**: Light/dark theme support with custom themed components (`ThemedText`, `ThemedView`)
- **TypeScript**: Strict TypeScript configuration with path mapping (`@/*` aliases)
- **Component Organization**: Reusable UI components in `/components` with platform-specific variants

## Development Commands

All commands should be run from the project root (`baro_app/`):

### Setup
```bash
# Install dependencies
pnpm install

# For development builds (if needed)
npx expo install
```

### Development
```bash
# Start development server
expo start
# or
pnpm start

# Run on specific platforms
expo start --ios
expo start --android
expo start --web

# Using npm scripts
pnpm run ios
pnpm run android
pnpm run web
```

### Code Quality
```bash
# Lint code
expo lint
# or
pnpm run lint
```

### Project Management
```bash
# Reset to blank project (moves current code to app-example/)
pnpm run reset-project
```

## Key Technologies

### Core Framework
- **Expo SDK 53** with new architecture enabled
- **React 19.0.0** with React Native 0.79.4
- **Expo Router 5.1** for file-based navigation
- **TypeScript 5.8** with strict mode enabled

### Camera & AR Features
- **Expo Camera 16.1** for camera functionality and barcode scanning
- **Expo Barcode Scanner 13.0** for QR/barcode recognition
- **@react-native-ml-kit/text-recognition** for OCR text extraction
- **React Native Vision Camera 4.7** for advanced camera features
- **Expo GL & Three.js** for AR overlays and 3D rendering

### Performance & Storage
- **AsyncStorage** for local caching and scan history
- **NetInfo** for network connectivity detection
- **React Native Reanimated 3.17** for smooth AR animations
- **Expo Haptics** for tactile feedback

## Project Structure

```
app/                    # Expo Router file-based routing
├── camera.tsx         # Main camera screen (app entry point)
├── results.tsx        # Price comparison results screen
├── scan-history.tsx   # Scan history screen
├── index.tsx          # Redirect to camera screen
├── (tabs)/            # Tab navigation group (secondary)
│   ├── _layout.tsx    # Tab navigator configuration
│   ├── index.tsx      # Home tab screen
│   └── explore.tsx    # Explore tab screen
├── _layout.tsx        # Root layout with navigation stack
└── +not-found.tsx     # 404 screen

components/            # Reusable UI components
├── AROverlay.tsx      # Real-time AR price overlay component
├── ui/               # Platform-specific UI components
│   ├── IconSymbol.tsx         # Cross-platform icon component
│   ├── IconSymbol.ios.tsx     # iOS-specific icons
│   ├── TabBarBackground.tsx   # Tab bar styling
│   └── TabBarBackground.ios.tsx
├── ThemedText.tsx    # Theme-aware text component
├── ThemedView.tsx    # Theme-aware view component
└── [other components]

services/              # Business logic and API services
├── priceService.ts    # Price comparison API with caching
└── textRecognition.ts # OCR text processing and extraction

hooks/                # Custom React hooks
├── useColorScheme.ts      # Color scheme detection
├── useColorScheme.web.ts  # Web-specific color scheme
└── useThemeColor.ts       # Theme color resolution

constants/
└── Colors.ts         # Theme color definitions
```

## Theme System

The app implements a comprehensive theming system:

- `useColorScheme()` hook detects system theme preference
- `useThemeColor()` hook resolves colors based on current theme
- `ThemedText` and `ThemedView` components automatically adapt to theme
- Platform-specific implementations for iOS/Android/web differences

## Development Patterns

- **File-based Routing**: Use the `app/` directory structure for navigation
- **Route Groups**: Use `(groupName)` folders for shared layouts without affecting URL structure
- **Platform Files**: Use `.ios.tsx`, `.android.tsx`, `.web.tsx` extensions for platform-specific code
- **Theme-aware Components**: Extend `ThemedText` and `ThemedView` for consistent theming
- **TypeScript Paths**: Use `@/` imports for cleaner relative imports

## Core Features

### Multi-Modal Product Scanning
1. **Barcode/QR Code Scanning**: Real-time recognition using Expo Camera
2. **OCR Text Recognition**: ML Kit text extraction from product labels
3. **Image Recognition**: Visual product identification (placeholder implementation)

### AR Price Overlay System
- Real-time price comparison display overlayed on camera view
- Animated AR components with smooth transitions
- Best price highlighting with store availability status
- Performance-optimized rendering (sub-1-second response)

### Performance Optimizations
- Aggressive caching with 5-minute expiration
- Pre-loading of popular products
- Network connectivity detection with offline fallback
- Response time monitoring and logging

### Data Management
- Scan history storage with AsyncStorage
- Price comparison caching for faster responses
- OCR text processing and product information extraction

## Navigation Structure

- **Camera-First Design**: App launches directly into camera mode
- Root stack navigator with camera, results, and history screens
- Secondary tab navigation (accessible but not primary)
- Haptic feedback for all user interactions

## Development Patterns

### Camera Integration
- Immediate camera activation on app launch
- Multi-mode scanning (barcode, text, image) with mode switching
- Photo capture for OCR and image recognition
- Real-time barcode scanning with debounced results

### AR Overlay Implementation
- Positioned overlay components with target-based positioning
- Animated entry/exit transitions using React Native Reanimated
- Price data visualization with store comparison
- Touch-through interactions for camera controls

### Performance Considerations
- API timeout of 800ms for price fetching
- Cache-first data strategy
- Background preloading of popular products
- Optimized image capture quality (0.8) for faster processing