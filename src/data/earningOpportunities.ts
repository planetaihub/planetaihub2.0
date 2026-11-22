export type EarningCategory =
  | 'All'
  | 'Passive'
  | 'AI Training'
  | 'Voice & Audio'
  | 'Research Study';

export interface EarningOpportunity {
  id: string;
  name: string;
  domain: string;
  category: Exclude<EarningCategory, 'All'>;
  badge: string;
  badgeTone: 'cyan' | 'emerald' | 'indigo';
  pay: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  url: string;
  bgImageUrl: string;
  referralCode?: string;
  referralNote?: string;
}

export const EARNING_CATEGORIES: EarningCategory[] = [
  'All',
  'Passive',
  'AI Training',
  'Voice & Audio',
  'Research Study',
];

export const EARNING_OPPORTUNITIES: EarningOpportunity[] = [
  {
    id: 'loggy3',
    name: 'Loggy3',
    domain: 'loggy3.com',
    category: 'Passive',
    badge: 'VERIFIED',
    badgeTone: 'emerald',
    pay: 'Up to $100 / mo ($0.10 – $1.00 / hr tiered)',
    subtitle: 'PlanetAI Verified • Windows & macOS • Pays 1st & 15th • PH, KE, IN, PK',
    description:
      'Get paid to record your screen while using your computer normally (work, browse, or play).',
    referralCode: '794MG8',
    referralNote:
      'Enter code 794MG8 before your first recording + upload 20 hrs in your first 2 weeks for 10 bonus hours of pay.',
    ctaLabel: 'Download at Loggy3 ↗',
    url: 'https://loggy3.com',
    bgImageUrl:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'micro1',
    name: 'micro1',
    domain: 'micro1.ai',
    category: 'AI Training',
    badge: 'FEATURED',
    badgeTone: 'cyan',
    pay: '$20 – $70+ / hr',
    subtitle: 'PlanetAI Verified • Web / Desktop • Worldwide Remote • USD Payouts',
    description:
      'Complete a quick AI interview to unlock global remote AI training, video annotation, and tech contracts.',
    ctaLabel: 'Browse All Roles ↗',
    url: 'https://micro1.ai',
    bgImageUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'babel-audio',
    name: 'Babel Audio',
    domain: 'babel.audio',
    category: 'Voice & Audio',
    badge: 'VERIFIED',
    badgeTone: 'emerald',
    pay: 'Flexible USD Rates',
    subtitle: 'PlanetAI Verified • PC / Laptop + Mic • Worldwide Remote',
    description:
      'Get paid to record natural conversations and voice scripts to help train next-generation AI speech models.',
    ctaLabel: 'Start Recording ↗',
    url: 'https://babel.audio',
    bgImageUrl:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'glootrain',
    name: 'GlooTrain',
    domain: 'glootrain.com',
    category: 'Research Study',
    badge: 'MAC + IPHONE',
    badgeTone: 'indigo',
    pay: '$5.00 / hr + Bonuses',
    subtitle: 'PlanetAI Verified • Requires Apple Silicon Mac & iPhone • PH Eligible',
    description:
      'Participate in a paid computer-use and eye-tracking research study for up to 20 hours per week.',
    ctaLabel: 'Apply on GlooTrain ↗',
    url: 'https://glootrain.com',
    bgImageUrl:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
  },
];
