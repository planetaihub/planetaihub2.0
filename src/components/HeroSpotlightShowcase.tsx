import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Video,
} from 'lucide-react';
import type { SpotlightVideoConfig } from '../types';
import {
  HERO_COMPANY_SPOTLIGHTS,
  type CareerPrepPayload,
  type HeroCompanySpotlight,
  resolveSpotlightApplyUrl,
} from '../utils/careerPrepTemplates';
import { parsePlayableVideoSource } from '../utils/videoUrl';
import { BrandAvatar } from './BrandAvatar';

interface HeroSpotlightShowcaseProps {
  customSpotlight?: SpotlightVideoConfig | null;
  onLoadPrepKit: (payload: CareerPrepPayload) => void;
  onOpenFeatureVideoModal: () => void;
}

export const HeroSpotlightShowcase: React.FC<HeroSpotlightShowcaseProps> = ({
  customSpotlight,
  onLoadPrepKit,
  onOpenFeatureVideoModal,
}) => {
  const [selectedId, setSelectedId] = useState<'micro1' | 'mercor' | 'outlier' | 'custom'>(() =>
    customSpotlight?.videoUrl ? 'custom' : 'micro1'
  );

  const customPlayable = useMemo(
    () =>
      customSpotlight?.videoUrl
        ? parsePlayableVideoSource(customSpotlight.videoUrl)
        : null,
    [customSpotlight?.videoUrl]
  );

  const selectedPreset: HeroCompanySpotlight = useMemo(() => {
    const found = HERO_COMPANY_SPOTLIGHTS.find((c) => c.id === selectedId);
    return found ?? HERO_COMPANY_SPOTLIGHTS[0];
  }, [selectedId]);

  const isCustomActive = selectedId === 'custom' && Boolean(customSpotlight && customPlayable);

  const displayCompany = isCustomActive && customSpotlight
    ? customSpotlight.company
    : selectedPreset.company;
  const displayDomain = isCustomActive && customSpotlight
    ? customSpotlight.domain
    : selectedPreset.domain;
  const displayRole = isCustomActive && customSpotlight
    ? customSpotlight.tagline
    : selectedPreset.roleTitle;
  const displayPayBand = isCustomActive && customSpotlight
    ? customSpotlight.payRange
    : selectedPreset.payBand;
  const displayRequirements = isCustomActive && customSpotlight
    ? [
        customSpotlight.summary,
        `Verified transparent USD compensation (${customSpotlight.payRange})`,
        'Direct employer ATS link with async remote screening',
      ]
    : selectedPreset.requirements;

  const directApplyHref = isCustomActive && customSpotlight
    ? `https://${customSpotlight.domain.replace(/^https?:\/\//, '')}`
    : resolveSpotlightApplyUrl(selectedPreset);

  const handleLoadResume = () => {
    const template = selectedPreset.resumeTemplate;
    onLoadPrepKit({
      nonce: Date.now(),
      targetTool: 'resume',
      sourceLabel: `${displayCompany} · ${displayRole}`,
      roleBundleId: selectedPreset.roleBundleId,
      companyDomain: displayDomain,
      applyUrl: directApplyHref,
      payBand: displayPayBand,
      customVideoUrl:
        isCustomActive && customSpotlight ? customSpotlight.videoUrl : undefined,
      resume: {
        targetTitle: isCustomActive ? displayRole : template.targetTitle,
        targetCompany: displayCompany,
        summary: isCustomActive && customSpotlight
          ? customSpotlight.summary
          : template.summary,
        skills: template.skills,
        experienceRole: template.role,
        experienceBullets: template.bullets,
      },
      interview: selectedPreset.interviewTemplate,
    });
  };

  const handleLoadInterview = () => {
    onLoadPrepKit({
      nonce: Date.now(),
      targetTool: 'interview',
      sourceLabel: `${displayCompany} · Mock Interview Script`,
      roleBundleId: selectedPreset.roleBundleId,
      companyDomain: displayDomain,
      applyUrl: directApplyHref,
      payBand: displayPayBand,
      customVideoUrl:
        isCustomActive && customSpotlight ? customSpotlight.videoUrl : undefined,
      resume: {
        targetTitle: isCustomActive ? displayRole : selectedPreset.resumeTemplate.targetTitle,
        targetCompany: displayCompany,
        summary: isCustomActive && customSpotlight
          ? customSpotlight.summary
          : selectedPreset.resumeTemplate.summary,
        skills: selectedPreset.resumeTemplate.skills,
        experienceRole: selectedPreset.resumeTemplate.role,
        experienceBullets: selectedPreset.resumeTemplate.bullets,
      },
      interview: selectedPreset.interviewTemplate,
    });
  };

  return (
    <section className="no-print bg-gradient-to-b from-slate-50 via-white to-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pt-7 pb-9 sm:px-6 sm:pt-10 sm:pb-12">
        {/* Compact Editorial Intro Strip Engineered to Keep Full Split Above the Fold */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1D4ED8]">
              1 Click, You Have It All · Remote AI Careers &amp; Prep Kits
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] text-balance">
              Transparent-pay remote AI roles, prepared in one click
            </h1>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm">
            Watch vetted company walkthroughs, launch your tailored resume &amp; mock interview script, and apply direct via verified USD ATS links.
          </p>
        </div>

        {/* 2-Column Side-by-Side Split Showcase (Immediate Above-the-Fold View) */}
        <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-7">
          {/* LEFT COLUMN: Featured Company Video Theatre */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-md lg:col-span-7 sm:p-6">
            <div className="space-y-3.5">
              {/* Company Switcher Pills + Employer CTA */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div
                  role="tablist"
                  aria-label="Featured company spotlights"
                  className="flex flex-wrap items-center gap-2"
                >
                  {HERO_COMPANY_SPOTLIGHTS.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setSelectedId(item.id)}
                        className={`inline-flex min-h-[36px] items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                          isSelected
                            ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span>{item.company}</span>
                      </button>
                    );
                  })}

                  {customSpotlight && customPlayable && (
                    <button
                      type="button"
                      role="tab"
                      aria-selected={selectedId === 'custom'}
                      onClick={() => setSelectedId('custom')}
                      className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                        selectedId === 'custom'
                          ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-xs'
                          : 'border-blue-200 bg-blue-50 text-[#1D4ED8] hover:bg-blue-100'
                      }`}
                    >
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      <span>{customSpotlight.company}</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onOpenFeatureVideoModal}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#1D4ED8]/40 hover:bg-blue-50/50 hover:text-[#1D4ED8] whitespace-nowrap"
                >
                  <Video className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Feature Your Company Video</span>
                </button>
              </div>

              {/* 16:9 Playable Privacy-Enhanced Video Frame */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm">
                {isCustomActive && customPlayable ? (
                  customPlayable.kind === 'html5' ? (
                    <video
                      key={customPlayable.src}
                      src={customPlayable.src}
                      controls
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <iframe
                      key={customPlayable.embedUrl}
                      src={customPlayable.embedUrl}
                      title={`${displayCompany} Company Video Spotlight`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  )
                ) : (
                  <iframe
                    key={selectedPreset.youtubeId}
                    src={`https://www.youtube-nocookie.com/embed/${selectedPreset.youtubeId}?rel=0`}
                    title={`${selectedPreset.company} — ${selectedPreset.videoLabel}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                )}
              </div>
            </div>

            {/* Clean Unboxed Metadata Footer */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#1D4ED8]">
                  Role Walkthrough
                </span>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <span className="font-medium text-slate-800">
                  {isCustomActive
                    ? `${displayCompany} Commercial Video Spotlight`
                    : selectedPreset.videoLabel}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                100% Browser-Local · Zero Sign-Up
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Instant Tailored Candidate Prep Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xl lg:col-span-5 sm:p-6">
            <div>
              <div className="flex items-center gap-3 min-w-0">
                <BrandAvatar
                  name={displayCompany}
                  domain={displayDomain}
                  size="md"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D4ED8]">
                    Tailored Candidate Prep Kit
                  </p>
                  <h2 className="truncate font-display text-xl font-bold text-slate-900">
                    {displayCompany}
                  </h2>
                  <p className="truncate text-xs font-medium text-slate-500">
                    {displayRole}
                  </p>
                </div>
              </div>

              {/* Verified USD Pay Band Box */}
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                    <span>Verified USD Pay</span>
                  </span>
                  <span className="font-mono text-base font-bold text-emerald-700 tabular-nums">
                    {displayPayBand}
                  </span>
                </div>
                {!isCustomActive && (
                  <p className="mt-1 text-[11px] text-slate-600">
                    <strong className="text-slate-800">Screening:</strong>{' '}
                    {selectedPreset.screeningFocus}
                  </p>
                )}
              </div>

              {/* Key Role Requirements */}
              <div className="mt-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Key Role Requirements
                </h3>
                <ul className="mt-2.5 space-y-2">
                  {displayRequirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-700"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1D4ED8]"
                        aria-hidden="true"
                      />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3 Tailored 1-Click Preparation Actions */}
            <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleLoadResume}
                className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full bg-[#1D4ED8] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
              >
                <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Load Tailored Resume Template</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleLoadInterview}
                className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-5 py-2 text-xs font-semibold text-[#1D4ED8] transition-colors hover:border-[#1D4ED8] hover:bg-blue-100/70 whitespace-nowrap"
              >
                <MessageSquare className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Open Mock Interview Script</span>
              </button>

              <a
                href={directApplyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap"
              >
                <span>Apply Direct (Verified ATS)</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
