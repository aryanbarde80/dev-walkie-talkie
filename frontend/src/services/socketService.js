/**
 * Socket Service — WebSocket Connection Manager
 * 
 * Handles connection to the signaling server with:
 *   - Auto-reconnection with exponential backoff
 *   - Clean disconnection
 *   - Event-based architecture
 */

import { io } from 'socket.io-client';

// Server URL — defaults to localhost for development
const SIGNALING_SERVER = import.meta.env.VITE_SIGNALING_SERVER || 'http://localhost:3001';

let socket = null;

/**
 * Connect to the signaling server.
 * Returns the socket instance for event binding.
 */
export function connectSocket() {
  if (socket?.connected) return socket;

  socket = io(SIGNALING_SERVER, {
    transports: ['websocket', 'polling'], // Prefer WebSocket, fallback to polling
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.warn('[Socket] Disconnected:', reason);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
  });

  return socket;
}

/**
 * Get the current socket instance (may not be connected)
 */
export function getSocket() {
  return socket;
}

/**
 * Disconnect from the signaling server
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Join a room on the signaling server
 */
export function joinRoom(roomId) {
  if (!socket?.connected) {
    console.error('[Socket] Cannot join room — not connected');
    return;
  }
  socket.emit('join-room', { roomId });
}

/**
 * Leave the current room
 */
export function leaveRoom() {
  if (!socket?.connected) return;
  socket.emit('leave-room');
}

/**
 * Send an SDP offer to a specific peer
 */
export function sendOffer(to, offer) {
  socket?.emit('offer', { to, offer });
}

/**
 * Send an SDP answer to a specific peer
 */
export function sendAnswer(to, answer) {
  socket?.emit('answer', { to, answer });
}

/**
 * Send an ICE candidate to a specific peer
 */
export function sendIceCandidate(to, candidate) {
  socket?.emit('ice-candidate', { to, candidate });
}
