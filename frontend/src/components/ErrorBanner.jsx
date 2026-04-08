/**
 * ErrorBanner — Dismissable error notification
 */

import useStore from '../store/useStore';

export default function ErrorBanner() {
  const error = useStore((s) => s.error);
  const clearError = useStore((s) => s.clearError);
  const micPermission = useStore((s) => s.micPermission);

  if (!error && micPermission !== 'denied') return null;

  const displayMessage = micPermission === 'denied'
    ? 'Microphone access denied. Please enable it in your browser settings.'
    : error;

  return (
    <div className="animate-slide-up w-full max-w-sm mx-auto">
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-neon-red/10 border border-neon-red/20">
        <svg className="w-5 h-5 text-neon-red shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="text-xs font-mono text-neon-red/80 leading-relaxed flex-1">
          {displayMessage}
        </p>
        <button
          onClick={clearError}
          className="text-neon-red/40 hover:text-neon-red transition-colors cursor-pointer"
          aria-label="Dismiss error"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
