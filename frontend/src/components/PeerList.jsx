/**
 * PeerList — Shows connected peers with their connection state
 */

import useStore from '../store/useStore';

const STATE_COLORS = {
  connecting: 'text-neon-orange',
  connected: 'text-neon-green',
  disconnected: 'text-dark-400',
  failed: 'text-neon-red',
  new: 'text-neon-blue',
};

const STATE_DOT_COLORS = {
  connecting: 'bg-neon-orange',
  connected: 'bg-neon-green',
  disconnected: 'bg-dark-400',
  failed: 'bg-neon-red',
  new: 'bg-neon-blue',
};

export default function PeerList() {
  const peers = useStore((s) => s.peers);
  const inRoom = useStore((s) => s.inRoom);

  const peerEntries = Object.entries(peers);

  if (!inRoom || peerEntries.length === 0) return null;

  return (
    <div className="animate-fade-in w-full max-w-sm mx-auto">
      <div className="glass rounded-xl p-4">
        <h3 className="text-xs font-mono text-dark-300 tracking-widest uppercase mb-3 flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
          PEERS ({peerEntries.length})
        </h3>
        
        <div className="flex flex-col gap-2">
          {peerEntries.map(([peerId, peer]) => (
            <div
              key={peerId}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-dark-800/50 border border-dark-600/30"
            >
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${STATE_DOT_COLORS[peer.state] || 'bg-dark-400'} ${
                  peer.state === 'connected' ? 'shadow-[0_0_6px_rgba(57,255,20,0.5)]' : ''
                }`} />
                <span className="text-xs font-mono text-dark-200 truncate max-w-[140px]">
                  {peerId.slice(0, 8)}...
                </span>
              </div>
              <span className={`text-[10px] font-mono tracking-wider uppercase ${STATE_COLORS[peer.state] || 'text-dark-400'}`}>
                {peer.state || 'unknown'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
