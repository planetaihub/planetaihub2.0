import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 right-4 z-50 flex items-center gap-2 rounded-xl border border-blue-200 bg-white/95 px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-lg backdrop-blur-xl"
    >
      <WifiOff className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
      <span>Offline Mode — Cached directory &amp; local storage active</span>
    </div>
  );
};
