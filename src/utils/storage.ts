import type { ExpenseEntry, UserNote, VitalEntry } from '../types';

const KEYS = {
  SAVED_JOBS: 'workdeck_saved_jobs_v1',
  JOB_NOTES: 'workdeck_job_notes_v1',
  NOTES: 'workdeck_notes_v1',
  EXPENSES: 'workdeck_expenses_v1',
  VITALS: 'workdeck_vitals_v1',
  PWA_BANNER_DISMISSED: 'workdeck_pwa_dismissed_v1',
  CAREER_DOC: 'workdeck_career_doc_v1',
  CAREER_STAR: 'workdeck_career_star_v1',
  CAREER_RUBRIC: 'workdeck_career_rubric_v1',
  CAREER_VOICE_SCRIPT: 'workdeck_career_voice_v1',
  FINANCE_BUDGET: 'workdeck_finance_budget_v1',
  FINANCE_RATES: 'workdeck_finance_rates_v1',
  FINANCE_INVOICE: 'workdeck_finance_invoice_v1',
  PRODUCTIVITY_SNIPPETS: 'workdeck_snippets_v1',
  PRODUCTIVITY_ALARM: 'workdeck_alarm_v1',
  PRODUCTIVITY_POMODORO: 'workdeck_pomodoro_v1',
  HEALTH_WATER: 'workdeck_water_v1',
  HEALTH_WEATHER_CACHE: 'workdeck_weather_cache_v1',
  POSTED_JOBS: 'workdeck_posted_jobs_v1',
  SPOTLIGHT_VIDEO: 'workdeck_spotlight_video_v1',
} as const;

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private browsing write errors gracefully
  }
}

export function loadSavedJobIds(): string[] {
  return readJson<string[]>(KEYS.SAVED_JOBS, []);
}

export function saveSavedJobIds(ids: string[]): void {
  writeJson(KEYS.SAVED_JOBS, ids);
}

export function loadJobNotes(): Record<string, string> {
  return readJson<Record<string, string>>(KEYS.JOB_NOTES, {});
}

export function saveJobNote(jobId: string, note: string): Record<string, string> {
  const current = loadJobNotes();
  const updated = { ...current };
  if (note.trim()) {
    updated[jobId] = note;
  } else {
    delete updated[jobId];
  }
  writeJson(KEYS.JOB_NOTES, updated);
  return updated;
}

export function loadUserNotes(): UserNote[] {
  return readJson<UserNote[]>(KEYS.NOTES, []);
}

export function saveUserNotes(notes: UserNote[]): void {
  writeJson(KEYS.NOTES, notes);
}

export function loadExpenses(): ExpenseEntry[] {
  return readJson<ExpenseEntry[]>(KEYS.EXPENSES, []);
}

export function saveExpenses(expenses: ExpenseEntry[]): void {
  writeJson(KEYS.EXPENSES, expenses);
}

export function loadVitals(): VitalEntry[] {
  return readJson<VitalEntry[]>(KEYS.VITALS, []);
}

export function saveVitals(vitals: VitalEntry[]): void {
  writeJson(KEYS.VITALS, vitals);
}

export function isPWABannerDismissed(): boolean {
  return readJson<boolean>(KEYS.PWA_BANNER_DISMISSED, false);
}

export function dismissPWABanner(): void {
  writeJson(KEYS.PWA_BANNER_DISMISSED, true);
}

export function loadCareerState<T>(
  slot: 'doc' | 'star' | 'rubric' | 'voice',
  fallback: T
): T {
  const map = {
    doc: KEYS.CAREER_DOC,
    star: KEYS.CAREER_STAR,
    rubric: KEYS.CAREER_RUBRIC,
    voice: KEYS.CAREER_VOICE_SCRIPT,
  };
  return readJson<T>(map[slot], fallback);
}

export function saveCareerState<T>(
  slot: 'doc' | 'star' | 'rubric' | 'voice',
  value: T
): void {
  const map = {
    doc: KEYS.CAREER_DOC,
    star: KEYS.CAREER_STAR,
    rubric: KEYS.CAREER_RUBRIC,
    voice: KEYS.CAREER_VOICE_SCRIPT,
  };
  writeJson(map[slot], value);
}

export { KEYS as STORAGE_KEYS };
