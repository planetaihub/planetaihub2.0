import React, { useEffect, useState } from 'react';

const BRAND_DOMAIN_MAP: Record<string, string> = {
  // Featured & Curated AI / Tech Employers
  'scale ai': 'scale.com',
  anthropic: 'anthropic.com',
  'babel audio': 'babel.audio',
  micro1: 'micro1.ai',
  mercor: 'mercor.com',
  visora: 'visora.com',
  'visora ai': 'visora.com',
  spout: 'withspout.com',
  withspout: 'withspout.com',
  outlier: 'outlier.ai',
  'outlier ai': 'outlier.ai',
  dataannotation: 'dataannotation.tech',
  'data annotation': 'dataannotation.tech',
  vercel: 'vercel.com',
  supabase: 'supabase.com',
  'hugging face': 'huggingface.co',
  huggingface: 'huggingface.co',
  turing: 'turing.com',
  elevenlabs: 'elevenlabs.io',
  cohere: 'cohere.com',
  linear: 'linear.app',
  'mistral ai': 'mistral.ai',
  'perplexity ai': 'perplexity.ai',
  perplexity: 'perplexity.ai',
  zapier: 'zapier.com',
  'telus digital': 'telusinternational.com',
  appen: 'appen.com',
  deepgram: 'deepgram.com',
  cartesia: 'cartesia.ai',
  vapi: 'vapi.ai',
  'weights & biases': 'wandb.ai',
  'together ai': 'together.ai',
  'modal labs': 'modal.com',
  flutterflow: 'flutterflow.io',
  replicate: 'replicate.com',
  replit: 'replit.com',
  langchain: 'langchain.com',

  // AI Assistants
  'google gemini': 'google.com',
  'claude ai': 'anthropic.com',
  chatgpt: 'openai.com',
  openai: 'openai.com',
  grok: 'x.ai',
  'microsoft copilot': 'microsoft.com',
  deepseek: 'deepseek.com',
  'mistral le chat': 'mistral.ai',
  huggingchat: 'huggingface.co',
  poe: 'poe.com',
  'google notebooklm': 'google.com',
  'meta ai': 'meta.ai',
  phind: 'phind.com',
  'gamma ai': 'gamma.app',
  'otter.ai': 'otter.ai',

  // Developer Tools
  'google ai studio': 'google.com',
  'github copilot free tier': 'github.com',
  github: 'github.com',
  netlify: 'netlify.com',
  'mit app inventor': 'appinventor.mit.edu',
  'bolt.new': 'bolt.new',
  'v0 by vercel': 'v0.dev',
  'audacity + openvino': 'audacityteam.org',
  'krisp acoustic check': 'krisp.ai',
  'jsonlint & schema validator': 'jsonlint.com',
};

interface SignatureBrandTileStyle {
  mark: string;
  bgClass: string;
  textClass: string;
  borderClass?: string;
}

