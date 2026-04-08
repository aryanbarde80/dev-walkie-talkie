/**
 * Dev Walkie-Talkie — WebRTC Signaling Server
 * 
 * This server is responsible for:
 *   1. Room management (create/join/leave)
 *   2. Peer discovery within rooms
 *   3. WebRTC signaling relay (SDP offer/answer, ICE candidates)
 * 
 * It does NOT handle any media — all audio streams flow peer-to-peer via WebRTC.
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

// CORS configuration — allow the frontend dev server and deployed origins
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  process.env.FRONTEND_URL
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true
  },
  // Performance: reduce ping interval for lower latency detection
  pingInterval: 10000,
  pingTimeout: 5000,
  // Allow binary data for potential future features
  maxHttpBufferSize: 1e6
});

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

// ─── In-memory Room Store ────────────────────────────────────────────────
// Structure: Map<roomId, Set<socketId>>
const rooms = new Map();

// Track which room each socket belongs to for clean disconnection
const socketRoomMap = new Map(); // Map<socketId, roomId>

// ─── Health check endpoint ───────────────────────────────────────────────
app.get('/health', (req, res) => {
  const roomStats = {};
  rooms.forEach((peers, roomId) => {
    roomStats[roomId] = peers.size;
  });
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    rooms: Object.keys(roomStats).length,
    totalConnections: io.engine.clientsCount,
    roomDetails: roomStats
  });
});

// ─── Socket.IO Connection Handling ───────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[CONNECT] ${socket.id} connected`);

  /**
   * JOIN ROOM
   * Client sends: { roomId: string }
   * Server:
   *   1. Adds socket to the room
   *   2. Sends existing peer list back to the joining client
   *   3. Notifies all existing peers about the new user
   */
  socket.on('join-room', ({ roomId }) => {
    if (!roomId || typeof roomId !== 'string') {
      socket.emit('error', { message: 'Invalid room ID' });
      return;
    }

    const sanitizedRoomId = roomId.trim().toLowerCase();

    // Leave previous room if any
    const previousRoom = socketRoomMap.get(socket.id);
    if (previousRoom) {
      leaveRoom(socket, previousRoom);
    }

    // Create room if it doesn't exist
    if (!rooms.has(sanitizedRoomId)) {
      rooms.set(sanitizedRoomId, new Set());
    }

    const room = rooms.get(sanitizedRoomId);

    // Get existing peers BEFORE adding the new one
    const existingPeers = Array.from(room);

    // Add socket to room
    room.add(socket.id);
    socketRoomMap.set(socket.id, sanitizedRoomId);
    socket.join(sanitizedRoomId);

    console.log(`[JOIN] ${socket.id} joined room "${sanitizedRoomId}" (${room.size} peers)`);

    // Send the list of existing peers to the joining client
    // The joining client will create offers for each existing peer
    socket.emit('room-joined', {
      roomId: sanitizedRoomId,
      peers: existingPeers,
      peerCount: room.size
    });

    // Notify existing peers about the new user
    socket.to(sanitizedRoomId).emit('user-joined', {
      peerId: socket.id,
      peerCount: room.size
    });
  });

  /**
   * WEBRTC SIGNALING: SDP Offer
   * Relay an SDP offer from one peer to another
   */
  socket.on('offer', ({ to, offer }) => {
    if (!to || !offer) return;
    console.log(`[SIGNAL] Offer from ${socket.id} to ${to}`);
    io.to(to).emit('offer', {
      from: socket.id,
      offer
    });
  });

  /**
   * WEBRTC SIGNALING: SDP Answer
   * Relay an SDP answer from one peer to another
   */
  socket.on('answer', ({ to, answer }) => {
    if (!to || !answer) return;
    console.log(`[SIGNAL] Answer from ${socket.id} to ${to}`);
    io.to(to).emit('answer', {
      from: socket.id,
      answer
    });
  });

  /**
   * WEBRTC SIGNALING: ICE Candidate
   * Relay ICE candidates between peers for NAT traversal
   */
  socket.on('ice-candidate', ({ to, candidate }) => {
    if (!to || !candidate) return;
    io.to(to).emit('ice-candidate', {
      from: socket.id,
      candidate
    });
  });

  /**
   * LEAVE ROOM
   * Explicit room leave (e.g., user clicks "Leave")
   */
  socket.on('leave-room', () => {
    const roomId = socketRoomMap.get(socket.id);
    if (roomId) {
      leaveRoom(socket, roomId);
    }
  });

  /**
   * DISCONNECT
   * Clean up when a socket disconnects (browser close, network drop, etc.)
   */
  socket.on('disconnect', (reason) => {
    console.log(`[DISCONNECT] ${socket.id} disconnected (${reason})`);
    const roomId = socketRoomMap.get(socket.id);
    if (roomId) {
      leaveRoom(socket, roomId);
    }
  });
});

/**
 * Helper: Remove a socket from a room and notify remaining peers
 */
function leaveRoom(socket, roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.delete(socket.id);
  socketRoomMap.delete(socket.id);
  socket.leave(roomId);

  console.log(`[LEAVE] ${socket.id} left room "${roomId}" (${room.size} remaining)`);

  // Notify remaining peers
  socket.to(roomId).emit('user-left', {
    peerId: socket.id,
    peerCount: room.size
  });

  // Clean up empty rooms to prevent memory leaks
  if (room.size === 0) {
    rooms.delete(roomId);
    console.log(`[CLEANUP] Room "${roomId}" deleted (empty)`);
  }
}

// ─── Start Server ────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🎙️  Dev Walkie-Talkie Signaling Server`);
  console.log(`   Running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});
