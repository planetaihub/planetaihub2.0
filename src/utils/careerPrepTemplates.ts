import type { JobListing } from '../types';
import { REFERRAL_URLS, resolveApplyUrl } from './referralLinks';
import { inferRoleBundleFromJob, type RoleBundleId } from './roleBundles';

export type CareerToolId =
  | 'role-prep'
  | 'resume'
  | 'interview'
  | 'email'
  | 'rubric-voice';

export type InterviewRoleTrack =
  | 'Frontend & Full-Stack'
  | 'Backend & Systems'
  | 'Product Design'
  | 'Product Management'
  | 'Data & AI'
  | 'Operations & Growth';

export interface HeroCompanySpotlight {
  id: 'micro1' | 'mercor' | 'outlier';
  company: string;
  domain: string;
  roleTitle: string;
  payBand: string;
  videoLabel: string;
  youtubeId: string;
  screeningFocus: string;
  requirements: string[];
  applyUrl: string;
  roleBundleId: RoleBundleId;
  resumeTemplate: {
    targetTitle: string;
    targetCompany: string;
    summary: string;
    skills: string;
    role: string;
    bullets: string;
  };
  interviewTemplate: {
    track: InterviewRoleTrack;
    questionId: string;
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export interface CareerPrepJobMeta {
  title: string;
  company: string;
  payRange: string;
  location: string;
  type: string;
  category: string;
  summary: string;
  applyUrl: string;
  stack: string[];
  responsibilities: string[];
  requirements: string[];
}

export interface CareerPrepPayload {
  nonce: number;
  targetTool: CareerToolId;
  sourceLabel: string;
  roleBundleId?: RoleBundleId;
  companyDomain?: string;
  applyUrl?: string;
  payBand?: string;
  customVideoUrl?: string;
  jobMeta?: CareerPrepJobMeta;
  resume?: {
    targetTitle: string;
    targetCompany: string;
    summary: string;
    skills: string;
    experienceRole?: string;
    experienceBullets?: string;
  };
  interview?: {
    track: InterviewRoleTrack;
    questionId: string;
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export const HERO_COMPANY_SPOTLIGHTS: HeroCompanySpotlight[] = [
  {
    id: 'micro1',
    company: 'micro1',
    domain: 'micro1.ai',
    roleTitle: 'AI Software & Evaluation Engineer',
    payBand: '$50 – $85 / hr USD',
    videoLabel: 'Technical System & AI Vetting Walkthrough',
    youtubeId: 'jPKTo1iGQiE',
    screeningFocus: '5-min async AI screen + system trade-offs & code quality rubric',
    requirements: [
      'TypeScript, Python, or React production debugging & API design',
      'Clear verbal explanation of latency, caching, and failure trade-offs',
      'Worldwide async remote availability (15–40 hrs/week)',
    ],
    applyUrl: REFERRAL_URLS.micro1,
    roleBundleId: 'ai-software',
    resumeTemplate: {
      targetTitle: 'AI Software & Evaluation Engineer',
      targetCompany: 'micro1',
      summary:
        'Full-stack and AI systems engineer specializing in TypeScript, Python evaluation harnesses, and scalable API design. Experienced writing deterministic unit tests, benchmarking LLM reasoning accuracy, and shipping clean async deliverables for distributed engineering teams.',
      skills:
        'TypeScript, Python, React, Node.js, LLM Evaluation, Unit Testing, System Design, REST/GraphQL APIs',
      role: 'Senior Software & AI Evaluation Contributor',
      bullets:
        '• Built reproducible benchmark suites and fail-to-pass integration tests across production repositories.\n• Diagnosed API latency and state-management bottlenecks, cutting p95 response time by 38%.\n• Documented clear architectural trade-offs and edge-case verifications for async global teams.',
    },
    interviewTemplate: {
      track: 'Data & AI',
      questionId: 'da-1',
      situation:
        'Our production LLM evaluation pipeline was returning inconsistent pass/fail verdicts whenever multi-file TypeScript patches introduced subtle type or runtime edge cases.',
      task: 'I was responsible for redesigning the verification harness so automated rubric graders caught regressions reliably before human review.',
      action:
        'I separated deterministic unit-test assertions from qualitative rubric checks, added isolated sandbox execution with strict JSON output schemas, and benchmarked 50 golden failure cases.',
      result:
        'False-positive pass rates dropped by 42% within two weeks and reviewer calibration agreement rose above 94% across distributed contributors.',
    },
  },
  {
    id: 'mercor',
    company: 'Mercor',
    domain: 'mercor.com',
    roleTitle: 'AI Domain Expert & Reasoning Specialist',
    payBand: '$60 – $120 / hr USD',
    videoLabel: 'Structured STAR & AI Vetting Interview Mastery',
    youtubeId: 'd2AnPgnCNZM',
    screeningFocus: 'Structured 20-min AI conversational interview & quantified STAR depth',
    requirements: [
      'Deep expertise in SWE, Quantitative Reasoning, Finance, or Law',
      'First-person ownership with quantified metrics in behavioral responses',
      'High-precision rubric critiques and edge-case problem authoring',
    ],
    applyUrl: REFERRAL_URLS.mercor,
    roleBundleId: 'prompt-llm',
    resumeTemplate: {
      targetTitle: 'AI Domain Expert & Reasoning Specialist',
      targetCompany: 'Mercor',
      summary:
        'Domain specialist with proven experience designing rigorous evaluation rubrics, authoring multi-step reasoning benchmarks, and auditing frontier model outputs for factual accuracy and edge-case completeness.',
      skills:
        'Domain Evaluation, Rubric Authoring, Multi-Step Reasoning, Python, Technical Auditing, Quantitative Analysis',
      role: 'Lead Domain Reasoning Reviewer',
      bullets:
        '• Authored 180+ multi-step domain prompts designed to surface subtle logical and quantitative hallucinations.\n• Calibrated structured scoring rubrics covering constraint adherence, edge cases, and citation accuracy.\n• Maintained 97% quality audit acceptance across high-complexity expert evaluation sprints.',
    },
    interviewTemplate: {
      track: 'Data & AI',
      questionId: 'da-2',
      situation:
        'During an automated evaluation sprint, a flagship model achieved high overall scores despite failing subtle boundary constraints in specialized technical scenarios.',
      task: 'I needed to isolate why aggregate pass metrics looked inflated and explain the risk clearly to non-technical program leads.',
      action:
        'I grouped failure traces by constraint type, built a 1-page breakdown showing three concrete production risks, and proposed weighted rubric deductions for silent hallucinated citations.',
      result:
        'Leadership adopted the weighted rubric within 48 hours, cutting uncaught domain errors by 35% on the following release candidate.',
    },
  },
  {
    id: 'outlier',
    company: 'Outlier',
    domain: 'outlier.ai',
    roleTitle: 'RLHF AI Trainer & Rubric Specialist',
    payBand: '$35 – $65 / hr USD',
    videoLabel: 'RLHF Preference Ranking & Rubric Alignment Guide',
    youtubeId: 'T_X4XFwKX8k',
    screeningFocus: 'Side-by-Side (SxS) completion ranking & instruction-following justification',
    requirements: [
      'Sharp analytical writing and zero-hallucination fact verification',
      'Ability to justify Model A vs. Model B rankings against multi-rule rubrics',
      'Flexible self-paced remote hours with weekly USD payouts',
    ],
    applyUrl: 'https://outlier.ai',
    roleBundleId: 'rlhf',
    resumeTemplate: {
      targetTitle: 'RLHF AI Trainer & Evaluation Specialist',
      targetCompany: 'Outlier',
      summary:
        'Analytical AI evaluator experienced in RLHF Side-by-Side (SxS) preference ranking, instruction-following audits, and clear evidence-backed written rationales across coding, STEM, and general reasoning tracks.',
      skills:
        'RLHF Evaluation, SxS Comparison, Prompt Engineering, Fact-Checking, Rubric Calibration, Technical Writing',
      role: 'AI Response Evaluator & Quality Reviewer',
      bullets:
        '• Evaluated 600+ Side-by-Side LLM responses for instruction adherence, factual grounding, and tone safety.\n• Rewrote ambiguous completions into gold-standard reference answers meeting strict JSON/style schemas.\n• Advanced to senior audit queue based on consistent inter-annotator accuracy.',
    },
    interviewTemplate: {
      track: 'Operations & Growth',
      questionId: 'og-1',
      situation:
        'While onboarding onto a high-volume evaluation queue, contributors frequently disagreed on how to penalize verbose but technically accurate model outputs.',
      task: 'I took initiative to create a concise checklist summarizing edge-case rubric rules so scoring stayed consistent across tasks.',
      action:
        'I documented 12 recurring instruction-violation patterns with clear good-vs-bad examples and structured a 3-step self-audit pass before submitting any SxS justification.',
      result:
        'My personal task approval rating climbed to 98% and I was invited to review and calibrate onboarding submissions for newer specialists.',
    },
  },
];

export function buildJobPrepPayload(
  job: JobListing,
  targetTool: CareerToolId = 'resume'
): CareerPrepPayload {
  const stackCsv = [...job.stack, job.category, 'Remote Async', 'USD Contract']
    .filter(Boolean)
    .slice(0, 8)
    .join(', ');

  const bulletLines = [
    ...job.responsibilities.slice(0, 2).map((r) => `• ${r}`),
    `• Delivered verifiable outcomes in ${job.category} across distributed remote workflows (${job.type}).`,
  ].join('\n');

  const isTech =
    job.category === 'Engineering' ||
    job.category === 'Developer Relations' ||
    job.category === 'Design & UI';
  const track: InterviewRoleTrack = isTech
    ? 'Frontend & Full-Stack'
    : 'Data & AI';
  const questionId = isTech ? 'fe-2' : 'da-1';
  const resolvedUrl = resolveApplyUrl(job.company, job.applyUrl);

  return {
    nonce: Date.now(),
    targetTool,
    sourceLabel: `${job.title} @ ${job.company}`,
    roleBundleId: inferRoleBundleFromJob(job),
    companyDomain: job.companyDomain,
    applyUrl: resolvedUrl,
    payBand: job.payRange,
    jobMeta: {
      title: job.title,
      company: job.company,
      payRange: job.payRange,
      location: job.location,
      type: job.type,
      category: job.category,
      summary: job.summary,
      applyUrl: resolvedUrl,
      stack: job.stack,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
    },
    resume: {
      targetTitle: job.title,
      targetCompany: job.company,
      summary: `${job.category} specialist targeting ${job.title} at ${job.company} (${job.payRange}). Proven track record in ${job.stack.slice(0, 3).join(', ') || job.category} with strong written async communication and reliable milestone delivery.`,
      skills: stackCsv,
      experienceRole: `${job.category} Specialist`,
      experienceBullets: bulletLines,
    },
    interview: {
      track,
      questionId,
      situation: `While contributing remotely on a ${job.category.toLowerCase()} initiative (${job.stack.slice(0, 2).join(' & ') || job.type}), requirements shifted mid-sprint across timezones.`,
      task: `I needed to keep deliverables aligned with ${job.company}-grade quality standards without waiting on synchronous meetings.`,
      action: `I wrote a concise spec checklist, validated edge cases using ${job.stack[0] || 'structured benchmarks'}, and posted clear async status updates before handoff.`,
      result: `Shipped the milestone on schedule with zero rework and documented the repeatable rubric for teammates.`,
    },
  };
}

export function resolveSpotlightApplyUrl(spotlight: HeroCompanySpotlight): string {
  return resolveApplyUrl(spotlight.company, spotlight.applyUrl);
}
