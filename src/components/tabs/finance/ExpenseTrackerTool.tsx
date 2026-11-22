import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Pencil,
  Plus,
  Receipt,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import type { ExpenseEntry } from '../../../types';
import {
  loadExpenses,
  readJson,
  saveExpenses,
  STORAGE_KEYS,
  writeJson,
} from '../../../utils/storage';

interface CurrencyOption {
  code: 'USD' | 'PHP' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'INR';
  symbol: string;
  label: string;
}

const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'PHP', symbol: '₱', label: 'PHP (₱)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'CAD', symbol: '$', label: 'CAD ($)' },
  { code: 'AUD', symbol: '$', label: 'AUD ($)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
];

const EXPENSE_CATEGORIES = [
  'Software & SaaS',
  'Home Office',
  'Equipment',
  'Coworking & Travel',
  'Meals & Client',
  'Taxes & Fees',
  'Other',
];

const BAR_STROKE_PALETTE = [
  { from: '#1d4ed8', to: '#3b82f6', glow: 'rgba(29,78,216,0.22)' },
  { from: '#059669', to: '#10b981', glow: 'rgba(5,150,105,0.22)' },
  { from: '#4f46e5', to: '#6366f1', glow: 'rgba(79,70,229,0.22)' },
  { from: '#0284c7', to: '#0ea5e9', glow: 'rgba(2,132,199,0.22)' },
  { from: '#7c3aed', to: '#8b5cf6', glow: 'rgba(124,58,237,0.2)' },
  { from: '#0d9488', to: '#14b8a6', glow: 'rgba(13,148,136,0.2)' },
  { from: '#475569', to: '#64748b', glow: 'rgba(71,85,105,0.18)' },
];

const LEGACY_SEED_IDS = new Set(['exp-seed-1', 'exp-seed-2', 'exp-seed-3']);

function loadInitialExpenses(): ExpenseEntry[] {
  const stored = loadExpenses();
  if (stored.length === 0) return [];
  if (stored.every((item) => LEGACY_SEED_IDS.has(item.id))) {
    return [];
  }
  return stored;
}

interface BudgetPrefs {
  currencyCode: CurrencyOption['code'];
  monthlyBudget: string;
}

function loadInitialBudgetPrefs(): BudgetPrefs {
  const raw = readJson<{ currencyCode?: CurrencyOption['code']; monthlyBudget?: number | string } | null>(
    STORAGE_KEYS.FINANCE_BUDGET,
    null
  );
  if (!raw) {
    return { currencyCode: 'USD', monthlyBudget: '' };
  }
  const rawBudget =
    raw.monthlyBudget === 1500 || raw.monthlyBudget === undefined
      ? ''
      : String(raw.monthlyBudget);
  return {
    currencyCode: raw.currencyCode || 'USD',
    monthlyBudget: rawBudget,
  };
}

