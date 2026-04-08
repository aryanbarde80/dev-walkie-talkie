/**
 * WebRTC Service — Peer Connection Manager
 * 
 * Manages WebRTC peer connections for real-time audio streaming.
 * 
 * Architecture:
 *   - Each peer gets its own RTCPeerConnection
 *   - Connections stored in a Map<peerId, RTCPeerConnection>
 *   - Local audio stream is shared across all connections
 *   - Audio tracks are enabled/disabled for push-to-talk (not stream removal)
 * 
 * STUN/TURN servers handle NAT traversal for reliable connectivity.
 */

import { sendOffer, sendAnswer, sendIceCandidate } from './socketService';

// ─── ICE Server Configuration ────────────────────────────────────────
// Using public STUN servers + optional TURN for NAT traversal
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 10,
};

// ─── State ───────────────────────────────────────────────────────────
const peerConnections = new Map(); // Map<peerId, RTCPeerConnection>
let localStream = null;
let onRemoteStreamCallback = null;
let onPeerStateChangeCallback = null;

// Pending ICE candidates for peers whose connections aren't fully set up yet
const pendingCandidates = new Map(); // Map<peerId, RTCIceCandidate[]>

/**
 * Set callback for when a remote audio stream is received
 */
export function onRemoteStream(callback) {
  onRemoteStreamCallback = callback;
}

/**
 * Set callback for peer connection state changes
 */
export function onPeerStateChange(callback) {
  onPeerStateChangeCallback = callback;
}

/**
 * Acquire the local microphone stream.
 * Optimized for voice with echo cancellation, noise suppression, and auto gain control.
 */
export async function getLocalStream() {
  if (localStream) return localStream;

  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
        channelCount: 1, // Mono for voice
      },
      video: false,
    });

    // Start with audio tracks DISABLED (push-to-talk off by default)
    localStream.getAudioTracks().forEach(track => {
      track.enabled = false;
    });

    return localStream;
  } catch (err) {
    console.error('[WebRTC] Failed to get microphone:', err);
    throw err;
  }
}

/**
 * Enable or disable the local audio track (push-to-talk toggle).
 * This doesn't stop/start the stream — just mutes/unmutes.
 */
export function setMicEnabled(enabled) {
  if (!localStream) return;
  localStream.getAudioTracks().forEach(track => {
    track.enabled = enabled;
  });
}

/**
 * Create a new RTCPeerConnection for a specific peer.
 * Handles ICE candidate gathering and remote stream events.
 */
function createPeerConnection(peerId) {
  // Clean up existing connection if any
  if (peerConnections.has(peerId)) {
    peerConnections.get(peerId).close();
  }

  const pc = new RTCPeerConnection(ICE_SERVERS);

  // ─── ICE Candidate Handling ────────────────────────────────────────
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      sendIceCandidate(peerId, event.candidate);
    }
  };

  pc.onicecandidateerror = (event) => {
    // Only log non-trivial errors (some STUN failures are expected)
    if (event.errorCode !== 701) {
      console.warn('[WebRTC] ICE candidate error:', event);
    }
  };

  // ─── Remote Stream Handling ────────────────────────────────────────
  pc.ontrack = (event) => {
    console.log('[WebRTC] Remote track received from:', peerId);
    const [remoteStream] = event.streams;
    if (remoteStream && onRemoteStreamCallback) {
      onRemoteStreamCallback(peerId, remoteStream);
    }
  };

  // ─── Connection State Monitoring ───────────────────────────────────
  pc.onconnectionstatechange = () => {
    console.log(`[WebRTC] Peer ${peerId} connection state:`, pc.connectionState);
    onPeerStateChangeCallback?.(peerId, pc.connectionState);

    // Auto-cleanup failed/disconnected peers
    if (pc.connectionState === 'failed') {
      console.warn(`[WebRTC] Connection to ${peerId} failed, attempting restart`);
      restartIce(peerId);
    }
  };

  pc.oniceconnectionstatechange = () => {
    console.log(`[WebRTC] Peer ${peerId} ICE state:`, pc.iceConnectionState);
    if (pc.iceConnectionState === 'disconnected') {
      // Give it a moment to recover before restarting
      setTimeout(() => {
        if (pc.iceConnectionState === 'disconnected') {
          restartIce(peerId);
        }
      }, 3000);
    }
  };

  // ─── Add local tracks to the connection ────────────────────────────
  if (localStream) {
    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });
  }

  peerConnections.set(peerId, pc);

  // Process any pending ICE candidates
  const pending = pendingCandidates.get(peerId);
  if (pending) {
    pending.forEach(candidate => {
      pc.addIceCandidate(candidate).catch(console.error);
    });
    pendingCandidates.delete(peerId);
  }

  return pc;
}

