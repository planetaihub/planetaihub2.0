export const REFERRAL_URLS = {
  micro1:
    'https://refer.micro1.ai/referral/jobs?referralCode=6b7ac363-af71-444b-97b2-ecc6dcc25f19&utm_source=referral&utm_medium=share&utm_campaign=job_referral',
  babel:
    'https://dashboard.babel.audio/sign-up?referrer=9-H4aslhSJ-Upit_wW_v6g.nJN4lyv3&referrerName=Von%20Ryan',
  mercor: 'https://t.mercor.com/ZHGlm',
  visora: 'https://visora.com/r/u_i4v_ctHMBD80',
  spout:
    'https://withspout.com/login?mode=signup&ref=bc7c8ff9-63db-4dd9-b6d2-cce48dd993d8',
} as const;

export const MICRO1_COMPANY_REFERRAL_URL =
  'https://company.micro1.ai/register/?referralCode=6b7ac363-af71-444b-97b2-ecc6dcc25f19&utm_source=referral&utm_medium=share&utm_campaign=job_referral';

/**
 * Automatically maps matching partner companies (case-insensitive)
 * to their verified candidate referral URL across curated and live ATS jobs.
 */
export function resolveApplyUrl(company: string, fallbackUrl: string): string {
  const normalized = company.trim().toLowerCase();
  if (!normalized) return fallbackUrl;

  if (normalized === 'micro1' || normalized.includes('micro1')) {
    return REFERRAL_URLS.micro1;
  }
  if (
    normalized === 'babel' ||
    normalized === 'babel audio' ||
    normalized.includes('babel')
  ) {
    return REFERRAL_URLS.babel;
  }
  if (normalized === 'mercor' || normalized.includes('mercor')) {
    return REFERRAL_URLS.mercor;
  }
  if (normalized === 'visora' || normalized.includes('visora')) {
    return REFERRAL_URLS.visora;
  }
  if (
    normalized === 'spout' ||
    normalized === 'withspout' ||
    normalized.includes('withspout') ||
    normalized.includes('spout')
  ) {
    return REFERRAL_URLS.spout;
  }

  return fallbackUrl;
}
