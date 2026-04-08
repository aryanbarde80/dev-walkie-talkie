/**
 * JoinRoom — Premium Upgrade
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

  const generateRoomId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
       if (i === 3) result += '-';
       result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setInputValue(result);
  };

  if (inRoom) {
    return (
      <div className="animate-slide-up w-full">
        <div className="glass-panel rounded-3xl p-6 flex flex-col items-center gap-4 relative overflow-hidden group">
           <div className="absolute inset-0 bg-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
           
           <div className="flex items-center gap-3">
             <span className="text-[10px] font-mono text-dark-400 font-bold uppercase tracking-[0.2em]">Signal Established</span>
           </div>

           <div className="px-8 py-3 rounded-2xl bg-dark-900/80 border border-neon-blue/20 flex items-center gap-4 group">
              <span className="text-2xl font-mono font-black text-neon-blue tracking-widest uppercase glow-text-blue">
                {roomId}
              </span>
           </div>

           <button
            onClick={onLeave}
            className="w-full py-4 rounded-2xl bg-dark-800 text-dark-300 font-mono text-xs font-black tracking-[0.3em]
                       hover:bg-neon-red/10 hover:text-neon-red hover:border-neon-red/30 border border-white/5
                       transition-all duration-300 cursor-pointer uppercase shadow-lg shadow-black/40"
          >
            Terminal-End Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up w-full max-w-sm mx-auto space-y-4">
      <form onSubmit={handleJoin} className="space-y-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-green/20 via-neon-secondary/20 to-neon-purple/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-1000" />
          
          <div className="relative flex items-center">
            <input
              type="text"
              id="room-id-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
              placeholder="ENTER SECURE CHANNEL"
              maxLength={12}
              className="w-full px-8 py-5 rounded-2xl bg-[#0a0b14] border border-white/10 
                         text-white font-mono text-center text-lg tracking-[0.3em] font-black
                         placeholder:text-dark-500 placeholder:text-sm placeholder:tracking-[0.1em]
                         focus:outline-none focus:border-neon-primary/40 focus:ring-1 focus:ring-neon-primary/20
                         transition-all duration-300"
            />
            
            <button
              type="button"
              onClick={generateRoomId}
              className="absolute right-4 p-2 rounded-xl text-dark-500 hover:text-neon-primary hover:bg-white/5 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!socketConnected || !inputValue.trim()}
          className="w-full py-5 rounded-2xl font-mono text-xs tracking-[0.4em] uppercase font-black
                     bg-gradient-to-r from-[#1a8a0a] to-[#04050a]
                     border border-neon-green/30
                     text-white shadow-xl shadow-black/80
                     hover:from-neon-primary/80 hover:to-neon-secondary/80 transform hover:-translate-y-1
                     disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed
                     transition-all duration-500 cursor-pointer active:scale-95"
        >
          {socketConnected ? 'Establish Secure Link' : 'Connecting To Grid...'}
        </button>
      </form>
    </div>
  );
}