const SIGNATURE_BRAND_TILES: Record<string, SignatureBrandTileStyle> = {
  micro1: {
    mark: 'm.',
    bgClass: 'bg-[#0A0A0A]',
    textClass: 'text-white',
    borderClass: 'border border-slate-900',
  },
  'scale ai': {
    mark: 'S/',
    bgClass: 'bg-[#111827]',
    textClass: 'text-indigo-300',
    borderClass: 'border border-slate-800',
  },
  outlier: {
    mark: 'O.',
    bgClass: 'bg-[#0F172A]',
    textClass: 'text-emerald-300',
    borderClass: 'border border-slate-800',
  },
  'outlier ai': {
    mark: 'O.',
    bgClass: 'bg-[#0F172A]',
    textClass: 'text-emerald-300',
    borderClass: 'border border-slate-800',
  },
  mercor: {
    mark: 'M',
    bgClass: 'bg-[#1E1B4B]',
    textClass: 'text-white',
    borderClass: 'border border-indigo-900',
  },
  dataannotation: {
    mark: 'DA',
    bgClass: 'bg-[#064E3B]',
    textClass: 'text-emerald-100',
    borderClass: 'border border-emerald-900',
  },
  'data annotation': {
    mark: 'DA',
    bgClass: 'bg-[#064E3B]',
    textClass: 'text-emerald-100',
    borderClass: 'border border-emerald-900',
  },
  'telus digital': {
    mark: 'TD',
    bgClass: 'bg-[#4B286D]',
    textClass: 'text-white',
    borderClass: 'border border-purple-900',
  },
  'babel audio': {
    mark: 'BA',
    bgClass: 'bg-[#1D4ED8]',
    textClass: 'text-white',
    borderClass: 'border border-blue-700',
  },
  spout: {
    mark: 'sp',
    bgClass: 'bg-[#0369A1]',
    textClass: 'text-white',
    borderClass: 'border border-sky-800',
  },
  visora: {
    mark: 'V',
    bgClass: 'bg-[#4338CA]',
    textClass: 'text-white',
    borderClass: 'border border-indigo-700',
  },
  'visora ai': {
    mark: 'V',
    bgClass: 'bg-[#4338CA]',
    textClass: 'text-white',
    borderClass: 'border border-indigo-700',
  },
  anthropic: {
    mark: 'A\\',
    bgClass: 'bg-[#1C1917]',
    textClass: 'text-[#F5EFE6]',
    borderClass: 'border border-stone-800',
  },
  cohere: {
    mark: 'Co',
    bgClass: 'bg-[#1E3A2F]',
    textClass: 'text-emerald-200',
    borderClass: 'border border-emerald-950',
  },
  zapier: {
    mark: 'Z_',
    bgClass: 'bg-[#FF4F00]',
    textClass: 'text-white',
    borderClass: 'border border-orange-600',
  },
  turing: {
    mark: 'Tu',
    bgClass: 'bg-[#18181B]',
    textClass: 'text-sky-300',
    borderClass: 'border border-zinc-800',
  },
  'perplexity ai': {
    mark: 'Px',
    bgClass: 'bg-[#0E7490]',
    textClass: 'text-white',
    borderClass: 'border border-cyan-800',
  },
  perplexity: {
    mark: 'Px',
    bgClass: 'bg-[#0E7490]',
    textClass: 'text-white',
    borderClass: 'border border-cyan-800',
  },
  elevenlabs: {
    mark: 'II',
    bgClass: 'bg-[#09090B]',
    textClass: 'text-white',
    borderClass: 'border border-zinc-800',
  },
  vercel: {
    mark: '▲',
    bgClass: 'bg-[#000000]',
    textClass: 'text-white',
    borderClass: 'border border-neutral-800',
  },
  supabase: {
    mark: 'S',
    bgClass: 'bg-[#1C1C1C]',
    textClass: 'text-[#3ECF8E]',
    borderClass: 'border border-neutral-800',
  },
  'hugging face': {
    mark: 'HF',
    bgClass: 'bg-[#92400E]',
    textClass: 'text-[#FEF3C7]',
    borderClass: 'border border-amber-800',
  },
  appen: {
    mark: 'Ap',
    bgClass: 'bg-[#991B1B]',
    textClass: 'text-white',
    borderClass: 'border border-red-900',
  },
  'mistral ai': {
    mark: 'Mi',
    bgClass: 'bg-[#B45309]',
    textClass: 'text-white',
    borderClass: 'border border-amber-800',
  },
  linear: {
    mark: 'Ln',
    bgClass: 'bg-[#312E81]',
    textClass: 'text-white',
    borderClass: 'border border-indigo-900',
  },
};

const FALLBACK_TILE_PALETTE: Array<{ bgClass: string; textClass: string }> = [
  { bgClass: 'bg-[#0F172A]', textClass: 'text-white' },
  { bgClass: 'bg-[#1D4ED8]', textClass: 'text-white' },
  { bgClass: 'bg-[#047857]', textClass: 'text-white' },
  { bgClass: 'bg-[#3730A3]', textClass: 'text-white' },
  { bgClass: 'bg-[#0F766E]', textClass: 'text-white' },
  { bgClass: 'bg-[#9F1239]', textClass: 'text-white' },
];

