# Vercel Frontend Deployment 🚀

This frontend is a React PWA built with Vite.

## Deployment Steps on Vercel:

1.  **Import Project**: Select this repository.
2.  **Root Directory**: `frontend`
3.  **Framework Preset**: **Vite** (Automatically detected).
4.  **Build Command**: `npm run build`
5.  **Output Directory**: `dist`
6.  **Environment Variables**:
    -   `VITE_SIGNALING_SERVER`: Set this to your deployed Render URL (e.g., `https://dev-walkie-talkie-backend.onrender.com`).

## PWA Notes:
-   The `vercel.json` file is included to ensure that `sw.js` (Service Worker) is served with correct headers and that SPA routing works correctly.
-   Ensure you access the site via **HTTPS** to enable the microphone and PWA features.
