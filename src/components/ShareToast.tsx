import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { subscribeShareToast } from '../utils/shareHelper';

export const ShareToast: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: number | undefined;

    const unsubscribe = subscribeShareToast((nextMessage) => {
      setMessage(nextMessage);
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setMessage(null);
      }, 2600);
    });

    return () => {
      unsubscribe();
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="no-print fixed right-4 bottom-24 z-50 flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-4 py-2.5 text-xs font-semibold text-slate-900 shadow-lg backdrop-blur-xl sm:right-6 md:bottom-6"
    >
      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};