export const ExpenseTrackerTool: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(loadInitialExpenses);
  const [prefs, setPrefs] = useState<BudgetPrefs>(loadInitialBudgetPrefs);

  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [filterCat, setFilterCat] = useState<string>('All');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    writeJson(STORAGE_KEYS.FINANCE_BUDGET, prefs);
  }, [prefs]);

  const activeCurrency = useMemo(
    () =>
      CURRENCIES.find((c) => c.code === prefs.currencyCode) || CURRENCIES[0],
    [prefs.currencyCode]
  );

  const formatMoney = (val: number) =>
    `${activeCurrency.symbol}${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = parseFloat(amount);
    if (!label.trim() || Number.isNaN(numeric) || numeric <= 0) return;

    if (editingId) {
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                label: label.trim(),
                amount: numeric,
                category,
                date,
              }
            : item
        )
      );
      setEditingId(null);
    } else {
      const next: ExpenseEntry = {
        id: `exp-${Date.now()}`,
        label: label.trim(),
        amount: numeric,
        category,
        date,
      };
      setExpenses((prev) => [next, ...prev]);
    }

    setLabel('');
    setAmount('');
  };

  const startEdit = (entry: ExpenseEntry) => {
    setEditingId(entry.id);
    setLabel(entry.label);
    setAmount(String(entry.amount));
    setCategory(entry.category);
    setDate(entry.date);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setLabel('');
    setAmount('');
  };

  const handleDelete = (id: string) => {
    if (editingId === id) cancelEdit();
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const totalSpent = useMemo(
    () => expenses.reduce((sum, item) => sum + item.amount, 0),
    [expenses]
  );

  const monthlyBudgetNum = useMemo(() => {
    const n = parseFloat(prefs.monthlyBudget);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [prefs.monthlyBudget]);

  const remainingBudget = monthlyBudgetNum - totalSpent;
  const budgetPct =
    monthlyBudgetNum > 0
      ? Math.min(100, Math.round((totalSpent / monthlyBudgetNum) * 100))
      : 0;

  const categoryBreakdown = useMemo(() => {
    const totals = new Map<string, number>();
    for (const item of expenses) {
      totals.set(item.category, (totals.get(item.category) || 0) + item.amount);
    }
    return Array.from(totals.entries())
      .map(([cat, sum]) => ({
        category: cat,
        sum,
        pct: totalSpent > 0 ? Math.round((sum / totalSpent) * 100) : 0,
      }))
      .sort((a, b) => b.sum - a.sum);
  }, [expenses, totalSpent]);

  const visibleExpenses = useMemo(() => {
    if (filterCat === 'All') return expenses;
    return expenses.filter((item) => item.category === filterCat);
  }, [expenses, filterCat]);

  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-wider text-slate-600';
  const inputClass =
    'mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none';

  return (
    <div className="space-y-6">
      {/* Top KPI & Multi-Currency Budget Header */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-1 w-full bg-[#1D4ED8]" />
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="expense-currency" className={labelClass}>
              Display Currency
            </label>
            <select
              id="expense-currency"
              value={prefs.currencyCode}
              onChange={(e) =>
                setPrefs((p) => ({
                  ...p,
                  currencyCode: e.target.value as CurrencyOption['code'],
                }))
              }
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-white text-slate-900">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="monthly-budget-input" className={labelClass}>
              Monthly Budget Target ({activeCurrency.code})
            </label>
            <input
              id="monthly-budget-input"
              type="number"
              min={0}
              step="50"
              value={prefs.monthlyBudget}
              onChange={(e) =>
                setPrefs((p) => ({
                  ...p,
                  monthlyBudget: e.target.value,
                }))
              }
              placeholder="e.g. 1500"
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm font-semibold text-slate-900 placeholder:text-slate-400 tabular-nums focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className={labelClass}>Total Logged</p>
            <p className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
              {formatMoney(totalSpent)}
            </p>
            <p className="font-mono text-xs font-medium text-[#1D4ED8] tabular-nums">
              {monthlyBudgetNum > 0
                ? `${budgetPct}% of budget used`
                : `${expenses.length} item${expenses.length === 1 ? '' : 's'} logged`}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
            <p className={labelClass}>Remaining Budget</p>
            <p
              className={`mt-1 font-mono text-xl font-bold tabular-nums ${
                monthlyBudgetNum === 0
                  ? 'text-slate-500'
                  : remainingBudget >= 0
                    ? 'text-emerald-700'
                    : 'text-rose-700'
              }`}
            >
              {monthlyBudgetNum === 0
                ? '—'
                : `${remainingBudget < 0 ? '-' : ''}${formatMoney(
                    Math.abs(remainingBudget)
                  )}`}
            </p>
            <p className="text-xs text-slate-600">
              {monthlyBudgetNum === 0
                ? 'Set a monthly budget target'
                : remainingBudget >= 0
                  ? 'Within target'
                  : 'Over monthly limit'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Add / Edit Transaction + SVG Category Breakdown */}
        <div className="space-y-6 lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="h-0.5 w-full bg-[#1D4ED8]/80" />
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  {editingId ? 'Edit Transaction' : 'Log Expense'}
                </h2>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Cloud hosting or ergonomic keyboard"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>
                    Amount ({activeCurrency.symbol})
                  </label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm text-slate-900 placeholder:text-slate-400 tabular-nums focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                  />
                </div>

                <div>
                  <label className={labelClass}>Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-xs text-slate-900 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-white text-slate-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#1D4ED8] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1E40AF]"
              >
                {editingId ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>Add Expense</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Visual SVG Category Breakdown Bars */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-display text-base font-bold text-slate-900">
              Category Breakdown
            </h3>
            {categoryBreakdown.length === 0 ? (
              <p className="mt-3 text-xs text-slate-500">
                Log expenses to visualize your category breakdown.
              </p>
            ) : (
              <div className="mt-4 space-y-3.5">
                {categoryBreakdown.map((row, idx) => {
                  const palette =
                    BAR_STROKE_PALETTE[idx % BAR_STROKE_PALETTE.length];
                  const gradId = `exp-bar-grad-${idx}`;
                  return (
                    <div key={row.category}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">
                          {row.category}
                        </span>
                        <span className="font-mono text-slate-600 tabular-nums">
                          {formatMoney(row.sum)} ·{' '}
                          <span className="font-semibold text-[#1D4ED8]">{row.pct}%</span>
                        </span>
                      </div>
                      <svg
                        className="mt-1.5 h-2.5 w-full overflow-visible"
                        viewBox="0 0 100 6"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient
                            id={gradId}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor={palette.from} />
                            <stop offset="100%" stopColor={palette.to} />
                          </linearGradient>
                        </defs>
                        <rect
                          x="0"
                          y="0"
                          width="100"
                          height="6"
                          rx="3"
                          fill="#e2e8f0"
                        />
                        <rect
                          x="0"
                          y="0"
                          width={Math.max(2, row.pct)}
                          height="6"
                          rx="3"
                          fill={`url(#${gradId})`}
                          style={{
                            filter: `drop-shadow(0 0 4px ${palette.glow})`,
                            transition: 'width 250ms ease',
                          }}
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Transaction Ledger */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-7">
          <div className="h-0.5 w-full bg-[#1D4ED8]/80" />
          <div className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Transactions ({visibleExpenses.length})
              </h2>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Filter transactions by category"
                  value={filterCat}
                  onChange={(e) => setFilterCat(e.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                >
                  <option value="All" className="bg-white text-slate-900">
                    All Categories
                  </option>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-white text-slate-900">
                      {c}
                    </option>
                  ))}
                </select>
                {expenses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setExpenses([])}
                    className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {visibleExpenses.length === 0 ? (
              <div className="my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                <Receipt className="h-7 w-7 text-[#1D4ED8]" aria-hidden="true" />
                <p className="mt-2.5 text-sm font-semibold text-slate-900">
                  No expenses logged yet
                </p>
                <p className="mt-1 max-w-xs text-xs text-slate-600">
                  Add software tools, office gear, or travel expenses on the left. Everything stays stored locally in your browser.
                </p>
              </div>
            ) : (
              <div className="mt-2 divide-y divide-slate-200">
                {visibleExpenses.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {entry.label}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-[#1D4ED8]">
                          {entry.category}
                        </span>
                        <span aria-hidden="true" className="mx-1.5 text-slate-400">
                          ·
                        </span>
                        <span className="font-mono text-slate-500 tabular-nums">
                          {entry.date}
                        </span>
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                        {formatMoney(entry.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEdit(entry)}
                        aria-label={`Edit ${entry.label}`}
                        className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#1D4ED8]"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        aria-label={`Delete ${entry.label}`}
                        className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
