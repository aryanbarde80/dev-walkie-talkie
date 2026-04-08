/**
 * StatusBar — Top bar showing connection status and room info
 */

import useStore from '../store/useStore';

export default function StatusBar() {
  const socketConnected = useStore((s) => s.socketConnected);
  const inRoom = useStore((s) => s.inRoom);
  const roomId = useStore((s) => s.roomId);
  const peerCount = useStore((s) => s.peerCount);

  return (
    <div className="glass-strong rounded-xl px-4 py-3 flex items-center justify-between animate-fade-in">
      {/* Left: Connection Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          socketConnected ? 'bg-neon-green shadow-[0_0_8px_rgba(57,255,20,0.6)]' : 'bg-neon-red shadow-[0_0_8px_rgba(255,23,68,0.6)]'
        }`} />
        <span className="text-xs font-mono text-dark-200">
          {socketConnected ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      {/* Center: Room Info */}
      {inRoom && (
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
          </svg>
          <span className="text-xs font-mono text-neon-blue tracking-wider">
            {roomId.toUpperCase()}
          </span>
        </div>
      )}

      {/* Right: Peer Count */}
      <div className="flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-dark-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
        <span className="text-xs font-mono text-dark-300">
          {inRoom ? `${peerCount}` : '0'}
        </span>
      </div>
    </div>
  );
}
