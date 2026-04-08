/**
 * Zustand Store — Global Application State
 * 
 * Centralized state for:
 *   - Connection status (socket, room)
 *   - Room info and peer list
 *   - Audio state (transmitting, mic permission)
 *   - UI state (speaking indicators)
 */

import { create } from 'zustand';

const useStore = create((set, get) => ({
  // ─── Connection State ─────────────────────────────────────────────
  socketConnected: false,
  setSocketConnected: (connected) => set({ socketConnected: connected }),

  // ─── Room State ───────────────────────────────────────────────────
  roomId: '',
  setRoomId: (roomId) => set({ roomId }),
  
  inRoom: false,
  setInRoom: (inRoom) => set({ inRoom }),

  // ─── Peer State ───────────────────────────────────────────────────
  // Map of peerId → { state: 'connecting' | 'connected' | 'disconnected', isSpeaking: boolean }
  peers: {},
  
  addPeer: (peerId) => set((state) => ({
    peers: { ...state.peers, [peerId]: { state: 'connecting', isSpeaking: false } }
  })),

  updatePeerState: (peerId, connectionState) => set((state) => {
    if (!state.peers[peerId]) return state;
    return {
      peers: {
        ...state.peers,
        [peerId]: { ...state.peers[peerId], state: connectionState }
      }
    };
  }),

  removePeer: (peerId) => set((state) => {
    const newPeers = { ...state.peers };
    delete newPeers[peerId];
    return { peers: newPeers };
  }),

  clearPeers: () => set({ peers: {} }),

  // ─── Audio State ──────────────────────────────────────────────────
  isTransmitting: false,
  setIsTransmitting: (isTransmitting) => set({ isTransmitting }),

  micPermission: 'prompt', // 'prompt' | 'granted' | 'denied'
  setMicPermission: (micPermission) => set({ micPermission }),

  // ─── UI State ─────────────────────────────────────────────────────
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  peerCount: 0,
  setPeerCount: (peerCount) => set({ peerCount }),

  // ─── Reset ────────────────────────────────────────────────────────
  resetRoom: () => set({
    inRoom: false,
    peers: {},
    peerCount: 0,
    isTransmitting: false,
    error: null,
  }),
}));

export default useStore;
