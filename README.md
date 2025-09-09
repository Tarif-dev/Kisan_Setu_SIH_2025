# Kisan Setu - SIH 2025

A clean React Native Expo app for farmers, built for Smart India Hackathon 2025.

## Project Structure

```
├── app/                    # Main application code using Expo Router
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── explore.tsx    # Explore screen
│   │   └── _layout.tsx    # Tab layout configuration
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 page
├── assets/                # Static assets
│   └── images/           # App icons and images
├── components/           # Reusable UI components
│   ├── ExternalLink.tsx  # External link component
│   └── Loading.tsx       # Loading component
└── Configuration files...
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Run on different platforms:
   ```bash
   npm run android   # Android device/emulator
   npm run ios       # iOS device/simulator
   npm run web       # Web browser
   ```

## Features

- Clean and minimal setup
- Tab-based navigation
- TailwindCSS support with NativeWind
- TypeScript support
- Cross-platform (iOS, Android, Web)

## Development

This project uses:

- **Expo Router** for file-based routing
- **NativeWind** for TailwindCSS styling
- **TypeScript** for type safety
- **React Native** for cross-platform development

Start building your Kisan Setu features from this clean foundation!
