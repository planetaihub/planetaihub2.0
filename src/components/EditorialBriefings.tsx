import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Check,
  ExternalLink,
  FileText,
  PlayCircle,
  Share2,
  X,
} from 'lucide-react';
import type { CareerToolId } from '../utils/careerPrepTemplates';
import evalsImg from '../assets/images/briefing_ai_evals_1795174425875.jpg';
import voiceImg from '../assets/images/briefing_voice_audio_1795174426421.jpg';
import remoteCompImg from '../assets/images/briefing_remote_comp_1795174427210.jpg';
import promptSchemaImg from '../assets/images/briefing_prompt_schema_1795175962565.jpg';
import safetyRedteamImg from '../assets/images/briefing_safety_redteam_1795175963063.jpg';
import asyncDeskImg from '../assets/images/briefing_async_desk_1795175962797.jpg';
import codeBenchmarkImg from '../assets/images/briefing_code_benchmark_1795175962674.jpg';
import bilingualStudioImg from '../assets/images/briefing_bilingual_studio_1795175963504.jpg';
import portfolioLaptopImg from '../assets/images/briefing_portfolio_laptop_1795175962173.jpg';
import globalInvoicingImg from '../assets/images/briefing_global_invoicing_1795175961909.jpg';
import ergonomicSetupImg from '../assets/images/briefing_ergonomic_setup_1795175962877.jpg';
import ragPipelineImg from '../assets/images/briefing_rag_pipeline_1795175961990.jpg';
import videoInterviewImg from '../assets/images/briefing_video_interview_1795175962638.jpg';
import dataResearchImg from '../assets/images/briefing_data_research_1795175962371.jpg';
import devrelStageImg from '../assets/images/briefing_devrel_stage_1795175962679.jpg';
import localWorkstationImg from '../assets/images/briefing_local_workstation_1795175961994.jpg';
import timezoneDeskImg from '../assets/images/briefing_timezone_desk_1795175962161.jpg';
import rateCalculatorImg from '../assets/images/briefing_rate_calculator_1795175963159.jpg';

export interface EditorialBriefing {
  id: string;
  category: string;
  badge?: 'FEATURED' | 'TRENDING';
  readTime: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
  author: string;
  keyTakeaways: string[];
  sections: Array<{ heading: string; body: string }>;
}

interface LiveFeedStory {
  id: string;
  title: string;
  source: string;
  url: string;
  points?: number;
}