export function resolveBrandDomain(
  name: string = '',
  explicitDomain?: string
): string {
  const safeName = typeof name === 'string' ? name : '';
  const normalizedName = safeName.trim().toLowerCase();
  if (BRAND_DOMAIN_MAP[normalizedName]) {
    return BRAND_DOMAIN_MAP[normalizedName];
  }

  const cleanedExplicit = (explicitDomain || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .toLowerCase();

  if (cleanedExplicit && cleanedExplicit.includes('.')) {
    return cleanedExplicit;
  }

  const slug = normalizedName.replace(/[^a-z0-9]/g, '');
  return slug ? `${slug}.com` : '';
}

function getTwoLetterMonogram(name: string = ''): string {
  const safeName = typeof name === 'string' ? name : '';
  const words = safeName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'AI';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function hashNameIndex(name: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

export function getCompanyMark(name: string = ''): string {
  const normalized = (name || '').trim().toLowerCase();
  const matched =
    SIGNATURE_BRAND_TILES[normalized] ||
    Object.entries(SIGNATURE_BRAND_TILES).find(([key]) =>
      normalized.includes(key)
    )?.[1];
  if (matched?.mark) return matched.mark;
  return getTwoLetterMonogram(name);
}

export interface BrandTileProps {
  name: string;
  size?: 'md' | 'lg';
  className?: string;
}

/**
 * Bold square brand tile (w-14 h-14 rounded-2xl) featuring signature brand
 * monograms & high-contrast surfaces with zero broken external images.
 */
export const BrandTile: React.FC<BrandTileProps> = ({
  name = '',
  size = 'lg',
  className = '',
}) => {
  const normalized = name.trim().toLowerCase();
  const matched =
    SIGNATURE_BRAND_TILES[normalized] ||
    Object.entries(SIGNATURE_BRAND_TILES).find(([key]) =>
      normalized.includes(key)
    )?.[1];

  const fallbackPalette =
    FALLBACK_TILE_PALETTE[hashNameIndex(normalized || 'ai', FALLBACK_TILE_PALETTE.length)];

  const mark = matched?.mark || getTwoLetterMonogram(name);
  const bgClass = matched?.bgClass || fallbackPalette.bgClass;
  const textClass = matched?.textClass || fallbackPalette.textClass;
  const borderClass = matched?.borderClass || 'border border-black/10';

  const sizeClass =
    size === 'md'
      ? 'w-12 h-12 rounded-xl text-lg'
      : 'w-14 h-14 rounded-2xl text-xl';

  return (
    <div
      aria-hidden="true"
      className={`shrink-0 flex items-center justify-center font-display font-bold tracking-tight shadow-sm select-none ${sizeClass} ${bgClass} ${textClass} ${borderClass} ${className}`}
    >
      <span>{mark}</span>
    </div>
  );
};

export interface BrandAvatarProps {
  name: string;
  domain?: string;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * Renders a crisp real brand logo using Google's high-res favicon resolver
 * inside a clean SaaS badge, with an automatic 2-letter monogram fallback.
 */
export const BrandAvatar: React.FC<BrandAvatarProps> = ({
  name = '',
  domain,
  size = 'md',
  variant = 'light',
  className = '',
}) => {
  const resolvedDomain = resolveBrandDomain(name, domain);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [resolvedDomain, name]);

  const surfaceClasses =
    variant === 'dark'
      ? 'bg-white/[0.08] border border-white/15'
      : 'bg-slate-50 border border-slate-200 shadow-2xs';

  const sizeClasses =
    size === 'xs'
      ? `w-6 h-6 rounded-md p-0.5 ${surfaceClasses}`
      : size === 'sm'
      ? `w-9 h-9 rounded-lg p-1 ${surfaceClasses}`
      : `w-10 h-10 rounded-xl p-1.5 ${surfaceClasses}`;

  const textSizeClass =
    size === 'xs' ? 'text-[9px]' : size === 'sm' ? 'text-[11px]' : 'text-xs';
  const fallbackColorClass =
    variant === 'dark' ? 'text-blue-200' : 'text-[#1D4ED8]';
  const showFallback = !resolvedDomain || hasError;
  const faviconUrl = resolvedDomain
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
        resolvedDomain
      )}&sz=128`
    : '';

  return (
    <div
      aria-hidden="true"
      className={`shrink-0 flex items-center justify-center overflow-hidden ${sizeClasses} ${className}`}
    >
      {showFallback ? (
        <span
          className={`font-mono font-bold tracking-tight select-none ${fallbackColorClass} ${textSizeClass}`}
        >
          {getTwoLetterMonogram(name)}
        </span>
      ) : (
        <img
          src={faviconUrl}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          className="h-full w-full rounded-[4px] object-contain"
        />
      )}
    </div>
  );
};

export interface CompanyTheme {
  cardBgClass: string;
  watermarkColor: string;
}

const COMPANY_THEMES: Record<string, CompanyTheme> = {
  micro1: {
    cardBgClass: 'bg-gradient-to-br from-neutral-50/90 via-white to-zinc-100/80',
    watermarkColor: 'text-neutral-900',
  },
  'scale ai': {
    cardBgClass: 'bg-gradient-to-br from-indigo-50/75 via-white to-slate-50',
    watermarkColor: 'text-indigo-600',
  },
  outlier: {
    cardBgClass: 'bg-gradient-to-br from-emerald-50/75 via-white to-cyan-50/50',
    watermarkColor: 'text-emerald-600',
  },
  'outlier ai': {
    cardBgClass: 'bg-gradient-to-br from-emerald-50/75 via-white to-cyan-50/50',
    watermarkColor: 'text-emerald-600',
  },
  mercor: {
    cardBgClass: 'bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60',
    watermarkColor: 'text-blue-700',
  },
  dataannotation: {
    cardBgClass: 'bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/50',
    watermarkColor: 'text-teal-700',
  },
  'data annotation': {
    cardBgClass: 'bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/50',
    watermarkColor: 'text-teal-700',
  },
  anthropic: {
    cardBgClass: 'bg-gradient-to-br from-stone-50/90 via-white to-amber-50/50',
    watermarkColor: 'text-stone-800',
  },
  'telus digital': {
    cardBgClass: 'bg-gradient-to-br from-purple-50/70 via-white to-violet-50/50',
    watermarkColor: 'text-purple-700',
  },
  'babel audio': {
    cardBgClass: 'bg-gradient-to-br from-blue-50/85 via-white to-sky-50/60',
    watermarkColor: 'text-blue-600',
  },
  spout: {
    cardBgClass: 'bg-gradient-to-br from-sky-50/80 via-white to-blue-50/50',
    watermarkColor: 'text-sky-600',
  },
  visora: {
    cardBgClass: 'bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/50',
    watermarkColor: 'text-indigo-700',
  },
  'visora ai': {
    cardBgClass: 'bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/50',
    watermarkColor: 'text-indigo-700',
  },
  cohere: {
    cardBgClass: 'bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50',
    watermarkColor: 'text-emerald-700',
  },
  zapier: {
    cardBgClass: 'bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50',
    watermarkColor: 'text-orange-600',
  },
  turing: {
    cardBgClass: 'bg-gradient-to-br from-zinc-100/80 via-white to-slate-50',
    watermarkColor: 'text-zinc-800',
  },
  'perplexity ai': {
    cardBgClass: 'bg-gradient-to-br from-cyan-50/80 via-white to-teal-50/50',
    watermarkColor: 'text-cyan-700',
  },
  perplexity: {
    cardBgClass: 'bg-gradient-to-br from-cyan-50/80 via-white to-teal-50/50',
    watermarkColor: 'text-cyan-700',
  },
  elevenlabs: {
    cardBgClass: 'bg-gradient-to-br from-zinc-100/80 via-white to-stone-50',
    watermarkColor: 'text-zinc-900',
  },
  vercel: {
    cardBgClass: 'bg-gradient-to-br from-neutral-100/80 via-white to-slate-50',
    watermarkColor: 'text-neutral-900',
  },
  supabase: {
    cardBgClass: 'bg-gradient-to-br from-emerald-50/60 via-white to-zinc-50',
    watermarkColor: 'text-emerald-600',
  },
  'hugging face': {
    cardBgClass: 'bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/50',
    watermarkColor: 'text-amber-700',
  },
};

export function getCompanyTheme(name: string = ''): CompanyTheme {
  const normalized = (name || '').trim().toLowerCase();
  const found =
    COMPANY_THEMES[normalized] ||
    Object.entries(COMPANY_THEMES).find(([key]) =>
      normalized.includes(key)
    )?.[1];
  return (
    found || {
      cardBgClass: 'bg-gradient-to-br from-slate-50/85 via-white to-slate-100/60',
      watermarkColor: 'text-slate-900',
    }
  );
}

