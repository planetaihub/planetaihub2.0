import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileText,
  MessageSquare,
  PlayCircle,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import type { CareerPrepPayload } from '../../../utils/careerPrepTemplates';
import {
  ROLE_BUNDLES,
  getRoleBundleById,
  type RoleBundleId,
} from '../../../utils/roleBundles';

interface RolePrepHubToolProps {
  prepPayload?: CareerPrepPayload | null;
  onEditResume: (payload: CareerPrepPayload) => void;
  onPracticeInterview: (payload: CareerPrepPayload) => void;
}

export const RolePrepHubTool: React.FC<RolePrepHubToolProps> = ({
  prepPayload,
  onEditResume,
  onPracticeInterview,
}) => {
  const [selectedBundleId, setSelectedBundleId] = useState<RoleBundleId>(
    prepPayload?.roleBundleId || 'rlhf'
  );
  const [copiedKey, setCopiedKey] = useState<'resume' | 'interview' | null>(null);

  useEffect(() => {
    if (prepPayload?.roleBundleId) {
      setSelectedBundleId(prepPayload.roleBundleId);
    }
  }, [prepPayload?.nonce, prepPayload?.roleBundleId]);

  const activeBundle = getRoleBundleById(selectedBundleId);
  const hasMatchingJobMeta = Boolean(
    prepPayload?.jobMeta && prepPayload?.roleBundleId === selectedBundleId
  );
  const jobMeta = hasMatchingJobMeta ? prepPayload?.jobMeta : undefined;

  const displayTitle = jobMeta ? jobMeta.title : activeBundle.title;
  const displayPayBand = jobMeta ? jobMeta.payRange : activeBundle.payBand;
  const displaySubline = jobMeta
    ? `${jobMeta.company} · ${jobMeta.location} · ${jobMeta.type}`
    : `${activeBundle.contractFormat} · ${activeBundle.timezoneSummary}`;
  const displayOverview = jobMeta ? jobMeta.summary : activeBundle.overviewSummary;
  const displayDuties =
    jobMeta && jobMeta.responsibilities.length > 0
      ? jobMeta.responsibilities
      : activeBundle.duties;
  const displayRequirements =
    jobMeta && jobMeta.requirements.length > 0
      ? jobMeta.requirements
      : activeBundle.requirements;

  const activeResume =
    hasMatchingJobMeta && prepPayload?.resume
      ? {
          targetTitle: prepPayload.resume.targetTitle,
          targetCompany: prepPayload.resume.targetCompany,
          summary: prepPayload.resume.summary,
          skills: prepPayload.resume.skills,
          experienceRole:
            prepPayload.resume.experienceRole || activeBundle.resumeTemplate.experienceRole,
          experienceBullets:
            prepPayload.resume.experienceBullets ||
            activeBundle.resumeTemplate.experienceBullets,
        }
      : activeBundle.resumeTemplate;

  const activeInterview =
    hasMatchingJobMeta && prepPayload?.interview
      ? {
          track: prepPayload.interview.track,
          questionId: prepPayload.interview.questionId,
          questionPrompt: activeBundle.interviewScript.questionPrompt,
          interviewerLens: activeBundle.interviewScript.interviewerLens,
          situation: prepPayload.interview.situation,
          task: prepPayload.interview.task,
          action: prepPayload.interview.action,
          result: prepPayload.interview.result,
        }
      : activeBundle.interviewScript;

  const handleSelectBundle = (bundleId: RoleBundleId) => {
    setSelectedBundleId(bundleId);
  };

  const scrollToSection = (sectionId: string) => {
    if (typeof document === 'undefined') return;
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const buildResumePlainText = (): string => {
    return [
      activeResume.targetTitle,
      `Target Employer: ${activeResume.targetCompany}`,
      '',
      'EXECUTIVE SUMMARY',
      activeResume.summary,
      '',
      'EXPERIENCE',
      activeResume.experienceRole,
      activeResume.experienceBullets,
      '',
      'CORE SKILLS',
      activeResume.skills,
    ].join('\n');
  };

  const buildInterviewPlainText = (): string => {
    return [
      `Track: ${activeInterview.track}`,
      `Question: ${activeInterview.questionPrompt}`,
      '',
      `Situation: ${activeInterview.situation}`,
      `Task: ${activeInterview.task}`,
      `Action: ${activeInterview.action}`,
      `Result: ${activeInterview.result}`,
    ].join('\n');
  };

  const handleCopy = async (kind: 'resume' | 'interview') => {
    const text =
      kind === 'resume' ? buildResumePlainText() : buildInterviewPlainText();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(kind);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Clipboard permission ignored
    }
  };

  const handleLaunchResumeBuilder = () => {
    onEditResume({
      nonce: Date.now(),
      targetTool: 'resume',
      roleBundleId: selectedBundleId,
      sourceLabel: jobMeta
        ? `${jobMeta.title} @ ${jobMeta.company}`
        : activeBundle.shortLabel,
      jobMeta,
      resume: activeResume,
      interview: {
        track: activeInterview.track,
        questionId: activeInterview.questionId,
        situation: activeInterview.situation,
        task: activeInterview.task,
        action: activeInterview.action,
        result: activeInterview.result,
      },
    });
  };

  const handleLaunchInterviewTool = () => {
    onPracticeInterview({
      nonce: Date.now(),
      targetTool: 'interview',
      roleBundleId: selectedBundleId,
      sourceLabel: jobMeta
        ? `${jobMeta.title} @ ${jobMeta.company}`
        : activeBundle.shortLabel,
      jobMeta,
      resume: activeResume,
      interview: {
        track: activeInterview.track,
        questionId: activeInterview.questionId,
        situation: activeInterview.situation,
        task: activeInterview.task,
        action: activeInterview.action,
        result: activeInterview.result,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Top 4-Track Selector + Quick 5-Section Anchor Strip */}
      <div className="no-print space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Select Specialty Track (1-Click 5-in-1 Role Bundle)
          </p>
          <div
            role="tablist"
            aria-label="Specialty role tracks"
            className="mt-2.5 flex flex-wrap items-center gap-2"
          >
            {ROLE_BUNDLES.map((bundle) => {
              const isSelected = bundle.id === selectedBundleId;
              return (
                <button
                  key={bundle.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectBundle(bundle.id)}
                  className={`inline-flex min-h-[42px] items-center rounded-full border px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {bundle.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Unboxed Section Jump Navigation */}
        <nav
          aria-label="Role bundle sections"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-slate-200 py-3 text-xs font-medium text-slate-600"
        >
          <span className="font-semibold text-slate-900">Jump to:</span>
          <button
            type="button"
            onClick={() => scrollToSection('bundle-overview')}
            className="hover:text-[#1D4ED8] hover:underline whitespace-nowrap"
          >
            01. Role Overview &amp; USD Pay
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('bundle-video')}
            className="hover:text-[#1D4ED8] hover:underline whitespace-nowrap"
          >
            02. Video Tutorial
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('bundle-guide')}
            className="hover:text-[#1D4ED8] hover:underline whitespace-nowrap"
          >
            03. Editorial Guide
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('bundle-resume')}
            className="hover:text-[#1D4ED8] hover:underline whitespace-nowrap"
          >
            04. Tailored Resume
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('bundle-interview')}
            className="hover:text-[#1D4ED8] hover:underline whitespace-nowrap"
          >
            05. Mock Interview Script
          </button>
        </nav>
      </div>

      {/* SECTION 01: Role Overview & Verified USD Job Description */}
      <section
        id="bundle-overview"
        aria-labelledby="bundle-overview-heading"
        className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-semibold text-[#1D4ED8]">
                01. Role Overview
              </span>
              <span aria-hidden="true">·</span>
              <span>{displaySubline}</span>
            </div>
            <h3
              id="bundle-overview-heading"
              className="font-display text-2xl font-bold tracking-tight text-slate-900 text-balance"
            >
              {displayTitle}
            </h3>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
              {displayOverview}
            </p>
          </div>

          <div className="shrink-0 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-left lg:text-right">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Verified USD Pay</span>
            </p>
            <p className="mt-0.5 font-mono text-lg font-bold text-emerald-700 tabular-nums whitespace-nowrap">
              {displayPayBand}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-900">
              <Briefcase className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
              <span>Typical Day-to-Day Duties</span>
            </h4>
            <ul className="mt-3 space-y-2.5">
              {displayDuties.map((duty, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700"
                >
                  <CheckCircle2
                    className="mt-1 h-4 w-4 shrink-0 text-[#1D4ED8]"
                    aria-hidden="true"
                  />
                  <span>{duty}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Baseline Requirements
            </h4>
            <ul className="mt-3 space-y-2.5">
              {displayRequirements.map((req, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700"
                >
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Verified Direct ATS Apply Destinations */}
        <div className="mt-7 border-t border-slate-200 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Direct Employer ATS Destinations
            </h4>
            {jobMeta && (
              <a
                href={jobMeta.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#1D4ED8] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
              >
                <span>Apply Directly at {jobMeta.company}</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {activeBundle.employerLinks.map((employer) => (
              <a
                key={employer.company}
                href={employer.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-[#1D4ED8]/50 hover:bg-white"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-bold text-slate-900 group-hover:text-[#1D4ED8]">
                      {employer.company}
                    </span>
                    <ExternalLink
                      className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-[#1D4ED8]"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-1 font-mono text-xs font-semibold text-emerald-700 tabular-nums">
                    {employer.payBand}
                  </p>
                </div>
                <p className="mt-2 text-xs text-slate-600">{employer.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 02 & 03: Video Tutorial + Tailored Editorial Guide */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* SECTION 02: Embedded Video Tutorial */}
        <section
          id="bundle-video"
          aria-labelledby="bundle-video-heading"
          className="scroll-mt-24 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-6"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#1D4ED8]">
                <PlayCircle className="h-4 w-4" aria-hidden="true" />
                <span>02. Video Tutorial</span>
              </span>
              <span>
                {activeBundle.video.instructor} · {activeBundle.video.duration}
              </span>
            </div>

            <h3
              id="bundle-video-heading"
              className="mt-2 font-display text-lg font-bold text-slate-900 text-balance"
            >
              {activeBundle.video.title}
            </h3>

            <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
              <iframe
                key={activeBundle.video.youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${activeBundle.video.youtubeId}?rel=0`}
                title={activeBundle.video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>

          <p className="mt-4 border-t border-slate-100 pt-3.5 text-xs leading-relaxed text-slate-600">
            <strong className="font-semibold text-slate-800">Focus while watching:</strong>{' '}
            {activeBundle.video.watchTip}
          </p>
        </section>

        {/* SECTION 03: Tailored Editorial Guide */}
        <section
          id="bundle-guide"
          aria-labelledby="bundle-guide-heading"
          className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#1D4ED8]">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>03. Editorial Rubric Briefing</span>
            </span>
            <span>{activeBundle.editorialGuide.readTime}</span>
          </div>

          <h3
            id="bundle-guide-heading"
            className="mt-2 font-display text-lg font-bold text-slate-900 text-balance"
          >
            {activeBundle.editorialGuide.title}
          </h3>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Key Passing Criteria
            </p>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-700">
              {activeBundle.editorialGuide.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-mono font-bold text-[#1D4ED8]">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 space-y-4">
            {activeBundle.editorialGuide.sections.map((section) => (
              <div key={section.heading}>
                <h4 className="text-sm font-bold text-slate-900">
                  {section.heading}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* SECTION 04: Ready-to-Edit Tailored Resume */}
      <section
        id="bundle-resume"
        aria-labelledby="bundle-resume-heading"
        className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8]">
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>04. Ready-to-Edit Tailored Resume</span>
            </span>
            <h3
              id="bundle-resume-heading"
              className="mt-1 font-display text-xl font-bold text-slate-900"
            >
              {activeResume.targetTitle}
            </h3>
            <p className="text-xs text-slate-500">
              ATS-formatted structure ready to personalize with your contact info and portfolio.
            </p>
          </div>

          <div className="no-print flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy('resume')}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap"
            >
              {copiedKey === 'resume' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <span className="text-emerald-700">Copied ATS Text</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                  <span>Copy ATS Text</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleLaunchResumeBuilder}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#1D4ED8] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
            >
              <span>Open &amp; Edit in Resume Builder</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-6 font-sans text-slate-800 sm:p-7">
          <div className="border-b border-slate-200 pb-3">
            <p className="text-base font-bold text-slate-950">
              [Your Full Name] — {activeResume.targetTitle}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Target Employer: {activeResume.targetCompany} · Remote Async · Portfolio / GitHub Link
            </p>
          </div>

          <div className="mt-4 space-y-4 text-xs leading-relaxed">
            <div>
              <p className="font-bold uppercase tracking-wider text-slate-500">
                Executive Summary
              </p>
              <p className="mt-1 text-slate-700">{activeResume.summary}</p>
            </div>

            <div>
              <p className="font-bold uppercase tracking-wider text-slate-500">
                Representative Experience — {activeResume.experienceRole}
              </p>
              <p className="mt-1 whitespace-pre-line text-slate-700">
                {activeResume.experienceBullets}
              </p>
            </div>

            <div>
              <p className="font-bold uppercase tracking-wider text-slate-500">
                Core Skills
              </p>
              <p className="mt-1 text-slate-700">{activeResume.skills}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: Ready-to-Practice Mock Interview Script */}
      <section
        id="bundle-interview"
        aria-labelledby="bundle-interview-heading"
        className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8]">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              <span>05. Mock Interview STAR Script</span>
            </span>
            <h3
              id="bundle-interview-heading"
              className="mt-1 font-display text-xl font-bold text-slate-900 text-balance"
            >
              {activeInterview.questionPrompt}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              <strong className="font-semibold text-slate-700">Interviewer lens:</strong>{' '}
              {activeInterview.interviewerLens}
            </p>
          </div>

          <div className="no-print flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleCopy('interview')}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap"
            >
              {copiedKey === 'interview' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <span className="text-emerald-700">Copied Script</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                  <span>Copy Script</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleLaunchInterviewTool}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#1D4ED8] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
            >
              <span>Practice in Mock Interview Tool</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D4ED8]">
              S — Situation
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {activeInterview.situation}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D4ED8]">
              T — Task
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {activeInterview.task}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D4ED8]">
              A — Action
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {activeInterview.action}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D4ED8]">
              R — Result
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {activeInterview.result}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
