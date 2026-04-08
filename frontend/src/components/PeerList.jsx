/**
 * PeerList — Radar Style Refinement
 */

import useStore from '../store/useStore';

const STATE_COLORS = {
  connecting: 'text-orange-400',
  connected: 'text-neon-green',
  disconnected: 'text-dark-500',
  failed: 'text-red-500',
  new: 'text-neon-blue',
};

const STATE_DOT = {
  connecting: 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]',
  connected: 'bg-neon-green shadow-[0_0_8px_rgba(57,255,20,0.5)]',
  disconnected: 'bg-dark-500',
  failed: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
  new: 'bg-neon-blue shadow-[0_0_8px_rgba(0,212,255,0.5)]',
};

export default function PeerList() {
  const peers = useStore((s) => s.peers);
  const inRoom = useStore((s) => s.inRoom);

  const peerEntries = Object.entries(peers);

  if (!inRoom || peerEntries.length === 0) return (
     <div className="w-full max-w-sm mx-auto glass-panel rounded-3xl p-8 flex flex-col items-center justify-center border-dashed border-white/5 opacity-40">
        <p className="text-[10px] font-mono tracking-[0.3em] font-bold text-dark-500 uppercase">Awaiting Peers On Grid</p>
     </div>
  );

  return (
    <div className="animate-fade-in w-full max-w-sm mx-auto space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-mono text-dark-400 tracking-[0.4em] uppercase font-black flex items-center gap-3">
          <div className="w-2 h-2 rounded-full border border-dark-400 animate-ping" />
          Satellite Relay ({peerEntries.length})
        </h3>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {peerEntries.map(([peerId, peer]) => (
          <div
            key={peerId}
            className="glass-panel group rounded-2xl px-5 py-4 flex items-center justify-between hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-3 h-3 rounded-sm rotate-45 ${STATE_DOT[peer.state] || 'bg-dark-500'}`} />
                {peer.state === 'connected' && (
                   <div className="absolute -inset-1 bg-neon-green/20 rounded-full blur-sm animate-pulse" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-dark-400 font-bold uppercase tracking-widest">Operator ID</span>
                <span className="text-xs font-mono text-white font-black tracking-widest">
                  {peerId.slice(0, 10).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="text-right">
               <span className={`text-[9px] font-mono font-black tracking-[0.2em] uppercase ${STATE_COLORS[peer.state] || 'text-dark-500'}`}>
                {peer.state || 'PENDING'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
