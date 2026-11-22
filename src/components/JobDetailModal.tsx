import React, { useEffect } from 'react';
import { Bookmark, Clock, ExternalLink, MapPin, Share2, X } from 'lucide-react';
import type { JobListing } from '../types';
import { BrandAvatar } from './BrandAvatar';
import { resolveApplyUrl } from '../utils/referralLinks';
import { shareContent } from '../utils/shareHelper';

interface JobDetailModalProps {
  job: JobListing | null;
  isSaved: boolean;
  personalNote: string;
  onToggleSave: (jobId: string) => void;
  onUpdateNote: (jobId: string, note: string) => void;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isSaved,
  personalNote,
  onToggleSave,
  onUpdateNote,
  onClose,
}) => {
  useEffect(() => {
    if (!job) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [job, onClose]);

  if (!job) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl sm:rounded-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <BrandAvatar name={job.company} domain={job.companyDomain} />
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {job.company}
                  <span aria-hidden="true" className="mx-2 text-slate-300">
                    ·
                  </span>
                  <span className="font-medium text-emerald-700">{job.source}</span>
                </p>
                <h2
                  id="job-modal-title"
                  className="mt-0.5 font-display text-2xl font-bold text-slate-900 text-balance"
                >
                  {job.title}
                </h2>
              </div>
            </div>
            <p className="mt-2.5 inline-block rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-sm font-semibold text-emerald-700 tabular-nums">
              {job.payRange}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
              <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-medium text-[#1D4ED8]">
                {job.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>{job.type}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                {job.location}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                {job.postedAt}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close job details"
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-slate-700">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              Role Overview
            </h3>
            <p className="mt-1.5 text-slate-700">{job.summary}</p>
            <p className="mt-2 text-xs text-slate-500">
              Location &amp; schedule: {job.timezoneNote}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Core Focus
            </h3>
            <p className="mt-1.5 font-mono text-xs font-medium text-[#1D4ED8]">
              {job.stack.join(' · ')}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Key Responsibilities
            </h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-slate-700">
              {job.responsibilities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              What You Bring
            </h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-slate-700">
              {job.requirements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <label
              htmlFor="job-personal-note"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              Personal Application Note (Saved locally in browser)
            </label>
            <textarea
              id="job-personal-note"
              rows={3}
              value={personalNote}
              onChange={(e) => onUpdateNote(job.id, e.target.value)}
              placeholder="Track referral contacts, interview dates, or tailored resume notes..."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSave(job.id)}
              className={`inline-flex min-h-[44px] flex-1 sm:flex-none items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isSaved
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${
                  isSaved ? 'fill-emerald-600 text-emerald-600' : ''
                }`}
                aria-hidden="true"
              />
              <span>{isSaved ? 'Saved to Shortlist' : 'Save Job'}</span>
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
                  text: `${job.title} at ${job.company} (${job.payRange}) — via PlanetAI Hub`,
                  url: `${origin}/?job=${encodeURIComponent(job.id)}`,
                });
              }}
              aria-label={`Share ${job.title} at ${job.company}`}
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#1D4ED8] whitespace-nowrap shrink-0"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              <span>Share</span>
            </button>
          </div>

          <a
            href={resolveApplyUrl(job.company, job.applyUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#1D4ED8] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] whitespace-nowrap shrink-0"
          >
            <span>Apply Now ↗</span>
            <ExternalLink className="h-4 w-4 sr-only" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
};
