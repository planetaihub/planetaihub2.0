import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, RotateCcw } from 'lucide-react';
import { readJson, STORAGE_KEYS, writeJson } from '../../../utils/storage';

type CurrencyCode = 'USD' | 'PHP' | 'EUR' | 'GBP' | 'CAD' | 'JPY';

interface CurrencyMeta {
  code: CurrencyCode;
  name: string;
  symbol: string;
}

const CURRENCIES: CurrencyMeta[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
];

// Rates expressed as units per 1 USD
const DEFAULT_RATES_PER_USD: Record<CurrencyCode, number> = {
  USD: 1,
  PHP: 58.5,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.39,
  JPY: 154.2,
};

export const CurrencyConverterTool: React.FC = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [fromCode, setFromCode] = useState<CurrencyCode>('USD');
  const [toCode, setToCode] = useState<CurrencyCode>('PHP');
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(() =>
    readJson<Record<CurrencyCode, number>>(
      STORAGE_KEYS.FINANCE_RATES,
      DEFAULT_RATES_PER_USD
    )
  );

  useEffect(() => {
    writeJson(STORAGE_KEYS.FINANCE_RATES, rates);
  }, [rates]);

  const fromMeta = CURRENCIES.find((c) => c.code === fromCode) || CURRENCIES[0];
  const toMeta = CURRENCIES.find((c) => c.code === toCode) || CURRENCIES[1];

  const convertedAmount = useMemo(() => {
    const usdAmount = amount / Math.max(0.0001, rates[fromCode]);
    return usdAmount * rates[toCode];
  }, [amount, fromCode, toCode, rates]);

  const crossRate = useMemo(
    () => rates[toCode] / Math.max(0.0001, rates[fromCode]),
    [rates, fromCode, toCode]
  );

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Main Converter */}
      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-7">
        <div className="border-b border-slate-200 pb-3.5">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Currency Converter
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Instant conversion with custom editable rates stored offline in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-11">
          <div className="sm:col-span-5">
            <label
              htmlFor="fx-amount"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600"
            >
              Amount ({fromMeta.code})
            </label>
            <input
              id="fx-amount"
              type="number"
              min={0}
              step="any"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 font-mono text-base font-bold text-slate-900 tabular-nums focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
            />
            <select
              aria-label="Source currency"
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value as CurrencyCode)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-white text-slate-900">
                  {c.code} ({c.symbol}) — {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center sm:col-span-1">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap currencies"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#1D4ED8] transition-colors hover:bg-blue-100"
            >
              <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:col-span-5">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Converted ({toMeta.code})
            </span>
            <div className="mt-1.5 flex h-12 w-full items-center rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 font-mono text-base font-bold text-emerald-700 tabular-nums">
              {toMeta.symbol}
              {convertedAmount.toLocaleString(undefined, {
                minimumFractionDigits: toCode === 'JPY' ? 0 : 2,
                maximumFractionDigits: toCode === 'JPY' ? 0 : 2,
              })}
            </div>
            <select
              aria-label="Target currency"
              value={toCode}
              onChange={(e) => setToCode(e.target.value as CurrencyCode)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-white text-slate-900">
                  {c.code} ({c.symbol}) — {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="inline-flex rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 font-mono text-xs font-semibold text-[#1D4ED8] tabular-nums">
          1 {fromCode} = {crossRate.toFixed(4)} {toCode}
        </p>
      </div>

      {/* Editable Reference Rates per 1 USD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900">
              Editable Rates (per 1 USD)
            </h3>
            <p className="text-xs text-slate-600">
              Customize to match your bank or Wise rate.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRates(DEFAULT_RATES_PER_USD)}
            className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {CURRENCIES.filter((c) => c.code !== 'USD').map((c) => (
            <div
              key={c.code}
              className="flex items-center justify-between gap-3"
            >
              <label
                htmlFor={`rate-${c.code}`}
                className="text-xs font-semibold text-slate-700"
              >
                {c.code} ({c.symbol}) · {c.name}
              </label>
              <input
                id={`rate-${c.code}`}
                type="number"
                min={0.0001}
                step="any"
                value={rates[c.code]}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setRates((prev) => ({
                    ...prev,
                    [c.code]: val > 0 ? val : prev[c.code],
                  }));
                }}
                className="h-10 w-28 rounded-lg border border-slate-200 bg-white px-2.5 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
