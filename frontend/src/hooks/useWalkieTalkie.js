/**
 * useWalkieTalkie — Main orchestration hook
 * 
 * Connects all pieces together:
 *   1. Socket connection + signaling event handlers
 *   2. WebRTC peer connection lifecycle
 *   3. Push-to-talk audio control
 *   4. Room join/leave logic
 */

import { useEffect, useCallback, useRef } from 'react';
import useStore from '../store/useStore';
import {
  connectSocket,
  disconnectSocket,
  joinRoom as socketJoinRoom,
  leaveRoom as socketLeaveRoom,
  getSocket,
} from '../services/socketService';
import {
  getLocalStream,
  setMicEnabled,
  createOffer,
  handleOffer,
  handleAnswer,
  handleIceCandidate,
  removePeer,
  closeAllConnections,
  onRemoteStream,
  onPeerStateChange,
} from '../services/webrtcService';

export default function useWalkieTalkie() {
  const {
    socketConnected,
    setSocketConnected,
    roomId,
    setRoomId,
    inRoom,
    setInRoom,
    setIsTransmitting,
    micPermission,
    setMicPermission,
    addPeer,
    updatePeerState,
    removePeer: removePeerFromStore,
    clearPeers,
    setPeerCount,
    setError,
    clearError,
    resetRoom,
  } = useStore();

  const audioElements = useRef(new Map()); // Map<peerId, HTMLAudioElement>

  // ─── Initialize Socket Connection ─────────────────────────────────
  useEffect(() => {
    const socket = connectSocket();

    socket.on('connect', () => {
      setSocketConnected(true);
      clearError();
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('connect_error', () => {
      setError('Cannot connect to server. Is the backend running?');
    });

    // ─── Room Events ──────────────────────────────────────────────────
    socket.on('room-joined', async ({ roomId: joinedRoomId, peers, peerCount }) => {
      console.log(`[Hook] Joined room "${joinedRoomId}" with ${peers.length} existing peers`);
      setInRoom(true);
      setPeerCount(peerCount);

      // Create offers for all existing peers in the room
      for (const peerId of peers) {
        addPeer(peerId);
        await createOffer(peerId);
      }
    });

    socket.on('user-joined', async ({ peerId, peerCount }) => {
      console.log('[Hook] New peer joined:', peerId);
      addPeer(peerId);
      setPeerCount(peerCount);
      // The new peer will send us an offer — we just wait for it
    });

    socket.on('user-left', ({ peerId, peerCount }) => {
      console.log('[Hook] Peer left:', peerId);
      removePeer(peerId);
      removePeerFromStore(peerId);
      setPeerCount(peerCount);

      // Clean up audio element
      const audioEl = audioElements.current.get(peerId);
      if (audioEl) {
        audioEl.srcObject = null;
        audioEl.remove();
        audioElements.current.delete(peerId);
      }
    });

    // ─── WebRTC Signaling Events ──────────────────────────────────────
    socket.on('offer', async ({ from, offer }) => {
      await handleOffer(from, offer);
    });

    socket.on('answer', async ({ from, answer }) => {
      await handleAnswer(from, answer);
    });

    socket.on('ice-candidate', async ({ from, candidate }) => {
      await handleIceCandidate(from, candidate);
    });

    socket.on('error', ({ message }) => {
      setError(message);
    });

    // ─── Remote Stream Handler ────────────────────────────────────────
    // When a remote peer's audio arrives, play it through an <audio> element
    onRemoteStream((peerId, stream) => {
      console.log('[Hook] Playing remote audio from:', peerId);
      
      let audioEl = audioElements.current.get(peerId);
      if (!audioEl) {
        audioEl = new Audio();
        audioEl.autoplay = true;
        audioEl.playsInline = true;
        // Some browsers need the element in the DOM to play
        audioEl.style.display = 'none';
        document.body.appendChild(audioEl);
        audioElements.current.set(peerId, audioEl);
      }
      audioEl.srcObject = stream;
      audioEl.play().catch(err => {
        console.warn('[Hook] Audio autoplay blocked:', err);
      });
    });

    // ─── Peer State Change Handler ────────────────────────────────────
    onPeerStateChange((peerId, state) => {
      updatePeerState(peerId, state);
    });

    // ─── Cleanup on unmount ───────────────────────────────────────────
    return () => {
      closeAllConnections();
      disconnectSocket();
      audioElements.current.forEach((el) => {
        el.srcObject = null;
        el.remove();
      });
      audioElements.current.clear();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Join Room ────────────────────────────────────────────────────
  const joinRoomHandler = useCallback(async (id) => {
    if (!id?.trim()) {
      setError('Please enter a room ID');
      return;
    }

    clearError();

    try {
      // Request microphone permission
      await getLocalStream();
      setMicPermission('granted');
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setMicPermission('denied');
        setError('Microphone access denied. Please allow microphone access to use walkie-talkie.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.');
      } else {
        setError('Failed to access microphone: ' + err.message);
      }
      return;
    }

    // Join the room via signaling server
    socketJoinRoom(id.trim());
  }, [setMicPermission, setError, clearError]);

  // ─── Leave Room ───────────────────────────────────────────────────
  const leaveRoomHandler = useCallback(() => {
    socketLeaveRoom();
    closeAllConnections();
    
    // Clean up audio elements
    audioElements.current.forEach((el) => {
      el.srcObject = null;
      el.remove();
    });
    audioElements.current.clear();

    resetRoom();
  }, [resetRoom]);

  // ─── Push-to-Talk Controls ────────────────────────────────────────
  const startTransmitting = useCallback(() => {
    setMicEnabled(true);
    setIsTransmitting(true);
  }, [setIsTransmitting]);

  const stopTransmitting = useCallback(() => {
    setMicEnabled(false);
    setIsTransmitting(false);
  }, [setIsTransmitting]);

  return {
    joinRoom: joinRoomHandler,
    leaveRoom: leaveRoomHandler,
    startTransmitting,
    stopTransmitting,
  };
}
