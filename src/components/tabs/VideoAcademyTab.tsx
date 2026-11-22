import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CheckSquare,
  Clock,
  ExternalLink,
  FileText,
  ListChecks,
  Play,
  PlayCircle,
  PlusCircle,
  Send,
  Square,
  X,
} from 'lucide-react';
import type { CareerToolId } from '../../utils/careerPrepTemplates';
import { AdBanner } from '../AdBanner';

export type AcademyCategory =
  | 'All Sessions'
  | 'AI & Mock Interviews'
  | 'RLHF & Data Annotation'
  | 'AI & Dev Workflows';

interface AcademyVideoSession {
  id: string;
  youtubeId: string;
  title: string;
  instructor: string;
  duration: string;
  category: Exclude<AcademyCategory, 'All Sessions'>;
  summary: string;
  keyTakeaways: string[];
  actionChecklist: string[];
  relatedBriefingId: string;
  relatedBriefingTitle: string;
  careerToolTarget: CareerToolId;
}

interface VideoAcademyTabProps {
  externalSessionTrigger?: { id: string; nonce: number } | null;
  onOpenBriefing?: (briefingId: string) => void;
  onOpenCareerStudio?: (tool?: CareerToolId) => void;
}

const ACADEMY_CATEGORIES: AcademyCategory[] = [
  'All Sessions',
  'AI & Mock Interviews',
  'RLHF & Data Annotation',
  'AI & Dev Workflows',
];

