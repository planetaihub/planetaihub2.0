import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Share2,
  SlidersHorizontal,
} from 'lucide-react';
import { REMOTE_JOBS } from '../../data/jobs';
import type {
  JobCategory,
  JobListing,
  JobRoleLevel,
  RemoteRegion,
  SpotlightVideoConfig,
} from '../../types';
import { AdBanner } from '../AdBanner';
import { BrandTile, resolveBrandDomain, getCompanyMark, getCompanyTheme } from '../BrandAvatar';
import { FeaturedVideoSpotlight } from '../FeaturedVideoSpotlight';
import { JobDetailModal } from '../JobDetailModal';
import type { PostJobTier } from '../PostJobModal';
import { resolveApplyUrl } from '../../utils/referralLinks';
import { shareContent } from '../../utils/shareHelper';

interface JobsBoardProps {
  savedJobIds: string[];
  postedJobs: JobListing[];
  jobNotes: Record<string, string>;
  spotlightConfig?: SpotlightVideoConfig | null;
  viewMode: 'all' | 'saved';
  onChangeViewMode: (mode: 'all' | 'saved') => void;
  onToggleSave: (jobId: string) => void;
  onUpdateJobNote: (jobId: string, note: string) => void;
  onOpenPostJob: (initialTier?: PostJobTier) => void;
  onOpenPrepKit: (job: JobListing) => void;
}

const CATEGORIES: Array<'All' | JobCategory> = [
  'All',
  'AI Training & RLHF',
  'Prompt Engineering',
  'Audio & Voice AI',
  'AI Evaluation',
  'AI Safety',
  'AI Operations',
  'Engineering',
  'Developer Relations',
  'Design & UI',
];

const ROLE_TYPES: Array<'All' | JobRoleLevel> = [
  'All',
  'Full-time',
  'Contract',
  'Freelance',
  'Part-time',
];

const REGIONS: Array<'All' | RemoteRegion> = [
  'All',
  'Worldwide',
  'Americas',
  'Europe / EMEA',
  'US Only',
  'APAC',
];

const PAY_THRESHOLDS = [
  { label: 'Any Pay', minUsd: 0 },
  { label: '$50k+ / yr eq.', minUsd: 50000 },
  { label: '$90k+ / yr eq.', minUsd: 90000 },
  { label: '$140k+ / yr eq.', minUsd: 140000 },
  { label: '$180k+ / yr eq.', minUsd: 180000 },
];

type QuickFilterKey =
  | 'entry-level'
  | 'pay-shown'
  | 'contract'
  | 'full-time'
  | 'ph-apac';

const QUICK_FILTERS: Array<{ key: QuickFilterKey; label: string }> = [
  { key: 'entry-level', label: 'Entry Level' },
  { key: 'pay-shown', label: 'Pay Shown' },
  { key: 'contract', label: 'Contract' },
  { key: 'full-time', label: 'Full-Time' },
  { key: 'ph-apac', label: 'PH / APAC Friendly' },
];

const INITIAL_JOBS_COUNT = 12;
const JOBS_PAGE_STEP = 12;

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function normalizeRemotiveType(rawType?: string): JobRoleLevel {
  const lower = (rawType || '').toLowerCase();
  if (lower.includes('contract')) return 'Contract';
  if (lower.includes('part')) return 'Part-time';
  if (lower.includes('freelance')) return 'Freelance';
  return 'Full-time';
}

