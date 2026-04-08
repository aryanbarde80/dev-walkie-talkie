# Deployment Guide 🚀

This document provides a step-by-step guide to deploying the Dev Walkie-Talkie project to production.

## 1. Backend (Signaling Server)

The backend is a Node.js server using Socket.IO. It can be deployed to any cloud provider that supports WebSockets.

### Recommended Providers:
- **Render** (Easy "Web Service" setup)
- **Railway** (Great for Node.js apps)
- **DigitalOcean App Platform**

### Deployment Steps:
1. Connect your GitHub repository to the provider.
2. Set the root directory to `backend`.
3. Set the build command: `npm install`
4. Set the start command: `node server.js`
5. **Environment Variables**:
   - `PORT`: Usually handled by the platform (default 3001).
   - `FRONTEND_URL`: The URL of your deployed frontend (e.g., `https://dev-walkie-talkie.vercel.app`) to handle CORS.

---

## 2. Frontend (React PWA)

The frontend is a static Vite build. It must be served over **HTTPS** for WebRTC (microphone access) to work.

### Recommended Providers:
- **Vercel** (Seamless Vite integration)
- **Netlify**
- **GitHub Pages**

### Deployment Steps:
1. Connect your GitHub repository.
2. Set the root directory to `frontend`.
3. Set the build command: `npm run build`
4. Set the output directory: `dist`
5. **Environment Variables**:
   - `VITE_SIGNALING_SERVER`: The URL of your deployed backend (e.g., `https://dev-walkie-talkie-server.onrender.com`).

---

## 3. Post-Deployment Checklist

### SSL/HTTPS
- Ensure the frontend is served via HTTPS. Browsers **will block** microphone access on non-secure origins (excluding `localhost`).

### STUN Servers
- The default configuration uses Google's public STUN servers. For high-traffic production use or strict enterprise firewalls, consider setting up a dedicated **TURN server** (e.g., using Twilio Network Traversal or a self-hosted Coturn server) in `webrtcService.js`.

### PWA Validation
- Open the deployed URL.
- Inspect using Chrome DevTools -> Application -> Manifest/Service Workers to ensure the PWA is recognized and installable.
- Run a Lighthouse report to verify PWA compliance.

---

## 📈 Monitoring
- Check backend logs for persistent connection errors.
- Ensure CORS errors aren't appearing in the frontend console after setting `FRONTEND_URL`.
