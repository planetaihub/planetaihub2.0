import React, { useEffect } from 'react';
import { Laptop, Share2, Smartphone, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { usePWAInstall } from '../hooks/usePWAInstall';

/**
 * Light SaaS modal showing clear 2-step installation instructions
 * for Android (Chrome), iPhone/iPad (Safari), and Windows/Mac (Chrome/Edge)
 * whenever the browser's native beforeinstallprompt is unavailable.
 */
export const InstallAppModal: React.FC = () => {
  const { isModalOpen, closeInstallModal } = usePWAInstall();

  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeInstallModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen, closeInstallModal]);

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-app-modal-title"
      onClick={closeInstallModal}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl sm:rounded-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
              <BrandLogo className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
                Offline-Ready App
              </p>
              <h2
                id="install-app-modal-title"
                className="font-display text-xl font-bold text-slate-900"
              >
                Install PlanetAI Hub
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeInstallModal}
            aria-label="Close install instructions"
            className="inline-flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-600">
          Add PlanetAI Hub to your home screen or desktop dock for instant full-screen launch and offline access to your saved jobs and career tools.
        </p>

        <div className="mt-4 space-y-3">
          {/* Android (Chrome) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Smartphone className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
              <span>Android (Chrome)</span>
            </div>
            <ol className="mt-2 space-y-1 text-xs leading-relaxed text-slate-600">
              <li>
                <span className="font-mono font-semibold text-[#1D4ED8]">1.</span> Tap the{' '}
                <strong className="text-slate-900">⋮</strong> menu button in the top-right corner of Chrome.
              </li>
              <li>
                <span className="font-mono font-semibold text-[#1D4ED8]">2.</span> Tap{' '}
                <strong className="text-slate-900">Install app</strong> (or{' '}
                <strong className="text-slate-900">Add to Home screen</strong>).
              </li>
            </ol>
          </div>

          {/* iPhone / iPad (Safari) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Share2 className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
              <span>iPhone / iPad (Safari)</span>
            </div>
            <ol className="mt-2 space-y-1 text-xs leading-relaxed text-slate-600">
              <li>
                <span className="font-mono font-semibold text-[#1D4ED8]">1.</span> Tap the{' '}
                <strong className="text-slate-900">Share</strong> icon in Safari’s bottom or top toolbar.
              </li>
              <li>
                <span className="font-mono font-semibold text-[#1D4ED8]">2.</span> Scroll down and tap{' '}
                <strong className="text-slate-900">Add to Home Screen</strong>.
              </li>
            </ol>
          </div>

          {/* Windows / Mac (Chrome / Edge) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Laptop className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              <span>Windows / Mac (Chrome / Edge)</span>
            </div>
            <ol className="mt-2 space-y-1 text-xs leading-relaxed text-slate-600">
              <li>
                <span className="font-mono font-semibold text-[#1D4ED8]">1.</span> Click the{' '}
                <strong className="text-slate-900">Install</strong> icon on the right side of the address bar (or open <strong className="text-slate-900">⋮ → Cast, save, and share</strong>).
              </li>
              <li>
                <span className="font-mono font-semibold text-[#1D4ED8]">2.</span> Click{' '}
                <strong className="text-slate-900">Install</strong> to pin PlanetAI Hub as a desktop app.
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-5 flex justify-end border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={closeInstallModal}
            className="min-h-[42px] rounded-full bg-[#1D4ED8] px-6 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E40AF]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
