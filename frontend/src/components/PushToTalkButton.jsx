/**
 * PushToTalkButton — Physical Hardware Button
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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 mb-2">
         <div className={`led orange ${isTransmitting ? 'on' : ''}`} />
         <span className={`text-[9px] font-bold uppercase ${isTransmitting ? 'text-orange-500' : 'text-dark-600'}`}>TX Active</span>
      </div>

      <button
        ref={buttonRef}
        id="ptt-button"
        className={`ptt-hardware ${isTransmitting ? 'active' : ''} ${!inRoom ? 'opacity-50 grayscale pointer-events-none' : ''}`}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
        onContextMenu={handleContextMenu}
        disabled={!inRoom}
      >
        <span className="tracking-tighter font-black italic">TALK</span>
      </button>

      <span className="text-[10px] font-bold text-dark-500 tracking-widest uppercase mt-2">
        {isTransmitting ? 'Transmitting' : 'Press to Talk'}
      </span>
    </div>
  );
}
