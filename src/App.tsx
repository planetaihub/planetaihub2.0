/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  FileText,
  PlayCircle,
  Wallet,
} from 'lucide-react';
import { AdBanner } from './components/AdBanner';
import { CompanyMarquee } from './components/CompanyMarquee';
import { EditorialBriefings } from './components/EditorialBriefings';
import { FocusedPrepWorkspace } from './components/FocusedPrepWorkspace';
import { Footer, type LegalModalType } from './components/Footer';
import { HeroSpotlightShowcase } from './components/HeroSpotlightShowcase';
import { InstallAppModal } from './components/InstallAppModal';
import { Navigation, TABS } from './components/Navigation';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PostJobModal, type PostJobTier } from './components/PostJobModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { ShareToast } from './components/ShareToast';
import { AIAssistantsTab } from './components/tabs/AIAssistantsTab';
import { CareerStudioTab } from './components/tabs/CareerStudioTab';
import { DevToolsTab } from './components/tabs/DevToolsTab';
import { FinanceDocsTab } from './components/tabs/FinanceDocsTab';
import { HealthWeatherTab } from './components/tabs/HealthWeatherTab';
import { JobsBoard } from './components/tabs/JobsBoard';
import { LiveEarningTab } from './components/tabs/LiveEarningTab';
import { ProductivityTab } from './components/tabs/ProductivityTab';
import { VideoAcademyTab } from './components/tabs/VideoAcademyTab';
import { VaAcademyTab } from './components/tabs/VaAcademyTab';
import { SecurityVaultTab } from './components/tabs/SecurityVaultTab';
import type { JobListing, SpotlightVideoConfig, TabId } from './types';
import {
  buildJobPrepPayload,
  type CareerPrepPayload,
  type CareerToolId,
} from './utils/careerPrepTemplates';
import {
  STORAGE_KEYS,
  loadJobNotes,
  loadSavedJobIds,
  readJson,
  saveJobNote,
  saveSavedJobIds,
  writeJson,
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('jobs');
  const [jobViewMode, setJobViewMode] = useState<'all' | 'saved'>('all');
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() =>
    loadSavedJobIds()
  );
  const [postedJobs, setPostedJobs] = useState<JobListing[]>(() =>
    readJson<JobListing[]>(STORAGE_KEYS.POSTED_JOBS, [])
  );
  const [jobNotes, setJobNotes] = useState<Record<string, string>>(() =>
    loadJobNotes()
  );
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [postJobInitialTier, setPostJobInitialTier] =
    useState<PostJobTier>('featured');
  const [spotlightConfig, setSpotlightConfig] =
    useState<SpotlightVideoConfig | null>(() =>
      readJson<SpotlightVideoConfig | null>(STORAGE_KEYS.SPOTLIGHT_VIDEO, null)
    );
  const [careerPrepPayload, setCareerPrepPayload] =
    useState<CareerPrepPayload | null>(null);
  const [focusedPrep, setFocusedPrep] = useState<CareerPrepPayload | null>(null);
  const [academySessionTrigger, setAcademySessionTrigger] = useState<{
    id: string;
    nonce: number;
  } | null>(null);
  const [briefingTrigger, setBriefingTrigger] = useState<{
    id: string;
    nonce: number;
  } | null>(null);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);

  const handleOpenPostJob = (initialTier: PostJobTier = 'featured') => {
    setPostJobInitialTier(initialTier);
    setIsPostJobOpen(true);
  };

  const handleSaveSpotlightVideo = (config: SpotlightVideoConfig) => {
    setSpotlightConfig(config);
    writeJson(STORAGE_KEYS.SPOTLIGHT_VIDEO, config);
  };

  const scrollToElement = (elementId: string) => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const exists = prev.includes(jobId);
      const next = exists
        ? prev.filter((id) => id !== jobId)
        : [jobId, ...prev];
      saveSavedJobIds(next);
      return next;
    });
  };

  const handleUpdateJobNote = (jobId: string, note: string) => {
    const updated = saveJobNote(jobId, note);
    setJobNotes(updated);
  };

  const handlePublishJob = (newJob: JobListing) => {
    setPostedJobs((prev) => {
      const next = [newJob, ...prev];
      writeJson(STORAGE_KEYS.POSTED_JOBS, next);
      return next;
    });
    setActiveTab('jobs');
    setJobViewMode('all');
    scrollToElement('workspace-showcase');
  };

  const handleOpenSavedJobs = () => {
    setActiveTab('jobs');
    setJobViewMode('saved');
    scrollToElement('workspace-showcase');
  };

  const handleSelectTab = (tab: TabId, shouldScroll = true) => {
    setActiveTab(tab);
    if (shouldScroll) {
      scrollToElement('workspace-showcase');
    }
  };

  const handleScrollToWorkspace = () => {
    scrollToElement('workspace-showcase');
  };

  const handleScrollToBriefings = () => {
    scrollToElement('editorial-briefings');
  };

  const handleLoadCareerPrep = (payload: CareerPrepPayload) => {
    setCareerPrepPayload(payload);
    setActiveTab('career-studio');
    scrollToElement('workspace-showcase');
  };

  const handleOpenFocusedPrep = (payload: CareerPrepPayload) => {
    setFocusedPrep(payload);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenJobPrepKit = (job: JobListing) => {
    const payload = buildJobPrepPayload(job, 'resume');
    handleOpenFocusedPrep(payload);
  };

  const handleOpenVideoAcademy = (sessionId?: string) => {
    if (sessionId) {
      setAcademySessionTrigger({ id: sessionId, nonce: Date.now() });
    }
    setActiveTab('video-academy');
    scrollToElement('workspace-showcase');
  };

  const handleOpenBriefingById = (briefingId: string) => {
    setBriefingTrigger({ id: briefingId, nonce: Date.now() });
    scrollToElement('editorial-briefings');
  };

  const handleOpenCareerStudioTool = (tool: CareerToolId = 'role-prep') => {
    setCareerPrepPayload((prev) =>
      prev
        ? { ...prev, targetTool: tool, nonce: Date.now() }
        : {
            nonce: Date.now(),
            targetTool: tool,
            sourceLabel: 'Editorial Training Path',
          }
    );
    setActiveTab('career-studio');
    scrollToElement('workspace-showcase');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'jobs':
        return (
          <JobsBoard
            savedJobIds={savedJobIds}
            postedJobs={postedJobs}
            jobNotes={jobNotes}
            spotlightConfig={spotlightConfig}
            viewMode={jobViewMode}
            onChangeViewMode={setJobViewMode}
            onToggleSave={handleToggleSaveJob}
            onUpdateJobNote={handleUpdateJobNote}
            onOpenPostJob={handleOpenPostJob}
            onOpenPrepKit={handleOpenJobPrepKit}
          />
        );
      case 'career-studio':
        return (
          <CareerStudioTab
            prepPayload={careerPrepPayload}
            onLoadPrepPayload={handleLoadCareerPrep}
            onClearPrepPayload={() => setCareerPrepPayload(null)}
          />
        );
      case 'ai-assistants':
        return <AIAssistantsTab />;
      case 'dev-tools':
        return <DevToolsTab />;
      case 'finance-docs':
        return <FinanceDocsTab />;
      case 'productivity':
        return <ProductivityTab />;
      case 'health-weather':
        return <HealthWeatherTab />;
      case 'live-earning':
        return <LiveEarningTab />;
      case 'video-academy':
        return (
          <VideoAcademyTab
            externalSessionTrigger={academySessionTrigger}
            onOpenBriefing={handleOpenBriefingById}
            onOpenCareerStudio={handleOpenCareerStudioTool}
          />
        );
      case 'va-academy':
        return <VaAcademyTab />;
      case 'security-vault':
        return <SecurityVaultTab />;
    }
  };

  const capabilityCards: Array<{
    title: string;
    description: string;
    ctaLabel: string;
    icon: typeof Briefcase;
    onClick: () => void;
  }> = [
    {
      title: 'Transparent USD Job Directory',
      description:
        'Verified remote AI, RLHF, prompt engineering, and software engineering contracts with upfront USD pay bands and direct ATS links.',
      ctaLabel: 'Open Job Board',
      icon: Briefcase,
      onClick: () => handleSelectTab('jobs'),
    },
    {
      title: 'Local-First Career Studio',
      description:
        'ATS-friendly Resume Builder with photo upload, tailored Cover Letter & Quick Email Drafter, plus Voice & Rubric Interview Prep.',
      ctaLabel: 'Launch Career Studio',
      icon: FileText,
      onClick: () => handleSelectTab('career-studio'),
    },
    {
      title: 'PlanetAI Video Academy',
      description:
        'Curated YouTube workshops on passing AI screening rounds, STAR frameworks, and RLHF grading with actionable checklists.',
      ctaLabel: 'Watch Video Sessions',
      icon: PlayCircle,
      onClick: () => handleSelectTab('video-academy'),
    },
    {
      title: '18 Editorial AI Briefings',
      description:
        'Field notes on evaluation rubrics, studio voice acoustics, async workflows, and global USD contractor compensation.',
      ctaLabel: 'Read Briefings',
      icon: BookOpen,
      onClick: handleScrollToBriefings,
    },
  ];

  const activeTabMeta = TABS.find((t) => t.id === activeTab);

  if (focusedPrep) {
    return (
      <>
        <OfflineIndicator />
        <FocusedPrepWorkspace
          prepPayload={focusedPrep}
          onBackToHub={() => setFocusedPrep(null)}
        />
        <ShareToast />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => handleSelectTab(tab)}
        savedCount={savedJobIds.length}
        onOpenSavedJobs={handleOpenSavedJobs}
        onScrollToWorkspace={handleScrollToWorkspace}
        onScrollToBriefings={handleScrollToBriefings}
        onOpenAbout={() => setLegalModal('about')}
      />

      <OfflineIndicator />

      {/* 1. HOMEPAGE HERO: FEATURED COMPANY VIDEO THEATRE + INSTANT TAILORED CANDIDATE PREP CARD */}
      <HeroSpotlightShowcase
        customSpotlight={spotlightConfig}
        onLoadPrepKit={handleOpenFocusedPrep}
        onOpenFeatureVideoModal={() => handleOpenPostJob('video-spotlight')}
      />

      {/* Light-Slate Partner / Platform Marquee Strip */}
      <section
        aria-label="Featured hiring platforms"
        className="no-print border-y border-slate-200 bg-slate-50"
      >
        <CompanyMarquee variant="light" />
      </section>

      {/* 2. FLOATING INTERACTIVE SaaS WORKSPACE WINDOW */}
      <main className="bg-white">
        <section
          id="workspace-showcase"
          aria-label="PlanetAI Hub Interactive Workspace"
          className="scroll-mt-20 mx-auto max-w-7xl px-4 pt-8 pb-4 sm:px-6 sm:pt-10"
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* SaaS Browser Window Chrome + Complete Workspace Tab Switcher (Zero Clipping) */}
            <div className="no-print border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="ml-2 rounded-lg border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] font-medium text-slate-600 shadow-2xs">
                    planetaihub.com/{activeTab}
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {activeTabMeta?.label} · Zero-Sign-Up Suite
                </span>
              </div>

              <div
                role="tablist"
                aria-label="Workspace modules"
                className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-200/80 pt-3"
              >
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      type="button"
                      onClick={() => handleSelectTab(tab.id, false)}
                      className={`inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                        isActive
                          ? 'bg-[#1D4ED8] text-white font-semibold shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{tab.desktopLabel}</span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={handleScrollToBriefings}
                  className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                >
                  <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Briefings</span>
                </button>
              </div>
            </div>

            {/* Inner Workspace Canvas (Clean 1Password-Style Light SaaS Interface) */}
            <div className="bg-white px-4 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8">
              <div className="no-print">
                <PWAInstallBanner />
              </div>

              {renderTabContent()}
            </div>
          </div>
        </section>

        {/* 3. 4-COLUMN PLATFORM CAPABILITY GRID (Clean White Canvas) */}
        <section
          aria-labelledby="capabilities-heading"
          className="no-print border-b border-slate-200 bg-white py-16 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
                Unified Remote Workflow
              </p>
              <h2
                id="capabilities-heading"
                className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance"
              >
                Everything you need to land remote AI work
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Browse vetted USD contracts, prepare application materials offline, watch interview walkthroughs, and stay current on AI evaluation trends.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {capabilityCards.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.title}
                    type="button"
                    onClick={card.onClick}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1D4ED8]/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                  >
                    <div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#1D4ED8] transition-colors group-hover:bg-[#1D4ED8] group-hover:text-white">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-slate-900">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {card.description}
                      </p>
                    </div>

                    <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] group-hover:gap-2 transition-all">
                      <span>{card.ctaLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => handleSelectTab('finance-docs')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1D4ED8]"
              >
                <Wallet className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
                <span>Also explore Freelance Finance Desk &amp; Invoice Generator →</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4. FULL-WIDTH COBALT BLUE HIGHLIGHT BANNER */}
        <section
          aria-label="Free local-first career suite highlight"
          className="no-print bg-[#1D4ED8] py-14 text-white sm:py-16"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl text-balance">
                100% Free &amp; Browser-Local Career Suite — Zero Accounts, Zero Subscriptions, Direct Employer Links
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-blue-100 sm:text-base">
                Your resumes, client invoices, saved job notes, and expense ledgers never leave your browser. Install as a desktop or mobile PWA anytime.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleSelectTab('jobs')}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#1D4ED8] shadow-md transition-colors hover:bg-blue-50 whitespace-nowrap"
              >
                Browse Remote Roles
              </button>
              <button
                type="button"
                onClick={() => handleOpenPostJob('featured')}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 whitespace-nowrap"
              >
                Post a Job
              </button>
            </div>
          </div>
        </section>

        {/* 5. LIGHT-SLATE EDITORIAL BRIEFINGS HUB (#F8FAFC) */}
        <section
          id="editorial-briefings"
          className="no-print scroll-mt-20 bg-[#F8FAFC] py-16 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <EditorialBriefings
              externalBriefingTrigger={briefingTrigger}
              onOpenVideoAcademy={handleOpenVideoAcademy}
              onOpenCareerStudio={handleOpenCareerStudioTool}
            />
            <div className="mt-10">
              <AdBanner variant="light" />
            </div>
          </div>
        </section>
      </main>

      {/* 6. CORPORATE LIGHT-SLATE FOOTER */}
      <Footer
        onSelectTab={(tab) => handleSelectTab(tab)}
        onScrollToBriefings={handleScrollToBriefings}
        onOpenPostJob={() => handleOpenPostJob('featured')}
        legalModal={legalModal}
        onChangeLegalModal={setLegalModal}
      />

      <PostJobModal
        isOpen={isPostJobOpen}
        initialTier={postJobInitialTier}
        onClose={() => setIsPostJobOpen(false)}
        onPublishJob={handlePublishJob}
        onSubmitVideoSpotlight={handleSaveSpotlightVideo}
      />

      <InstallAppModal />

      <ShareToast />
    </div>
  );
}
