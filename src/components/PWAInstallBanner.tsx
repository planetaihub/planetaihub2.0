import React, { useState } from 'react';
import { Download, Share2, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { shareContent } from '../utils/shareHelper';
import { dismissPWABanner, isPWABannerDismissed } from '../utils/storage';

interface ActionButtonProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export const ShareAppButton: React.FC<ActionButtonProps> = ({
  className = '',
  variant = 'light',
}) => {
  const handleShareApp = () => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://planetaihub.com';
    void shareContent({
      title: 'PlanetAI Hub — Remote AI Jobs & Career Suite',
      text: 'Remote AI & tech jobs with transparent USD pay, career tools, and offline utilities on PlanetAI Hub.',
      url: origin,
    });
  };

  const variantClasses =
    variant === 'light'
      ? 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700'
      : 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200';

  const iconClasses = variant === 'light' ? 'text-slate-500' : 'text-slate-300';

  return (
    <button
      type="button"
      onClick={handleShareApp}
      aria-label="Share PlanetAI Hub"
      className={`${variantClasses} rounded-full px-3 py-1.5 min-h-[36px] text-xs font-medium flex items-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] whitespace-nowrap shrink-0 ${className}`}
    >
      <Share2 className={`h-3.5 w-3.5 shrink-0 ${iconClasses}`} aria-hidden="true" />
      <span>Share</span>
    </button>
  );
};

export const PWAInstallButton: React.FC<ActionButtonProps> = ({
  className = '',
  variant = 'light',
}) => {
  const { isInstalled, install } = usePWAInstall();

  // Automatically hide Install App when running in standalone installed mode
  if (isInstalled) {
    return null;
  }

  const variantClasses =
    variant === 'light'
      ? 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
      : 'border border-white/20 bg-white/10 text-white hover:bg-white/20';

  return (
    <button
      type="button"
      onClick={() => {
        void install();
      }}
      aria-label="Install PlanetAI Hub app"
      className={`${variantClasses} rounded-full px-3 py-1.5 min-h-[36px] text-xs font-medium flex items-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] whitespace-nowrap shrink-0 ${className}`}
    >
      <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>Install App</span>
    </button>
  );
};

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState<boolean>(() =>
    isPWABannerDismissed()
  );

  if (isInstalled || dismissed || (!isInstallable && !isIOS)) {
    return null;
  }

  const handleDismiss = () => {
    dismissPWABanner();
    setDismissed(true);
  };

  return (
    <div
      role="region"
      aria-label="Install PlanetAI Hub app"
      className="mb-6 flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3 sm:items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-white text-[#1D4ED8] shadow-2xs">
          <Smartphone className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Install PlanetAI Hub for offline access
          </p>
          <p className="text-xs text-slate-600">
            Pin this hub to your home screen or desktop. Saved jobs and tools work offline with zero account required.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <button
          type="button"
          onClick={() => {
            void install();
          }}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] whitespace-nowrap shrink-0"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span>{isInstallable ? 'Install App' : 'How to Install'}</span>
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install banner"
          className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
