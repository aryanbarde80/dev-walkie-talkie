/**
 * PeerList — Terminal/LCD Style
 */

import useStore from '../store/useStore';

export default function PeerList() {
  const peers = useStore((s) => s.peers);
  const inRoom = useStore((s) => s.inRoom);

  const peerEntries = Object.entries(peers);

  if (!inRoom) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-[9px] font-bold text-dark-500 uppercase">Operator Log</span>
        <span className="text-[9px] font-bold text-dark-500 uppercase">{peerEntries.length} Active</span>
      </div>
      
      <div className="space-y-2">
        {peerEntries.length === 0 ? (
          <div className="p-4 border border-dashed border-white/5 rounded text-center">
             <span className="text-[10px] italic text-dark-600 font-bold uppercase">No peers in range</span>
          </div>
        ) : (
          peerEntries.map(([peerId, peer]) => (
            <div
              key={peerId}
              className="p-3 bg-black/40 border border-white/5 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${peer.state === 'connected' ? 'bg-green-500 shadow-[0_0_5px_green]' : 'bg-dark-600'}`} />
                <span className="text-[10px] font-bold text-dark-200">OP-{peerId.slice(0, 6).toUpperCase()}</span>
              </div>
              <span className={`text-[9px] font-bold uppercase ${peer.state === 'connected' ? 'text-green-700' : 'text-dark-500'}`}>
                {peer.state || 'Syncing'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