const ACADEMY_SESSIONS: AcademyVideoSession[] = [
  {
    id: 'star-framework-exponent',
    youtubeId: 'd2AnPgnCNZM',
    title: 'The STAR Framework: Nail Your Behavioral & AI Vetting Interview',
    instructor: 'Aced (Exponent)',
    duration: '12 min',
    category: 'AI & Mock Interviews',
    summary:
      'Master structured behavioral storytelling used across automated AI vetting screens (micro1, Mercor) and live remote engineering interviews.',
    keyTakeaways: [
      'Keep Situation and Task setup under 25% of your speaking time so the rubric evaluates your direct engineering decisions.',
      'Replace vague team pronouns ("we shipped") with crisp first-person ownership ("I profiled the query and cut p99 latency").',
      'Anchor every Result statement in verifiable numbers: latency drops, USD savings, accuracy gains, or eval pass rates.',
      'Speak at a steady 135–150 WPM cadence with clean pauses so automated AI transcription graders capture every metric accurately.',
    ],
    actionChecklist: [
      'Draft 3 modular STAR stories in Career Studio covering debugging, trade-offs, and cross-team ownership.',
      'Rehearse each story out loud under a strict 120-second timer without reading verbatim.',
      'Add at least two concrete quantitative outcomes per story before taking an AI screen.',
    ],
    relatedBriefingId: 'briefing-interview-star',
    relatedBriefingTitle: 'Mastering Async Video Screens & STAR Behavioral Interviews',
    careerToolTarget: 'interview',
  },
  {
    id: 'star-when-to-use',
    youtubeId: 'gUQn50iEPqg',
    title: 'The S.T.A.R. Interview Method: Common Traps & How to Fix Them',
    instructor: 'Carol Forde-Johnston',
    duration: '11 min',
    category: 'AI & Mock Interviews',
    summary:
      'Recognize when candidates over-explain background context and learn how to pivot smoothly into measurable execution and reflection.',
    keyTakeaways: [
      'Automated and human interviewers score clarity of reasoning—jumping straight into the core constraint beats lengthy backstory.',
      'Include a concise 1-sentence Lesson Learned or follow-up safeguard to differentiate senior judgment from junior execution.',
      'Avoid hypothetical answers ("I would...") when asked a behavioral prompt ("Tell me about a time..."); always cite a real project.',
      'Prepare a 30-second compressed version for rapid-fire AI screening prompts.',
    ],
    actionChecklist: [
      'Trim background context in your primary interview story down to two crisp sentences.',
      'Record a quick audio check using clean microphone spacing to eliminate room echo.',
      'Verify each story clearly answers the exact prompt constraint rather than drifting off-topic.',
    ],
    relatedBriefingId: 'briefing-interview-star',
    relatedBriefingTitle: 'Mastering Async Video Screens & STAR Behavioral Interviews',
    careerToolTarget: 'interview',
  },
  {
    id: 'system-design-whatsapp',
    youtubeId: '0iyLURrWIgQ',
    title: 'System Design Mock Interview: Real-Time Messaging Architecture',
    instructor: 'Aced (Exponent)',
    duration: '44 min',
    category: 'AI & Mock Interviews',
    summary:
      'Full end-to-end mock technical interview walking through functional requirements, WebSocket gateways, message ordering, and storage trade-offs.',
    keyTakeaways: [
      'Always spend the first 4–5 minutes scoping functional requirements, scale targets (DAU/QPS), and latency SLAs before drawing boxes.',
      'Explain why you select a protocol (e.g., persistent WebSockets vs. long polling) rather than naming technologies in isolation.',
      'Call out read/write amplification, offline delivery queues, and idempotency keys proactively before the interviewer prompts you.',
      'Summarize bottlenecks and monitoring metrics in the final 5 minutes to demonstrate production readiness.',
    ],
    actionChecklist: [
      'Practice estimating QPS, payload sizes, and storage retention out loud in under 3 minutes.',
      'Write a 4-step template: Scope -> High-Level API & Flow -> Deep Dive Bottlenecks -> Reliability.',
      'Review failure modes (retry storms, split-brain writes, hot partitions) before live system rounds.',
    ],
    relatedBriefingId: 'briefing-code-benchmarks',
    relatedBriefingTitle: 'SWE-Bench & Unit-Test Synthesis: High-Tier Coding Specialist Roles',
    careerToolTarget: 'resume',
  },
  {
    id: 'system-design-youtube',
    youtubeId: 'jPKTo1iGQiE',
    title: 'Design YouTube: High-Throughput Video & Distributed Storage Mock',
    instructor: 'NeetCode',
    duration: '22 min',
    category: 'AI & Mock Interviews',
    summary:
      'Concise architecture breakdown covering chunked uploads, transcoding pipelines, CDN edge caching, and metadata database sharding.',
    keyTakeaways: [
      'Separate the metadata control plane (SQL/NoSQL) from the heavy binary media path (object storage + CDN edge nodes).',
      'Break large media uploads into resumable chunks with asynchronous DAG workers for adaptive bitrate transcoding.',
      'Justify caching tiers explicitly by comparing hot viral read ratios against long-tail cold storage access.',
      'Communicate trade-offs cleanly—clarity of reasoning counts far more than memorizing vendor names.',
    ],
    actionChecklist: [
      'Map out separate read vs. write paths when practicing any media or AI inference pipeline question.',
      'Practice explaining CDN cache invalidation and pre-signed upload URLs concisely.',
      'Timebox high-level diagramming to 15 minutes so you leave room for scaling deep dives.',
    ],
    relatedBriefingId: 'briefing-async-ops',
    relatedBriefingTitle: 'Async-First Engineering: Writing Habits That Win $140k+ Distributed Offers',
    careerToolTarget: 'resume',
  },
  {
    id: 'rlhf-ibm-explained',
    youtubeId: 'T_X4XFwKX8k',
    title: 'Reinforcement Learning from Human Feedback (RLHF) Explained',
    instructor: 'IBM Technology',
    duration: '9 min',
    category: 'RLHF & Data Annotation',
    summary:
      'Visual foundational guide to how human preference rankings train reward models and align foundation LLMs with helpfulness and safety rubrics.',
    keyTakeaways: [
      'RLHF bridges raw next-token pretraining and instruction-following behavior by encoding nuanced human judgment into a reward model.',
      'High-signal annotators evaluate multiple dimensions simultaneously: instruction adherence, factual grounding, tone, and refusal calibration.',
      'Side-by-Side (SxS) preference rationales must reference concrete evidence from the prompt and response rather than subjective vibes.',
      'Consistent inter-annotator agreement is the #1 factor platforms track when promoting trainers to senior reviewer tiers.',
    ],
    actionChecklist: [
      'Always verify every factual claim, math step, or code snippet inside Model A and Model B before picking a winner.',
      'Structure your SxS written justification in 3 parts: Verdict -> Core Dimension Delta -> Specific Error Citation.',
      'Never reward verbose filler over concise, constraint-compliant precision.',
    ],
    relatedBriefingId: 'briefing-rlhf-evals',
    relatedBriefingTitle: 'Inside $50/hr+ RLHF Rubrics: How Frontier Labs Grade Reasoning Chains',
    careerToolTarget: 'rubric-voice',
  },
  {
    id: 'rlhf-10-min-deep-dive',
    youtubeId: 'GSqZ8oQ6s50',
    title: 'RLHF Mechanics: Reward Models, Preference Pairs & Grading Rubrics',
    instructor: 'Byte Goose AI',
    duration: '10 min',
    category: 'RLHF & Data Annotation',
    summary:
      'Understand how SFT, reward modeling, and preference ranking datasets turn noisy model completions into reliable production assistants.',
    keyTakeaways: [
      'Supervised Fine-Tuning (SFT) establishes format and demonstration quality; preference pairs teach fine-grained boundary distinctions.',
      'Good rubrics break an open-ended prompt into binary verifiable criteria (format, constraints, accuracy, edge cases).',
      'Watch out for length bias—models often sound confident while sneaking subtle hallucinated APIs or fabricated citations.',
      'Domain experts earn higher hourly bands ($45–$85/hr) by writing adversarial prompts that expose reasoning failures.',
    ],
    actionChecklist: [
      'Run generated code snippets mentally or locally before marking a completion as "Fully Correct".',
      'Flag subtle negative-constraint violations (e.g., word limits, banned libraries, JSON schema mismatches).',
      'Keep a personal glossary of recurring rubric edge cases while onboarding onto a new annotation project.',
    ],
    relatedBriefingId: 'briefing-rlhf-evals',
    relatedBriefingTitle: 'Inside $50/hr+ RLHF Rubrics: How Frontier Labs Grade Reasoning Chains',
    careerToolTarget: 'rubric-voice',
  },
  {
    id: 'rlhf-nathan-lambert',
    youtubeId: 'McaI5kkQySU',
    title: 'Frontier RLHF, DPO & Post-Training Evaluation with Dr. Nathan Lambert',
    instructor: 'Super Data Science Podcast',
    duration: '58 min',
    category: 'RLHF & Data Annotation',
    summary:
      'In-depth engineering discussion on PPO vs. DPO, synthetic vs. human preference data, and why expert evaluation quality drives frontier AI gains.',
    keyTakeaways: [
      'Post-training labs increasingly invest in specialized STEM, coding, and multilingual human data over generic crowd labeling.',
      'Direct Preference Optimization (DPO) simplifies training stability, making clean, unambiguous preference pairs even more valuable.',
      'Over-optimization (reward hacking) occurs when evaluators reward overly polite sycophancy instead of truthful pushback.',
      'Understanding evaluation benchmarks helps AI Evaluation Engineers design automated LLM-as-a-judge pipelines.',
    ],
    actionChecklist: [
      'Study how sycophancy and over-refusal degrade model utility during evaluation tasks.',
      'Practice writing atomic, objective rubric criteria that both human reviewers and LLM judges can score consistently.',
      'Document edge-case reasoning clearly when escalating ambiguous prompts in production eval queues.',
    ],
    relatedBriefingId: 'briefing-synthetic-data',
    relatedBriefingTitle: 'Synthetic Data Curation: Why Human Judgment Still Anchors Model Quality',
    careerToolTarget: 'interview',
  },
  {
    id: 'andrew-ng-prompting',
    youtubeId: '8ib4Qnh2HFE',
    title: 'Full AI Prompting Course: Systematic Workflows & Reasoning Patterns',
    instructor: 'DeepLearning.AI (Andrew Ng)',
    duration: '45 min',
    category: 'AI & Dev Workflows',
    summary:
      'Master practical prompting principles—clear delimiters, structured outputs, iterative refinement, and giving models explicit reasoning steps.',
    keyTakeaways: [
      'Separate instructions from untrusted user data using clear delimiters (XML tags or triple backticks) to prevent prompt injection.',
      'Request structured JSON or Markdown schemas when integrating LLM calls into automated developer workflows.',
      'Instruct the model to verify intermediate assumptions or work out its own solution before grading or summarizing.',
      'Treat prompt design like software engineering: build a small test suite and iterate systematically rather than guessing.',
    ],
    actionChecklist: [
      'Wrap variable inputs in explicit XML tags (<context>...</context>) in your reusable prompt templates.',
      'Save your top-performing system prompts inside the Productivity tab Snippets Vault for fast daily reuse.',
      'Test prompts across at least 3 edge-case inputs before shipping any workflow automation.',
    ],
    relatedBriefingId: 'briefing-prompt-schema',
    relatedBriefingTitle: 'Structured Prompt Contracts: Designing Deterministic JSON Tool Calls',
    careerToolTarget: 'resume',
  },
  {
    id: 'freecodecamp-prompt-eng',
    youtubeId: '_ZvnD73m40o',
    title: 'Prompt Engineering Tutorial: Zero-Shot, Few-Shot & Hallucination Control',
    instructor: 'freeCodeCamp.org',
    duration: '41 min',
    category: 'AI & Dev Workflows',
    summary:
      'Hands-on developer guide to crafting reliable prompts, using few-shot exemplars, controlling temperature, and mitigating model hallucinations.',
    keyTakeaways: [
      'Zero-shot prompting works well for broad tasks, while 2–4 diverse few-shot examples lock in tone, edge cases, and formatting.',
      'Lower temperature (0.0–0.2) for deterministic extraction, classification, and code review; raise slightly for brainstorming.',
      'Instruct models explicitly to answer "Insufficient context" when grounding facts are absent from provided documents.',
      'Combine role framing with explicit negative constraints to eliminate repetitive boilerplate phrasing.',
    ],
    actionChecklist: [
      'Add 2–3 gold-standard input/output pairs whenever a task requires strict formatting consistency.',
      'Include an explicit fallback phrase for missing evidence in every RAG or summarization prompt.',
      'Verify outputs against JSON schemas using the Dev Tools validator before downstream processing.',
    ],
    relatedBriefingId: 'briefing-rag-pipelines',
    relatedBriefingTitle: 'Auditing RAG Pipelines: Citation Grounding and Hallucination Metrics',
    careerToolTarget: 'resume',
  },
  {
    id: 'google-ai-studio-workflow',
    youtubeId: 'oQw3MauKik8',
    title: 'Google AI Studio Mastery: System Instructions, Prototyping & Gemini API',
    instructor: 'proflead',
    duration: '14 min',
    category: 'AI & Dev Workflows',
    summary:
      'Walkthrough of Google AI Studio features including system instructions, structured output schemas, safety controls, and rapid API code export.',
    keyTakeaways: [
      'System Instructions persist behavioral boundaries across multi-turn chats without cluttering user-turn prompts.',
      'Structured Outputs force deterministic JSON responses aligned with TypeScript interfaces for reliable app integration.',
      'Inspect token counts and context window usage directly inside AI Studio to optimize inference latency and cost.',
      'Export tested prompts straight into @google/genai TypeScript code once your prototype passes validation.',
    ],
    actionChecklist: [
      'Move persona rules and formatting mandates into System Instructions rather than repeating them per message.',
      'Define strict response schemas when extracting job data, resume fields, or evaluation rubrics.',
      'Compare Gemini Flash vs. Pro latency in AI Studio before finalizing production model selection.',
    ],
    relatedBriefingId: 'briefing-prompt-schema',
    relatedBriefingTitle: 'Structured Prompt Contracts: Designing Deterministic JSON Tool Calls',
    careerToolTarget: 'resume',
  },
];

