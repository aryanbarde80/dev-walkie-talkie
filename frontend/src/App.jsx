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
    <div className="h-full w-full bg-[#020308] relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 grid-pattern-v2 opacity-50 z-0" />
      <div className="absolute inset-0 noise-overlay z-0" />
      <div className="scanline" />

      {/* Ambient gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-neon-green/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-neon-blue/[0.05] blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] rotate-45 left-[50%] w-[300px] h-[600px] rounded-full bg-neon-purple/[0.03] blur-[100px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col px-6 py-6 max-w-lg mx-auto safe-area-bottom">
        {/* Header */}
        <header className="shrink-0 space-y-6">
          {/* Logo / Title */}
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-3.5 h-3.5 rounded-sm bg-neon-green shadow-[0_0_15px_rgba(57,255,20,0.6)] animate-pulse" />
              <h1 className="text-2xl font-mono font-black tracking-[0.2em] text-white italic glow-text-green">
                DEV<span className="text-neon-green">WALKIE</span>
              </h1>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-dark-500" />
              <p className="text-[10px] font-mono text-dark-400 tracking-[0.5em] uppercase font-bold">
                SECURE SIGNAL v1
              </p>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-dark-500" />
            </div>
          </div>

          <StatusBar />
        </header>

        {/* Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center gap-8 py-6 min-h-0">
          <ErrorBanner />

          <div className="w-full space-y-8 flex flex-col items-center">
            <JoinRoom onJoin={joinRoom} onLeave={leaveRoom} />

            <PushToTalkButton
              onStartTransmit={startTransmitting}
              onStopTransmit={stopTransmitting}
            />
          </div>

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
