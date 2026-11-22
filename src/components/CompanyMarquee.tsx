import React from 'react';
import { BrandAvatar } from './BrandAvatar';

interface MarqueeCompany {
  name: string;
  domain: string;
}

const FEATURED_COMPANIES: readonly MarqueeCompany[] = [
  { name: 'Outlier', domain: 'outlier.ai' },
  { name: 'DataAnnotation', domain: 'dataannotation.tech' },
  { name: 'Scale AI', domain: 'scale.com' },
  { name: 'Anthropic', domain: 'anthropic.com' },
  { name: 'Hugging Face', domain: 'huggingface.co' },
  { name: 'Turing', domain: 'turing.com' },
  { name: 'ElevenLabs', domain: 'elevenlabs.io' },
  { name: 'micro1', domain: 'micro1.ai' },
  { name: 'Mercor', domain: 'mercor.com' },
  { name: 'Babel Audio', domain: 'babel.audio' },
  { name: 'Visora', domain: 'visora.com' },
  { name: 'Spout', domain: 'withspout.com' },
  { name: 'Vercel', domain: 'vercel.com' },
  { name: 'Supabase', domain: 'supabase.com' },
  { name: 'Cohere', domain: 'cohere.com' },
  { name: 'Linear', domain: 'linear.app' },
  { name: 'Mistral AI', domain: 'mistral.ai' },
  { name: 'Perplexity AI', domain: 'perplexity.ai' },
];

interface CompanyMarqueeProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const CompanyMarquee: React.FC<CompanyMarqueeProps> = ({
  className = '',
  variant = 'light',
}) => {
  const isLight = variant === 'light';

  return (
    <div
      aria-label="Hiring partners and remote AI employers"
      className={`no-print w-full overflow-hidden py-3.5 ${className}`}
    >
      <div className="mx-auto max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]">
          {[0, 1].map((dupIndex) => (
            <div
              key={dupIndex}
              aria-hidden={dupIndex === 1 ? 'true' : undefined}
              className="flex shrink-0 items-center"
            >
              {FEATURED_COMPANIES.map((company) => (
                <React.Fragment key={`${dupIndex}-${company.name}`}>
                  <span
                    className={`inline-flex shrink-0 items-center gap-2 px-3 py-0.5 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap ${
                      isLight
                        ? 'text-slate-700 hover:text-slate-950'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <BrandAvatar
                      name={company.name}
                      domain={company.domain}
                      size="xs"
                      variant={isLight ? 'light' : 'dark'}
                    />
                    <span>{company.name}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`mx-3 select-none text-xs ${
                      isLight ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    •
                  </span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
