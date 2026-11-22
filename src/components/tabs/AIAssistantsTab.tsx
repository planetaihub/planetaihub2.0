/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  BrainCircuit,
  Code2,
  ExternalLink,
  Globe,
  Mic,
  Search,
  Sparkles,
  Terminal,
  Copy,
  Check,
  FileText,
  Sliders,
  Cpu,
} from 'lucide-react';
import { AdBanner } from '../AdBanner';
import { BrandAvatar, getCompanyMark } from '../BrandAvatar';

type AssistantCategory =
  | 'All'
  | 'General & Reasoning'
  | 'Research & Search'
  | 'Coding & Docs'
  | 'Decks & Audio';

interface AIAssistantTool {
  id: string;
  name: string;
  provider: string;
  category: Exclude<AssistantCategory, 'All'>;
  description: string;
  url: string;
  domain: string;
}

const AI_ASSISTANTS: AIAssistantTool[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    provider: 'Google',
    category: 'General & Reasoning',
    description: 'Multimodal assistant with deep Workspace integration and long-context reasoning.',
    url: 'https://gemini.google.com',
    domain: 'google.com',
  },
  {
    id: 'claude',
    name: 'Claude AI',
    provider: 'Anthropic',
    category: 'General & Reasoning',
    description: 'Thoughtful long-form writing, structured coding artifacts, and nuanced analysis.',
    url: 'https://claude.ai',
    domain: 'anthropic.com',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    provider: 'OpenAI',
    category: 'General & Reasoning',
    description: 'Versatile conversational assistant with free web search, canvas, and voice modes.',
    url: 'https://chatgpt.com',
    domain: 'openai.com',
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    provider: 'Perplexity',
    category: 'Research & Search',
    description: 'Real-time answer engine delivering cited web research and source summaries.',
    url: 'https://www.perplexity.ai',
    domain: 'perplexity.ai',
  },
  {
    id: 'grok',
    name: 'Grok',
    provider: 'xAI',
    category: 'General & Reasoning',
    description: 'Fast conversational assistant with live web context and coding support.',
    url: 'https://grok.com',
    domain: 'x.ai',
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    provider: 'Microsoft',
    category: 'General & Reasoning',
    description: 'Free web-grounded assistant for drafting, image creation, and productivity tasks.',
    url: 'https://copilot.microsoft.com',
    domain: 'microsoft.com',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    provider: 'DeepSeek',
    category: 'Coding & Docs',
    description: 'Open-weight reasoning and code generation chat with step-by-step logic traces.',
    url: 'https://chat.deepseek.com',
    domain: 'deepseek.com',
  },
  {
    id: 'mistral',
    name: 'Mistral Le Chat',
    provider: 'Mistral AI',
    category: 'General & Reasoning',
    description: 'High-speed European assistant supporting web search, code execution, and canvas.',
    url: 'https://chat.mistral.ai',
    domain: 'mistral.ai',
  },
  {
    id: 'huggingchat',
    name: 'HuggingChat',
    provider: 'Hugging Face',
    category: 'Coding & Docs',
    description: 'Free open-source model playground for comparing leading community LLMs.',
    url: 'https://huggingface.co/chat',
    domain: 'huggingface.co',
  },
  {
    id: 'poe',
    name: 'Poe',
    provider: 'Quora',
    category: 'General & Reasoning',
    description: 'Unified multi-model chat hub to switch between top text and coding models.',
    url: 'https://poe.com',
    domain: 'poe.com',
  },
  {
    id: 'notebooklm',
    name: 'Google NotebookLM',
    provider: 'Google',
    category: 'Research & Search',
    description: 'Source-grounded research notebook turning PDFs and notes into study guides and audio.',
    url: 'https://notebooklm.google.com',
    domain: 'google.com',
  },
  {
    id: 'meta-ai',
    name: 'Meta AI',
    provider: 'Meta',
    category: 'General & Reasoning',
    description: 'Free Llama-powered assistant for quick answers, brainstorming, and image generation.',
    url: 'https://www.meta.ai',
    domain: 'meta.ai',
  },
  {
    id: 'phind',
    name: 'Phind',
    provider: 'Phind',
    category: 'Coding & Docs',
    description: 'Developer-focused technical answer engine with live code references and docs.',
    url: 'https://www.phind.com',
    domain: 'phind.com',
  },
  {
    id: 'gamma',
    name: 'Gamma AI',
    provider: 'Gamma',
    category: 'Decks & Audio',
    description: 'Generate structured slide decks, briefs, and one-page web docs from a short outline.',
    url: 'https://gamma.app',
    domain: 'gamma.app',
  },
  {
    id: 'otter',
    name: 'Otter.ai',
    provider: 'Otter',
    category: 'Decks & Audio',
    description: 'Real-time meeting transcription, speaker notes, and searchable action summaries.',
    url: 'https://otter.ai',
    domain: 'otter.ai',
  },
];

