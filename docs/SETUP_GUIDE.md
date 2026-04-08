# Setup & Deployment Guide 🛠️

Detailed instructions for setting up the Dev Walkie-Talkie environment.

## Local Development

### Requirements
-   **Node.js**: v18.0.0 or higher.
-   **NPM**: v9.0.0 or higher.

### Environment Variables
Create a `.env` file in the `frontend` directory:
```env
VITE_SIGNALING_SERVER=http://localhost:3001
```

### Protocol Note
WebRTC requires **HTTPS** for microphone access. 
-   On `localhost`, browsers allow HTTP for testing.
-   When testing on a separate device (mobile) via local IP, you may need to use an `ngrok` tunnel or a local HTTPS proxy if the browser blocks mic access over HTTP.

## Production Deployment

### Backend (Signaling)
-   Deploy to **Render**, **Railway**, or **Heroku**.
-   Ensure the `FRONTEND_URL` env variable is set to allow CORS.

### Frontend (PWA)
-   Deploy to **Vercel** or **Netlify**.
-   Static file hosting is sufficient as it's a Vite build.
-   Enable a custom domain to ensure HTTPS.

## Troubleshooting
-   **No Audio**: Check browser console for `NotAllowedError` (mic permission).
-   **Connection Failed**: Ensure both peers can reach the STUN server. In strict corporate networks, a TURN server may be required (not included in the default config).
