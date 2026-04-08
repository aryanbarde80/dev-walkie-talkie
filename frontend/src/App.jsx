/**
 * App — Main Application Component
 * 
 * Single-screen layout with:
 *   1. Status bar (top)
 *   2. Room join/info (upper section)
 *   3. Push-to-talk button (center)
 *   4. Peer list (bottom)
 */

import StatusBar from './components/StatusBar';
import JoinRoom from './components/JoinRoom';
import PushToTalkButton from './components/PushToTalkButton';
import PeerList from './components/PeerList';
import ErrorBanner from './components/ErrorBanner';
import useWalkieTalkie from './hooks/useWalkieTalkie';

export default function App() {
  const { joinRoom, leaveRoom, startTransmitting, stopTransmitting } = useWalkieTalkie();

  return (
    <div className="h-full w-full bg-dark-900 noise-bg grid-pattern relative overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-neon-green/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-neon-blue/[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-neon-purple/[0.02] blur-[80px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col px-4 py-4 max-w-lg mx-auto safe-area-inset">
        {/* Header */}
        <header className="shrink-0">
          {/* Logo / Title */}
          <div className="text-center mb-4 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm bg-neon-green shadow-[0_0_10px_rgba(57,255,20,0.4)] animate-pulse" />
              <h1 className="text-lg font-mono font-bold tracking-[0.15em] text-white">
                DEV<span className="text-neon-green">WALKIE</span>
              </h1>
            </div>
            <p className="text-[10px] font-mono text-dark-400 tracking-[0.3em] uppercase">
              Push-to-Talk • WebRTC
            </p>
          </div>

          {/* Status Bar */}
          <StatusBar />
        </header>

        {/* Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center gap-6 py-4 min-h-0">
          {/* Error Banner */}
          <ErrorBanner />

          {/* Room Controls */}
          <JoinRoom onJoin={joinRoom} onLeave={leaveRoom} />

          {/* Push-to-Talk Button */}
          <PushToTalkButton
            onStartTransmit={startTransmitting}
            onStopTransmit={stopTransmitting}
          />

          {/* Peer List */}
          <PeerList />
        </main>

        {/* Footer */}
        <footer className="shrink-0 text-center py-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-[9px] font-mono text-dark-500 tracking-widest">
            v1.0.0 • ENCRYPTED P2P AUDIO
          </p>
        </footer>
      </div>
    </div>
  );
}