const BRIEFINGS: EditorialBriefing[] = [
  {
    id: 'briefing-rlhf-evals',
    category: 'AI Evaluation',
    badge: 'FEATURED',
    readTime: '5 min read',
    publishedAt: 'Nov 2026',
    title: 'Inside $50/hr+ RLHF Rubrics: How Frontier Labs Grade Reasoning Chains',
    excerpt:
      'Why frontier model teams moved beyond simple A/B preference clicks toward structured diagnostic rubrics—and how specialist reviewers qualify.',
    imageUrl: evalsImg,
    imageAlt:
      'Minimalist AI researcher desk illuminated at dusk during rubric review',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Labs now prioritize multi-step failure localization over surface prose polish.',
      'Code execution verification and unit-test synthesis command the highest hourly tiers.',
      'Consistent inter-annotator calibration unlocks long-term retainer projects.',
    ],
    sections: [
      {
        heading: 'From Preference Rankings to Diagnostic Rubrics',
        body: 'Early reinforcement learning pipelines relied on rapid pairwise comparisons. Modern frontier teams at labs and evaluation platforms now ask domain contributors to author unit-tested edge cases, isolate logical hallucinations at the exact step of divergence, and justify scores against explicit policy checklists.',
      },
      {
        heading: 'What Separates Top-Quartile Reviewers',
        body: 'Reviewers earning $45 to $85 per hour treat each prompt as a reproducible specification. Instead of writing generic critiques, they supply minimal counterexamples, verified code diffs, and concise rubric explanations that automated grading harnesses can validate reliably.',
      },
    ],
  },
  {
    id: 'briefing-voice-ai',
    category: 'Audio & Voice AI',
    badge: 'FEATURED',
    readTime: '5 min read',
    publishedAt: 'Nov 2026',
    title: 'Acoustic Standards for Remote Voice AI & Multilingual Speech Roles',
    excerpt:
      'Practical room treatment, noise-floor benchmarks (-60 dBFS), and microphone chain tips to pass Babel Audio and ElevenLabs auditions on the first take.',
    imageUrl: voiceImg,
    imageAlt:
      'Studio condenser microphone and acoustic baffle under focused studio key lighting',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Target an unweighted noise floor below -55 to -60 dBFS before applying DSP.',
      'Dynamic broadcast mics paired with close acoustic baffles outperform untreated condenser setups.',
      'Natural conversational cadence beats overly theatrical announcer delivery in modern TTS datasets.',
    ],
    sections: [
      {
        heading: 'Why Room Acoustics Matter More Than Expensive Mics',
        body: 'Voice synthesis models amplify subtle room reflections and HVAC hum during training. Recording inside a treated corner or behind a portable absorption shield removes comb filtering far more effectively than software noise gates, which often clip consonant tails.',
      },
      {
        heading: 'Passing Bilingual & Conversational Audits',
        body: 'Use the Voice Sample Prep teleprompter inside Career Studio to practice steady pacing around 145–160 words per minute while keeping input peaks safely between -12 dBFS and -6 dBFS.',
      },
    ],
  },
  {
    id: 'briefing-global-comp',
    category: 'Remote Finance',
    badge: 'TRENDING',
    readTime: '6 min read',
    publishedAt: 'Nov 2026',
    title: 'Global Contractor Pay Math: Optimizing USD ($) to PHP (₱) Transfers',
    excerpt:
      'Breaking down Wise, Payoneer, and direct wire spreads so remote AI engineers and annotators keep more of every invoiced dollar.',
    imageUrl: remoteCompImg,
    imageAlt:
      'Architectural coworking conservatory overlooking a twilight skyline',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'A 2.5% hidden FX spread on $4,000/month costs $1,200 (₱70,200+) annually in avoidable fees.',
      'Standardized PDF/Word invoices with clear net-15 terms speed up international payouts.',
      'Always benchmark hourly offers against effective take-home pay after platform deductions.',
    ],
    sections: [
      {
        heading: 'Calculating Real Net Hourly & Monthly Rates',
        body: 'Headline contract rates rarely reflect net take-home pay once marketplace fees, payment rails, and FX spreads are factored in. At 1 USD = ₱58.50, losing 4.4% to legacy payment gateways shaves roughly ₱10,300 off a $4,000 monthly invoice.',
      },
      {
        heading: 'Structuring International Retainer Invoices',
        body: 'Keep your billing cadence predictable—biweekly or net-15—with explicit USD line items, contractor tax classification notes, and preferred Wise or SWIFT routing instructions generated in Finance & Docs.',
      },
    ],
  },
  {
    id: 'briefing-prompt-schema',
    category: 'Prompt Engineering',
    badge: 'TRENDING',
    readTime: '4 min read',
    publishedAt: 'Nov 2026',
    title: 'Structured Prompt Contracts: Designing Deterministic JSON Tool Calls',
    excerpt:
      'How production AI teams replace brittle prose prompts with versioned schemas, constrained decoding, and automated regression suites.',
    imageUrl: promptSchemaImg,
    imageAlt:
      'Software engineer workspace at night with an ultra-wide monitor displaying structured code architecture',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Pin explicit enum values and nullable fields to eliminate silent downstream parser crashes.',
      'Separate static system instructions from dynamic user context for higher prompt-cache hit rates.',
      'Track 20–50 golden test cases whenever editing production prompt templates.',
    ],
    sections: [
      {
        heading: 'Prompting as Interface Design',
        body: 'Senior prompt engineers think in contracts rather than clever wording. Every tool-calling prompt should define strict types, fallback behaviors for ambiguous user inputs, and clear refusal boundaries.',
      },
      {
        heading: 'Building Regression Harnesses That Scale',
        body: 'Before shipping a prompt update, evaluate diffs across edge cases covering malformed inputs, multilingual queries, and multi-turn state transitions to guarantee latency and accuracy stay intact.',
      },
    ],
  },
  {
    id: 'briefing-ai-safety',
    category: 'AI Safety',
    badge: 'FEATURED',
    readTime: '6 min read',
    publishedAt: 'Nov 2026',
    title: 'Red-Teaming Frontier Models: How Safety Evaluators Catch Policy Failures',
    excerpt:
      'Inside adversarial testing sprints, multi-turn jailbreak taxonomies, and why calm analytical reporting pays $55–$90/hr remote contracts.',
    imageUrl: safetyRedteamImg,
    imageAlt:
      'Cybersecurity and AI safety research terminal inside a dark glass studio',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Multi-turn context drift reveals vulnerabilities missed by single-turn prompt probes.',
      'Reproducible transcripts with exact seed/temperature metadata are mandatory for severity triage.',
      'Cross-domain expertise in biosecurity, cyber, or finance commands premium safety retainers.',
    ],
    sections: [
      {
        heading: 'Beyond One-Line Adversarial Prompts',
        body: 'Modern safety evaluations probe how models behave over 10-turn reasoning chains, tool invocations, and role-switched scenarios. Labs reward researchers who uncover systematic failure modes rather than isolated phrasing quirks.',
      },
      {
        heading: 'Writing High-Signal Incident Briefs',
        body: 'Every vulnerability submission should pair the exact conversation trace with a concise severity rationale and recommended guardrail adjustment.',
      },
    ],
  },
  {
    id: 'briefing-async-ops',
    category: 'Remote Culture',
    readTime: '5 min read',
    publishedAt: 'Nov 2026',
    title: 'Async-First Engineering: Writing Habits That Win $140k+ Distributed Offers',
    excerpt:
      'Why distributed AI startups screen candidates for written RFC clarity long before live coding rounds—and how to showcase it.',
    imageUrl: asyncDeskImg,
    imageAlt:
      'Serene minimalist home office desk overlooking a rainy twilight cityscape',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Lead every Slack thread or PR summary with the decision needed and explicit trade-offs.',
      'Replace 30-minute status calls with 3-minute screen-recorded architecture walkthroughs.',
      'Document assumptions upfront so teammates in other timezones stay unblocked overnight.',
    ],
    sections: [
      {
        heading: 'Communication Bandwidth Is Your Remote Multiplier',
        body: 'When a team spans Manila, London, and San Francisco, vague status messages stall entire sprints for 24 hours. High-leverage remote engineers write self-contained proposals that answer likely follow-up questions in advance.',
      },
      {
        heading: 'Demonstrating Async Mastery During Interviews',
        body: 'Submit clean READMEs, concise cover letters, and structured STAR examples that prove you thrive without shoulder-tapping.',
      },
    ],
  },
  {
    id: 'briefing-code-benchmarks',
    category: 'Engineering',
    readTime: '7 min read',
    publishedAt: 'Nov 2026',
    title: 'SWE-Bench & Unit-Test Synthesis: High-Tier Coding Specialist Roles',
    excerpt:
      'A closer look at $60–$100/hr remote coding contributor tracks focused on Dockerized bug reproduction and multi-file patches.',
    imageUrl: codeBenchmarkImg,
    imageAlt:
      'Mechanical keyboard and dual-monitor coding workstation under cool cyan rim lighting',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Reproducing real repository issues with deterministic fail-to-pass tests is the core skill.',
      'TypeScript, Python, Rust, and Go contributors see the deepest steady project queues.',
      'Clean commit hygiene and minimal diffs score higher than over-engineered rewrites.',
    ],
    sections: [
      {
        heading: 'Why Fail-to-Pass Verification Matters',
        body: 'Frontier coding models improve fastest when trained on real GitHub issue resolutions verified inside isolated containers. Contributors write test cases that fail on the buggy commit and pass cleanly once patched.',
      },
      {
        heading: 'Qualifying for Senior Coding Queues',
        body: 'Expect a practical debugging assessment testing dependency resolution, edge-case coverage, and concise code review commentary.',
      },
    ],
  },
  {
    id: 'briefing-bilingual-ai',
    category: 'AI Training',
    readTime: '5 min read',
    publishedAt: 'Nov 2026',
    title: 'Tagalog, Spanish & Japanese AI Training: Qualifying for Bilingual Tracks',
    excerpt:
      'Why regional nuance, code-switching fluency, and cultural idiom checks open steady $25–$48/hr remote opportunities across APAC and LATAM.',
    imageUrl: bilingualStudioImg,
    imageAlt:
      'Multilingual AI researcher with headphones and reference books in a navy-lit study',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Natural code-switching (such as Taglish or Spanglish) is increasingly tested in consumer voice AI.',
      'Direct literal translations fail rubric checks—preserve intent, register, and regional idioms.',
      'Clean grammatical explanations help you advance from rater to quality auditor tiers.',
    ],
    sections: [
      {
        heading: 'Closing the Multilingual Quality Gap',
        body: 'Labs are investing heavily in non-English reasoning, customer support, and speech parity. Reviewers who understand both colloquial phrasing and formal technical terminology are in short supply.',
      },
      {
        heading: 'Preparing for Bilingual Qualification Tests',
        body: 'Practice rewriting stiff machine-translated outputs into natural native phrasing while preserving factual precision.',
      },
    ],
  },
  {
    id: 'briefing-portfolio-proof',
    category: 'Career Strategy',
    readTime: '4 min read',
    publishedAt: 'Nov 2026',
    title: 'Zero-Fluff AI Portfolios That Pass 30-Second Technical Screens',
    excerpt:
      'What hiring managers actually inspect in remote candidate GitHubs, live demos, and single-page evaluation case studies.',
    imageUrl: portfolioLaptopImg,
    imageAlt:
      'Minimalist matte-black laptop on a dark slate architectural table in a design loft',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Ship 2–3 live, clickable artifacts rather than 15 half-finished tutorial clones.',
      'Include a benchmark table or latency/cost breakdown right at the top of your README.',
      'Remove login gates so recruiters can verify your craft in under 30 seconds.',
    ],
    sections: [
      {
        heading: 'Show Decisions, Not Just Libraries',
        body: 'Anyone can scaffold a chat wrapper. Stand out by explaining why you chose a specific chunking strategy, evaluation metric, or caching layer—and share real failure cases you fixed.',
      },
      {
        heading: 'Pairing Your Portfolio With Clean Outreach',
        body: 'Link directly to a 90-second demo and concise resume built in Career Studio when messaging founding engineers.',
      },
    ],
  },
  {
    id: 'briefing-usd-invoicing',
    category: 'Finance & Tax',
    readTime: '5 min read',
    publishedAt: 'Nov 2026',
    title: 'Net-15 Retainer Contracts & International USD Invoicing Playbook',
    excerpt:
      'Essential invoice clauses, payment milestone structures, and bookkeeping tips for remote AI consultants billing US and EU clients.',
    imageUrl: globalInvoicingImg,
    imageAlt:
      'Sleek tablet, titanium pen, and leather folio overlooking twilight city lights',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Always display sequential invoice numbers, service dates, and explicit currency (`USD $`).',
      'Split large fixed-scope projects into 50% kickoff and 50% delivery milestones.',
      'Archive monthly expense receipts and FX conversion statements in one consistent folder.',
    ],
    sections: [
      {
        heading: 'Eliminating Payment Delays Before They Happen',
        body: 'Most delayed contractor payouts stem from missing PO numbers, unclear billing periods, or mismatched bank details. Standardizing your invoice template removes back-and-forth with client finance teams.',
      },
      {
        heading: 'Exporting Ready-to-Send Documents',
        body: 'Generate crisp PDF, Word (.doc), or Excel (.csv) invoices directly inside Finance & Docs with instant USD calculations.',
      },
    ],
  },
  {
    id: 'briefing-ergonomic-setup',
    category: 'Workspace',
    readTime: '4 min read',
    publishedAt: 'Nov 2026',
    title: 'Ergonomic Deep-Work Setups Under $800 for Full-Time Remote Specialists',
    excerpt:
      'High-impact desk upgrades—monitor arms, acoustic panels, and task lighting—that protect posture across long evaluation sprints.',
    imageUrl: ergonomicSetupImg,
    imageAlt:
      'Ergonomic remote engineering workstation with acoustic wood slats and cool cyan bias lighting',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Raise your primary monitor top edge to eye level with a $45 gas-spring arm.',
      'Bias lighting behind your display cuts late-night eye strain during dark-mode coding.',
      'Spend budget on a supportive mesh chair and quiet keyboard before cosmetic accessories.',
    ],
    sections: [
      {
        heading: 'Designing for 8-Hour Focus Comfort',
        body: 'Remote specialists spend thousands of hours at their desks each year. Fixing monitor height, wrist angle, and glare delivers immediate daily energy dividends.',
      },
      {
        heading: 'Dual-Purpose Audio & Video Readiness',
        body: 'Position your desk facing soft natural light or a diffused key light so recruiter video calls look crisp without extra setup time.',
      },
    ],
  },
  {
    id: 'briefing-rag-pipelines',
    category: 'AI Engineering',
    readTime: '6 min read',
    publishedAt: 'Nov 2026',
    title: 'Auditing RAG Pipelines: Citation Grounding and Hallucination Metrics',
    excerpt:
      'How AI evaluation engineers measure retrieval recall, faithfulness, and context precision across enterprise knowledge bases.',
    imageUrl: ragPipelineImg,
    imageAlt:
      'Dark glass server racks and fiber optic patch cables illuminated by cool cyan light',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Separate retrieval failures from generator synthesis errors before tuning prompts.',
      'Hybrid BM25 + dense vector search consistently beats pure vector lookup on exact identifiers.',
      'Require inline chunk citations so reviewers can verify every numeric claim rapidly.',
    ],
    sections: [
      {
        heading: 'Pinpointing Where Retrieval Breaks',
        body: 'When a RAG assistant invents an answer, 60% of the time the right document chunk never reached the context window. Auditing top-k recall first saves weeks of pointless prompt tweaking.',
      },
      {
        heading: 'Scoring Faithfulness Consistently',
        body: 'Track claim-level support against retrieved snippets so product teams can ship updates with measurable confidence.',
      },
    ],
  },
  {
    id: 'briefing-interview-star',
    category: 'Interview Prep',
    readTime: '5 min read',
    publishedAt: 'Nov 2026',
    title: 'Mastering Async Video Screens & STAR Behavioral Interviews',
    excerpt:
      'Structuring 90-second Situation-Task-Action-Result answers that highlight ownership, metrics, and calm problem-solving.',
    imageUrl: videoInterviewImg,
    imageAlt:
      'Remote creator camera and microphone desk setup with softbox lighting',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Keep Situation + Task under 20 seconds so 75% of your answer covers Action and Result.',
      'Anchor every story with one concrete metric: latency reduced, hours saved, or accuracy lifted.',
      'Look directly into the camera lens when delivering your opening and closing takeaways.',
    ],
    sections: [
      {
        heading: 'Why Remote Teams Lean on Structured Behavioral Prompts',
        body: 'Without hallway observation, distributed teams rely on behavioral signals to gauge how you handle ambiguity, missed deadlines, and cross-functional disagreement.',
      },
      {
        heading: 'Rehearsing Without Sounding Scripted',
        body: 'Draft bullet anchors using the AI Interview Prep tool in Career Studio, then rehearse out loud with a two-minute timer.',
      },
    ],
  },
  {
    id: 'briefing-synthetic-data',
    category: 'AI Research',
    readTime: '6 min read',
    publishedAt: 'Nov 2026',
    title: 'Synthetic Data Curation: Why Human Judgment Still Anchors Model Quality',
    excerpt:
      'Where automated distillation hits model collapse—and why human-curated edge cases remain essential for reasoning reliability.',
    imageUrl: dataResearchImg,
    imageAlt:
      'AI research library and glass whiteboard covered in mathematical curves at night',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Synthetic generators amplify subtle biases unless anchored by human-audited gold sets.',
      'Hard negative mining relies on domain experts spotting plausible-sounding but false derivations.',
      'Curated diversity across edge cases beats raw dataset volume in post-training.',
    ],
    sections: [
      {
        heading: 'The Complementarity of Human & Synthetic Pipelines',
        body: 'While synthetic pipelines scale candidate generation effortlessly, frontier labs depend on specialist reviewers to define quality ceilings, verify rare edge cases, and prevent distributional drift.',
      },
      {
        heading: 'Opportunities for Subject-Matter Specialists',
        body: 'Specialists in law, finance, medicine, and systems engineering continue to see strong contract demand for gold-set curation.',
      },
    ],
  },
  {
    id: 'briefing-ai-devrel',
    category: 'Developer Relations',
    readTime: '5 min read',
    publishedAt: 'Nov 2026',
    title: 'Breaking Into Remote Developer Relations With Interactive Demos',
    excerpt:
      'How engineers transition into $120k–$175k remote DevRel roles by shipping reproducible starter kits and clear technical guides.',
    imageUrl: devrelStageImg,
    imageAlt:
      'Developer workshop desk with laptop and external display in a dark industrial loft',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Write tutorials that solve a real integration bottleneck rather than repeating quickstarts.',
      'Every code sample should run cleanly in under 5 minutes with zero hidden environment quirks.',
      'Track community questions to feed actionable SDK ergonomics back to product engineering.',
    ],
    sections: [
      {
        heading: 'DevRel Is Product Engineering in Public',
        body: 'The strongest developer advocates act as the first external customer for every new API release—identifying rough edges before developers ever hit them.',
      },
      {
        heading: 'Building Your Proof-of-Work Trail',
        body: 'Publish two deep technical walkthroughs paired with clean GitHub templates to stand out immediately.',
      },
    ],
  },
  {
    id: 'briefing-local-llms',
    category: 'Dev Tools',
    readTime: '5 min read',
    publishedAt: 'Nov 2026',
    title: 'Running Open-Weight Models Locally for Offline & Privacy-First Workflows',
    excerpt:
      'Hardware sizing, quantization trade-offs (Q4_K_M vs Q8_0), and practical local tooling for confidential code review.',
    imageUrl: localWorkstationImg,
    imageAlt:
      'Matte-black workstation GPU desktop tower beside a minimalist studio display',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      '24GB VRAM or unified memory comfortably runs fast quantized 14B–32B coding models locally.',
      'Q4_K_M quantization retains strong reasoning fidelity while cutting memory footprint in half.',
      'Local inference pairs naturally with air-gapped client repositories and offline travel sprints.',
    ],
    sections: [
      {
        heading: 'When Local Inference Beats Cloud APIs',
        body: 'Under strict client NDAs or spotty travel Wi-Fi, local open-weight models give engineers uninterrupted autocomplete, refactoring, and log analysis with zero data leaving the machine.',
      },
      {
        heading: 'Balancing Speed and Context Length',
        body: 'Keep active context windows focused around relevant files to preserve crisp tokens-per-second throughput on desktop hardware.',
      },
    ],
  },
  {
    id: 'briefing-timezones',
    category: 'Productivity',
    readTime: '4 min read',
    publishedAt: 'Nov 2026',
    title: 'Managing APAC-to-US Overlap Without Burnout: Sustainable Shift Schedules',
    excerpt:
      'Designing split-block calendars, light exposure routines, and crisp handoff notes for Manila, Tokyo, and US Pacific teams.',
    imageUrl: timezoneDeskImg,
    imageAlt:
      'Calm night-shift remote engineer desk with world-time clock overlooking a blue-hour skyline',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Limit synchronous US overlap to a fixed 2–3 hour morning or late-evening window.',
      'Protect an unbroken 7.5-hour sleep anchor rather than fragmenting rest across shifts.',
      'Use World Clock & Pomodoro intervals in Productivity to separate work blocks cleanly.',
    ],
    sections: [
      {
        heading: 'The Split-Anchor Schedule That Actually Lasts',
        body: 'Instead of staying awake until 4 a.m. five nights a week, top APAC remote engineers negotiate a morning US-Pacific overlap (7–10 a.m. PHT) paired with afternoon async deep work.',
      },
      {
        heading: 'Protecting Cognitive Recovery',
        body: 'Clear end-of-day handoff notes let you close your laptop on schedule without lingering Slack anxiety.',
      },
    ],
  },
  {
    id: 'briefing-freelance-rates',
    category: 'Compensation',
    readTime: '5 min read',
    publishedAt: 'Nov 2026',
    title: 'Reverse-Engineering Your Minimum Hourly Rate ($/hr) From Net Goals',
    excerpt:
      'How to factor non-billable admin hours, paid time off, equipment depreciation, and Wise fees into sustainable consulting rates.',
    imageUrl: rateCalculatorImg,
    imageAlt:
      'Matte-black mechanical numpad, aluminum ruler, and financial notebook on dark slate',
    author: 'PlanetAI Desk',
    keyTakeaways: [
      'Assume 25–30 billable hours per 40-hour workweek to account for outreach and admin.',
      'Add a 15–20% buffer above salaried equivalents to cover healthcare, hardware, and PTO.',
      'Test your exact floor in seconds with Finance & Docs Reverse Rate Calculator.',
    ],
    sections: [
      {
        heading: 'Why Salaried Hourly Math Underprices Contracts',
        body: 'Dividing a target $60,000 salary by 2,080 hours ignores unpaid holidays, platform fees, and tax obligations. A realistic billable denominator is closer to 1,400–1,500 hours per year.',
      },
      {
        heading: 'Communicating Rates With Confidence',
        body: 'Anchor rate conversations around clear deliverables, turnaround SLAs, and measurable ROI so clients evaluate value rather than just hourly cost.',
      },
    ],
  },
];

