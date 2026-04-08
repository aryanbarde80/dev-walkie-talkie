/**
 * JoinRoom — Room ID input and join/leave controls
 */

import { useState } from 'react';
import useStore from '../store/useStore';

export default function JoinRoom({ onJoin, onLeave }) {
  const [inputValue, setInputValue] = useState('');
  const inRoom = useStore((s) => s.inRoom);
  const roomId = useStore((s) => s.roomId);
  const setRoomId = useStore((s) => s.setRoomId);
  const socketConnected = useStore((s) => s.socketConnected);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setRoomId(inputValue.trim().toLowerCase());
    onJoin(inputValue.trim().toLowerCase());
  };

  const handleLeave = () => {
    setInputValue('');
    onLeave();
  };

  // Generate a random room ID
  const generateRoomId = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setInputValue(result);
  };

  if (inRoom) {
    return (
      <div className="animate-slide-up flex flex-col items-center gap-4">
        <div className="glass rounded-xl px-6 py-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.6)]" />
            <span className="text-sm font-mono text-dark-100">Connected to room</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-700/50 border border-dark-500/50">
            <span className="font-mono text-lg tracking-[0.3em] text-neon-blue font-semibold">
              {roomId.toUpperCase()}
            </span>
          </div>
          <button
            onClick={handleLeave}
            id="leave-room-btn"
            className="mt-2 px-6 py-2 rounded-lg bg-dark-600 border border-dark-500 text-dark-200 text-sm font-mono
                       hover:bg-neon-red/10 hover:border-neon-red/40 hover:text-neon-red
                       transition-all duration-200 cursor-pointer"
          >
            LEAVE ROOM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up w-full max-w-sm mx-auto">
      <form onSubmit={handleJoin} className="flex flex-col gap-4">
        {/* Header */}
        <div className="text-center mb-2">
          <h2 className="text-sm font-mono text-dark-300 tracking-widest uppercase">
            Enter Room Channel
          </h2>
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            id="room-id-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toLowerCase())}
            placeholder="room-id"
            maxLength={20}
            autoComplete="off"
            className="w-full px-5 py-4 rounded-xl bg-dark-800 border border-dark-500/50 
                       text-white font-mono text-center text-lg tracking-[0.2em]
                       placeholder:text-dark-400 placeholder:tracking-[0.2em]
                       focus:outline-none focus:border-neon-green/50 focus:shadow-[0_0_20px_rgba(57,255,20,0.1)]
                       transition-all duration-300"
          />
          <button
            type="button"
            onClick={generateRoomId}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg
                       text-dark-400 hover:text-neon-green hover:bg-dark-600
                       transition-all duration-200 cursor-pointer"
            title="Generate random room ID"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
            </svg>
          </button>
        </div>

        {/* Join Button */}
        <button
          type="submit"
          id="join-room-btn"
          disabled={!socketConnected || !inputValue.trim()}
          className="w-full py-4 rounded-xl font-mono text-sm tracking-widest uppercase
                     bg-gradient-to-r from-neon-green/20 to-neon-blue/20
                     border border-neon-green/30
                     text-neon-green font-semibold
                     hover:from-neon-green/30 hover:to-neon-blue/30 hover:border-neon-green/50
                     hover:shadow-[0_0_30px_rgba(57,255,20,0.15)]
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none
                     transition-all duration-300 cursor-pointer"
        >
          {socketConnected ? 'JOIN CHANNEL' : 'CONNECTING...'}
        </button>
      </form>
    </div>
  );
}
