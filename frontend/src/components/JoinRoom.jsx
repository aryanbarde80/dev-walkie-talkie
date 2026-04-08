/**
 * JoinRoom — Hardened Interface
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

  if (inRoom) {
    return (
      <div className="w-full text-center space-y-4">
        <div className="py-2 border-y border-white/5">
           <p className="text-[9px] font-bold text-dark-400 uppercase mb-1">Signal Lock In</p>
           <p className="text-xl font-bold lcd-text tracking-widest">{roomId.toUpperCase()}</p>
        </div>
        <button
          onClick={onLeave}
          className="w-full py-2 bg-dark-900 text-dark-400 text-[10px] font-bold border border-white/5 rounded uppercase"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleJoin} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[8px] font-bold text-dark-400 uppercase block ml-1">Frequency Code</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            placeholder="000-000"
            maxLength={10}
            className="w-full bg-[#050607] border-2 border-[#1a1b1e] rounded-lg p-3 text-center lcd-text font-bold text-lg 
                       placeholder:text-dark-800 focus:outline-none focus:border-dark-600 transition-all uppercase"
          />
        </div>

        <button
          type="submit"
          disabled={!socketConnected || !inputValue.trim()}
          className="w-full py-4 bg-dark-800 text-white font-bold text-xs rounded-lg border-2 border-black shadow-[0_4px_0_#000] active:translate-y-1 active:shadow-none transition-all uppercase"
        >
          {socketConnected ? 'Link Channel' : 'Scanning...'}
        </button>
      </form>
    </div>
  );
}
