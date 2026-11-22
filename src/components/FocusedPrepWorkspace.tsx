import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileText,
  ListChecks,
  MessageSquare,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import type { CareerPrepPayload } from '../utils/careerPrepTemplates';
import { resolveCompanyKitProfile } from '../utils/companyProfiles';
import { parsePlayableVideoSource } from '../utils/videoUrl';
import { BrandAvatar } from './BrandAvatar';
import { InterviewPrepTool } from './tabs/career/InterviewPrepTool';
import { ResumeBuilderTool } from './tabs/career/ResumeBuilderTool';
import { RubricSimulatorTool } from './tabs/career/RubricSimulatorTool';

interface FocusedPrepWorkspaceProps {
  prepPayload: CareerPrepPayload;
  onBackToHub: () => void;
}

type FocusedKitTool = 'resume' | 'interview';

export const FocusedPrepWorkspace: React.FC<FocusedPrepWorkspaceProps> = ({
  prepPayload,
  onBackToHub,
}) => {
  const [activeKitTool, setActiveKitTool] = useState<FocusedKitTool>(
    prepPayload.targetTool === 'interview' ? 'interview' : 'resume'
  );
  const [clearSignal, setClearSignal] = useState(0);

  useEffect(() => {
    setActiveKitTool(
      prepPayload.targetTool === 'interview' ? 'interview' : 'resume'
    );
  }, [prepPayload.nonce, prepPayload.targetTool]);

  const profile = useMemo(
    () => resolveCompanyKitProfile(prepPayload),
    [prepPayload]
  );

  const customVideoSource = useMemo(
    () =>
      profile.video.customVideoUrl
        ? parsePlayableVideoSource(profile.video.customVideoUrl)
        : null,
    [profile.video.customVideoUrl]
  );

  const handleResetToBlank = () => {
    setClearSignal((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Clean Sticky Single Top Bar — Zero Nested Browser Tab Bars */}
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Left: Back to Hub */}
          <button
            type="button"
            onClick={onBackToHub}
            className="inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 whitespace-nowrap"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            <span>Back to PlanetAI Hub</span>
          </button>

          {/* Center: Active Company & Role */}
          <div className="order-3 flex min-w-0 w-full items-center justify-center gap-2.5 border-t border-slate-100 pt-2.5 md:order-2 md:w-auto md:flex-1 md:border-t-0 md:pt-0">
            <BrandAvatar
              name={profile.company}
              domain={profile.domain}
              size="sm"
            />
            <div className="flex min-w-0 items-center gap-2 text-xs sm:text-sm">
              <span className="truncate font-display font-bold text-slate-900">
                {profile.company}
              </span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span className="truncate font-medium text-slate-600">
                {profile.roleTitle}
              </span>
            </div>
          </div>

          {/* Right: Reset / Clear to Blank + Apply Direct */}
          <div className="order-2 flex shrink-0 items-center gap-2 md:order-3">
            <button
              type="button"
              onClick={handleResetToBlank}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span>Reset / Clear to Blank</span>
            </button>

            <a
              href={profile.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#1D4ED8] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
            >
              <span>Apply Direct (Verified ATS)</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      {/* Distraction-Free Full-Page Workspace */}
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
        {/* 1. VERIFIED COMPANY PROFILE & ROLE OVERVIEW CARD */}
        <section
          aria-labelledby="company-kit-overview-heading"
          className="no-print rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <BrandAvatar
                name={profile.company}
                domain={profile.domain}
                size="md"
              />
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-[#1D4ED8]">
                    Verified Company &amp; Role Kit
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{profile.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{profile.contractType}</span>
                </div>
                <h1
                  id="company-kit-overview-heading"
                  className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance"
                >
                  {profile.roleTitle}
                </h1>
                <p className="text-sm font-medium text-slate-600">
                  {profile.company} ({profile.domain})
                </p>
              </div>
            </div>

            <div className="shrink-0 rounded-xl border border-emerald-200 bg-emerald-50/70 px-5 py-3.5 text-left lg:text-right">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                <ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                <span>Verified USD Pay</span>
              </p>
              <p className="mt-0.5 font-mono text-xl font-bold text-emerald-700 tabular-nums whitespace-nowrap">
                {profile.payBand}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-6">
              <div>
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Building2 className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Company Background &amp; What They Build</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {profile.companyBackground}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  <strong className="font-semibold text-slate-800">What they build:</strong>{' '}
                  {profile.whatTheyBuild}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Screening Format
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {profile.screeningFormat}
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <ListChecks className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
                <span>Key Rubric Expectations</span>
              </h2>
              <ul className="mt-3 space-y-3">
                {profile.rubricExpectations.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4ED8]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 2. TAILORED ROLE WALKTHROUGH VIDEO + STUDY TAKEAWAYS */}
        <section
          aria-labelledby="company-kit-video-heading"
          className="no-print rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-xs">
                {customVideoSource ? (
                  customVideoSource.kind === 'html5' ? (
                    <video
                      key={customVideoSource.src}
                      src={customVideoSource.src}
                      controls
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <iframe
                      key={customVideoSource.embedUrl}
                      src={customVideoSource.embedUrl}
                      title={`${profile.company} — ${profile.video.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  )
                ) : (
                  <iframe
                    key={profile.video.youtubeId}
                    src={`https://www.youtube-nocookie.com/embed/${profile.video.youtubeId}?rel=0`}
                    title={`${profile.company} — ${profile.video.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                )}
              </div>
            </div>

            <div className="space-y-4 lg:col-span-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#1D4ED8]">
                  <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Tailored Role Walkthrough</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {profile.video.instructor} · {profile.video.duration}
                </span>
              </div>

              <h2
                id="company-kit-video-heading"
                className="font-display text-xl font-bold leading-snug text-slate-900 text-balance"
              >
                {profile.video.title}
              </h2>

              <div className="space-y-2.5 border-t border-slate-200 pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Study Takeaways Before Applying
                </p>
                <ul className="space-y-2.5">
                  {profile.video.takeaways.map((takeaway, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-700 sm:text-[13px]"
                    >
                      <span className="mt-0.5 font-mono font-bold text-[#1D4ED8]">
                        0{idx + 1}.
                      </span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. DEDICATED SINGLE-FOCUS TOOL VIEW WITH SIMPLE 2-PILL TOGGLE */}
        <section aria-label="Tailored application builder" className="space-y-6">
          <div className="no-print flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                {activeKitTool === 'resume'
                  ? `Tailored Resume & Cover Letter for ${profile.company}`
                  : `Mock Interview Script & Rubric Simulator for ${profile.company}`}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Pre-loaded for {profile.roleTitle}. Edit inline, copy clean text, or export directly to PDF.
              </p>
            </div>

            {/* Simple 2-Pill Toggle */}
            <div
              role="tablist"
              aria-label="Company kit preparation tools"
              className="inline-flex self-start rounded-full border border-slate-200 bg-white p-1 shadow-2xs sm:self-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeKitTool === 'resume'}
                onClick={() => setActiveKitTool('resume')}
                className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeKitTool === 'resume'
                    ? 'bg-[#1D4ED8] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Tailored Resume &amp; Cover Letter</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeKitTool === 'interview'}
                onClick={() => setActiveKitTool('interview')}
                className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeKitTool === 'interview'
                    ? 'bg-[#1D4ED8] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Mock Interview Script</span>
              </button>
            </div>
          </div>

          {activeKitTool === 'resume' ? (
            <ResumeBuilderTool
              prepPayload={prepPayload}
              clearSignal={clearSignal}
            />
          ) : (
            <div className="space-y-10">
              <InterviewPrepTool
                prepPayload={prepPayload}
                clearSignal={clearSignal}
              />

              <div className="space-y-4 border-t border-slate-200 pt-8">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Screening Readiness &amp; Application Rubric Simulator
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Run a quick pre-submit audit against {profile.company}&apos;s quality criteria before clicking Apply Direct.
                  </p>
                </div>
                <RubricSimulatorTool clearSignal={clearSignal} />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