export const JobsBoard: React.FC<JobsBoardProps> = ({
  savedJobIds,
  postedJobs,
  jobNotes,
  spotlightConfig,
  viewMode,
  onChangeViewMode,
  onToggleSave,
  onUpdateJobNote,
  onOpenPostJob,
  onOpenPrepKit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | JobCategory>(
    'All'
  );
  const [selectedType, setSelectedType] = useState<'All' | JobRoleLevel>('All');
  const [selectedRegion, setSelectedRegion] = useState<'All' | RemoteRegion>(
    'All'
  );
  const [minPayUsd, setMinPayUsd] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'curated' | 'highest-pay'>('curated');
  const [entryLevelOnly, setEntryLevelOnly] = useState(false);
  const [payShownOnly, setPayShownOnly] = useState(false);
  const [apacFriendlyOnly, setApacFriendlyOnly] = useState(false);
  const [visibleJobCount, setVisibleJobCount] =
    useState<number>(INITIAL_JOBS_COUNT);
  const [activeJob, setActiveJob] = useState<JobListing | null>(null);

  const [liveAtsJobs, setLiveAtsJobs] = useState<JobListing[]>([]);
  const [atsSyncStatus, setAtsSyncStatus] = useState<
    'idle' | 'syncing' | 'synced' | 'offline'
  >('idle');

  const syncLiveAtsFeeds = async (signal?: AbortSignal) => {
    setAtsSyncStatus('syncing');
    try {
      const [remotiveRes, jobicyRes] = await Promise.allSettled([
        fetch(
          'https://remotive.com/api/remote-jobs?category=software-dev&limit=6',
          { signal }
        ),
        fetch(
          'https://jobicy.com/api/v2/remote-jobs?count=6&industry=tech',
          { signal }
        ),
      ]);

      const synced: JobListing[] = [];

      if (remotiveRes.status === 'fulfilled' && remotiveRes.value.ok) {
        const data = (await remotiveRes.value.json()) as {
          jobs?: Array<{
            id: number;
            title: string;
            company_name: string;
            salary?: string;
            candidate_required_location?: string;
            job_type?: string;
            publication_date?: string;
            url: string;
          }>;
        };
        for (const item of (data.jobs || []).slice(0, 6)) {
          const pay = item.salary?.trim() || 'USD Salary (ATS)';
          synced.push({
            id: `remotive-${item.id}`,
            title: item.title,
            company: item.company_name,
            category: 'Engineering',
            payRange: pay,
            location: item.candidate_required_location || 'Remote (Worldwide)',
            type: normalizeRemotiveType(item.job_type),
            source: 'Live ATS · Remotive',
            postedAt: (item.publication_date || '').slice(0, 10) || 'Live',
            applyUrl: resolveApplyUrl(item.company_name, item.url),
            companyDomain: resolveBrandDomain(item.company_name),
            region: 'Worldwide',
            payMinUsd: item.salary ? 80000 : 0,
            payMaxUsd: item.salary ? 150000 : 0,
            summary: `Live synced remote opening at ${item.company_name} via Remotive ATS.`,
            stack: ['Live ATS', 'Remote', 'Software Engineering'],
            responsibilities: [
              `Collaborate remotely with ${item.company_name} product and engineering teams.`,
              'Review full job specification directly on the employer ATS page.',
            ],
            requirements: [
              `Remote eligibility in ${item.candidate_required_location || 'listed regions'}.`,
            ],
            timezoneNote: item.candidate_required_location || 'Remote',
          });
        }
      }

      if (jobicyRes.status === 'fulfilled' && jobicyRes.value.ok) {
        const data = (await jobicyRes.value.json()) as {
          jobs?: Array<{
            id: number;
            jobTitle: string;
            companyName: string;
            annualSalaryMin?: string;
            annualSalaryMax?: string;
            salaryCurrency?: string;
            jobGeo?: string;
            jobType?: string[];
            pubDate?: string;
            url: string;
          }>;
        };
        for (const item of (data.jobs || []).slice(0, 6)) {
          const minNum = Number(item.annualSalaryMin || 0);
          const maxNum = Number(item.annualSalaryMax || 0);
          const hasPay = minNum > 0 || maxNum > 0;
          const payRange = hasPay
            ? `$${Math.round((minNum || maxNum) / 1000)}k - $${Math.round((maxNum || minNum) / 1000)}k / yr`
            : 'Competitive Remote Pay';
          synced.push({
            id: `jobicy-${item.id}`,
            title: item.jobTitle,
            company: item.companyName,
            category: 'AI Operations',
            payRange,
            location: item.jobGeo || 'Remote (Worldwide)',
            type: normalizeRemotiveType(item.jobType?.[0]),
            source: 'Live ATS · Jobicy',
            postedAt: (item.pubDate || '').slice(0, 10) || 'Live',
            applyUrl: resolveApplyUrl(item.companyName, item.url),
            companyDomain: resolveBrandDomain(item.companyName),
            region: 'Worldwide',
            payMinUsd: minNum,
            payMaxUsd: maxNum,
            summary: `Live synced remote tech opening at ${item.companyName} via Jobicy ATS.`,
            stack: ['Live ATS', 'Tech', item.jobGeo || 'Worldwide'],
            responsibilities: [
              `Contribute remotely to ${item.companyName} operations and delivery.`,
            ],
            requirements: [`Eligible in ${item.jobGeo || 'Worldwide'}.`],
            timezoneNote: item.jobGeo || 'Remote',
          });
        }
      }

      if (synced.length > 0) {
        setLiveAtsJobs(synced);
        setAtsSyncStatus('synced');
      } else {
        setAtsSyncStatus('offline');
      }
    } catch {
      setAtsSyncStatus('offline');
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    syncLiveAtsFeeds(controller.signal);
    return () => controller.abort();
  }, []);

  // Reset pagination back to initial 9 rows whenever filter criteria change
  useEffect(() => {
    setVisibleJobCount(INITIAL_JOBS_COUNT);
  }, [
    searchQuery,
    selectedCategory,
    selectedType,
    selectedRegion,
    minPayUsd,
    payShownOnly,
    entryLevelOnly,
    apacFriendlyOnly,
    sortBy,
    viewMode,
  ]);

  const allJobs = useMemo(
    () => [...postedJobs, ...REMOTE_JOBS, ...liveAtsJobs],
    [postedJobs, liveAtsJobs]
  );

  // Auto-open shared job modal if visited via ?job=<id>
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sharedJobId = new URLSearchParams(window.location.search).get('job');
    if (!sharedJobId) return;
    const matched = allJobs.find((j) => j.id === sharedJobId);
    if (matched) {
      setActiveJob(matched);
    }
  }, [allJobs]);

  const featuredJobs = useMemo(() => {
    const picks: JobListing[] = [...postedJobs.slice(0, 2)];
    for (const job of REMOTE_JOBS) {
      if (job.featured && !picks.some((p) => p.id === job.id)) {
        picks.push(job);
      }
      if (picks.length >= 4) break;
    }
    const preferredIds = [
      'curated-001',
      'curated-005',
      'curated-002',
      'curated-003',
    ];
    for (const id of preferredIds) {
      if (picks.length >= 4) break;
      const found = REMOTE_JOBS.find((j) => j.id === id);
      if (found && !picks.some((p) => p.id === found.id)) {
        picks.push(found);
      }
    }
    return picks.slice(0, 4);
  }, [postedJobs]);

  const savedSet = useMemo(() => new Set(savedJobIds), [savedJobIds]);

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matched = allJobs.filter((job) => {
      if (viewMode === 'saved' && !savedSet.has(job.id)) {
        return false;
      }
      if (selectedCategory !== 'All' && job.category !== selectedCategory) {
        return false;
      }
      if (selectedType !== 'All' && job.type !== selectedType) {
        return false;
      }
      if (selectedRegion !== 'All' && job.region !== selectedRegion) {
        return false;
      }
      if (minPayUsd > 0 && job.payMaxUsd < minPayUsd) {
        return false;
      }
      if (payShownOnly && !job.payRange.includes('$')) {
        return false;
      }
      if (entryLevelOnly) {
        const lowerTitle = `${job.title} ${job.category} ${job.type}`.toLowerCase();
        const isEntry =
          lowerTitle.includes('trainer') ||
          lowerTitle.includes('bilingual') ||
          lowerTitle.includes('specialist') ||
          lowerTitle.includes('associate') ||
          lowerTitle.includes('junior') ||
          lowerTitle.includes('entry') ||
          lowerTitle.includes('freelance');
        if (!isEntry) return false;
      }
      if (apacFriendlyOnly) {
        const loc = `${job.location} ${job.region}`.toLowerCase();
        const isApacFriendly =
          loc.includes('worldwide') ||
          loc.includes('global') ||
          loc.includes('apac') ||
          loc.includes('ph');
        if (!isApacFriendly) return false;
      }
      if (query) {
        const haystack = [
          job.title,
          job.company,
          job.category,
          job.location,
          job.type,
          job.summary,
          job.source,
          ...job.stack,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }
      return true;
    });

    if (sortBy === 'highest-pay') {
      return [...matched].sort((a, b) => b.payMaxUsd - a.payMaxUsd);
    }
    return matched;
  }, [
    allJobs,
    searchQuery,
    selectedCategory,
    selectedType,
    selectedRegion,
    minPayUsd,
    payShownOnly,
    entryLevelOnly,
    apacFriendlyOnly,
    sortBy,
    viewMode,
    savedSet,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedType !== 'All' ||
    selectedRegion !== 'All' ||
    minPayUsd > 0 ||
    entryLevelOnly ||
    payShownOnly ||
    apacFriendlyOnly;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedType('All');
    setSelectedRegion('All');
    setMinPayUsd(0);
    setEntryLevelOnly(false);
    setPayShownOnly(false);
    setApacFriendlyOnly(false);
    setSortBy('curated');
  };

  const isQuickFilterActive = (key: QuickFilterKey): boolean => {
    switch (key) {
      case 'entry-level':
        return entryLevelOnly;
      case 'pay-shown':
        return payShownOnly;
      case 'contract':
        return selectedType === 'Contract';
      case 'full-time':
        return selectedType === 'Full-time';
      case 'ph-apac':
        return apacFriendlyOnly;
    }
  };

  const toggleQuickFilter = (key: QuickFilterKey) => {
    switch (key) {
      case 'entry-level':
        setEntryLevelOnly((prev) => !prev);
        break;
      case 'pay-shown':
        setPayShownOnly((prev) => !prev);
        break;
      case 'contract':
        setSelectedType((prev) => (prev === 'Contract' ? 'All' : 'Contract'));
        break;
      case 'full-time':
        setSelectedType((prev) => (prev === 'Full-time' ? 'All' : 'Full-time'));
        break;
      case 'ph-apac':
        setApacFriendlyOnly((prev) => !prev);
        break;
    }
  };

  // Paginated visible slice (12 cards initially, +12 per Show more click)
  const visibleJobs = useMemo(
    () => filteredJobs.slice(0, visibleJobCount),
    [filteredJobs, visibleJobCount]
  );
  const remainingJobsCount = Math.max(0, filteredJobs.length - visibleJobs.length);
  const allJobsShown = remainingJobsCount === 0 && filteredJobs.length > INITIAL_JOBS_COUNT;

  // Chunk visible jobs in balanced groups of 12 so one manual <AdBanner /> renders cleanly below each grid section
  const jobChunks = useMemo(() => chunkArray(visibleJobs, 12), [visibleJobs]);

  const handleViewSpotlightRoles = (companyQuery: string) => {
    onChangeViewMode('all');
    setSelectedCategory('All');
    setSelectedType('All');
    setSelectedRegion('All');
    setMinPayUsd(0);
    setEntryLevelOnly(false);
    setPayShownOnly(false);
    setApacFriendlyOnly(false);
    setSearchQuery(companyQuery || 'micro1');
    if (typeof document !== 'undefined') {
      document
        .getElementById('jobs-directory-list')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section aria-labelledby="jobs-heading" className="space-y-10">
      {/* 1. WORKSPACE SEARCH HEADER & FEATURED COMPANY VIDEO SPOTLIGHT */}
      <div className="space-y-8 border-b border-slate-200 pb-10">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[#1D4ED8]">
              Live Role Feed
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono font-semibold text-emerald-700 tabular-nums">
              {allJobs.length} Active Remote Roles
            </span>
            <span aria-hidden="true">·</span>
            <span>Transparent USD Pay</span>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2
                id="jobs-heading"
                className="font-display text-2xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-3xl text-balance"
              >
                Curated Remote AI &amp; Engineering Roles
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                Search RLHF, prompt engineering, voice AI, and full-stack software openings across{' '}
                <strong className="font-mono text-emerald-700 tabular-nums">
                  {allJobs.length}
                </strong>{' '}
                verified roles with direct employer ATS links and zero middlemen.
              </p>
            </div>
          </div>

          {/* Integrated Search + Primary Cobalt CTA */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search role, company, or AI skill..."
                aria-label="Search jobs by role, company, or skill"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pr-3.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs transition-colors focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => onOpenPostJob('featured')}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1D4ED8] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Post a Job</span>
            </button>
          </div>

          {/* Quick Filter Pills */}
          <div
            aria-label="Quick job filters"
            className="flex items-center gap-2 overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade px-1 pr-8 pb-1 sm:px-0 sm:pr-0"
          >
            {QUICK_FILTERS.map((pill) => {
              const active = isQuickFilterActive(pill.key);
              return (
                <button
                  key={pill.key}
                  type="button"
                  onClick={(e) => {
                    toggleQuickFilter(pill.key);
                    if (window.innerWidth <= 768) {
                      e.currentTarget.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'center',
                        block: 'nearest',
                      });
                    }
                  }}
                  aria-pressed={active}
                  className={`snap-center shrink-0 whitespace-nowrap min-h-[38px] rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white font-semibold shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Wide 1Password-Style Featured Company Video Spotlight */}
        <FeaturedVideoSpotlight
          spotlightConfig={spotlightConfig}
          onViewRoles={handleViewSpotlightRoles}
          onSubmitVideoSpotlight={() => onOpenPostJob('video-spotlight')}
        />
      </div>

      {/* 2. HIGH-CONTRAST FEATURED JOBS SPOTLIGHT (4-CARD ROW) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              Featured Spotlight
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Top Transparent-Pay Openings
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Hand-verified hourly &amp; salaried remote contracts
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredJobs.map((job) => {
            const isSaved = savedSet.has(job.id);
            const theme = getCompanyTheme(job.company);
            return (
              <article
                key={`featured-${job.id}`}
                className={`group relative overflow-hidden flex flex-col justify-between rounded-2xl border border-slate-200/90 ${theme.cardBgClass} p-5 text-slate-900 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1D4ED8]/40 hover:shadow-xl`}
              >
                <div
                  className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                  aria-hidden="true"
                >
                  <div className={`absolute -bottom-5 -right-5 flex items-center justify-center font-display font-black tracking-tighter select-none text-[110px] leading-none opacity-[0.12] group-hover:opacity-[0.18] transition-opacity duration-300 ${theme.watermarkColor}`}>
                    {getCompanyMark(job.company)}
                  </div>
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <BrandTile name={job.company} />
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onToggleSave(job.id)}
                          aria-pressed={isSaved}
                          aria-label={
                            isSaved
                              ? `Remove ${job.title} from saved`
                              : `Save ${job.title}`
                          }
                          className={`inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-xl border transition-colors ${
                            isSaved
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <Bookmark
                            className={`h-3.5 w-3.5 ${
                              isSaved ? 'fill-emerald-600 text-emerald-600' : ''
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const origin =
                              typeof window !== 'undefined'
                                ? window.location.origin
                                : 'https://planetaihub.com';
                            void shareContent({
                              title: `${job.title} at ${job.company}`,
                              text: `${job.title} at ${job.company} (${job.payRange})`,
                              url: `${origin}/?job=${encodeURIComponent(job.id)}`,
                            });
                          }}
                          aria-label={`Share ${job.title} at ${job.company}`}
                          className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-[#1D4ED8]"
                        >
                          <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-700 tabular-nums">
                        {job.payRange}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1D4ED8]">
                        Featured
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-base font-bold leading-snug text-slate-900 line-clamp-2">
                      <button
                        type="button"
                        onClick={() => setActiveJob(job)}
                        className="text-left transition-colors hover:text-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                      >
                        {job.title}
                      </button>
                    </h3>

                    <p className="mt-1.5 text-xs font-semibold text-slate-700">
                      {job.company}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        {job.location}
                      </span>
                      <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-[#1D4ED8]">
                        {job.category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-3.5">
                    <button
                      type="button"
                      onClick={() => onOpenPrepKit(job)}
                      className="inline-flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-full bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
                    >
                      <span>Open 1-Click Kit →</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* 3. DIRECTORY CONTROLS: VIEW SWITCHER, CATEGORY STRIP & FACET FILTERS */}
      <div id="jobs-directory-list" className="scroll-mt-24 space-y-4 border-t border-slate-200 pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Live Directory
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              All Remote AI &amp; Tech Positions
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => syncLiveAtsFeeds()}
              disabled={atsSyncStatus === 'syncing'}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700 disabled:opacity-60 whitespace-nowrap"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-emerald-600 ${
                  atsSyncStatus === 'syncing' ? 'animate-spin' : ''
                }`}
                aria-hidden="true"
              />
              <span>
                {atsSyncStatus === 'syncing'
                  ? 'Syncing ATS...'
                  : liveAtsJobs.length > 0
                  ? `Live ATS (${liveAtsJobs.length})`
                  : 'Sync Live ATS'}
              </span>
            </button>

            <div className="rounded-xl border border-slate-200 bg-slate-100 shrink-0">
              <div
                role="tablist"
                aria-label="Job board views"
                className="flex items-center gap-1 overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade p-1 max-md:px-3 max-md:pr-8"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'all'}
                  onClick={(e) => {
                    onChangeViewMode('all');
                    if (window.innerWidth <= 768) {
                      e.currentTarget.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'center',
                        block: 'nearest',
                      });
                    }
                  }}
                  className={`snap-center min-h-[36px] rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    viewMode === 'all'
                      ? 'bg-[#1D4ED8] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({allJobs.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'saved'}
                  onClick={(e) => {
                    onChangeViewMode('saved');
                    if (window.innerWidth <= 768) {
                      e.currentTarget.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'center',
                        block: 'nearest',
                      });
                    }
                  }}
                  className={`snap-center min-h-[36px] rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    viewMode === 'saved'
                      ? 'bg-[#1D4ED8] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Saved ({savedJobIds.length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontally Scrollable Category Strip */}
        <div
          aria-label="Filter by category"
          className="flex items-center gap-2 overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade px-3 pr-8 pb-1 md:px-0 md:pr-0"
        >
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={(e) => {
                  setSelectedCategory(category);
                  if (window.innerWidth <= 768) {
                    e.currentTarget.scrollIntoView({
                      behavior: 'smooth',
                      inline: 'center',
                      block: 'nearest',
                    });
                  }
                }}
                className={`snap-center min-h-[38px] rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {category === 'All' ? 'All Categories' : category}
              </button>
            );
          })}
        </div>

        {/* Multi-Facet Select Filter Bar */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            <select
              aria-label="Filter by employment type"
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value as 'All' | JobRoleLevel)
              }
              className="input-obsidian h-11 w-full px-3 text-sm font-medium"
            >
              {ROLE_TYPES.map((role) => (
                <option key={role} value={role}>
                  {role === 'All' ? 'All Employment Types' : role}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by minimum pay range"
              value={minPayUsd}
              onChange={(e) => setMinPayUsd(Number(e.target.value))}
              className="input-obsidian h-11 w-full px-3 text-sm font-medium"
            >
              {PAY_THRESHOLDS.map((tier) => (
                <option key={tier.minUsd} value={tier.minUsd}>
                  {tier.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by remote region"
              value={selectedRegion}
              onChange={(e) =>
                setSelectedRegion(e.target.value as 'All' | RemoteRegion)
              }
              className="input-obsidian h-11 w-full px-3 text-sm font-medium"
            >
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region === 'All' ? 'All Regions' : region}
                </option>
              ))}
            </select>

            <select
              aria-label="Sort job listings"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'curated' | 'highest-pay')
              }
              className="input-obsidian h-11 w-full px-3 text-sm font-medium"
            >
              <option value="curated">Sort: Editorial Curated</option>
              <option value="highest-pay">Sort: Highest Pay</option>
            </select>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <SlidersHorizontal
                className="h-3.5 w-3.5 text-[#1D4ED8]"
                aria-hidden="true"
              />
              <span>
                Showing{' '}
                <strong className="font-mono font-semibold text-slate-900 tabular-nums">
                  {visibleJobs.length}
                </strong>{' '}
                of{' '}
                <strong className="font-mono font-semibold text-emerald-700 tabular-nums">
                  {filteredJobs.length}
                </strong>{' '}
                {filteredJobs.length === 1 ? 'role' : 'roles'}
                {viewMode === 'saved' ? ' in saved shortlist' : ''}
              </span>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. SCANNABLE COMPACT JOB DIRECTORY ROWS (9 INITIAL + PAGINATED + ADBANNER AFTER EVERY 9 ROWS) */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
          <h3 className="font-display text-xl font-bold text-slate-900">
            {viewMode === 'saved'
              ? 'No saved jobs yet'
              : 'No matching remote roles found'}
          </h3>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
            {viewMode === 'saved'
              ? 'Bookmark any role below to keep a private shortlist with personal notes.'
              : 'Try broadening your pay threshold, switching remote regions, or clearing active filters.'}
          </p>
          <div className="mt-5 flex justify-center">
            {viewMode === 'saved' ? (
              <button
                type="button"
                onClick={() => onChangeViewMode('all')}
                className="min-h-[44px] rounded-xl bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF]"
              >
                Browse All Jobs
              </button>
            ) : (
              <button
                type="button"
                onClick={resetFilters}
                className="min-h-[44px] rounded-xl bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF]"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-6">
            {jobChunks.map((chunk, chunkIdx) => {
              const isFullChunk = chunk.length === 12;
              const isLastChunk = chunkIdx === jobChunks.length - 1;
              const shouldShowBannerAfterChunk = isFullChunk || isLastChunk;

              return (
                <React.Fragment key={`chunk-${chunkIdx}`}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {chunk.map((job) => {
                      const isSaved = savedSet.has(job.id);
                      const hasNote = Boolean(jobNotes[job.id]?.trim());
                      const theme = getCompanyTheme(job.company);

                      return (
                        <article
                          key={job.id}
                          className={`group relative overflow-hidden flex flex-col justify-between rounded-2xl border border-slate-200/90 ${theme.cardBgClass} p-5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1D4ED8]/40 hover:shadow-xl`}
                        >
                          <div
                            className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                            aria-hidden="true"
                          >
                            <div className={`absolute -bottom-5 -right-5 flex items-center justify-center font-display font-black tracking-tighter select-none text-[110px] leading-none opacity-[0.12] group-hover:opacity-[0.18] transition-opacity duration-300 ${theme.watermarkColor}`}>
                              {getCompanyMark(job.company)}
                            </div>
                          </div>

                          <div className="relative z-10 flex flex-col justify-between h-full">
                            {/* Top: Bold Square Brand Tile + USD Pay Badge + Save/Share */}
                            <div>
                              <div className="flex items-start justify-between gap-3">
                                <BrandTile name={job.company} />

                                <div className="flex flex-col items-end gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => onToggleSave(job.id)}
                                      aria-pressed={isSaved}
                                      aria-label={
                                        isSaved
                                          ? `Remove ${job.title} from saved`
                                          : `Save ${job.title}`
                                      }
                                      className={`inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-lg border transition-colors ${
                                        isSaved
                                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                                      }`}
                                    >
                                      <Bookmark
                                        className={`h-3.5 w-3.5 ${
                                          isSaved
                                            ? 'fill-emerald-600 text-emerald-600'
                                            : ''
                                        }`}
                                        aria-hidden="true"
                                      />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const origin =
                                          typeof window !== 'undefined'
                                            ? window.location.origin
                                            : 'https://planetaihub.com';
                                        void shareContent({
                                          title: `${job.title} at ${job.company}`,
                                          text: `${job.title} at ${job.company} (${job.payRange})`,
                                          url: `${origin}/?job=${encodeURIComponent(job.id)}`,
                                        });
                                      }}
                                      aria-label={`Share ${job.title} at ${job.company}`}
                                      className="inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-[#1D4ED8]"
                                    >
                                      <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                                    </button>
                                  </div>

                                  <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-700 tabular-nums whitespace-nowrap">
                                    {job.payRange}
                                  </span>
                                </div>
                              </div>

                              {/* Middle: Title, Company Name, Region & Category */}
                              <div className="mt-4">
                                <h3 className="font-display text-base font-bold leading-snug text-slate-900 line-clamp-2">
                                  <button
                                    type="button"
                                    onClick={() => setActiveJob(job)}
                                    className="text-left transition-colors hover:text-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                                  >
                                    {job.title}
                                  </button>
                                </h3>

                                <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                  <span className="truncate">{job.company}</span>
                                  <span aria-hidden="true" className="text-slate-300">
                                    ·
                                  </span>
                                  <span className="font-normal text-slate-500">
                                    {job.type}
                                  </span>
                                  {hasNote && (
                                    <>
                                      <span aria-hidden="true" className="text-slate-300">
                                        ·
                                      </span>
                                      <span className="text-[#1D4ED8]">Note</span>
                                    </>
                                  )}
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                    {job.location}
                                  </span>
                                  <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-[#1D4ED8]">
                                    {job.category}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Bottom: Single Primary Cobalt-Blue CTA */}
                            <div className="mt-5 border-t border-slate-100 pt-3.5">
                              <button
                                type="button"
                                onClick={() => onOpenPrepKit(job)}
                                className="inline-flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-full bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
                              >
                                <span>Open 1-Click Kit →</span>
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {shouldShowBannerAfterChunk && <AdBanner />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Centered Show More (X remaining) / Show Less Pagination Pill */}
          {(remainingJobsCount > 0 || allJobsShown) && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  if (allJobsShown) {
                    setVisibleJobCount(INITIAL_JOBS_COUNT);
                  } else {
                    setVisibleJobCount((prev) =>
                      Math.min(filteredJobs.length, prev + JOBS_PAGE_STEP)
                    );
                  }
                }}
                className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-[#1D4ED8] shadow-sm transition-colors hover:border-[#1D4ED8]/50 hover:bg-slate-50"
              >
                {allJobsShown
                  ? 'Show less'
                  : `Show more (${remainingJobsCount} remaining)`}
              </button>
            </div>
          )}
        </div>
      )}

      <JobDetailModal
        job={activeJob}
        isSaved={activeJob ? savedSet.has(activeJob.id) : false}
        personalNote={activeJob ? jobNotes[activeJob.id] || '' : ''}
        onToggleSave={onToggleSave}
        onUpdateNote={onUpdateJobNote}
        onClose={() => setActiveJob(null)}
      />
    </section>
  );
};
