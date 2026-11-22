import React, { useMemo, useState } from 'react';
import {
  Cloud,
  Code2,
  Cpu,
  ExternalLink,
  Search,
  Terminal,
  Volume2,
} from 'lucide-react';
import { AdBanner } from '../AdBanner';
import { BrandAvatar } from '../BrandAvatar';

type DevToolCategory =
  | 'All'
  | 'AI App Builders'
  | 'Coding & Validation'
  | 'Backend & Hosting'
  | 'Audio & Voice QA';

interface DevToolItem {
  id: string;
  name: string;
  category: Exclude<DevToolCategory, 'All'>;
  description: string;
  url: string;
  domain: string;
}

const DEV_TOOLS: DevToolItem[] = [
  {
    id: 'ai-studio',
    name: 'Google AI Studio',
    category: 'AI App Builders',
    description:
      'Prototyping environment and free API playground for building Gemini-powered apps.',
    url: 'https://aistudio.google.com',
    domain: 'google.com',
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot Free Tier',
    category: 'Coding & Validation',
    description:
      'In-editor code completions and chat included free for individual GitHub accounts.',
    url: 'https://github.com/features/copilot',
    domain: 'github.com',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'Backend & Hosting',
    description:
      'Open-source Postgres database, auth, edge functions, and storage with generous free tier.',
    url: 'https://supabase.com',
    domain: 'supabase.com',
  },
  {
    id: 'netlify',
    name: 'Netlify',
    category: 'Backend & Hosting',
    description:
      'Instant Git-to-edge web hosting with preview deploys, forms, and serverless functions.',
    url: 'https://www.netlify.com',
    domain: 'netlify.com',
  },
  {
    id: 'flutterflow',
    name: 'FlutterFlow',
    category: 'AI App Builders',
    description:
      'Visual cross-platform builder exporting clean Flutter code for iOS, Android, and Web.',
    url: 'https://www.flutterflow.io',
    domain: 'flutterflow.io',
  },
  {
    id: 'mit-app-inventor',
    name: 'MIT App Inventor',
    category: 'AI App Builders',
    description:
      'Block-based visual mobile app builder designed for rapid prototyping and education.',
    url: 'https://appinventor.mit.edu',
    domain: 'appinventor.mit.edu',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'Backend & Hosting',
    description:
      'Zero-config frontend cloud for Vite, React, and Next.js with instant global edge CDN.',
    url: 'https://vercel.com',
    domain: 'vercel.com',
  },
  {
    id: 'replit',
    name: 'Replit',
    category: 'AI App Builders',
    description:
      'Browser-based collaborative IDE and cloud container runtime with instant live URLs.',
    url: 'https://replit.com',
    domain: 'replit.com',
  },
  {
    id: 'bolt-new',
    name: 'Bolt.new',
    category: 'AI App Builders',
    description:
      'Full-stack WebContainers workspace to prompt, run, and deploy web apps in-browser.',
    url: 'https://bolt.new',
    domain: 'bolt.new',
  },
  {
    id: 'v0-vercel',
    name: 'v0 by Vercel',
    category: 'AI App Builders',
    description:
      'Generative UI workbench producing copy-ready React and Tailwind CSS components.',
    url: 'https://v0.dev',
    domain: 'v0.dev',
  },
  {
    id: 'audacity-openvino',
    name: 'Audacity + OpenVINO',
    category: 'Audio & Voice QA',
    description:
      'Free open-source audio editor enhanced with local AI noise suppression and stem tools.',
    url: 'https://www.audacityteam.org',
    domain: 'audacityteam.org',
  },
  {
    id: 'krisp',
    name: 'Krisp Acoustic Check',
    category: 'Audio & Voice QA',
    description:
      'Real-time background noise, echo cancellation, and mic clarity testing for remote calls.',
    url: 'https://krisp.ai',
    domain: 'krisp.ai',
  },
  {
    id: 'jsonlint',
    name: 'JSONLint & Schema Validator',
    category: 'Coding & Validation',
    description:
      'Validate, format, and inspect JSON payloads and structural syntax errors instantly.',
    url: 'https://jsonlint.com',
    domain: 'jsonlint.com',
  },
];

const CATEGORIES: DevToolCategory[] = [
  'All',
  'AI App Builders',
  'Backend & Hosting',
  'Coding & Validation',
  'Audio & Voice QA',
];

function getDevCategoryIcon(category: Exclude<DevToolCategory, 'All'>) {
  switch (category) {
    case 'Backend & Hosting':
      return Cloud;
    case 'Coding & Validation':
      return Terminal;
    case 'Audio & Voice QA':
      return Volume2;
    default:
      return Cpu;
  }
}

const DEV_TOOLS_PHOTO =
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';

export const DevToolsTab: React.FC = () => {
  const [category, setCategory] = useState<DevToolCategory>('All');
  const [query, setQuery] = useState('');

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEV_TOOLS.filter((tool) => {
      if (category !== 'All' && tool.category !== category) return false;
      if (q) {
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [category, query]);

  return (
    <section aria-labelledby="dev-tools-heading" className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#1D4ED8]">
              <Code2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
                Builder Launchpad
              </p>
              <h2
                id="dev-tools-heading"
                className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance"
              >
                Free App Builders &amp; Developer Tools
              </h2>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Curated launchpad of free-tier app builders, cloud hosting platforms, code validators, and remote audio utilities.
          </p>
        </div>

        <div className="relative w-full lg:w-72">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter developer tools..."
            aria-label="Filter developer tools"
            className="input-obsidian h-11 w-full pr-3.5 pl-10 text-sm"
          />
        </div>
      </div>

      {/* Horizontally Scrollable Category Sub-Tab Bar */}
      <div
        role="tablist"
        aria-label="Filter developer tools by category"
        className="flex items-center gap-2 overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade px-1 pb-1"
      >
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={(e) => {
                setCategory(cat);
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
              {cat === 'All' ? `All Tools (${DEV_TOOLS.length})` : cat}
            </button>
          );
        })}
      </div>

      {/* Light SaaS Card Grid with Photo Header */}
      {filteredTools.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
          <p className="text-sm font-medium text-slate-700">
            No tools match "{query}".
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('All');
            }}
            className="mt-4 min-h-[42px] rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF]"
          >
            Show All {DEV_TOOLS.length} Tools
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const CategoryIcon = getDevCategoryIcon(tool.category);

            return (
              <article
                key={tool.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1D4ED8]/40 hover:shadow-lg"
              >
                <div>
                  {/* h-36 Top Photo Header with Dark Gradient Overlay */}
                  <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                    <img
                      src={DEV_TOOLS_PHOTO}
                      alt={tool.name}
                      className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/70 to-[#0F172A]/25" />

                    {/* Badges inside Photo Header */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-slate-900/75 px-3 py-1 font-mono text-[10px] font-bold tracking-wider uppercase text-cyan-200 backdrop-blur-md">
                          <CategoryIcon className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                          <span>{tool.category}</span>
                        </span>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-slate-900/80 p-1.5 backdrop-blur-md shadow-md">
                          <BrandAvatar name={tool.name} domain={tool.domain} variant="dark" />
                        </div>
                      </div>

                      <div>
                        <span className="inline-flex rounded-md border border-white/20 bg-slate-900/75 px-2.5 py-0.5 text-[11px] font-semibold text-slate-100 backdrop-blur-md">
                          {tool.domain}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Light SaaS Card Body */}
                  <div className="p-5">
                    <h3 className="truncate font-display text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-[#1D4ED8]">
                      {tool.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3.5">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
                  >
                    <span>Open Tool</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <AdBanner />
    </section>
  );
};
