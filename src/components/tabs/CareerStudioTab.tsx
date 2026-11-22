import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  CheckSquare,
  FileText,
  Mail,
  MessageSquare,
  Mic,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type {
  CareerPrepPayload,
  CareerToolId,
} from '../../utils/careerPrepTemplates';
import { AdBanner } from '../AdBanner';
import { EmailDrafterTool } from './career/EmailDrafterTool';
import { InterviewPrepTool } from './career/InterviewPrepTool';
import { ResumeBuilderTool } from './career/ResumeBuilderTool';
import { RolePrepHubTool } from './career/RolePrepHubTool';
import { RubricSimulatorTool } from './career/RubricSimulatorTool';
import { VoiceSampleTool } from './career/VoiceSampleTool';

interface CareerStudioTabProps {
  prepPayload?: CareerPrepPayload | null;
  onLoadPrepPayload?: (payload: CareerPrepPayload) => void;
  onClearPrepPayload?: () => void;
}

const CAREER_TOOLS: Array<{
  id: CareerToolId;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'role-prep', label: 'Role Prep Hub', Icon: Briefcase },
  { id: 'resume', label: 'Resume & Cover Letter', Icon: FileText },
  { id: 'interview', label: 'Mock Interview Script', Icon: MessageSquare },
  { id: 'email', label: 'Quick Email Drafter', Icon: Mail },
  { id: 'rubric-voice', label: 'Rubric & Voice Prep', Icon: Mic },
];

export const CareerStudioTab: React.FC<CareerStudioTabProps> = ({
  prepPayload,
  onLoadPrepPayload,
  onClearPrepPayload,
}) => {
  const [activeTool, setActiveTool] = useState<CareerToolId>(
    prepPayload?.targetTool || 'role-prep'
  );
  const [clearSignal, setClearSignal] = useState(0);

  useEffect(() => {
    if (prepPayload?.targetTool) {
      setActiveTool(prepPayload.targetTool);
    }
  }, [prepPayload?.nonce, prepPayload?.targetTool]);

  const handleResetToBlank = () => {
    setClearSignal((n) => n + 1);
    onClearPrepPayload?.();
  };

  const handleEditResumeFromBundle = (payload: CareerPrepPayload) => {
    if (onLoadPrepPayload) {
      onLoadPrepPayload(payload);
    } else {
      setActiveTool('resume');
    }
  };

  const handlePracticeInterviewFromBundle = (payload: CareerPrepPayload) => {
    if (onLoadPrepPayload) {
      onLoadPrepPayload(payload);
    } else {
      setActiveTool('interview');
    }
  };

  const showTopResetBar = Boolean(
    prepPayload ||
      activeTool === 'resume' ||
      activeTool === 'interview' ||
      activeTool === 'rubric-voice'
  );

  return (
    <section aria-labelledby="career-studio-heading" className="space-y-8">
      {/* Header + Single Clean Pill Switcher */}
      <div className="no-print space-y-6 border-b border-slate-200 pb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#1D4ED8]">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
                  Application Suite
                </p>
                <h2
                  id="career-studio-heading"
                  className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance"
                >
                  Career Studio
                </h2>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              Single-focus remote preparation tools—1-click specialty role bundles, ATS resume &amp; PDF export, STAR interview script builder, outreach drafter, and voice &amp; rubric checks.
            </p>
          </div>

          {showTopResetBar && (
            <button
              type="button"
              onClick={handleResetToBlank}
              className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 self-start rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:border-slate-400 hover:bg-slate-50 lg:self-end whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span>Clear / Reset to Blank</span>
            </button>
          )}
        </div>

        {/* Clean Single Pill Switcher (Zero Stacked/Nested Tab Bars) */}
        <div
          role="tablist"
          aria-label="Career Studio tools"
          className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
        >
          {CAREER_TOOLS.map(({ id, label, Icon }) => {
            const isSelected = activeTool === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={(e) => {
                  setActiveTool(id);
                  if (window.innerWidth <= 768) {
                    e.currentTarget.scrollIntoView({
                      behavior: 'smooth',
                      inline: 'center',
                      block: 'nearest',
                    });
                  }
                }}
                className={`inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white hover:text-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Quiet Single-Line Context Note When Launched from Hero or Job Card */}
        {prepPayload && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles
                className="h-4 w-4 shrink-0 text-[#1D4ED8]"
                aria-hidden="true"
              />
              <span>
                Tailored template loaded for{' '}
                <strong className="font-semibold text-[#1D4ED8]">
                  {prepPayload.sourceLabel}
                </strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetToBlank}
              className="font-semibold text-[#1D4ED8] hover:underline whitespace-nowrap"
            >
              Reset template
            </button>
          </div>
        )}
      </div>

      {/* Single-Focus Active Tool View */}
      <div>
        {activeTool === 'role-prep' && (
          <RolePrepHubTool
            prepPayload={prepPayload}
            onEditResume={handleEditResumeFromBundle}
            onPracticeInterview={handlePracticeInterviewFromBundle}
          />
        )}

        {activeTool === 'resume' && (
          <ResumeBuilderTool
            prepPayload={prepPayload}
            clearSignal={clearSignal}
          />
        )}

        {activeTool === 'interview' && (
          <InterviewPrepTool
            prepPayload={prepPayload}
            clearSignal={clearSignal}
          />
        )}

        {activeTool === 'email' && <EmailDrafterTool />}

        {activeTool === 'rubric-voice' && (
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Mic className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold text-slate-900">
                  1. Voice Sample Teleprompter
                </h3>
              </div>
              <VoiceSampleTool clearSignal={clearSignal} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <CheckSquare
                  className="h-4 w-4 text-[#1D4ED8]"
                  aria-hidden="true"
                />
                <h3 className="font-display text-lg font-bold text-slate-900">
                  2. Pre-Submit Application Rubric
                </h3>
              </div>
              <RubricSimulatorTool clearSignal={clearSignal} />
            </div>
          </div>
        )}
      </div>

      {/* AdBanner strictly below main output section */}
      <AdBanner />
    </section>
  );
};
