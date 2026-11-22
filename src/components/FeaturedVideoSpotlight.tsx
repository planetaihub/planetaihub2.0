import React, { useMemo } from 'react';
import {
  ArrowRight,
  Clock,
  Globe,
  PlayCircle,
  ShieldCheck,
  Video,
} from 'lucide-react';
import type { SpotlightVideoConfig } from '../types';
import { parsePlayableVideoSource } from '../utils/videoUrl';
import { BrandTile } from './BrandAvatar';

interface FeaturedVideoSpotlightProps {
  spotlightConfig?: SpotlightVideoConfig | null;
  onViewRoles: (companyQuery: string) => void;
  onSubmitVideoSpotlight: () => void;
}

const DEFAULT_COMPANY: SpotlightVideoConfig = {
  company: 'micro1',
  domain: 'micro1.ai',
  tagline: 'Remote AI Training, RLHF & Software Engineering',
  summary:
    'micro1 connects global software engineers, data scientists, and domain experts directly with frontier AI labs for asynchronous model evaluation, code benchmarks, and full-time remote engineering teams.',
  payRange: '$50 – $85 / hr',
  videoUrl: '',
};

interface WalkthroughFallback {
  youtubeId: string;
  label: string;
  instructor: string;
}

function resolveRoleWalkthroughVideo(
  company: string,
  tagline: string
): WalkthroughFallback {
  const haystack = `${company} ${tagline}`.toLowerCase();

  if (/\b(voice|audio|speech|babel|spout|elevenlabs)\b/.test(haystack)) {
    return {
      youtubeId: 'CZ7cLoZzVoY',
      label: 'Voice AI Acoustic & Audition Walkthrough',
      instructor: 'Lenny B',
    };
  }

  if (/\b(mercor|behavioral|star)\b/.test(haystack)) {
    return {
      youtubeId: 'd2AnPgnCNZM',
      label: 'Structured STAR & AI Vetting Walkthrough',
      instructor: 'Aced (Exponent)',
    };
  }

  if (/\b(prompt|anthropic|llm workflow|rag)\b/.test(haystack)) {
    return {
      youtubeId: '8ib4Qnh2HFE',
      label: 'Systematic AI Prompting & Workflow Guide',
      instructor: 'DeepLearning.AI',
    };
  }

  if (/\b(outlier|rlhf|annotation|rubric|dataannotation|scale)\b/.test(haystack) && !haystack.includes('micro1')) {
    return {
      youtubeId: 'T_X4XFwKX8k',
      label: 'RLHF Preference Ranking & Rubric Walkthrough',
      instructor: 'IBM Technology',
    };
  }

  return {
    youtubeId: 'jPKTo1iGQiE',
    label: 'Technical System & AI Vetting Walkthrough',
    instructor: 'NeetCode',
  };
}

export const FeaturedVideoSpotlight: React.FC<FeaturedVideoSpotlightProps> = ({
  spotlightConfig,
  onViewRoles,
  onSubmitVideoSpotlight,
}) => {
  const activeCompany = spotlightConfig?.company ? spotlightConfig : DEFAULT_COMPANY;

  const customPlayable = useMemo(
    () =>
      spotlightConfig?.videoUrl
        ? parsePlayableVideoSource(spotlightConfig.videoUrl)
        : null,
    [spotlightConfig?.videoUrl]
  );

  const fallbackVideo = useMemo(
    () => resolveRoleWalkthroughVideo(activeCompany.company, activeCompany.tagline),
    [activeCompany.company, activeCompany.tagline]
  );

  const hasCustomVideo = Boolean(customPlayable);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md md:p-8">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left Side: Clean 16:9 Playable Company Video or Smart Role-Specific Walkthrough Fallback */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              <span>
                {hasCustomVideo
                  ? 'Featured Employer Commercial'
                  : 'Featured Employer Spotlight'}
              </span>
            </span>

            <span className="text-xs font-medium text-slate-500">
              {hasCustomVideo
                ? `${activeCompany.company} Spotlight Video`
                : `${fallbackVideo.label} · ${fallbackVideo.instructor}`}
            </span>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm">
            {customPlayable ? (
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
                  title={`${activeCompany.company} Commercial Video Spotlight`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              )
            ) : (
              <iframe
                key={fallbackVideo.youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${fallbackVideo.youtubeId}?rel=0`}
                title={`${activeCompany.company} — ${fallbackVideo.label}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            )}
          </div>
        </div>

        {/* Right Side: Company Info, Pay Band & Employer Video Submission CTA */}
        <div className="flex flex-col justify-between space-y-5 lg:col-span-5">
          <div>
            <div className="flex items-center gap-3.5">
              <BrandTile name={activeCompany.company} size="lg" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-bold tracking-tight text-slate-900">
                    {activeCompany.company}
                  </h3>
                  <span className="text-xs font-semibold text-[#1D4ED8]">
                    · Verified Partner
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  {activeCompany.tagline}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {activeCompany.summary}
            </p>

            {/* Verified USD Pay Band Highlight */}
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  <span>Verified USD Pay</span>
                </span>
                <span className="font-mono text-base font-bold text-emerald-700 tabular-nums">
                  {activeCompany.payRange}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                  Worldwide Remote
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                  Flexible &amp; Full-Time
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => onViewRoles(activeCompany.company)}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
            >
              <span>View Open Roles</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onSubmitVideoSpotlight}
              className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#1D4ED8]/40 hover:bg-blue-50/50 hover:text-[#1D4ED8] whitespace-nowrap"
            >
              <Video className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Submit Your Company Video Spotlight</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