const FALLBACK_LIVE_WIRE: LiveFeedStory[] = [
  {
    id: 'hn-fallback-1',
    title: 'Evaluating LLM Agents in Production Without Flaky Benchmarks',
    source: 'Hacker News · AI Engineering',
    url: 'https://news.ycombinator.com/',
  },
  {
    id: 'hn-fallback-2',
    title: 'Open-Weight Reasoning Models and Local Inference Efficiency',
    source: 'Dev.to · AI Community',
    url: 'https://dev.to/t/ai',
  },
  {
    id: 'hn-fallback-3',
    title: 'Designing Low-Latency Voice Agents for Real-Time Conversations',
    source: 'Hacker News · Speech Tech',
    url: 'https://news.ycombinator.com/',
  },
];

const INITIAL_BRIEFINGS_COUNT = 6;
const BRIEFINGS_STEP = 6;

interface EditorialBriefingsProps {
  externalBriefingTrigger?: { id: string; nonce: number } | null;
  onOpenVideoAcademy?: (sessionId?: string) => void;
  onOpenCareerStudio?: (tool?: CareerToolId) => void;
}

const BRIEFING_TO_VIDEO_MAP: Record<
  string,
  { sessionId: string; label: string }
> = {
  'briefing-rlhf-evals': {
    sessionId: 'rlhf-ibm-explained',
    label: 'RLHF & Diagnostic Rubrics Video',
  },
  'briefing-interview-star': {
    sessionId: 'star-framework-exponent',
    label: 'The STAR Framework Video',
  },
  'briefing-prompt-schema': {
    sessionId: 'google-ai-studio-workflow',
    label: 'Google AI Studio & Prompting Video',
  },
  'briefing-code-benchmarks': {
    sessionId: 'system-design-whatsapp',
    label: 'System Design Mock Interview Video',
  },
  'briefing-synthetic-data': {
    sessionId: 'rlhf-nathan-lambert',
    label: 'Frontier RLHF & DPO Deep Dive',
  },
};

