import React, { useEffect, useRef } from 'react';
import {
  Briefcase,
  FileText,
  Sparkles,
  Code2,
  Wallet,
  CheckSquare,
  CloudSun,
  Coins,
  Bookmark,
  PlayCircle,
  Users,
  Shield,
} from 'lucide-react';
import type { TabId } from '../types';
import { PWAInstallButton, ShareAppButton } from './PWAInstallBanner';
import { BrandLogo } from './BrandLogo';

export interface NavTabItem {
  id: TabId;
  label: string;
  desktopLabel: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const TABS: NavTabItem[] = [
  {
    id: 'jobs',
    label: 'Remote Jobs',
    desktopLabel: 'Remote Jobs',
    shortLabel: 'Jobs',
    icon: Briefcase,
  },
  {
    id: 'career-studio',
    label: 'Career Studio',
    desktopLabel: 'Career Studio',
    shortLabel: 'Career',
    icon: FileText,
  },
  {
    id: 'ai-assistants',
    label: 'AI Tools',
    desktopLabel: 'AI Tools',
    shortLabel: 'AI Tools',
    icon: Sparkles,
  },
  {
    id: 'dev-tools',
    label: 'Dev Tools',
    desktopLabel: 'Dev Tools',
    shortLabel: 'Dev Tools',
    icon: Code2,
  },
  {
    id: 'finance-docs',
    label: 'Finance Desk',
    desktopLabel: 'Finance Desk',
    shortLabel: 'Finance',
    icon: Wallet,
  },
  {
    id: 'productivity',
    label: 'Productivity',
    desktopLabel: 'Productivity',
    shortLabel: 'Productivity',
    icon: CheckSquare,
  },
  {
    id: 'health-weather',
    label: 'Health',
    desktopLabel: 'Health',
    shortLabel: 'Health',
    icon: CloudSun,
  },
  {
    id: 'live-earning',
    label: 'Live Earning',
    desktopLabel: 'Live Earning',
    shortLabel: 'Earning',
    icon: Coins,
  },
  {
    id: 'video-academy',
    label: 'Video Academy',
    desktopLabel: 'Video Academy',
    shortLabel: 'Academy',
    icon: PlayCircle,
  },
  {
    id: 'va-academy',
    label: 'VA Academy',
    desktopLabel: 'VA Academy',
    shortLabel: 'VA Academy',
    icon: Users,
  },
  {
    id: 'security-vault',
    label: 'Security Vault',
    desktopLabel: 'Security Vault',
    shortLabel: 'Security',
    icon: Shield,
  },
];

// Backward-compatible export alias if referenced elsewhere
export const NAV_TABS = TABS;

interface NavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  savedCount: number;
  onOpenSavedJobs: () => void;
  onScrollToWorkspace: () => void;
  onScrollToBriefings: () => void;
  onOpenAbout: () => void;
}

const scrollElementIntoCenter = (el: HTMLElement | null) => {
  if (!el || typeof window === 'undefined') return;
  if (window.innerWidth <= 768) {
    el.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }
};

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  onOpenSavedJobs,
  onScrollToWorkspace,
  onScrollToBriefings,
  onOpenAbout,
}) => {
  const mobileTabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});

  useEffect(() => {
    scrollElementIntoCenter(mobileTabRefs.current[activeTab] ?? null);
  }, [activeTab]);

  const anchorLinks = [
    { label: 'Directory', onClick: () => onSelectTab('jobs') },
    { label: 'Workspace Suites', onClick: onScrollToWorkspace },
    { label: 'Editorial Briefings', onClick: onScrollToBriefings },
    { label: 'About', onClick: onOpenAbout },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="no-print bg-[#0F172A] px-4 py-2 text-center text-xs font-medium text-slate-200 border-b border-slate-800">
        <p className="mx-auto max-w-7xl truncate">
          PlanetAI Hub: Curated Remote AI, RLHF &amp; Voice AI Roles with Transparent USD Pay • Zero Sign-Up Required
        </p>
      </div>

      {/* Clean, Spacious White Sticky Header (Zero Clipping / Zero Redundancy) */}
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:gap-8">
          {/* Left: PlanetAI Hub Logo */}
          <button
            type="button"
            onClick={() => onSelectTab('jobs')}
            className="inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 transition-colors hover:text-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8] sm:text-xl"
          >
            <BrandLogo className="h-7 w-7 shrink-0" />
            <span>PlanetAI Hub</span>
          </button>

          {/* Center: 4 Clean High-Level Anchor Links */}
          <nav
            aria-label="Primary sections"
            className="hidden lg:flex items-center gap-6 xl:gap-8"
          >
            {anchorLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8] whitespace-nowrap shrink-0"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right: Share, Install App, Saved (0), Browse USD Roles */}
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <ShareAppButton variant="light" />
              <PWAInstallButton variant="light" />
            </div>

            <button
              type="button"
              onClick={onOpenSavedJobs}
              aria-label={`Saved jobs (${savedCount})`}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] whitespace-nowrap shrink-0"
            >
              <Bookmark className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
              <span className="hidden md:inline">Saved</span>
              <span className="font-mono tabular-nums text-slate-600">
                ({savedCount})
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('jobs')}
              className="inline-flex min-h-[38px] items-center justify-center rounded-full bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] whitespace-nowrap shrink-0"
            >
              Browse USD Roles
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Floating Light SaaS Bottom Navigation Dock */}
      <nav
        aria-label="Mobile navigation dock"
        className="no-print md:hidden fixed bottom-2.5 left-2.5 right-2.5 z-40 rounded-2xl border border-slate-200 bg-white/95 py-1.5 shadow-[0_12px_36px_rgba(15,23,42,0.18)] backdrop-blur-xl"
      >
        <div className="flex items-center overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade gap-1 px-3 pr-8">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  mobileTabRefs.current[tab.id] = el;
                }}
                type="button"
                onClick={(e) => {
                  onSelectTab(tab.id);
                  scrollElementIntoCenter(e.currentTarget);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`snap-center shrink-0 min-w-[68px] flex flex-col items-center justify-center py-2 px-2.5 rounded-xl min-h-[48px] transition-all ${
                  isActive
                    ? 'bg-[#1D4ED8] text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="mt-1 text-[11px] font-medium leading-none whitespace-nowrap">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
