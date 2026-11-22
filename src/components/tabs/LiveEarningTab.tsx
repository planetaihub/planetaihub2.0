import React, { useMemo, useState } from 'react';
import {
  Check,
  Coins,
  Copy,
  ExternalLink,
  Gift,
  ShieldCheck,
} from 'lucide-react';
import {
  EARNING_CATEGORIES,
  EARNING_OPPORTUNITIES,
  type EarningCategory,
  type EarningOpportunity,
} from '../../data/earningOpportunities';
import { AdBanner } from '../AdBanner';

function getBadgeClasses(tone: 'cyan' | 'emerald' | 'indigo'): string {
  if (tone === 'emerald') {
    return 'border-emerald-400/50 bg-emerald-500/25 text-emerald-200 shadow-sm';
  }
  if (tone === 'indigo') {
    return 'border-blue-400/50 bg-blue-500/25 text-blue-100 shadow-sm';
  }
  return 'border-cyan-400/50 bg-cyan-500/25 text-cyan-100 shadow-sm';
}

const ProductLogoBadge: React.FC<{ item: EarningOpportunity; size?: 'header' | 'inline' }> = ({
  item,
  size = 'header',
}) => {
  const [hasError, setHasError] = useState(false);
  const initials = item.name.slice(0, 2).toUpperCase();

  const containerClass =
    size === 'inline'
      ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 p-1.5 shadow-2xs'
      : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-slate-900/80 p-2 backdrop-blur-md shadow-lg';

  const imgClass = size === 'inline' ? 'h-6 w-6 object-contain rounded' : 'h-6 w-6 object-contain rounded-md';

  return (
    <div className={containerClass}>
      {!hasError ? (
        <img
          src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`}
          alt={`${item.name} logo`}
          onError={() => setHasError(true)}
          className={imgClass}
        />
      ) : (
        <span
          className={`font-mono text-xs font-bold ${
            size === 'inline' ? 'text-[#1D4ED8]' : 'text-cyan-200'
          }`}
        >
          {initials}
        </span>
      )}
    </div>
  );
};

export const LiveEarningTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<EarningCategory>('All');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const filteredOpportunities = useMemo(() => {
    if (selectedCategory === 'All') return EARNING_OPPORTUNITIES;
    return EARNING_OPPORTUNITIES.filter(
      (item) => item.category === selectedCategory
    );
  }, [selectedCategory]);

  const handleCopyCode = async (id: string, code: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedCodeId(id);
      window.setTimeout(() => {
        setCopiedCodeId((prev) => (prev === id ? null : prev));
      }, 2200);
    } catch {
      // Clipboard blocked gracefully
    }
  };

  return (
    <section aria-labelledby="live-earning-heading" className="space-y-6">
      {/* Header & AdSense-Safe Disclosure */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#1D4ED8]">
              <Coins className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
                Featured Spotlight Partners
              </p>
              <h2
                id="live-earning-heading"
                className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance"
              >
                Live Earning Opportunities
              </h2>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-700 tabular-nums">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span>{EARNING_OPPORTUNITIES.length} Verified Platforms</span>
          </span>
        </div>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
          Verified side-income, AI training, and passive earning platforms. Some links may be referral links at no extra cost to you.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div
        role="tablist"
        aria-label="Filter live earning opportunities by category"
        className="flex items-center gap-2 overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade px-1 pb-1"
      >
        {EARNING_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={(e) => {
                setSelectedCategory(category);
                if (window.innerWidth <= 768) {
                  e.currentTarget.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest',
                  });
                }
              }}
              className={`snap-center min-h-[38px] rounded-full border px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* 4-Card Featured Spotlight Grid with Atmospheric Photo Header + Light SaaS Card Body */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredOpportunities.map((item) => {
          const isCopied = copiedCodeId === item.id;
          return (
            <article
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1D4ED8]/40 hover:shadow-lg"
            >
              <div>
                {/* 1. h-48 Top Photo Header with Dark Gradient Overlay */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.bgImageUrl}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover opacity-75 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/65 to-[#0F172A]/25" />

                  {/* 2. Badges inside Photo Header */}
                  <div className="absolute inset-0 flex flex-col justify-between p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] font-bold tracking-wider uppercase backdrop-blur-md ${getBadgeClasses(
                          item.badgeTone
                        )}`}
                      >
                        {item.badge}
                      </span>

                      <ProductLogoBadge item={item} size="header" />
                    </div>

                    <div>
                      <span className="inline-flex rounded-md border border-white/20 bg-slate-900/75 px-2.5 py-1 text-[11px] font-semibold text-slate-100 backdrop-blur-md shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Light SaaS Card Body */}
                <div className="p-6">
                  <div className="flex items-center gap-3.5">
                    <ProductLogoBadge item={item} size="inline" />
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-xl font-bold tracking-tight text-slate-900">
                        {item.name}
                      </h3>
                      <p className="font-mono text-xs text-emerald-700 font-bold tabular-nums">
                        {item.pay}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2.5 text-xs font-medium text-slate-500">
                    {item.subtitle}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>

                  {/* Interactive Referral Code Box */}
                  {item.referralCode && (
                    <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/70 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Gift
                            className="h-4 w-4 shrink-0 text-[#1D4ED8]"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-semibold text-slate-800">
                            Referral Code:
                          </span>
                          <code className="rounded-lg border border-blue-200 bg-white px-2.5 py-1 font-mono text-sm font-bold tracking-widest text-[#1D4ED8]">
                            {item.referralCode}
                          </code>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleCopyCode(item.id, item.referralCode!)
                          }
                          className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                            isCopied
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-[#1D4ED8]/40 hover:text-[#1D4ED8]'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>

                      {item.referralNote && (
                        <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                          {item.referralNote}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                <a
                  href={item.url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
                >
                  <span>{item.ctaLabel}</span>
                  <ExternalLink className="h-3.5 w-3.5 sr-only" aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* AdSense Manual Slot Below Main Content */}
      <AdBanner />
    </section>
  );
};