export const EditorialBriefings: React.FC<EditorialBriefingsProps> = ({
  externalBriefingTrigger,
  onOpenVideoAcademy,
  onOpenCareerStudio,
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BRIEFINGS_COUNT);
  const [selectedBriefing, setSelectedBriefing] =
    useState<EditorialBriefing | null>(() => {
      if (typeof window === 'undefined') return null;
      const slug = new URLSearchParams(window.location.search).get('briefing');
      return slug ? BRIEFINGS.find((b) => b.id === slug) || null : null;
    });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [liveStories, setLiveStories] =
    useState<LiveFeedStory[]>(FALLBACK_LIVE_WIRE);
  const [isLiveFeedLoaded, setIsLiveFeedLoaded] = useState(false);

  useEffect(() => {
    if (!externalBriefingTrigger?.id) return;
    const found = BRIEFINGS.find((b) => b.id === externalBriefingTrigger.id);
    if (found) {
      setSelectedBriefing(found);
    }
  }, [externalBriefingTrigger]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadLiveAiFeed() {
      try {
        const res = await fetch(
          'https://hn.algolia.com/api/v1/search?tags=story&query=AI&hitsPerPage=5',
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          hits?: Array<{
            objectID: string;
            title?: string;
            url?: string;
            points?: number;
          }>;
        };

        const validHits = (data.hits || [])
          .filter((hit) => hit.title && hit.url)
          .slice(0, 3)
          .map((hit) => ({
            id: hit.objectID,
            title: hit.title as string,
            source: 'Hacker News Live JSON',
            url: hit.url as string,
            points: hit.points,
          }));

        if (!cancelled && validHits.length > 0) {
          setLiveStories(validHits);
          setIsLiveFeedLoaded(true);
        }
      } catch {
        // Offline or network restricted: keep graceful curated fallback
      }
    }

    loadLiveAiFeed();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!selectedBriefing) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedBriefing(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedBriefing]);

  const handleCopyShareLink = async (
    article: EditorialBriefing,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/?briefing=${article.id}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const area = document.createElement('textarea');
        area.value = shareUrl;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        document.body.removeChild(area);
      }
      setCopiedId(article.id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === article.id ? null : prev));
      }, 2000);
    } catch {
      setCopiedId(article.id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === article.id ? null : prev));
      }, 2000);
    }
  };

  const visibleBriefings = BRIEFINGS.slice(0, visibleCount);
  const remainingCount = Math.max(0, BRIEFINGS.length - visibleCount);
  const allShown = remainingCount === 0;

  const handlePaginationClick = () => {
    if (allShown) {
      setVisibleCount(INITIAL_BRIEFINGS_COUNT);
    } else {
      setVisibleCount((prev) =>
        Math.min(BRIEFINGS.length, prev + BRIEFINGS_STEP)
      );
    }
  };

  return (
    <section
      aria-labelledby="briefings-heading"
      className="space-y-8"
    >
      {/* Editorial Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-[#1D4ED8]">
            PlanetAI Editorial · {BRIEFINGS.length} Guides
          </p>
          <h2
            id="briefings-heading"
            className="mt-1.5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance"
          >
            Latest AI &amp; Remote Work Briefings
          </h2>
        </div>
        <div className="flex flex-col items-start gap-2.5 sm:items-end">
          <p className="max-w-md text-sm leading-relaxed text-slate-600 sm:text-right">
            Deep-dive field notes on RLHF rubrics, studio voice acoustics, remote USD compensation, and AI engineering workflows.
          </p>
          {onOpenVideoAcademy && (
            <button
              type="button"
              onClick={() => onOpenVideoAcademy()}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-4 py-1.5 text-xs font-semibold text-[#1D4ED8] shadow-2xs transition-colors hover:border-[#1D4ED8]/50 hover:bg-blue-50/70 whitespace-nowrap"
            >
              <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Watch Companion Sessions in Video Academy →</span>
            </button>
          )}
        </div>
      </div>

      {/* 3-Column Desktop / 1-Column Mobile Photo-Overlay Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {visibleBriefings.map((article) => {
          const imgFailed = Boolean(failedImages[article.id]);
          const isCopied = copiedId === article.id;

          return (
            <article
              key={article.id}
              onClick={() => setSelectedBriefing(article)}
              className="group relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1D4ED8]/40 hover:shadow-xl"
            >
              {/* Full-Bleed Cover Image */}
              {!imgFailed ? (
                <img
                  src={article.imageUrl}
                  alt={article.imageAlt}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={() =>
                    setFailedImages((prev) => ({
                      ...prev,
                      [article.id]: true,
                    }))
                  }
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0F172A] via-slate-900 to-blue-950/70 p-4">
                  <BookOpen
                    className="h-10 w-10 text-cyan-400/60"
                    aria-hidden="true"
                  />
                </div>
              )}

              {/* Smooth Dark Bottom Vignette */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/75 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#060913]/70 to-transparent"
              />

              {/* Top Row: Left FEATURED / Category Badge + Right 1-Click Share/Copy Button */}
              <div className="relative z-10 flex items-start justify-between gap-2 p-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {article.badge ? (
                    <span className="rounded-md bg-cyan-400 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-950 shadow-sm">
                      {article.badge}
                    </span>
                  ) : (
                    <span className="rounded-md border border-indigo-400/30 bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-indigo-300 backdrop-blur-md">
                      {article.category}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => handleCopyShareLink(article, e)}
                  aria-label={`Copy share link for ${article.title}`}
                  className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md transition-colors whitespace-nowrap shrink-0 ${
                    isCopied
                      ? 'border-emerald-400/50 bg-emerald-500/25 text-emerald-300'
                      : 'border-white/20 bg-[#060913]/75 text-slate-100 hover:border-cyan-400/60 hover:text-cyan-300'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3 w-3" aria-hidden="true" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bottom Overlay: Category Kicker, Crisp Headline & Muted Metadata */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
                {article.badge && (
                  <span className="mb-1.5 inline-block rounded-md border border-indigo-400/30 bg-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-200 backdrop-blur-md">
                    {article.category}
                  </span>
                )}

                <h3 className="font-serif text-lg font-semibold leading-snug text-white line-clamp-2 transition-colors group-hover:text-cyan-200">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBriefing(article);
                    }}
                    className="text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                  >
                    {article.title}
                  </button>
                </h3>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
                  <span>{article.author}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.publishedAt}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Centered "Show more (X remaining)" / "Show less" Pagination Pill Button */}
      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={handlePaginationClick}
          className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-[#1D4ED8] shadow-sm transition-colors hover:border-[#1D4ED8]/50 hover:bg-slate-50"
        >
          {allShown
            ? 'Show less'
            : `Show more (${remainingCount} remaining)`}
        </button>
      </div>

      {/* Compact Live AI JSON Wire Strip */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <span className="font-mono font-semibold text-emerald-700">
              {isLiveFeedLoaded ? 'LIVE JSON FEED' : 'CURATED BRIEFING WIRE'}
            </span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="text-slate-600">
              Top AI &amp; engineering stories from the developer wire
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {liveStories.map((story) => (
            <a
              key={story.id}
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-colors hover:border-[#1D4ED8]/40 hover:bg-white"
            >
              <p className="line-clamp-2 text-sm font-medium text-slate-900 transition-colors group-hover:text-[#1D4ED8]">
                {story.title}
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {story.source}
                  {typeof story.points === 'number'
                    ? ` · ${story.points} pts`
                    : ''}
                </span>
                <ExternalLink
                  className="h-3 w-3 shrink-0 text-slate-400 group-hover:text-[#1D4ED8]"
                  aria-hidden="true"
                />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Full Readable Editorial Article Modal */}
      {selectedBriefing && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="briefing-modal-title"
          onClick={() => setSelectedBriefing(null)}
        >
          <article
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl sm:rounded-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {selectedBriefing.badge && (
                    <span className="rounded-md bg-[#1D4ED8] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
                      {selectedBriefing.badge}
                    </span>
                  )}
                  <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-medium text-[#1D4ED8]">
                    {selectedBriefing.category}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="text-slate-500">
                    {selectedBriefing.readTime}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="text-slate-500">
                    {selectedBriefing.publishedAt}
                  </span>
                </div>
                <h2
                  id="briefing-modal-title"
                  className="mt-2.5 font-display text-2xl font-bold leading-snug text-slate-900 sm:text-3xl text-balance"
                >
                  {selectedBriefing.title}
                </h2>
                <p className="mt-1.5 text-xs text-slate-500">
                  By {selectedBriefing.author}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBriefing(null)}
                aria-label="Close briefing"
                className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 aspect-[16/10] bg-slate-100">
              <img
                src={selectedBriefing.imageUrl}
                alt={selectedBriefing.imageAlt}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/70 p-4">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-[#1D4ED8]">
                Key Takeaways
              </h3>
              <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
                {selectedBriefing.keyTakeaways.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700">
              {selectedBriefing.sections.map((section) => (
                <div key={section.heading}>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    {section.heading}
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-slate-700">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyShareLink(selectedBriefing)}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
                >
                  {copiedId === selectedBriefing.id ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                      <span className="text-emerald-700">Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                      <span>Copy Share Link</span>
                    </>
                  )}
                </button>

                {onOpenVideoAcademy && (
                  <button
                    type="button"
                    onClick={() => {
                      const mapped =
                        BRIEFING_TO_VIDEO_MAP[selectedBriefing.id]?.sessionId;
                      setSelectedBriefing(null);
                      onOpenVideoAcademy(mapped);
                    }}
                    className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-[#1D4ED8] transition-colors hover:bg-blue-100"
                  >
                    <PlayCircle className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {BRIEFING_TO_VIDEO_MAP[selectedBriefing.id]?.label ||
                        'Watch Related Video'}
                    </span>
                  </button>
                )}

                {onOpenCareerStudio && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBriefing(null);
                      onOpenCareerStudio('resume');
                    }}
                    className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <FileText className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                    <span>Open Career Studio</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedBriefing(null)}
                className="min-h-[42px] rounded-full bg-[#1D4ED8] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1E40AF]"
              >
                Done Reading
              </button>
            </div>
          </article>
        </div>
      )}
    </section>
  );
};
