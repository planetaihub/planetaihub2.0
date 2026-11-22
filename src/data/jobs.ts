import curatedJobsRaw from './jobs.json';
import type {
  CuratedJobRecord,
  JobCategory,
  JobListing,
  RemoteRegion,
} from '../types';
import { resolveBrandDomain } from '../components/BrandAvatar';
import { resolveApplyUrl } from '../utils/referralLinks';

function parseAnnualPayRange(payRange: string): {
  minUsd: number;
  maxUsd: number;
} {
  const matches = payRange.match(/[\d,]+/g) || [];
  const numbers = matches
    .map((m) => Number(m.replace(/,/g, '')))
    .filter((n) => !Number.isNaN(n) && n > 0);

  const isHourly = payRange.toLowerCase().includes('/ hr');
  const multiplier = isHourly ? 2080 : 1;

  if (numbers.length === 0) return { minUsd: 0, maxUsd: 0 };
  if (numbers.length === 1) {
    const val = numbers[0] * multiplier;
    return { minUsd: val, maxUsd: val };
  }
  return {
    minUsd: numbers[0] * multiplier,
    maxUsd: numbers[1] * multiplier,
  };
}

function inferRegion(location: string): RemoteRegion {
  const loc = location.toLowerCase();
  if (loc.includes('worldwide') || loc.includes('global')) return 'Worldwide';
  if (loc.includes('apac') || loc.includes('ph')) return 'APAC';
  if (loc.includes('emea') || loc.includes('europe')) return 'Europe / EMEA';
  if (loc.includes('americas') || loc.includes('canada') || loc.includes('north america'))
    return 'Americas';
  return 'US Only';
}

const CATEGORY_STACKS: Record<JobCategory, string[]> = {
  'AI Training & RLHF': ['RLHF', 'Rubric Grading', 'Python', 'Reasoning'],
  'Prompt Engineering': ['Prompt Design', 'JSON Schema', 'RAG', 'Tool Calling'],
  'Audio & Voice AI': ['Speech QA', 'Prosody', 'Audio Studio', 'Acoustics'],
  'AI Evaluation': ['LLM Evals', 'Benchmarking', 'Factuality', 'Python'],
  'AI Safety': ['Red Teaming', 'Alignment', 'Policy Eval', 'Guardrails'],
  'AI Operations': ['Workflow Ops', 'QA Pipelines', 'No-Code', 'Automation'],
  Engineering: ['TypeScript', 'Python', 'Postgres', 'Distributed Systems'],
  'Developer Relations': ['Docs-as-Code', 'SDKs', 'Tutorials', 'Community'],
  'Design & UI': ['Figma', 'Design Systems', 'Prototyping', 'UX Craft'],
};

const CATEGORY_SUMMARIES: Record<JobCategory, string> = {
  'AI Training & RLHF':
    'Evaluate model responses, author high-signal reasoning chains, and refine preference rankings across coding, STEM, or domain tasks.',
  'Prompt Engineering':
    'Design structured system prompts, evaluation test suites, and agentic tool-calling workflows for production LLM systems.',
  'Audio & Voice AI':
    'Contribute natural speech datasets, audit prosody and acoustic quality, or engineer ultra-low-latency voice synthesis pipelines.',
  'AI Evaluation':
    'Build golden datasets, diagnostic rubrics, and automated regression harnesses measuring model accuracy and factuality.',
  'AI Safety':
    'Probe frontier models for adversarial edge cases, policy alignment gaps, and robustness failures across multimodal inputs.',
  'AI Operations':
    'Scale distributed contributor workflows, data QA pipelines, and automated operations across global remote teams.',
  Engineering:
    'Architect reliable full-stack, backend, and GPU runtime infrastructure powering modern AI products and developer platforms.',
  'Developer Relations':
    'Create reproducible starter apps, technical guides, and SDK documentation helping builders ship faster with AI tooling.',
  'Design & UI':
    'Craft responsive interfaces, visual builder canvases, and accessible design systems tailored for AI-native workflows.',
};

const curatedRecords = curatedJobsRaw as CuratedJobRecord[];

export const REMOTE_JOBS: JobListing[] = curatedRecords.map((record) => {
  const { minUsd, maxUsd } = parseAnnualPayRange(record.payRange);
  const region = inferRegion(record.location);

  return {
    ...record,
    applyUrl: resolveApplyUrl(record.company, record.applyUrl),
    companyDomain: resolveBrandDomain(record.company, record.domain),
    region,
    payMinUsd: minUsd,
    payMaxUsd: maxUsd,
    summary: CATEGORY_SUMMARIES[record.category],
    stack: CATEGORY_STACKS[record.category],
    responsibilities: [
      `Deliver high-precision ${record.category.toLowerCase()} outcomes aligned with ${record.company} quality standards.`,
      `Collaborate asynchronously across distributed teams with clear written documentation.`,
      `Iterate quickly on feedback rubrics, tooling improvements, and measurable quality benchmarks.`,
    ],
    requirements: [
      `Demonstrated track record in ${record.category} or closely related technical/domain work.`,
      `Reliable quiet remote workspace and strong written English communication.`,
      `Eligibility to work in ${record.location}.`,
    ],
    timezoneNote: `${record.location} · Async-friendly ${record.type}`,
  };
});
