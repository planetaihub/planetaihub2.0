import React, { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Sparkles, Video, X } from 'lucide-react';
import type {
  JobCategory,
  JobListing,
  JobRoleLevel,
  RemoteRegion,
  SpotlightVideoConfig,
} from '../types';
import { BrandAvatar, resolveBrandDomain } from './BrandAvatar';
import {
  MICRO1_COMPANY_REFERRAL_URL,
  resolveApplyUrl,
} from '../utils/referralLinks';

export type PostJobTier = 'standard' | 'featured' | 'video-spotlight';

interface PostJobModalProps {
  isOpen: boolean;
  initialTier?: PostJobTier;
  onClose: () => void;
  onPublishJob: (job: JobListing) => void;
  onSubmitVideoSpotlight?: (config: SpotlightVideoConfig) => void;
}

const PAYPAL_FEATURED_URL = 'https://paypal.com';
const STANDARD_CONTACT_EMAIL = 'team@planetaihub.com';
const VIDEO_SPOTLIGHT_CONTACT_EMAIL = 'workatlas.team@gmail.com';

const JOB_CATEGORIES: JobCategory[] = [
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

const ROLE_LEVELS: JobRoleLevel[] = [
  'Full-time',
  'Contract',
  'Freelance',
  'Part-time',
];

const REGIONS: RemoteRegion[] = [
  'Worldwide',
  'APAC',
  'Americas',
  'Europe / EMEA',
  'US Only',
];

function parseAnnualPay(payRange: string): { minUsd: number; maxUsd: number } {
  const matches = payRange.match(/[\d,]+/g) || [];
  const nums = matches
    .map((m) => Number(m.replace(/,/g, '')))
    .filter((n) => !Number.isNaN(n) && n > 0);
  const multiplier = payRange.toLowerCase().includes('/ hr') ? 2080 : 1;
  if (nums.length === 0) return { minUsd: 80000, maxUsd: 120000 };
  if (nums.length === 1) return { minUsd: nums[0] * multiplier, maxUsd: nums[0] * multiplier };
  return { minUsd: nums[0] * multiplier, maxUsd: nums[1] * multiplier };
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  initialTier = 'featured',
  onClose,
  onPublishJob,
  onSubmitVideoSpotlight,
}) => {
  const [tier, setTier] = useState<PostJobTier>(initialTier);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [employerEmail, setEmployerEmail] = useState('');
  const [category, setCategory] = useState<JobCategory>('AI Training & RLHF');
  const [type, setType] = useState<JobRoleLevel>('Contract');
  const [region, setRegion] = useState<RemoteRegion>('Worldwide');
  const [payRange, setPayRange] = useState('$45 - $70 / hr');
  const [location, setLocation] = useState('Remote (Worldwide)');
  const [applyUrl, setApplyUrl] = useState('https://');
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [paypalTransactionId, setPaypalTransactionId] = useState('');
  const [submittedTxnId, setSubmittedTxnId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedTier, setSubmittedTier] = useState<PostJobTier | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTier(initialTier);
      setSubmittedTier(null);
      setError('');
    }
  }, [isOpen, initialTier]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSubmittedTier(null);
        setSubmittedTxnId('');
        setError('');
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeContactEmail =
    tier === 'video-spotlight'
      ? VIDEO_SPOTLIGHT_CONTACT_EMAIL
      : STANDARD_CONTACT_EMAIL;

  const submittedContactEmail =
    submittedTier === 'video-spotlight'
      ? VIDEO_SPOTLIGHT_CONTACT_EMAIL
      : STANDARD_CONTACT_EMAIL;

  const handleResetAndClose = () => {
    setSubmittedTier(null);
    setSubmittedTxnId('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedCompany = company.trim();
    const trimmedPay = payRange.trim();
    const trimmedUrl = applyUrl.trim();
    const trimmedVideoUrl = videoUrl.trim();
    const trimmedEmail = employerEmail.trim();
    const trimmedTxnId = paypalTransactionId.trim();
    const isFeatured = tier === 'featured';
    const isVideoSpotlight = tier === 'video-spotlight';
    const isPaidTier = isFeatured || isVideoSpotlight;

    if (!trimmedTitle || !trimmedCompany || !trimmedPay) {
      setError('Please enter a role title, company name, and transparent USD pay range.');
      return;
    }
    if (!/^https?:\/\/.+/i.test(trimmedUrl)) {
      setError('Please provide a valid direct ATS or careers URL starting with https://');
      return;
    }
    if (isVideoSpotlight && trimmedVideoUrl && !/^https?:\/\/.+/i.test(trimmedVideoUrl)) {
      setError('Intro Video URL must start with https:// (YouTube, Vimeo, Loom, or MP4 link).');
      return;
    }
    if (isFeatured && !trimmedTxnId) {
      setError('Please enter your PayPal Transaction ID as proof of payment for Featured Spotlight.');
      return;
    }

    setError('');
    setSubmitting(true);

    const { minUsd, maxUsd } = parseAnnualPay(trimmedPay);

    const newJob: JobListing = {
      id: `employer-${Date.now()}`,
      title: trimmedTitle,
      company: trimmedCompany,
      category,
      payRange: trimmedPay,
      location: location.trim() || `Remote (${region})`,
      type,
      source: isVideoSpotlight
        ? 'Video Spotlight Feature'
        : isFeatured
        ? 'Featured Spotlight'
        : 'Featured Employer',
      postedAt: new Date().toISOString().slice(0, 10),
      applyUrl: resolveApplyUrl(trimmedCompany, trimmedUrl),
      companyDomain: resolveBrandDomain(trimmedCompany),
      region,
      payMinUsd: minUsd,
      payMaxUsd: maxUsd,
      featured: isPaidTier,
      summary:
        summary.trim() ||
        `Direct remote ${category.toLowerCase()} opportunity with transparent USD compensation at ${trimmedCompany}.`,
      stack: [category, type, region, 'Transparent Pay'],
      responsibilities: [
        `Lead ${category.toLowerCase()} deliverables asynchronously across distributed teams.`,
        `Maintain high accuracy, clean documentation, and timely milestone execution.`,
      ],
      requirements: [
        `Proven experience in ${category} or closely related AI/software work.`,
        `Eligibility for ${location.trim() || region} remote work.`,
      ],
      timezoneNote: `${location.trim() || region} · ${type}`,
    };

    onPublishJob(newJob);

    if (isVideoSpotlight && trimmedVideoUrl && onSubmitVideoSpotlight) {
      onSubmitVideoSpotlight({
        company: trimmedCompany,
        domain: resolveBrandDomain(trimmedCompany),
        tagline: `${category} · ${type}`,
        summary: newJob.summary,
        payRange: trimmedPay,
        videoUrl: trimmedVideoUrl,
      });
    }

    const targetEmail = isVideoSpotlight
      ? VIDEO_SPOTLIGHT_CONTACT_EMAIL
      : STANDARD_CONTACT_EMAIL;

    try {
      await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `[PlanetAI Hub] ${
            isVideoSpotlight
              ? 'VIDEO SPOTLIGHT APPLICATION: '
              : isFeatured
              ? 'FEATURED ($29) '
              : 'Free '
          }${trimmedTitle} @ ${trimmedCompany}`,
          tier: isVideoSpotlight
            ? 'Video Spotlight Feature'
            : isFeatured
            ? 'Featured Spotlight ($29 USD / 30 days)'
            : 'Standard Listing ($0 Free)',
          paypal_transaction_id: isFeatured ? trimmedTxnId : 'N/A',
          employer_email: trimmedEmail || 'Not provided',
          company_intro_video_url: isVideoSpotlight
            ? trimmedVideoUrl || 'To be provided via email'
            : 'N/A',
          company: trimmedCompany,
          title: trimmedTitle,
          pay_range: trimmedPay,
          category,
          type,
          region,
          apply_url: trimmedUrl,
          ready_to_paste_json: JSON.stringify(newJob, null, 2),
        }),
      });
    } catch {
      // Non-blocking fallback
    }

    setSubmitting(false);
    setSubmittedTxnId(isFeatured ? trimmedTxnId : '');
    setSubmittedTier(tier);

    setTitle('');
    setCompany('');
    setEmployerEmail('');
    setVideoUrl('');
    setSummary('');
    setPaypalTransactionId('');
  };

  const previewCompanyName = company.trim() || 'AI';
  const previewDomain = company.trim()
    ? resolveBrandDomain(company)
    : 'planetaihub.com';

  const inputClass =
    'mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-job-title"
      onClick={handleResetAndClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl sm:rounded-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              For Employers · {activeContactEmail}
            </p>
            <h2
              id="post-job-title"
              className="mt-1 font-display text-2xl font-bold text-slate-900"
            >
              {tier === 'video-spotlight'
                ? 'Submit Company Video Spotlight'
                : 'Post a Remote Role'}
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Every PlanetAI Hub listing requires transparent USD pay and a direct ATS link.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close Post a Job modal"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {submittedTier ? (
          <div className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            {submittedTier === 'video-spotlight' ? (
              <div className="space-y-2.5">
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Video Spotlight Application Received!
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Your company spotlight request and role listing have been routed to our Video Spotlight desk at{' '}
                  <a
                    href={`mailto:${submittedContactEmail}`}
                    className="font-mono font-semibold text-[#1D4ED8] underline"
                  >
                    {submittedContactEmail}
                  </a>
                  . Your opening is also live in the directory now.
                </p>
              </div>
            ) : submittedTier === 'featured' ? (
              <div className="space-y-3">
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Featured Role Submitted!
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Your listing and PayPal Transaction ID{' '}
                  <span className="font-mono font-semibold text-emerald-700">
                    {submittedTxnId}
                  </span>{' '}
                  have been sent to{' '}
                  <span className="font-mono font-semibold text-[#1D4ED8]">
                    {submittedContactEmail}
                  </span>
                  . Your role is now pinned in the{' '}
                  <strong className="text-slate-900">Featured Spotlight</strong>.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Standard Role Published!
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Your remote listing is now live in the directory and forwarded to{' '}
                  <span className="font-mono font-semibold text-[#1D4ED8]">
                    {submittedContactEmail}
                  </span>{' '}
                  for editorial verification.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              Return to Job Directory
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setTier('video-spotlight')}
                className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition ${
                  tier === 'video-spotlight'
                    ? 'border-[#1D4ED8] bg-blue-50/70 shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8]">
                    <Video className="h-3.5 w-3.5 shrink-0" />
                    Video Spotlight Feature
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600">
                  16:9 hero video showcase + pay band badge via {VIDEO_SPOTLIGHT_CONTACT_EMAIL}.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTier('featured')}
                className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition ${
                  tier === 'featured'
                    ? 'border-[#1D4ED8] bg-blue-50/70 shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured Role
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">$29</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600">
                  Pinned at top for 30 days + Verified Spotlight badge.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTier('standard')}
                className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition ${
                  tier === 'standard'
                    ? 'border-[#1D4ED8] bg-blue-50/70 shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">
                    Standard Listing
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-700">FREE</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600">
                  Listed in chronological order with transparent USD pay.
                </p>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Role Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Staff AI Evaluation Engineer"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Company Name *
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <BrandAvatar
                    name={previewCompanyName}
                    domain={previewDomain}
                    size="sm"
                  />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Anthropic"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Transparent USD Pay *
                </label>
                <input
                  type="text"
                  value={payRange}
                  onChange={(e) => setPayRange(e.target.value)}
                  placeholder="$50 - $85 / hr or $140k - $180k"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as JobCategory)}
                  className={inputClass}
                >
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Engagement
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as JobRoleLevel)}
                  className={inputClass}
                >
                  {ROLE_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Remote Region
                </label>
                <select
                  value={region}
                  onChange={(e) => {
                    const next = e.target.value as RemoteRegion;
                    setRegion(next);
                    setLocation(`Remote (${next})`);
                  }}
                  className={inputClass}
                >
                  {REGIONS.map((reg) => (
                    <option key={reg} value={reg}>
                      {reg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Employer Email
                </label>
                <input
                  type="email"
                  value={employerEmail}
                  onChange={(e) => setEmployerEmail(e.target.value)}
                  placeholder="hiring@company.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Direct Application / ATS URL *
              </label>
              <input
                type="url"
                value={applyUrl}
                onChange={(e) => setApplyUrl(e.target.value)}
                placeholder="https://greenhouse.io..."
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>

            {tier === 'video-spotlight' && (
              <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Video Spotlight Feature Placement
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Direct placement inquiries go straight to{' '}
                      <a
                        href={`mailto:${VIDEO_SPOTLIGHT_CONTACT_EMAIL}`}
                        className="font-mono font-semibold text-[#1D4ED8] underline"
                      >
                        {VIDEO_SPOTLIGHT_CONTACT_EMAIL}
                      </a>
                      .
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800">
                    Company Intro Video URL (YouTube, Loom, Vimeo, or MP4)
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Role Summary (Optional)
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Describe company mission, key responsibilities, tech stack, and async expectations..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>

            {tier === 'featured' && (
              <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Featured Spotlight Checkout ($29 USD)
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Complete PayPal payment first, then paste your receipt ID below.
                    </p>
                  </div>
                  <a
                    href={PAYPAL_FEATURED_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[38px] shrink-0 items-center justify-center gap-1.5 rounded-full border border-blue-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#1D4ED8] transition hover:bg-blue-50 whitespace-nowrap"
                  >
                    <span>Pay $29 via PayPal</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>

                <div>
                  <label
                    htmlFor="paypal-transaction-id"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    PayPal Transaction ID *
                  </label>
                  <input
                    id="paypal-transaction-id"
                    type="text"
                    required
                    value={paypalTransactionId}
                    onChange={(e) => setPaypalTransactionId(e.target.value)}
                    placeholder="e.g. 9AB12345CD678901E"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-600">
                    Required as proof of payment to verify and pin your Featured Spotlight listing.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1D4ED8] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E40AF] disabled:opacity-60"
              >
                {submitting
                  ? 'Submitting...'
                  : tier === 'video-spotlight'
                  ? 'Submit Video Spotlight Application →'
                  : tier === 'featured'
                  ? 'Verify Payment & Publish Featured Role →'
                  : 'Publish Free Standard Role'}
              </button>
            </div>

            <a
              href={MICRO1_COMPANY_REFERRAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <BrandAvatar name="micro1" domain="micro1.ai" size="xs" />
                <span className="text-xs font-semibold text-[#1D4ED8]">
                  Hiring AI Talent? Source Pre-Vetted Engineers via micro1 →
                </span>
              </div>
            </a>
          </form>
        )}
      </div>
    </div>
  );
};
