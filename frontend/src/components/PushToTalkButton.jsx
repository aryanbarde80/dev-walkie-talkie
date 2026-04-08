/**
 * PushToTalkButton — Premium Visuals Upgrade
 */

import { useCallback, useRef } from 'react';
import useStore from '../store/useStore';

export default function PushToTalkButton({ onStartTransmit, onStopTransmit }) {
  const isTransmitting = useStore((s) => s.isTransmitting);
  const inRoom = useStore((s) => s.inRoom);
  const buttonRef = useRef(null);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleStart = useCallback((e) => {
    e.preventDefault();
    if (!inRoom) return;
    onStartTransmit();
  }, [inRoom, onStartTransmit]);

  const handleEnd = useCallback((e) => {
    e.preventDefault();
    if (!inRoom) return;
    onStopTransmit();
  }, [inRoom, onStopTransmit]);

  const bars = Array.from({ length: 9 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center gap-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      {/* Dynamic Visualizer */}
      <div className="h-12 flex items-center justify-center gap-1.5 w-40">
        {isTransmitting ? (
          bars.map((i) => (
            <div
              key={i}
              className="audio-visualizer-bar"
              style={{
                animationDelay: `${i * 0.05}s`,
                height: `${Math.random() * 30 + 10}px`,
                transition: 'height 0.1s ease',
                animation: 'wave 0.6s ease-in-out infinite'
              }}
            />
          ))
        ) : (
          <div className="flex items-center gap-2">
            {bars.map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-dark-600 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Futuristic PTT Button */}
      <div className="ptt-outer">
        <button
          ref={buttonRef}
          id="ptt-button"
          className={`ptt-inner ${isTransmitting ? 'active' : ''} ${!inRoom ? 'opacity-20 grayscale' : ''}`}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
          onContextMenu={handleContextMenu}
          disabled={!inRoom}
        >
          {/* Signal Indicator */}
          <div className={`absolute top-6 flex items-center gap-1.5 transition-opacity duration-300 ${isTransmitting ? 'opacity-100' : 'opacity-0'}`}>
             <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
             <span className="text-[8px] font-mono text-neon-green tracking-[0.2em] font-black uppercase">On Air</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className={`p-4 rounded-2xl transition-all duration-300 ${isTransmitting ? 'bg-neon-green/10 text-neon-green glow-text-green' : 'bg-dark-500/20 text-dark-300'}`}>
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className={`text-[10px] font-mono font-black tracking-[0.4em] uppercase ${isTransmitting ? 'text-neon-green' : 'text-dark-500'}`}>
              {isTransmitting ? 'LIVE' : 'PUSH'}
            </span>
          </div>
        </button>
        <div className="ptt-ripple" />
      </div>

      {/* Footer Info */}
      <div className="flex flex-col items-center gap-2">
         <div className={`h-1 w-16 rounded-full transition-all duration-500 ${isTransmitting ? 'bg-neon-green shadow-[0_0_10px_rgba(57,255,20,0.4)] w-24' : 'bg-dark-700 w-12'}`} />
         <p className={`text-[11px] font-mono tracking-[0.2em] font-bold transition-colors duration-300 ${isTransmitting ? 'text-neon-green uppercase' : 'text-dark-400'}`}>
           {inRoom ? (isTransmitting ? 'Transmitting Data...' : 'Hold to Speak') : 'System Inactive'}
         </p>
      </div>
    </div>
  );
}
