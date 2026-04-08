/**
 * StatusBar — Retro LCD Style
 */

import useStore from '../store/useStore';

export default function StatusBar() {
  const socketConnected = useStore((s) => s.socketConnected);
  const inRoom = useStore((s) => s.inRoom);
  const roomId = useStore((s) => s.roomId);
  const peerCount = useStore((s) => s.peerCount);

  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
      <div className="flex flex-col">
        <span className="text-[8px] font-bold text-dark-400 uppercase">Status</span>
        <span className={`text-[10px] font-bold lcd-text ${socketConnected ? '' : 'text-red-900 line-through'}`}>
          {socketConnected ? 'READY' : 'OFF'}
        </span>
      </div>

      {inRoom && (
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-dark-400 uppercase">CH</span>
          <span className="text-xs font-bold lcd-text animate-flicker">
            {roomId.toUpperCase()}
          </span>
        </div>
      )}

      <div className="flex flex-col items-end">
        <span className="text-[8px] font-bold text-dark-400 uppercase">Nodes</span>
        <span className="text-xs font-bold lcd-text">
          {peerCount.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
