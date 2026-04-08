# PWA Features & Offline Support 📲

Dev Walkie-Talkie is designed to function as a native-quality application on mobile devices.

## Features

### 1. Standalone Mode
Using the `manifest.json`, the app removes browser chrome (URL bar, navigation buttons) when installed, providing more screen real estate for the PTT button.

### 2. Service Worker (`sw.js`)
We use a **Cache-First** strategy for static assets:
- **Assets Cached**: JS bundles, CSS, fonts, icons, and the offline page.
- **Expiration**: The cache is versioned and cleared automatically on updates.

### 3. Offline Fallback
If the user opens the app without an internet connection, the service worker serves `offline.html` instead of a generic browser error. This page is styled to match the app's dark aesthetic.

### 4. Background Audio
WebRTC streams can continue in many mobile browsers even if the screen is locked, enabling true walkie-talkie functionality (browser implementation varies).

## Configuration
The PWA settings are located in:
- `frontend/public/manifest.json`
- `frontend/public/sw.js`
- `frontend/index.html` (meta tags)