const CATEGORIES: AssistantCategory[] = [
  'All',
  'General & Reasoning',
  'Research & Search',
  'Coding & Docs',
  'Decks & Audio',
];

interface BrandTheme {
  backdropClass: string;
  watermarkColor: string;
  pillClass: string;
}

const BRAND_THEMES: Record<string, BrandTheme> = {
  gemini: {
    backdropClass: 'bg-gradient-to-br from-blue-50/80 via-indigo-50/70 to-sky-50',
    watermarkColor: 'text-indigo-600',
    pillClass: 'border-indigo-200 bg-white/95 text-indigo-700',
  },
  claude: {
    backdropClass: 'bg-gradient-to-br from-orange-50/80 via-amber-50/70 to-rose-50/50',
    watermarkColor: 'text-orange-600',
    pillClass: 'border-orange-200 bg-white/95 text-orange-700',
  },
  chatgpt: {
    backdropClass: 'bg-gradient-to-br from-emerald-50/80 via-teal-50/70 to-cyan-50/50',
    watermarkColor: 'text-emerald-600',
    pillClass: 'border-emerald-200 bg-white/95 text-emerald-700',
  },
  perplexity: {
    backdropClass: 'bg-gradient-to-br from-cyan-50/80 via-sky-50/70 to-slate-100/60',
    watermarkColor: 'text-cyan-700',
    pillClass: 'border-cyan-200 bg-white/95 text-cyan-800',
  },
  grok: {
    backdropClass: 'bg-gradient-to-br from-slate-100/80 via-zinc-100/70 to-slate-50',
    watermarkColor: 'text-slate-700',
    pillClass: 'border-slate-300 bg-white/95 text-slate-800',
  },
  copilot: {
    backdropClass: 'bg-gradient-to-br from-sky-50/80 via-blue-50/70 to-teal-50/50',
    watermarkColor: 'text-sky-600',
    pillClass: 'border-sky-200 bg-white/95 text-sky-800',
  },
  deepseek: {
    backdropClass: 'bg-gradient-to-br from-blue-50/80 via-sky-100/60 to-indigo-50/50',
    watermarkColor: 'text-blue-700',
    pillClass: 'border-blue-200 bg-white/95 text-blue-800',
  },
  mistral: {
    backdropClass: 'bg-gradient-to-br from-amber-50/80 via-yellow-50/70 to-orange-100/50',
    watermarkColor: 'text-amber-600',
    pillClass: 'border-amber-200 bg-white/95 text-amber-800',
  },
  huggingchat: {
    backdropClass: 'bg-gradient-to-br from-yellow-50/80 via-amber-50/70 to-orange-50/50',
    watermarkColor: 'text-amber-500',
    pillClass: 'border-amber-200 bg-white/95 text-amber-800',
  },
  poe: {
    backdropClass: 'bg-gradient-to-br from-purple-50/80 via-indigo-50/70 to-violet-50/50',
    watermarkColor: 'text-purple-600',
    pillClass: 'border-purple-200 bg-white/95 text-purple-800',
  },
  notebooklm: {
    backdropClass: 'bg-gradient-to-br from-blue-50/80 via-indigo-50/70 to-sky-50',
    watermarkColor: 'text-blue-600',
    pillClass: 'border-blue-200 bg-white/95 text-blue-800',
  },
  'meta-ai': {
    backdropClass: 'bg-gradient-to-br from-blue-50/80 via-cyan-50/70 to-slate-50',
    watermarkColor: 'text-blue-600',
    pillClass: 'border-blue-200 bg-white/95 text-blue-800',
  },
  phind: {
    backdropClass: 'bg-gradient-to-br from-emerald-50/80 via-teal-50/70 to-slate-50',
    watermarkColor: 'text-emerald-700',
    pillClass: 'border-emerald-200 bg-white/95 text-emerald-800',
  },
  gamma: {
    backdropClass: 'bg-gradient-to-br from-violet-50/80 via-purple-50/70 to-pink-50/50',
    watermarkColor: 'text-violet-600',
    pillClass: 'border-violet-200 bg-white/95 text-violet-800',
  },
  otter: {
    backdropClass: 'bg-gradient-to-br from-blue-50/80 via-sky-50/70 to-teal-50/50',
    watermarkColor: 'text-blue-600',
    pillClass: 'border-blue-200 bg-white/95 text-blue-800',
  },
};

