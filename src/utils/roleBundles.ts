import type { JobListing } from '../types';
import { REFERRAL_URLS } from './referralLinks';
import type { InterviewRoleTrack } from './careerPrepTemplates';

export type RoleBundleId =
  | 'rlhf'
  | 'voice-ai'
  | 'prompt-llm'
  | 'ai-software';

export interface RoleBundleEmployerLink {
  company: string;
  payBand: string;
  note: string;
  applyUrl: string;
}

export interface RoleBundle {
  id: RoleBundleId;
  shortLabel: string;
  title: string;
  payBand: string;
  contractFormat: string;
  timezoneSummary: string;
  overviewSummary: string;
  duties: string[];
  requirements: string[];
  employerLinks: RoleBundleEmployerLink[];
  video: {
    youtubeId: string;
    title: string;
    instructor: string;
    duration: string;
    watchTip: string;
  };
  editorialGuide: {
    title: string;
    readTime: string;
    keyTakeaways: string[];
    sections: Array<{ heading: string; body: string }>;
  };
  resumeTemplate: {
    targetTitle: string;
    targetCompany: string;
    summary: string;
    skills: string;
    experienceRole: string;
    experienceBullets: string;
  };
  interviewScript: {
    track: InterviewRoleTrack;
    questionId: string;
    questionPrompt: string;
    interviewerLens: string;
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export const ROLE_BUNDLES: RoleBundle[] = [
  {
    id: 'rlhf',
    shortLabel: 'Data Annotation & RLHF',
    title: 'RLHF AI Trainer & Diagnostic Rubric Specialist',
    payBand: '$35 – $65 / hr USD',
    contractFormat: 'Flexible Remote Contract · Weekly USD Payouts',
    timezoneSummary: 'Worldwide Async (15–40 hrs/week)',
    overviewSummary:
      'Evaluate frontier model responses side-by-side, locate reasoning or code failures, author structured diagnostic rubrics, and write gold-standard reference completions across STEM, coding, and analytical writing queues.',
    duties: [
      'Grade Side-by-Side (SxS) model responses against multi-rule instruction and factuality rubrics.',
      'Isolate the earliest point of reasoning divergence or silent hallucination in multi-step outputs.',
      'Rewrite flawed responses into clean, constraint-compliant gold-standard demonstrations.',
      'Maintain high inter-annotator agreement during calibration sprints to unlock senior audit tiers.',
    ],
    requirements: [
      'Sharp analytical writing and zero-hallucination verification discipline (citing primary sources or running code locally).',
      'Ability to synthesize binary rubric criteria rather than writing vague subjective opinions.',
      'Reliable quiet workspace and consistent weekly delivery with zero unverified copy-paste AI filler.',
    ],
    employerLinks: [
      {
        company: 'Outlier',
        payBand: '$35 – $65 / hr USD',
        note: 'Generalist, STEM & Coding RLHF queues',
        applyUrl: 'https://outlier.ai',
      },
      {
        company: 'Mercor',
        payBand: '$50 – $90 / hr USD',
        note: 'Domain-expert rubric & reasoning projects',
        applyUrl: REFERRAL_URLS.mercor,
      },
      {
        company: 'Visora AI',
        payBand: '$30 – $55 / hr USD',
        note: 'Multimodal evaluation & preference annotation',
        applyUrl: REFERRAL_URLS.visora,
      },
    ],
    video: {
      youtubeId: 'T_X4XFwKX8k',
      title: 'Reinforcement Learning from Human Feedback (RLHF) Explained',
      instructor: 'IBM Technology',
      duration: '9 min',
      watchTip:
        'Pay close attention to how preference rankings feed reward models—high-tier labs reject vague "looks better" rationales and reward specific dimension-by-dimension evidence.',
    },
    editorialGuide: {
      title: 'How to Pass $40–$65/hr RLHF Screening & Avoid Length-Bias Traps',
      readTime: '4 min read',
      keyTakeaways: [
        'Never reward verbose confident prose when a model skips a negative constraint or invents a citation.',
        'Structure every Side-by-Side rationale in three crisp parts: Verdict -> Core Dimension Delta -> Exact Quote/Line Proof.',
        'Verify every math intermediate step and code import before assigning a top truthfulness rating.',
      ],
      sections: [
        {
          heading: '1. Why Screening Audits Fail Strong Writers',
          body: 'Most RLHF qualification tests fail candidates for one reason: rewarding polished tone over factual or constraint accuracy. Model A may sound warm and thorough while violating a "use zero external libraries" constraint, while Model B follows every constraint concisely. Always audit negative constraints first before reading for style.',
        },
        {
          heading: '2. Writing Calibrated Diagnostic Justifications',
          body: 'Lead immediately with your winner and severity gap (e.g., "Model B is much better because Model A hallucinates a deprecated API flag on line 7"). Cite exact snippets from both completions, keep subjective adjectives out of your justification, and document any partial instruction misses explicitly.',
        },
        {
          heading: '3. Moving from Generalist Queue to Senior Reviewer',
          body: 'Contributors who maintain 90%+ calibration scores on onboarding benchmarks are quickly invited to higher-paying review and rubric-authoring queues. Treat every qualifier prompt like a production spec test rather than a speed race.',
        },
      ],
    },
    resumeTemplate: {
      targetTitle: 'RLHF AI Trainer & Diagnostic Rubric Specialist',
      targetCompany: 'Outlier / Mercor',
      summary:
        'Analytical AI evaluation specialist experienced in Side-by-Side (SxS) preference ranking, multi-step reasoning verification, and diagnostic rubric authoring. Proven accuracy auditing LLM outputs for constraint adherence, factual grounding, and technical correctness.',
      skills:
        'RLHF Evaluation, SxS Preference Ranking, Rubric Authoring, Fact-Checking, Python / Logic Verification, Instruction Following QA, Technical Writing',
      experienceRole: 'AI Response Evaluator & Quality Reviewer',
      experienceBullets:
        '• Audited 500+ Side-by-Side LLM completions for instruction compliance, factual truthfulness, and reasoning coherence.\n• Authored atomic, binary rubric criteria eliminating subjective grader drift across multi-turn edge cases.\n• Rewrote flawed model completions into clean reference answers while maintaining 96%+ reviewer calibration accuracy.',
    },
    interviewScript: {
      track: 'Data & AI',
      questionId: 'da-1',
      questionPrompt:
        'Tell me about an evaluation pipeline or data quality monitor you built that caught silent regressions before users noticed.',
      interviewerLens:
        'Shows how you verify edge cases systematically instead of trusting aggregate pass scores.',
      situation:
        'During a high-volume LLM evaluation sprint, contributors repeatedly disagreed on whether verbose but slightly off-constraint completions should pass or fail.',
      task: 'I needed to establish repeatable quality checks that caught subtle instruction violations and hallucinated claims before submissions reached final QA.',
      action:
        'I grouped recurring model errors into a 4-point pre-submit checklist—negative constraints, factual citation checks, code/math dry-runs, and formatting schemas—and calibrated borderline examples against the project rubric.',
      result:
        'My personal approval accuracy climbed to 98% within two weeks and prevented dozens of subtle false-pass ratings from entering the training batch.',
    },
  },
  {
    id: 'voice-ai',
    shortLabel: 'Voice AI & Audio Evaluator',
    title: 'Voice AI Contributor & Conversational Speech Evaluator',
    payBand: '$25 – $48 / hr USD',
    contractFormat: 'Remote Session Contract · Per-Audio / Hourly USD',
    timezoneSummary: 'Worldwide Self-Scheduled Recording Windows',
    overviewSummary:
      'Record studio-clean conversational speech, bilingual code-switching dialogues, and emotional prosody datasets, or audit synthetic Text-to-Speech (TTS) outputs for acoustic artifacts, pronunciation accuracy, and natural pacing.',
    duties: [
      'Capture natural, unscripted and prompted speech sessions inside a quiet, low-reverb acoustic space.',
      'Perform bilingual pronunciation and regional intonation checks for multilingual voice models.',
      'Score synthetic speech clips for clicks, room echo, robotic cadence, and clipping.',
      'Maintain consistent mic-to-mouth distance and -12 dBFS to -6 dBFS recording gain targets.',
    ],
    requirements: [
      'Quiet untreated-free corner or absorption setup achieving noise floor <= -55 dBFS.',
      'Clear conversational delivery without artificial "radio announcer" over-acting.',
      'Dedicated USB/XLR microphone (dynamic or treated condenser) and wired monitoring headphones.',
    ],
    employerLinks: [
      {
        company: 'Babel Audio',
        payBand: '$25 – $45 / hr USD',
        note: 'Natural multilingual & English voice sessions',
        applyUrl: REFERRAL_URLS.babel,
      },
      {
        company: 'Spout',
        payBand: '$28 – $48 / hr USD',
        note: 'Conversational audio & speech QA tracks',
        applyUrl: REFERRAL_URLS.spout,
      },
      {
        company: 'Mercor',
        payBand: '$35 – $65 / hr USD',
        note: 'Specialist bilingual audio & prosody evaluation',
        applyUrl: REFERRAL_URLS.mercor,
      },
    ],
    video: {
      youtubeId: 'CZ7cLoZzVoY',
      title: 'Acoustic Treatment Secret For Great Sounding Voice Recordings',
      instructor: 'Lenny B',
      duration: '8 min',
      watchTip:
        'Notice how taming early desk and wall reflections with simple soft baffles improves AI voice audition acceptance far more than buying expensive software plugins.',
    },
    editorialGuide: {
      title: 'Passing Voice AI Audio Auditions on Take One (-60 dBFS Checklist)',
      readTime: '4 min read',
      keyTakeaways: [
        'Disable laptop noise-suppression toggles before recording—voice AI pipelines flag aggressive DSP artifacts.',
        'Record 5 seconds of silent room tone first to verify your noise floor sits safely below -55 dBFS.',
        'Speak at 140–155 WPM with relaxed conversational breath pauses instead of stiff news-anchor cadence.',
      ],
      sections: [
        {
          heading: '1. Why Audio Submissions Get Rejected',
          body: 'Voice dataset buyers run automated spectral checks before a human ever listens. Hidden AC hum, laptop fan whine, chair squeaks, and overly aggressive software noise gates chop off consonant endings ("s", "t", "k") and trigger instant automatic rejections.',
        },
        {
          heading: '2. Fast Home Booth Setup on Any Budget',
          body: 'Position a dynamic microphone 4–6 inches off-axis (around 30 degrees) to eliminate plosives without needing heavy compression. Hang thick blankets or heavy curtains behind and beside you—treating the wall directly behind your head absorbs slap-back echo instantly.',
        },
        {
          heading: '3. Natural Prosody & Bilingual Code-Switching',
          body: 'Modern voice assistants train for genuine everyday conversation. Practice scripts in the Rubric & Voice Prep teleprompter at 1.0x speed, keeping volume peaks around -9 dBFS and letting filler pauses sound organic rather than rushed.',
        },
      ],
    },
    resumeTemplate: {
      targetTitle: 'Voice AI Contributor & Speech Quality Evaluator',
      targetCompany: 'Babel Audio / Spout',
      summary:
        'Speech and audio QA contributor with a dedicated acoustic home studio setup (-60 dBFS noise floor). Experienced capturing natural conversational voice datasets, evaluating TTS prosody and phoneme accuracy, and delivering broadcast-clean WAV/FLAC audio on fast async turnarounds.',
      skills:
        'Studio Voice Recording, Acoustic Noise-Floor Control, TTS Prosody Evaluation, Phoneme & Bilingual QA, Conversational Narration, Audacity / Reaper, Gain Staging',
      experienceRole: 'Conversational Voice Contributor & Audio QA Reviewer',
      experienceBullets:
        '• Delivered 120+ hours of clean conversational speech recordings meeting strict -58 dBFS noise floor and zero-clipping WAV specs.\n• Audited synthetic voice clips for unnatural breath cadence, pronunciation drift, and spectral compression artifacts.\n• Maintained 99% first-pass technical acceptance across unscripted multi-speaker dialogue sessions.',
    },
    interviewScript: {
      track: 'Operations & Growth',
      questionId: 'og-1',
      questionPrompt:
        'Share an example of a manual process or quality setup you standardized to eliminate rework.',
      interviewerLens:
        'Voice platforms care about repeatable studio hygiene and zero rejected audio batches.',
      situation:
        'Early in my audio contribution work, changing ambient humidity and laptop fan spin occasionally pushed background noise above strict -55 dBFS platform thresholds.',
      task: 'I needed a fast, zero-guesswork pre-recording check so every submitted session passed automated spectral QA on the first upload.',
      action:
        'I built a repeatable 60-second pre-flight routine: moved to an off-axis dynamic mic chain behind acoustic curtains, verified room tone below -60 dBFS without software DSP, and logged sample script pacing around 145 WPM.',
      result:
        'Rejected takes dropped to zero across 40+ consecutive recording hours, qualifying me for higher-rate bilingual and expressive dialogue queues.',
    },
  },
  {
    id: 'prompt-llm',
    shortLabel: 'Prompt & LLM Specialist',
    title: 'Prompt Engineer & Structured LLM Workflow Designer',
    payBand: '$50 – $95 / hr USD',
    contractFormat: 'Remote Contract or Retainer · High-Signal Portfolio',
    timezoneSummary: 'Worldwide Async / Flexible Overlap',
    overviewSummary:
      'Architect deterministic system instructions, structured JSON output schemas, tool-calling contracts, and RAG grounding checks that turn brittle LLM prototypes into reliable production workflows.',
    duties: [
      'Design versioned system prompts with clear delimiters, strict enum schemas, and explicit refusal boundaries.',
      'Build 20–50 case golden regression suites catching hallucinated parameters or citation drift.',
      'Audit RAG retrieval chunks and prompt-cache boundaries to minimize inference latency and token spend.',
      'Document repeatable prompt contracts for engineering and product teams.',
    ],
    requirements: [
      'Hands-on fluency with structured JSON outputs, function/tool calling, and few-shot boundary examples.',
      'Experience diagnosing model sycophancy, instruction hierarchy conflicts, and context window rot.',
      'Clear technical writing with measurable before/after evaluation diffs.',
    ],
    employerLinks: [
      {
        company: 'Mercor',
        payBand: '$60 – $110 / hr USD',
        note: 'LLM prompt engineering & benchmark contracts',
        applyUrl: REFERRAL_URLS.mercor,
      },
      {
        company: 'micro1',
        payBand: '$50 – $85 / hr USD',
        note: 'Vetted AI workflow & agentic engineers',
        applyUrl: REFERRAL_URLS.micro1,
      },
      {
        company: 'Outlier',
        payBand: '$45 – $70 / hr USD',
        note: 'Prompt authoring & instruction-hierarchy tasks',
        applyUrl: 'https://outlier.ai',
      },
    ],
    video: {
      youtubeId: '8ib4Qnh2HFE',
      title: 'Full AI Prompting Course: Systematic Workflows & Reasoning Patterns',
      instructor: 'DeepLearning.AI (Andrew Ng)',
      duration: '45 min',
      watchTip:
        'Focus on how treating prompt engineering as an iterative test-driven engineering loop—with explicit delimiters and verifiable schemas—separates specialists from hobbyists.',
    },
    editorialGuide: {
      title: 'Structured Prompt Contracts: From Brittle Text to Deterministic JSON',
      readTime: '5 min read',
      keyTakeaways: [
        'Separate static system rules from untrusted user text using explicit XML tags (<input>...</input>) for prompt-cache speed and safety.',
        'Pin strict JSON schemas, nullable fallbacks, and an "insufficient_evidence" escape hatch to halt silent fabrication.',
        'Never ship a prompt tweak without running diffs across malformed inputs, long contexts, and multilingual edge cases.',
      ],
      sections: [
        {
          heading: '1. Prompting as Interface Engineering',
          body: 'Top-paid prompt specialists think in API contracts rather than clever adjectives. Every production prompt should clearly define role precedence, exact output types, allowed enum values, and explicit behavior when source context is incomplete.',
        },
        {
          heading: '2. Eliminating Hallucinations in RAG & Extraction Pipelines',
          body: 'Lower temperature (0.0–0.2) for extraction tasks, require inline span citations pointing back to retrieved document IDs, and add negative constraints telling the model to return null rather than guessing missing fields.',
        },
        {
          heading: '3. Proving Impact in Remote Interviews',
          body: 'Bring 2–3 concrete before/after evaluation examples showing how schema restructuring improved JSON validity from ~84% to 99.5% or cut token spend by splitting static instructions from dynamic context.',
        },
      ],
    },
    resumeTemplate: {
      targetTitle: 'Prompt Engineer & LLM Workflow Specialist',
      targetCompany: 'Mercor / AI Product Labs',
      summary:
        'Prompt & LLM workflow specialist focused on deterministic JSON tool calling, RAG citation grounding, and automated prompt regression suites. Experienced improving structured extraction reliability above 99% while lowering token latency and hallucination rates.',
      skills:
        'Prompt Engineering, JSON Schema Design, Tool/Function Calling, RAG Grounding, LLM Evaluation Suites, Python, TypeScript, Prompt Caching',
      experienceRole: 'LLM Prompt & Evaluation Specialist',
      experienceBullets:
        '• Replaced fragile prose prompts with typed JSON schemas and XML delimiters, raising downstream parser reliability from 86% to 99.4%.\n• Built 50-case golden regression benchmarks testing multi-turn instruction adherence, edge inputs, and fallback refusal accuracy.\n• Reordered static system instructions vs. dynamic user payloads to raise prompt cache hits and lower p95 latency by 31%.',
    },
    interviewScript: {
      track: 'Data & AI',
      questionId: 'da-2',
      questionPrompt:
        'Explain how you communicated a nuanced model limitation or metric caveat to non-technical leadership.',
      interviewerLens:
        'Tests whether you can translate hallucination rates and prompt edge cases into concrete product guardrails.',
      situation:
        'A summarization workflow showed 95% user satisfaction in demos, yet silently fabricated policy dates whenever source documents omitted renewal terms.',
      task: 'I needed to explain why aggregate demo scores masked a compliance risk and ship a deterministic prompt mitigation fast.',
      action:
        'I isolated 15 failing document traces into a 1-page side-by-side brief showing the exact financial risk, then shipped a strict JSON contract requiring an explicit "missing_term: true" field and span citations before any summary renders.',
      result:
        'Leadership approved the guardrail in one review cycle and ungrounded date hallucinations dropped to 0% across our evaluation suite.',
    },
  },
  {
    id: 'ai-software',
    shortLabel: 'AI Software & Code Reviewer',
    title: 'AI Software Engineer & Automated Code Evaluation Specialist',
    payBand: '$60 – $120 / hr USD',
    contractFormat: 'Remote Contract / Full-Time · Technical Vetting',
    timezoneSummary: 'Worldwide Async or Americas/EMEA Overlap',
    overviewSummary:
      'Design full-stack AI applications, reproduce real GitHub repository bugs inside Dockerized sandboxes, author deterministic fail-to-pass unit tests, and pass AI technical screening rounds covering system trade-offs.',
    duties: [
      'Debug production TypeScript, Python, React, or backend issues and write minimal, clean patches.',
      'Author deterministic unit/integration tests verifying bug reproduction (fail) and fix resolution (pass).',
      'Explain API design, caching, concurrency, and latency trade-offs clearly during 5–20 min AI screening calls.',
      'Build reliable full-stack integrations with typed LLM APIs, streaming states, and error boundaries.',
    ],
    requirements: [
      'Production experience in TypeScript, React, Node.js, Python, or Go with strong Git & testing hygiene.',
      'Ability to diagnose async race conditions, N+1 queries, and edge-case failure modes concisely.',
      'Clear spoken and written English for async RFCs and automated technical interviews.',
    ],
    employerLinks: [
      {
        company: 'micro1',
        payBand: '$50 – $95 / hr USD',
        note: '5-min AI screen -> direct global engineering roles',
        applyUrl: REFERRAL_URLS.micro1,
      },
      {
        company: 'Mercor',
        payBand: '$70 – $120 / hr USD',
        note: 'Senior SWE-bench & code review contracts',
        applyUrl: REFERRAL_URLS.mercor,
      },
      {
        company: 'Outlier',
        payBand: '$50 – $80 / hr USD',
        note: 'Python, JS/TS & Systems coding specialist tracks',
        applyUrl: 'https://outlier.ai',
      },
    ],
    video: {
      youtubeId: 'jPKTo1iGQiE',
      title: 'Design YouTube: High-Throughput System & Distributed Architecture Mock',
      instructor: 'NeetCode',
      duration: '22 min',
      watchTip:
        'Listen to how strong candidates separate control-plane metadata from heavy binary/compute paths early and state trade-offs out loud before diving into details.',
    },
    editorialGuide: {
      title: 'Passing micro1 & SWE-Bench Code Screens: Architecture + Fail-to-Pass Craft',
      readTime: '6 min read',
      keyTakeaways: [
        'Keep technical explanations structured: Constraint -> Concrete Design Choice -> Bottleneck / Failure Mitigation.',
        'For SWE evaluation tasks, write minimal targeted diffs paired with deterministic tests that fail pre-patch and pass post-patch.',
        'Avoid bloated refactors—evaluation harnesses penalize unrequested edits to unrelated modules.',
      ],
      sections: [
        {
          heading: '1. Acing Async AI Technical Interviews (micro1 / Mercor)',
          body: 'AI screening interviewers transcribe your response verbatim and score technical specificity. When asked about React state, API latency, or system scaling, anchor immediately with real numbers (e.g., cutting p95 latency from 420ms to 140ms via connection pooling and Redis read-through caching) rather than textbook definitions.',
        },
        {
          heading: '2. Mastering SWE-Bench & Code Evaluation Rubrics',
          body: 'Top-tier coding evaluation roles pay $60–$120/hr for isolating authentic multi-file repository bugs. Reproduce the issue deterministically inside a clean environment first, confirm the failing assertion, then apply the smallest possible patch that respects existing types and conventions.',
        },
        {
          heading: '3. Showing Async Ownership on Your Resume',
          body: 'Every experience bullet should pair a concrete engineering action with a measurable outcome (test coverage added, latency reduced, bundle size cut, or incident MTTR lowered).',
        },
      ],
    },
    resumeTemplate: {
      targetTitle: 'AI Software & Evaluation Engineer',
      targetCompany: 'micro1 / Mercor',
      summary:
        'Full-stack software engineer specializing in TypeScript, React, Python, and automated evaluation harnesses. Experienced reproducing complex multi-file bugs, shipping clean API architectures, and cutting production latency across distributed async teams.',
      skills:
        'TypeScript, React, Node.js, Python, PostgreSQL, Docker, Automated Testing (Vitest/Pytest), System Design, REST/GraphQL, LLM Evals',
      experienceRole: 'Senior Full-Stack & AI Systems Engineer',
      experienceBullets:
        '• Diagnosed API serialization bottlenecks and database query plans, cutting p95 response latency by 38% across core endpoints.\n• Built Dockerized fail-to-pass verification suites validating multi-file TypeScript and Python patches before human review.\n• Delivered end-to-end typed UI and backend features asynchronously with zero-downtime migrations and comprehensive integration tests.',
    },
    interviewScript: {
      track: 'Frontend & Full-Stack',
      questionId: 'fe-1',
      questionPrompt:
        'Tell me about a time you significantly improved perceived load performance or core web vitals in a production app.',
      interviewerLens:
        'Automated & live reviewers look for exact profiling tools, trade-offs, and before/after p95 numbers.',
      situation:
        'Our interactive analytics workspace suffered a 2.8-second initial load delay and noticeable input lag whenever users filtered large datasets.',
      task: 'I owned profiling the bottleneck and bringing p95 time-to-interactive under 1 second without breaking offline persistence.',
      action:
        'I ran performance flamegraphs, split heavy secondary visualizations via dynamic imports, memoized expensive derived table rows, and moved localStorage writes off the synchronous render hot path.',
      result:
        'Initial JS payload shrank by 44%, p95 time-to-interactive dropped from 2.8s to 780ms, and filter interaction frame drops fell to zero.',
    },
  },
];

export function getRoleBundleById(id?: RoleBundleId): RoleBundle {
  return ROLE_BUNDLES.find((b) => b.id === id) ?? ROLE_BUNDLES[0];
}

export function inferRoleBundleFromJob(job: JobListing): RoleBundleId {
  const haystack = `${job.category} ${job.title} ${job.stack.join(' ')}`.toLowerCase();

  if (
    job.category === 'Audio & Voice AI' ||
    /\b(voice|audio|speech|tts|acoustic|bilingual audio)\b/.test(haystack)
  ) {
    return 'voice-ai';
  }

  if (
    job.category === 'Engineering' ||
    job.category === 'Developer Relations' ||
    job.category === 'Design & UI' ||
    /\b(engineer|developer|swe|full-stack|frontend|backend|typescript|react|code)\b/.test(
      haystack
    )
  ) {
    return 'ai-software';
  }

  if (
    job.category === 'Prompt Engineering' ||
    /\b(prompt|llm workflow|rag|agentic|json schema)\b/.test(haystack)
  ) {
    return 'prompt-llm';
  }

  return 'rlhf';
}
