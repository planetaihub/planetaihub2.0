import React, { useEffect, useMemo, useState } from 'react';
import { CheckSquare, RotateCcw, Square } from 'lucide-react';
import { loadCareerState, saveCareerState } from '../../../utils/storage';

interface RubricCriterion {
  id: string;
  section: string;
  label: string;
  points: number;
  guidance: string;
}

const RUBRIC_CRITERIA: RubricCriterion[] = [
  {
    id: 'r-1',
    section: 'Role & Compensation Fit',
    label: 'Posted pay band meets or exceeds your minimum target rate',
    points: 10,
    guidance: 'Avoid unpriced roles without a clear compensation range.',
  },
  {
    id: 'r-2',
    section: 'Role & Compensation Fit',
    label: 'Remote region & timezone overlap match your daily schedule',
    points: 10,
    guidance: 'Verify country/state eligibility and required core hours.',
  },
  {
    id: 'r-3',
    section: 'Role & Compensation Fit',
    label: 'Core stack matches at least 70% of listed must-have skills',
    points: 10,
    guidance: 'Focus applications where your primary strengths lead.',
  },
  {
    id: 'r-4',
    section: 'Resume & ATS Signal',
    label: 'Resume headline & top summary mirror the role terminology',
    points: 10,
    guidance: 'Align exact titles and keywords naturally in the top third.',
  },
  {
    id: 'r-5',
    section: 'Resume & ATS Signal',
    label: 'Experience bullets lead with quantified outcomes (%, $, time)',
    points: 10,
    guidance: 'Replace passive duty lists with measurable before/after results.',
  },
  {
    id: 'r-6',
    section: 'Resume & ATS Signal',
    label: 'Document exports cleanly as selectable single-column PDF text',
    points: 5,
    guidance: 'Avoid multi-column graphics that scramble ATS parsers.',
  },
  {
    id: 'r-7',
    section: 'Remote & Async Proof',
    label: 'Portfolio, GitHub, or live demo links open without login walls',
    points: 10,
    guidance: 'Ensure reviewers can inspect real work in under 30 seconds.',
  },
  {
    id: 'r-8',
    section: 'Remote & Async Proof',
    label: 'Cover note highlights async documentation or distributed ownership',
    points: 10,
    guidance: 'Remote teams hire for written clarity and self-direction.',
  },
  {
    id: 'r-9',
    section: 'Remote & Async Proof',
    label: 'Microphone, lighting, and quiet workspace tested for video screens',
    points: 5,
    guidance: 'Run a quick audio check before scheduling recruiter calls.',
  },
  {
    id: 'r-10',
    section: 'Outreach & Follow-Through',
    label: 'Application tailored to the company product rather than generic blast',
    points: 10,
    guidance: 'Reference a specific feature, blog post, or technical challenge.',
  },
  {
    id: 'r-11',
    section: 'Outreach & Follow-Through',
    label: 'Direct note sent to hiring manager or team lead after applying',
    points: 5,
    guidance: 'Keep cold outreach under 100 words with one concrete proof point.',
  },
  {
    id: 'r-12',
    section: 'Outreach & Follow-Through',
    label: 'Role saved in shortlist with personal follow-up date logged',
    points: 5,
    guidance: 'Follow up once 5–7 business days after initial submission.',
  },
];

interface SavedRubricState {
  targetLabel: string;
  checkedIds: string[];
}

const EMPTY_RUBRIC: SavedRubricState = {
  targetLabel: '',
  checkedIds: [],
};

function loadInitialRubricState(): SavedRubricState {
  const saved = loadCareerState<Partial<SavedRubricState> | null>('rubric', null);
  if (!saved) return EMPTY_RUBRIC;

  if (saved.targetLabel === 'Senior Frontend Engineer — Linearity Labs') {
    return EMPTY_RUBRIC;
  }

  return {
    targetLabel: typeof saved.targetLabel === 'string' ? saved.targetLabel : '',
    checkedIds: Array.isArray(saved.checkedIds) ? saved.checkedIds : [],
  };
}

interface RubricSimulatorToolProps {
  clearSignal?: number;
}

