/**
 * App — Physical Walkie-Talkie UI
 */

import { useState } from 'react';
import StatusBar from './components/StatusBar';
import JoinRoom from './components/JoinRoom';
import PushToTalkButton from './components/PushToTalkButton';
import PeerList from './components/PeerList';
import ErrorBanner from './components/ErrorBanner';
import useWalkieTalkie from './hooks/useWalkieTalkie';

export default function App() {
  const { joinRoom, leaveRoom, startTransmitting, stopTransmitting } = useWalkieTalkie();

  return (
    <div className="h-full w-full bg-[#111] overflow-hidden flex items-center justify-center p-4">
      {/* The Physical Device Container */}
      <div className="relative w-full max-w-[420px] h-full max-h-[850px] pt-12">
        {/* Hardware Decorations */}
        <div className="antenna" />
        <div className="knob" />
        
        {/* Main Chassis */}
        <div className="walkie-chassis">
          
          {/* LEDs and Brand */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className={`led red on`} />
                <span className="text-[7px] uppercase font-bold text-dark-500">Power</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className={`led green on`} />
                <span className="text-[7px] uppercase font-bold text-dark-500">Signal</span>
              </div>
            </div>
            
            <div className="text-right">
              <h1 className="text-xs font-black tracking-tighter text-dark-400 italic">
                PRO-TX <span className="text-dark-300">8000</span>
              </h1>
            </div>
          </div>

          {/* The Digital Screen Area */}
          <div className="walkie-screen flex-grow-[0.4] flex flex-col">
            <StatusBar />
            <div className="flex-grow flex flex-col items-center justify-center p-2">
               <ErrorBanner />
               <JoinRoom onJoin={joinRoom} onLeave={leaveRoom} />
            </div>
          </div>

          {/* Speaker Grill */}
          <div className="speaker-grill" />

          {/* Audio Visualization / Peer List inside internal panel */}
          <div className="flex-1 overflow-y-auto mb-6 px-2 custom-scrollbar">
             <PeerList />
          </div>

          {/* Control Section */}
          <div className="mt-auto mb-4 flex flex-col items-center gap-8">
            <PushToTalkButton
              onStartTransmit={startTransmitting}
              onStopTransmit={stopTransmitting}
            />
            
            {/* Auxiliary tactile buttons */}
            <div className="flex gap-4 w-full px-4">
               <button className="tactile-button flex-1 py-3">SCAN</button>
               <button className="tactile-button flex-1 py-3">MENU</button>
               <button className="tactile-button flex-1 py-3">FREQ</button>
            </div>
          </div>

        </div>

        {/* Device Screw heads (Decoration) */}
        <div className="absolute bottom-5 left-8 w-1.5 h-1.5 rounded-full bg-black/40 border border-white/5" />
        <div className="absolute bottom-5 right-8 w-1.5 h-1.5 rounded-full bg-black/40 border border-white/5" />
      </div>
    </div>
  );
}
