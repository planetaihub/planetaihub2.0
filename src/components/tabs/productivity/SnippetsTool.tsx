import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ClipboardList,
  Copy,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import { readJson, STORAGE_KEYS, writeJson } from '../../../utils/storage';

interface SnippetItem {
  id: string;
  title: string;
  category: string;
  content: string;
  updatedAt: string;
}

const LEGACY_SNIPPET_IDS = new Set(['snip-1', 'snip-2', 'snip-3']);

function loadInitialSnippets(): SnippetItem[] {
  const saved = readJson<SnippetItem[]>(STORAGE_KEYS.PRODUCTIVITY_SNIPPETS, []);
  if (!Array.isArray(saved) || saved.length === 0) return [];
  if (saved.every((item) => LEGACY_SNIPPET_IDS.has(item.id))) {
    return [];
  }
  return saved;
}

export const SnippetsTool: React.FC = () => {
  const [snippets, setSnippets] = useState<SnippetItem[]>(loadInitialSnippets);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    writeJson(STORAGE_KEYS.PRODUCTIVITY_SNIPPETS, snippets);
  }, [snippets]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const item: SnippetItem = {
      id: `snip-${Date.now()}`,
      title: title.trim(),
      category: category.trim() || 'General',
      content: content.trim(),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setSnippets((prev) => [item, ...prev]);
    setTitle('');
    setCategory('');
    setContent('');
  };

  const handleClearForm = () => {
    setTitle('');
    setCategory('');
    setContent('');
  };

  const handleCopy = async (item: SnippetItem) => {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      // Clipboard blocked
    }
  };

  const handleDelete = (id: string) => {
    setSnippets((prev) => prev.filter((item) => item.id !== id));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return snippets;
    return snippets.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q)
    );
  }, [snippets, search]);

  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-wider text-slate-600';
  const inputClass =
    'mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none';

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {copiedId && (
        <div
          role="status"
          className="fixed right-5 bottom-20 z-50 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-700 shadow-lg md:bottom-6"
        >
          <Check className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          <span>Copied ✓</span>
        </div>
      )}

      {/* Add Snippet Form */}
      <form
        onSubmit={handleAdd}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-5"
      >
        <div className="h-1 w-full bg-[#1D4ED8]" />
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Save New Snippet
            </h2>
            {(title || category || content) && (
              <button
                type="button"
                onClick={handleClearForm}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                <RotateCcw className="h-3 w-3 text-slate-500" aria-hidden="true" />
                <span>Clear Form</span>
              </button>
            )}
          </div>

          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Recruiter Availability Reply"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Group / Label</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. AI Prompt, Links, Outreach"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Text, Prompt, or Link</label>
            <textarea
              rows={5}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste reusable replies, prompts, or profile links here..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#1D4ED8] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1E40AF]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Save Snippet</span>
          </button>
        </div>
      </form>

      {/* Saved Snippets List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-7">
        <div className="h-1 w-full bg-[#1D4ED8]" />
        <div className="space-y-4 p-5">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Saved Snippets ({filtered.length})
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-56">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search snippets..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pr-3 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                />
              </div>
              {snippets.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSnippets([])}
                  className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 whitespace-nowrap"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <ClipboardList
                className="h-7 w-7 text-[#1D4ED8]"
                aria-hidden="true"
              />
              <p className="mt-2.5 text-sm font-semibold text-slate-900">
                {search.trim() ? 'No matching snippets found' : 'No saved snippets yet'}
              </p>
              <p className="mt-1 max-w-xs text-xs text-slate-600">
                Save frequently used links, AI prompts, or standup templates on the left for one-click copying.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-display text-sm font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-600">
                        <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-[#1D4ED8]">
                          {item.category}
                        </span>
                        <span aria-hidden="true" className="mx-1.5 text-slate-400">
                          ·
                        </span>
                        <span className="font-mono text-slate-500 tabular-nums">
                          {item.updatedAt}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(item)}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#1D4ED8] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1E40AF]"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check
                              className="h-3.5 w-3.5 text-white"
                              aria-hidden="true"
                            />
                            <span>Copied ✓</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        aria-label={`Delete ${item.title}`}
                        className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-2.5 whitespace-pre-line font-mono text-xs leading-relaxed text-slate-700">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
