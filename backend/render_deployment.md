# Render Backend Deployment 🚀

This backend is a Node.js WebSocket signaling server.

## Deployment Steps on Render:

1.  **New Web Service**: Select this repository.
2.  **Root Directory**: `backend`
3.  **Build Command**: `npm install`
4.  **Start Command**: `node server.js`
5.  **Environment Variables**:
    -   `FRONTEND_URL`: Set this to your Vercel URL (e.g., `https://dev-walkie-talkie.vercel.app`) to enable CORS and secure signaling.

## Monitoring:
Once deployed, Render will provide a URL (e.g., `https://dev-walkie-talkie-backend.onrender.com`). 
**Copy this URL** and use it as the `VITE_SIGNALING_SERVER` value in your Vercel deployment.
