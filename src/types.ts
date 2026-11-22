export type TabId =
  | 'jobs'
  | 'career-studio'
  | 'ai-assistants'
  | 'dev-tools'
  | 'finance-docs'
  | 'productivity'
  | 'health-weather'
  | 'live-earning'
  | 'video-academy'
  | 'va-academy'
  | 'security-vault';

export interface SpotlightVideoConfig {
  company: string;
  domain: string;
  tagline: string;
  summary: string;
  payRange: string;
  videoUrl: string;
}

export type JobCategory =
  | 'AI Training & RLHF'
  | 'Prompt Engineering'
  | 'Audio & Voice AI'
  | 'AI Evaluation'
  | 'AI Safety'
  | 'AI Operations'
  | 'Engineering'
  | 'Developer Relations'
  | 'Design & UI';

export type JobRoleLevel =
  | 'Full-time'
  | 'Contract'
  | 'Freelance'
  | 'Part-time';

export type RemoteRegion =
  | 'Worldwide'
  | 'Americas'
  | 'Europe / EMEA'
  | 'US Only'
  | 'APAC';

export interface CuratedJobRecord {
  id: string;
  title: string;
  company: string;
  category: JobCategory;
  payRange: string;
  location: string;
  type: JobRoleLevel;
  source: string;
  postedAt: string;
  applyUrl: string;
  domain?: string;
  featured?: boolean;
}

export interface JobListing extends CuratedJobRecord {
  companyDomain: string;
  region: RemoteRegion;
  payMinUsd: number; // Annualized USD equivalent for filtering & sorting
  payMaxUsd: number;
  summary: string;
  stack: string[];
  responsibilities: string[];
  requirements: string[];
  timezoneNote: string;
}

export interface UserNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface ExpenseEntry {
  id: string;
  label: string;
  amount: number;
  category: string;
  date: string;
}

export interface VitalEntry {
  id: string;
  metric: string;
  value: string;
  recordedAt: string;
}