export const RubricSimulatorTool: React.FC<RubricSimulatorToolProps> = ({
  clearSignal = 0,
}) => {
  const [state, setState] = useState<SavedRubricState>(loadInitialRubricState);
  const lastClearSignalRef = React.useRef<number>(clearSignal);

  useEffect(() => {
    saveCareerState('rubric', state);
  }, [state]);

  useEffect(() => {
    if (clearSignal > lastClearSignalRef.current) {
      lastClearSignalRef.current = clearSignal;
      setState(EMPTY_RUBRIC);
    }
  }, [clearSignal]);

  const checkedSet = useMemo(
    () => new Set(state.checkedIds),
    [state.checkedIds]
  );

  const maxPoints = useMemo(
    () => RUBRIC_CRITERIA.reduce((sum, c) => sum + c.points, 0),
    []
  );

  const earnedPoints = useMemo(
    () =>
      RUBRIC_CRITERIA.reduce(
        (sum, c) => (checkedSet.has(c.id) ? sum + c.points : sum),
        0
      ),
    [checkedSet]
  );

  const readinessStatus = useMemo(() => {
    if (earnedPoints === 0) {
      return {
        label: 'Select Criteria to Score Readiness',
        tone: 'text-slate-500',
        bar: 'bg-slate-300',
      };
    }
    if (earnedPoints >= 85) {
      return {
        label: 'Strong Submit Ready',
        tone: 'text-emerald-700',
        bar: 'bg-emerald-600',
      };
    }
    if (earnedPoints >= 60) {
      return {
        label: 'Competitive — Polish Gaps',
        tone: 'text-[#1D4ED8]',
        bar: 'bg-[#1D4ED8]',
      };
    }
    return {
      label: 'Needs Tailoring Before Submit',
      tone: 'text-amber-700',
      bar: 'bg-amber-500',
    };
  }, [earnedPoints]);

  const toggleItem = (id: string) => {
    setState((prev) => {
      const exists = prev.checkedIds.includes(id);
      return {
        ...prev,
        checkedIds: exists
          ? prev.checkedIds.filter((item) => item !== id)
          : [...prev.checkedIds, id],
      };
    });
  };

  const resetAll = () => {
    setState(EMPTY_RUBRIC);
  };

  const sections = useMemo(() => {
    const grouped = new Map<string, RubricCriterion[]>();
    for (const item of RUBRIC_CRITERIA) {
      const list = grouped.get(item.section) || [];
      list.push(item);
      grouped.set(item.section, list);
    }
    return Array.from(grouped.entries());
  }, []);

  return (
    <div className="space-y-5">
      {/* Live Score Summary Bar */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm">
        <div className="h-1 w-full bg-[#1D4ED8]" />
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <label
                htmlFor="rubric-target-role"
                className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600"
              >
                Application Being Scored
              </label>
              <input
                id="rubric-target-role"
                type="text"
                value={state.targetLabel}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, targetLabel: e.target.value }))
                }
                placeholder="e.g. Senior Frontend Engineer — Company Name"
                className="mt-1.5 h-11 w-full max-w-lg rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Checklist Score
                </p>
                <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                  {earnedPoints} / {maxPoints}
                </p>
                <p className={`text-xs font-semibold ${readinessStatus.tone}`}>
                  {readinessStatus.label}
                </p>
              </div>

              <button
                type="button"
                onClick={resetAll}
                disabled={!state.targetLabel && state.checkedIds.length === 0}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 disabled:opacity-40 whitespace-nowrap"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                <span>Clear Form</span>
              </button>
            </div>
          </div>

          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-200/70">
            <div
              className={`h-full rounded-full transition-all duration-300 ${readinessStatus.bar}`}
              style={{ width: `${Math.round((earnedPoints / maxPoints) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {sections.map(([sectionTitle, items]) => (
          <div
            key={sectionTitle}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="h-0.5 w-full bg-[#1D4ED8]/70" />
            <div className="p-5">
              <h3 className="border-b border-slate-200 pb-3 font-display text-base font-bold text-slate-900">
                {sectionTitle}
              </h3>

              <div className="mt-3 divide-y divide-slate-100">
                {items.map((item) => {
                  const isChecked = checkedSet.has(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      onClick={() => toggleItem(item.id)}
                      className="flex w-full items-start gap-3 rounded-xl px-2 py-3 text-left transition-colors hover:bg-slate-50"
                    >
                      <span className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckSquare
                            className="h-5 w-5 text-emerald-600"
                            aria-hidden="true"
                          />
                        ) : (
                          <Square
                            className="h-5 w-5 text-slate-400"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-sm font-medium ${
                            isChecked ? 'text-slate-900 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {item.guidance}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1D4ED8] tabular-nums">
                        +{item.points}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
