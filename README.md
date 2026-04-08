# Dev Walkie-Talkie 🎙️

A production-grade Progressive Web App for real-time push-to-talk voice communication using WebRTC.

![Dev Walkie-Talkie](frontend/public/favicon.svg)

## Features

- **Real-time Voice Communication** — Peer-to-peer audio streaming via WebRTC
- **Push-to-Talk** — Hold button to speak, release to stop
- **Room-based System** — Join rooms using a room ID
- **Low Latency** — Target <300ms with direct P2P audio
- **Multi-peer Support** — Multiple users in the same room
- **Mobile-first PWA** — Installable on any device
- **Offline Fallback** — Service Worker with static asset caching
- **Dark Developer Theme** — Premium glassmorphism UI

## Architecture

```
┌─────────────┐    WebSocket     ┌──────────────────┐    WebSocket     ┌─────────────┐
│   Client A  │◄────────────────►│  Signaling Server │◄────────────────►│   Client B  │
│  (React PWA)│                  │  (Node.js + WS)   │                  │  (React PWA)│
└──────┬──────┘                  └──────────────────┘                  └──────┬──────┘
       │                                                                       │
       │                    WebRTC (Peer-to-Peer Audio)                       │
       └───────────────────────────────────────────────────────────────────────┘
```

The signaling server only handles:
- Room management (join/leave)
- Peer discovery
- WebRTC signaling (SDP offer/answer, ICE candidates)

**All audio streams flow directly peer-to-peer** — the server never touches audio data.

## Tech Stack

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | React 19 + Vite 8               |
| Styling   | TailwindCSS v4                  |
| State     | Zustand                         |
| Realtime  | WebRTC + Socket.IO              |
| Backend   | Node.js + Express + Socket.IO   |
| PWA       | Service Worker + Web Manifest   |

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### 1. Start the Signaling Server

```bash
cd backend
npm install
npm start
```

The server starts on `http://localhost:3001`.

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

### 3. Test with Multiple Devices

Open the app in two browser tabs (or on your phone via the network URL shown in the terminal). Both users should:

1. Enter the same room ID
2. Click "Join Channel"
3. Allow microphone access
4. Hold the PTT button to speak

## Project Structure

```
dev-walkie-talkie/
├── backend/
│   ├── server.js              # WebSocket signaling server
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── manifest.json      # PWA manifest
│   │   ├── sw.js              # Service worker
│   │   ├── offline.html       # Offline fallback page
│   │   ├── favicon.svg        # App favicon
│   │   ├── icon-192.png       # PWA icon 192x192
│   │   └── icon-512.png       # PWA icon 512x512
│   ├── src/
│   │   ├── components/
│   │   │   ├── StatusBar.jsx      # Connection status bar
│   │   │   ├── JoinRoom.jsx       # Room join/leave UI
│   │   │   ├── PushToTalkButton.jsx # PTT button with animations
│   │   │   ├── PeerList.jsx       # Connected peers display
│   │   │   └── ErrorBanner.jsx    # Error notifications
│   │   ├── hooks/
│   │   │   └── useWalkieTalkie.js # Main orchestration hook
│   │   ├── services/
│   │   │   ├── socketService.js   # WebSocket connection manager
│   │   │   └── webrtcService.js   # WebRTC peer connection manager
│   │   ├── store/
│   │   │   └── useStore.js        # Zustand global state
│   │   ├── App.jsx                # Root component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Design system + TailwindCSS
│   ├── .env                       # Environment variables
│   ├── vite.config.js             # Vite configuration
│   └── package.json
└── README.md
```

## WebRTC Flow

1. User A joins room → Server sends existing peer list
2. User A creates SDP offers for each existing peer
3. Existing peers receive offers → create SDP answers
4. ICE candidates are exchanged for NAT traversal
5. P2P audio connection is established
6. Push-to-talk enables/disables the audio track (stream stays open)

## Deployment

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Deploy the `dist/` folder
```

Set the `VITE_SIGNALING_SERVER` environment variable to your deployed backend URL.

### Backend (Render / Railway)
Deploy `backend/` as a Node.js service. Set `FRONTEND_URL` environment variable to your deployed frontend URL for CORS.

## Edge Cases Handled

- ✅ WebSocket auto-reconnection with exponential backoff
- ✅ Peer disconnection cleanup
- ✅ ICE restart on connection failure
- ✅ Echo cancellation + noise suppression
- ✅ Graceful microphone permission handling
- ✅ Pending ICE candidate queue
- ✅ Empty room cleanup (memory leak prevention)
- ✅ Offline fallback page

## License

MIT