/**
 * Attempt ICE restart for a peer connection
 */
async function restartIce(peerId) {
  const pc = peerConnections.get(peerId);
  if (!pc) return;

  try {
    const offer = await pc.createOffer({ iceRestart: true });
    await pc.setLocalDescription(offer);
    sendOffer(peerId, offer);
    console.log('[WebRTC] ICE restart initiated for:', peerId);
  } catch (err) {
    console.error('[WebRTC] ICE restart failed:', err);
  }
}

/**
 * Create and send an SDP offer to a peer.
 * Called by the joining client for each existing peer in the room.
 */
export async function createOffer(peerId) {
  const pc = createPeerConnection(peerId);

  try {
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: false,
    });
    await pc.setLocalDescription(offer);
    sendOffer(peerId, offer);
    console.log('[WebRTC] Offer sent to:', peerId);
  } catch (err) {
    console.error('[WebRTC] Failed to create offer:', err);
  }
}

/**
 * Handle an incoming SDP offer from a peer.
 * Creates an answer and sends it back.
 */
export async function handleOffer(peerId, offer) {
  const pc = createPeerConnection(peerId);

  try {
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    sendAnswer(peerId, answer);
    console.log('[WebRTC] Answer sent to:', peerId);
  } catch (err) {
    console.error('[WebRTC] Failed to handle offer:', err);
  }
}

/**
 * Handle an incoming SDP answer from a peer.
 */
export async function handleAnswer(peerId, answer) {
  const pc = peerConnections.get(peerId);
  if (!pc) {
    console.warn('[WebRTC] No connection for answer from:', peerId);
    return;
  }

  try {
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    console.log('[WebRTC] Answer received from:', peerId);
  } catch (err) {
    console.error('[WebRTC] Failed to handle answer:', err);
  }
}

/**
 * Handle an incoming ICE candidate from a peer.
 */
export async function handleIceCandidate(peerId, candidate) {
  const pc = peerConnections.get(peerId);

  if (!pc) {
    // Queue the candidate — connection may not exist yet
    if (!pendingCandidates.has(peerId)) {
      pendingCandidates.set(peerId, []);
    }
    pendingCandidates.get(peerId).push(new RTCIceCandidate(candidate));
    return;
  }

  try {
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (err) {
    console.error('[WebRTC] Failed to add ICE candidate:', err);
  }
}

/**
 * Remove a specific peer connection (on user-left)
 */
export function removePeer(peerId) {
  const pc = peerConnections.get(peerId);
  if (pc) {
    pc.close();
    peerConnections.delete(peerId);
    pendingCandidates.delete(peerId);
    console.log('[WebRTC] Peer removed:', peerId);
  }
}

/**
 * Close all peer connections and release the local stream.
 * Called when leaving a room.
 */
export function closeAllConnections() {
  peerConnections.forEach((pc, peerId) => {
    pc.close();
    console.log('[WebRTC] Closed connection to:', peerId);
  });
  peerConnections.clear();
  pendingCandidates.clear();

  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
}

/**
 * Get the number of active peer connections
 */
export function getPeerCount() {
  return peerConnections.size;
}