const SOP_BLUEPRINTS = [
  {
    title: 'Inbox Triage SOP',
    content: '1. Label urgent founder emails red.\n2. Archive newsletters to Read Later.\n3. Draft replies for 80% of routine inquiries.\n4. Send EOD summary digest.',
  },
  {
    title: 'RLHF Quality Checklist',
    content: '1. Verify factual accuracy against trusted web citations.\n2. Ensure tone is objective, neutral, and helpful.\n3. Check for logical consistency and edge cases.\n4. Format output cleanly in Markdown.',
  },
  {
    title: 'Client Onboarding Flow',
    content: '1. Send signed contractor agreement & 50% retainer invoice.\n2. Invite client to shared Notion workspace & Slack channel.\n3. Collect secure credentials via 1Password vault.\n4. Schedule kickoff alignment call.',
  },
];

export const AIAssistantsTab: React.FC = () => {
  const [viewMode, setViewMode] = useState<'directory' | 'workbench'>('directory');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<AssistantCategory>('All');

  // Prompt Architect State
  const [promptRole, setPromptRole] = useState('Senior AI Prompt Engineer');
  const [promptContext, setPromptContext] = useState('Building high-precision remote workflow templates');
  const [promptTask, setPromptTask] = useState('Draft comprehensive documentation with step-by-step checklists');
  const [promptConstraints, setPromptConstraints] = useState('Zero markdown errors, concise and actionable, professional tone');
  const [promptOutputFormat, setPromptOutputFormat] = useState('Structured Markdown with bullet points');
  const [promptCopied, setPromptCopied] = useState(false);

  // Token Estimator State
  const [tokenText, setTokenText] = useState('PlanetAI Hub delivers curated remote AI and tech contracts with transparent USD pay.');

  const compiledPrompt = useMemo(() => {
    return `### Role\n${promptRole}\n\n### Context\n${promptContext}\n\n### Task\n${promptTask}\n\n### Constraints\n${promptConstraints}\n\n### Output Format\n${promptOutputFormat}`;
  }, [promptRole, promptContext, promptTask, promptConstraints, promptOutputFormat]);

  const tokenStats = useMemo(() => {
    const chars = tokenText.length;
    const words = tokenText.trim() ? tokenText.trim().split(/\s+/).length : 0;
    // Rough heuristic: ~4 characters per token in English
    const estimatedTokens = Math.ceil(chars / 4);
    const geminiCost = ((estimatedTokens / 1000000) * 0.075).toFixed(5);
    const claudeCost = ((estimatedTokens / 1000000) * 3.0).toFixed(5);
    const gptCost = ((estimatedTokens / 1000000) * 2.5).toFixed(5);

    return { chars, words, estimatedTokens, geminiCost, claudeCost, gptCost };
  }, [tokenText]);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AI_ASSISTANTS.filter((tool) => {
      if (category !== 'All' && tool.category !== category) return false;
      if (q) {
        const haystack = [tool.name, tool.provider, tool.category, tool.description].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query, category]);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(compiledPrompt);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <section aria-labelledby="ai-tools-heading" className="space-y-8 pb-12">
      {/* Header Banner & Mode Switcher */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-[#111827] to-blue-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
              <BrainCircuit className="h-4 w-4 text-blue-400" aria-hidden="true" />
              <span>AI &amp; Automation Workbench</span>
            </div>
            <h1
              id="ai-tools-heading"
              className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              AI Assistants Directory &amp; Zero-API Workbench
            </h1>
            <p className="text-xs text-slate-300 sm:text-sm">
              Explore 15 verified AI assistant portals or utilize our 100% client-side prompt architect, token estimator, and SOP blueprint generator.
            </p>
          </div>

          <div className="flex rounded-xl border border-slate-700 bg-slate-900/80 p-1 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('directory')}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                viewMode === 'directory' ? 'bg-[#1D4ED8] text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              AI Tool Directory
            </button>
            <button
              type="button"
              onClick={() => setViewMode('workbench')}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                viewMode === 'workbench' ? 'bg-[#1D4ED8] text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Zero-API Workbench
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'directory' ? (
        <div className="space-y-6">
          {/* Search & Category Pills */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search AI assistants by name or provider..."
                aria-label="Search AI assistants"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-3.5 pl-10 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scroll-smooth snap-x no-scrollbar pb-1">
              {CATEGORIES.map((cat) => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`snap-center shrink-0 min-h-[38px] rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Tool Cards Grid with Brand Watermarks */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => {
              const theme = BRAND_THEMES[tool.id] ?? {
                backdropClass: 'bg-gradient-to-br from-slate-50 via-white to-slate-100/60',
                watermarkColor: 'text-slate-900',
                pillClass: 'border-slate-200 bg-white/95 text-slate-700',
              };

              return (
                <article
                  key={tool.id}
                  className={`group relative overflow-hidden flex flex-col justify-between rounded-2xl border border-slate-200/90 ${theme.backdropClass} p-5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1D4ED8]/40 hover:shadow-xl`}
                >
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl" aria-hidden="true">
                    <div className={`absolute -bottom-5 -right-5 flex items-center justify-center font-display font-black tracking-tighter select-none text-[110px] leading-none opacity-[0.12] group-hover:opacity-[0.18] transition-opacity duration-300 ${theme.watermarkColor}`}>
                      {getCompanyMark(tool.name)}
                    </div>
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold shadow-2xs ${theme.pillClass}`}>
                        {tool.category}
                      </span>
                      <div className="rounded-xl border border-white/90 bg-white p-2 shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <BrandAvatar name={tool.name} domain={tool.domain} size="sm" variant="light" className="border-0 bg-transparent shadow-none" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-[#1D4ED8] transition-colors">
                        {tool.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-slate-600">{tool.provider}</p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">{tool.description}</p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 border-t border-slate-200/60 pt-4">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#1E40AF]"
                    >
                      <span>Open Assistant Portal</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        /* Zero-API AI & Automation Workbench */
        <div className="space-y-8">
          {/* Tool 1: Prompt Architect */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-[#1D4ED8]">
                <Sliders className="h-5 w-5" />
                <h3 className="font-display text-lg font-bold text-slate-900">Interactive Prompt Architect</h3>
              </div>
              <p className="text-xs text-slate-600">
                Configure role, context, task, and constraints to generate clean, high-precision prompts instantly.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Role / Persona</label>
                <input
                  type="text"
                  value={promptRole}
                  onChange={(e) => setPromptRole(e.target.value)}
                  className="input-obsidian mt-1 h-10 w-full px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Context / Background</label>
                <input
                  type="text"
                  value={promptContext}
                  onChange={(e) => setPromptContext(e.target.value)}
                  className="input-obsidian mt-1 h-10 w-full px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Core Task</label>
                <input
                  type="text"
                  value={promptTask}
                  onChange={(e) => setPromptTask(e.target.value)}
                  className="input-obsidian mt-1 h-10 w-full px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Constraints &amp; Rules</label>
                <input
                  type="text"
                  value={promptConstraints}
                  onChange={(e) => setPromptConstraints(e.target.value)}
                  className="input-obsidian mt-1 h-10 w-full px-3 text-xs"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm lg:col-span-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-base font-bold text-slate-900">Compiled Prompt Output</h4>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                      promptCopied ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-[#1D4ED8] bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                    }`}
                  >
                    {promptCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{promptCopied ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 font-mono text-xs text-slate-800 whitespace-pre-wrap select-all max-h-64 overflow-y-auto">
                  {compiledPrompt}
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Ready to paste directly into Gemini, Claude, or ChatGPT with zero API configuration.
              </p>
            </div>
          </div>

          {/* Tool 2: Token & Context Estimator */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <Cpu className="h-5 w-5" />
                <h3 className="font-display text-lg font-bold text-slate-900">Client-Side LLM Token Estimator</h3>
              </div>
              <p className="text-xs text-slate-600">
                Instant local token counter and estimated API cost comparison across leading LLM providers.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Input Text / Document</label>
                <textarea
                  value={tokenText}
                  onChange={(e) => setTokenText(e.target.value)}
                  rows={4}
                  className="input-obsidian mt-1 w-full p-3 text-xs"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm lg:col-span-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <h4 className="font-display text-base font-bold text-emerald-900">Token &amp; Cost Analysis</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl border border-emerald-200 bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Characters</p>
                    <p className="mt-1 font-mono text-base font-bold text-slate-900">{tokenStats.chars}</p>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Words</p>
                    <p className="mt-1 font-mono text-base font-bold text-slate-900">{tokenStats.words}</p>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Est. Tokens</p>
                    <p className="mt-1 font-mono text-base font-bold text-emerald-700">{tokenStats.estimatedTokens}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-emerald-200 pb-1">
                    <span className="text-slate-600">Est. API Cost (Gemini Flash):</span>
                    <span className="font-mono font-bold text-emerald-800">${tokenStats.geminiCost}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-200 pb-1">
                    <span className="text-slate-600">Est. API Cost (GPT-4o):</span>
                    <span className="font-mono font-bold text-slate-900">${tokenStats.gptCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Est. API Cost (Claude 3.5 Sonnet):</span>
                    <span className="font-mono font-bold text-slate-900">${tokenStats.claudeCost}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tool 3: No-Code Workflow & SOP Blueprint Generator */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-6">
            <h3 className="font-display text-lg font-bold text-slate-900">
              No-Code Workflow &amp; SOP Blueprint Generator
            </h3>
            <p className="text-xs text-slate-600">
              Pre-built, customizable automation templates ready to copy into your Notion workspace or client documentation.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {SOP_BLUEPRINTS.map((bp) => {
                const [copiedBp, setCopiedBp] = useState(false);
                return (
                  <div key={bp.title} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-display text-sm font-bold text-slate-900">{bp.title}</h4>
                      <pre className="font-mono text-[11px] text-slate-600 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                        {bp.content}
                      </pre>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(bp.content);
                          setCopiedBp(true);
                          setTimeout(() => setCopiedBp(false), 2000);
                        } catch {}
                      }}
                      className="inline-flex min-h-[36px] w-full items-center justify-center gap-1.5 rounded-xl bg-[#1D4ED8] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF]"
                    >
                      {copiedBp ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedBp ? 'Copied Blueprint!' : 'Copy SOP Template'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <AdBanner />
    </section>
  );
};
