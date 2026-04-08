/**
 * StatusBar — High-End Refresh
 */

import useStore from '../store/useStore';

export default function StatusBar() {
  const socketConnected = useStore((s) => s.socketConnected);
  const inRoom = useStore((s) => s.inRoom);
  const roomId = useStore((s) => s.roomId);
  const peerCount = useStore((s) => s.peerCount);

  return (
    <div className="glass-panel rounded-2xl px-6 py-4 flex items-center justify-between animate-fade-in relative overflow-hidden group">
      {/* Decorative inner light */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Connection State */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`w-2.5 h-2.5 rounded-full ${
            socketConnected ? 'bg-neon-green shadow-[0_0_12px_rgba(57,255,20,0.8)]' : 'bg-neon-red shadow-[0_0_12px_rgba(255,23,68,0.8)]'
          }`} />
          {socketConnected && <div className="absolute inset-0 w-full h-full bg-neon-green rounded-full animate-ping opacity-40" />}
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-mono text-dark-400 tracking-[0.1em] font-bold uppercase">Network</span>
          <span className={`text-[10px] font-mono font-black tracking-widest ${socketConnected ? 'text-neon-green' : 'text-neon-red'}`}>
            {socketConnected ? 'STABLE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Active Channel */}
      {inRoom && (
        <div className="flex flex-col items-center">
            <span className="text-[8px] font-mono text-dark-400 tracking-[0.1em] font-bold uppercase">Channel</span>
            <span className="text-xs font-mono text-neon-blue font-black tracking-[0.2em] glow-text-blue uppercase">
              {roomId}
            </span>
        </div>
      )}

      {/* Nodes / Peers */}
      <div className="flex items-center gap-3 text-right">
        <div className="flex flex-col">
          <span className="text-[8px] font-mono text-dark-400 tracking-[0.1em] font-bold uppercase">Nodes</span>
          <span className="text-sm font-mono text-white font-black tracking-widest">
            {peerCount.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-white/5 border border-white/5">
          <svg className="w-4 h-4 text-dark-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
