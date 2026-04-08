/**
 * PushToTalkButton — The main PTT control
 * 
 * Uses both mouse and touch events for cross-device compatibility.
 * Visual feedback includes:
 *   - Pulsing ring animation when transmitting
 *   - Audio wave visualizer bars
 *   - Color transitions
 */

import { useCallback, useRef } from 'react';
import useStore from '../store/useStore';

export default function PushToTalkButton({ onStartTransmit, onStopTransmit }) {
  const isTransmitting = useStore((s) => s.isTransmitting);
  const inRoom = useStore((s) => s.inRoom);
  const buttonRef = useRef(null);

  // Prevent context menu on long press (mobile)
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

  // Audio visualizer bars (shown when transmitting)
  const bars = Array.from({ length: 7 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      {/* Audio Wave Visualizer */}
      <div className="h-8 flex items-end gap-1">
        {isTransmitting ? (
          bars.map((i) => (
            <div
              key={i}
              className="audio-bar"
              style={{
                animationDelay: `${i * 0.08}s`,
                height: '4px',
              }}
            />
          ))
        ) : (
          <div className="flex items-center gap-1.5">
            {bars.map((i) => (
              <div
                key={i}
                className="w-[3px] h-1 rounded-full bg-dark-500 transition-all duration-300"
              />
            ))}
          </div>
        )}
      </div>

      {/* PTT Button */}
      <div className="relative">
        {/* Pulse rings (visible when transmitting) */}
        {isTransmitting && (
          <>
            <div className="ptt-ring" />
            <div className="ptt-ring" style={{ animationDelay: '0.5s' }} />
          </>
        )}

        <button
          ref={buttonRef}
          id="ptt-button"
          className={`ptt-button ${isTransmitting ? 'active' : ''} ${!inRoom ? 'opacity-30 cursor-not-allowed' : ''}`}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
          onContextMenu={handleContextMenu}
          disabled={!inRoom}
          aria-label="Push to talk"
        >
          {/* Inner content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {/* Mic Icon */}
            <svg
              className={`w-10 h-10 transition-colors duration-200 ${
                isTransmitting ? 'text-neon-green drop-shadow-[0_0_12px_rgba(57,255,20,0.6)]' : 'text-dark-300'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
              />
            </svg>

            {/* Label */}
            <span className={`text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-200 ${
              isTransmitting ? 'text-neon-green' : 'text-dark-400'
            }`}>
              {isTransmitting ? 'TX' : 'PTT'}
            </span>
          </div>
        </button>
      </div>

      {/* Status Text */}
      <p className={`text-xs font-mono tracking-wider transition-colors duration-200 ${
        isTransmitting ? 'text-neon-green' : 'text-dark-400'
      }`}>
        {!inRoom
          ? 'JOIN A ROOM TO TRANSMIT'
          : isTransmitting
            ? '● TRANSMITTING'
            : 'HOLD TO TALK'
        }
      </p>
    </div>
  );
}