export const VideoAcademyTab: React.FC<VideoAcademyTabProps> = ({
  externalSessionTrigger,
  onOpenBriefing,
  onOpenCareerStudio,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<AcademyCategory>('All Sessions');
  const [activeVideoId, setActiveVideoId] = useState<string>(
    ACADEMY_SESSIONS[0].id
  );
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [suggestTitle, setSuggestTitle] = useState('');
  const [suggestUrl, setSuggestUrl] = useState('');
  const [suggestCategory, setSuggestCategory] = useState<
    Exclude<AcademyCategory, 'All Sessions'>
  >('AI & Mock Interviews');
  const [suggestNotes, setSuggestNotes] = useState('');
  const [suggestError, setSuggestError] = useState('');
  const [suggestSent, setSuggestSent] = useState(false);

  useEffect(() => {
    if (!externalSessionTrigger?.id) return;
    const found = ACADEMY_SESSIONS.find((s) => s.id === externalSessionTrigger.id);
    if (found) {
      setSelectedCategory('All Sessions');
      setActiveVideoId(found.id);
    }
  }, [externalSessionTrigger]);

  const filteredSessions = useMemo(() => {
    if (selectedCategory === 'All Sessions') return ACADEMY_SESSIONS;
    return ACADEMY_SESSIONS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const activeSession = useMemo(
    () =>
      ACADEMY_SESSIONS.find((s) => s.id === activeVideoId) ?? ACADEMY_SESSIONS[0],
    [activeVideoId]
  );

  const handleWatchInPlayer = (sessionId: string) => {
    setActiveVideoId(sessionId);
    if (typeof document !== 'undefined') {
      document
        .getElementById('video-academy-theatre')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleChecklistStep = (stepKey: string) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const handleSubmitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = suggestTitle.trim();
    const trimmedUrl = suggestUrl.trim();
    if (!trimmedTitle || !/^https?:\/\/.+/i.test(trimmedUrl)) {
      setSuggestError(
        'Please enter a descriptive video title and valid https:// YouTube URL.'
      );
      return;
    }

    setSuggestError('');
    try {
      await fetch('https://formsubmit.co/ajax/team@planetaihub.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `[PlanetAI Hub Video Academy] Video Suggestion: ${trimmedTitle}`,
          title: trimmedTitle,
          youtube_url: trimmedUrl,
          category: suggestCategory,
          notes: suggestNotes.trim() || 'Submitted via Video Academy',
        }),
      });
    } catch {
      // Non-blocking fallback
    }

    setSuggestSent(true);
    setSuggestTitle('');
    setSuggestUrl('');
    setSuggestNotes('');
  };

  return (
    <section aria-labelledby="video-academy-heading" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#1D4ED8]">
              <PlayCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
                Training &amp; Interview Prep
              </p>
              <h2
                id="video-academy-heading"
                className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance"
              >
                PlanetAI Video Academy
              </h2>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Playable educational workshops on passing AI vetting screens, mastering RLHF evaluation rubrics, and shipping real-world AI workflows—paired with structured study notes and companion briefings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSuggestSent(false);
            setSuggestError('');
            setIsSuggestOpen(true);
          }}
          className="inline-flex min-h-[40px] items-center gap-1.5 self-start rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#1D4ED8]/40 hover:bg-blue-50/50 hover:text-[#1D4ED8] lg:self-auto whitespace-nowrap shrink-0"
        >
          <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Suggest an Educational Video</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div
        role="tablist"
        aria-label="Filter video sessions by category"
        className="flex flex-wrap items-center gap-2"
      >
        {ACADEMY_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const count =
            category === 'All Sessions'
              ? ACADEMY_SESSIONS.length
              : ACADEMY_SESSIONS.filter((s) => s.category === category).length;

          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedCategory(category)}
              className={`min-h-[38px] rounded-full border px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                isSelected
                  ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      {/* FEATURED INTERACTIVE VIDEO THEATRE + STRUCTURED STUDY NOTES */}
      <div
        id="video-academy-theatre"
        className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md sm:p-7"
      >
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
          {/* Left: 16:9 Privacy-Enhanced YouTube Player */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm">
              <iframe
                key={activeSession.youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${activeSession.youtubeId}?rel=0`}
                title={activeSession.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#1D4ED8]">
                  {activeSession.category}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-600">
                  <Clock className="h-3 w-3 text-slate-500" aria-hidden="true" />
                  {activeSession.duration}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  by <strong className="text-slate-800">{activeSession.instructor}</strong>
                </span>
              </div>

              <a
                href={`https://www.youtube.com/watch?v=${activeSession.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] hover:underline whitespace-nowrap"
              >
                <span>Open on YouTube</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>

            <div>
              <h3 className="font-display text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                {activeSession.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {activeSession.summary}
              </p>
            </div>

            {/* Cross-Links to Companion Briefing & Career Studio */}
            <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-4">
              {onOpenBriefing && (
                <button
                  type="button"
                  onClick={() => onOpenBriefing(activeSession.relatedBriefingId)}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/70 px-4 py-1.5 text-xs font-semibold text-[#1D4ED8] transition-colors hover:bg-blue-100"
                >
                  <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Read Companion Guide: {activeSession.relatedBriefingTitle}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </button>
              )}

              {onOpenCareerStudio && (
                <button
                  type="button"
                  onClick={() => onOpenCareerStudio(activeSession.careerToolTarget)}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <FileText className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Practice in Career Studio</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Structured Study Notes & Actionable Checklist */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <BookOpen className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                <h4 className="font-display text-base font-bold text-slate-900">
                  Structured Study Notes &amp; Key Takeaways
                </h4>
              </div>

              <ul className="space-y-2.5 text-xs leading-relaxed text-slate-700 sm:text-[13px]">
                {activeSession.keyTakeaways.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4ED8]"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Actionable Prep Checklist
                </h5>
              </div>

              <ul className="mt-3 space-y-2">
                {activeSession.actionChecklist.map((step, idx) => {
                  const stepKey = `${activeSession.id}-step-${idx}`;
                  const isDone = Boolean(checkedSteps[stepKey]);
                  return (
                    <li key={stepKey}>
                      <button
                        type="button"
                        onClick={() => handleToggleChecklistStep(stepKey)}
                        aria-pressed={isDone}
                        className="flex w-full items-start gap-2.5 rounded-lg p-1.5 text-left text-xs transition-colors hover:bg-slate-50"
                      >
                        {isDone ? (
                          <CheckSquare
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                            aria-hidden="true"
                          />
                        ) : (
                          <Square
                            className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={
                            isDone
                              ? 'text-slate-400 line-through'
                              : 'text-slate-700 font-medium'
                          }
                        >
                          {step}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CURATED EDUCATIONAL VIDEO LIBRARY GRID */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-slate-900 sm:text-xl">
            Curated Video Library ({filteredSessions.length} Sessions)
          </h3>
          <p className="text-xs text-slate-500">
            Select any tutorial to load it into the player with study notes
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSessions.map((session) => {
            const isActive = session.id === activeSession.id;
            return (
              <article
                key={session.id}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                  isActive
                    ? 'border-[#1D4ED8] ring-2 ring-blue-600/15 shadow-md'
                    : 'border-slate-200 shadow-xs hover:-translate-y-0.5 hover:border-[#1D4ED8]/40 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Clean Video Thumbnail Header */}
                  <div className="relative aspect-video w-full overflow-hidden border-b border-slate-100 bg-slate-100">
                    <img
                      src={`https://i.ytimg.com/vi/${session.youtubeId}/hqdefault.jpg`}
                      alt={session.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/15"
                    />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="rounded-full border border-white/80 bg-white/95 px-2.5 py-0.5 text-[10px] font-semibold text-[#1D4ED8] shadow-2xs">
                        {session.category}
                      </span>
                      <span className="rounded-full bg-slate-900/80 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-white backdrop-blur-xs">
                        {session.duration}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleWatchInPlayer(session.id)}
                      aria-label={`Play ${session.title}`}
                      className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1D4ED8] text-white shadow-md transition-transform group-hover:scale-105 hover:bg-[#1E40AF]"
                    >
                      <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Clean White Card Body */}
                  <div className="p-5">
                    <p className="text-[11px] font-semibold text-slate-500">
                      {session.instructor}
                    </p>
                    <h4 className="mt-1 font-display text-base font-bold leading-snug text-slate-900 line-clamp-2 group-hover:text-[#1D4ED8] transition-colors">
                      {session.title}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">
                      {session.summary}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3.5">
                  <button
                    type="button"
                    onClick={() => handleWatchInPlayer(session.id)}
                    className={`inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      isActive
                        ? 'border border-blue-200 bg-blue-50 text-[#1D4ED8]'
                        : 'bg-[#1D4ED8] text-white shadow-xs hover:bg-[#1E40AF]'
                    }`}
                  >
                    <PlayCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{isActive ? 'Playing in Theatre' : 'Watch in Player'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Bottom Suggest Link */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-base font-bold text-slate-900">
            Know an exceptional AI interview or RLHF walkthrough?
          </p>
          <p className="mt-0.5 text-xs text-slate-600">
            Creators and learners can recommend high-signal YouTube tutorials for editorial review.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSuggestSent(false);
            setSuggestError('');
            setIsSuggestOpen(true);
          }}
          className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#1D4ED8] shadow-2xs transition-colors hover:border-[#1D4ED8]/40 hover:bg-blue-50/50 whitespace-nowrap"
        >
          <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Suggest an Educational Video</span>
        </button>
      </div>

      <AdBanner />

      {/* Suggest an Educational Video Modal */}
      {isSuggestOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="suggest-video-title"
          onClick={() => setIsSuggestOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl sm:rounded-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
                  Video Academy Submissions
                </p>
                <h3
                  id="suggest-video-title"
                  className="mt-1 font-display text-xl font-bold text-slate-900"
                >
                  Suggest an Educational Video
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSuggestOpen(false)}
                aria-label="Close suggestion modal"
                className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {suggestSent ? (
              <div className="mt-5 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h4 className="font-display text-lg font-bold text-slate-900">
                  Suggestion Sent to Editorial Desk!
                </h4>
                <p className="text-xs leading-relaxed text-slate-600">
                  Thank you for contributing to PlanetAI Video Academy. Our editors review submissions at{' '}
                  <span className="font-mono font-semibold text-[#1D4ED8]">
                    team@planetaihub.com
                  </span>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuggestOpen(false)}
                  className="w-full rounded-full bg-[#1D4ED8] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#1E40AF]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitSuggestion} className="mt-5 space-y-4">
                {suggestError && (
                  <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
                    {suggestError}
                  </p>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Tutorial Title *
                  </label>
                  <input
                    type="text"
                    value={suggestTitle}
                    onChange={(e) => setSuggestTitle(e.target.value)}
                    placeholder="e.g. Prompt Evaluation & Rubric Calibration Walkthrough"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    YouTube Video URL *
                  </label>
                  <input
                    type="url"
                    value={suggestUrl}
                    onChange={(e) => setSuggestUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Academy Track
                  </label>
                  <select
                    value={suggestCategory}
                    onChange={(e) =>
                      setSuggestCategory(
                        e.target.value as Exclude<AcademyCategory, 'All Sessions'>
                      )
                    }
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                  >
                    <option value="AI & Mock Interviews">AI &amp; Mock Interviews</option>
                    <option value="RLHF & Data Annotation">RLHF &amp; Data Annotation</option>
                    <option value="AI & Dev Workflows">AI &amp; Dev Workflows</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Why It Helps Learners (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={suggestNotes}
                    onChange={(e) => setSuggestNotes(e.target.value)}
                    placeholder="Key takeaways or timestamp highlights..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsSuggestOpen(false)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#1D4ED8] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1E40AF]"
                  >
                    <Send className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Submit Video</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
