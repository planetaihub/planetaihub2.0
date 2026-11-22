/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  Calculator,
  RotateCcw,
  TrendingUp,
  ShieldAlert,
  CreditCard,
  DollarSign,
  PieChart,
} from 'lucide-react';

const FEE_PRESETS = [
  { id: 'direct', label: '0% Direct / ACH', feePct: '0' },
  { id: 'wise', label: '2% Wise / Payoneer', feePct: '2' },
  { id: 'paypal', label: '4.4% PayPal', feePct: '4.4' },
];

function parsePositive(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

interface DebtItem {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

export const RateCalculatorsTool: React.FC = () => {
  // Calculator Sub-mode state
  const [activeSubTab, setActiveSubTab] = useState<'income' | 'wealth' | 'debt'>('income');

  // 1. Income & Tax Reserve state
  const [earningsMode, setEarningsMode] = useState<'hourly' | 'monthly'>('hourly');
  const [hourlyRateUsd, setHourlyRateUsd] = useState<string>('45');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  const [monthlyGrossUsd, setMonthlyGrossUsd] = useState<string>('5000');
  const [feePct, setFeePct] = useState<string>('0');
  const [taxReservePct, setTaxReservePct] = useState<string>('15');
  const [exchangeRatePhp, setExchangeRatePhp] = useState<string>('58.5');

  // 2. Compound Wealth & Emergency Fund Simulator state
  const [initialDeposit, setInitialDeposit] = useState<string>('10000');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('1000');
  const [apyPct, setApyPct] = useState<string>('8');
  const [years, setYears] = useState<string>('10');
  const [monthlyExpensesForRunway, setMonthlyExpensesForRunway] = useState<string>('2500');

  // 3. Debt Payoff Accelerator state
  const [debts, setDebts] = useState<DebtItem[]>([
    { id: 'd1', name: 'Credit Card A', balance: 3500, rate: 22.9, minPayment: 120 },
    { id: 'd2', name: 'Personal Loan', balance: 8000, rate: 11.5, minPayment: 250 },
  ]);
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState<string>('300');
  const [newDebtName, setNewDebtName] = useState('');
  const [newDebtBalance, setNewDebtBalance] = useState('');
  const [newDebtRate, setNewDebtRate] = useState('');
  const [newDebtMin, setNewDebtMin] = useState('');

  // Calculations for Income & Tax Reserve
  const incomeCalc = useMemo(() => {
    const fee = Math.min(100, parsePositive(feePct));
    const tax = Math.min(50, parsePositive(taxReservePct));
    const fx = parsePositive(exchangeRatePhp) || 58.5;

    let grossMonthly = 0;
    if (earningsMode === 'hourly') {
      const rate = parsePositive(hourlyRateUsd);
      const hours = parsePositive(hoursPerWeek);
      grossMonthly = rate * hours * 4.33;
    } else {
      grossMonthly = parsePositive(monthlyGrossUsd);
    }

    const feeDeduction = grossMonthly * (fee / 100);
    const afterFeeMonthly = grossMonthly - feeDeduction;
    const taxReserveMonthly = afterFeeMonthly * (tax / 100);
    const netTakeHomeMonthly = afterFeeMonthly - taxReserveMonthly;
    const netTakeHomeAnnual = netTakeHomeMonthly * 12;

    return {
      grossMonthly,
      feeDeduction,
      afterFeeMonthly,
      taxReserveMonthly,
      netTakeHomeMonthly,
      netTakeHomeAnnual,
      netMonthlyPhp: netTakeHomeMonthly * fx,
      netAnnualPhp: netTakeHomeAnnual * fx,
    };
  }, [earningsMode, hourlyRateUsd, hoursPerWeek, monthlyGrossUsd, feePct, taxReservePct, exchangeRatePhp]);

  // Calculations for Compound Wealth & Emergency Fund
  const wealthCalc = useMemo(() => {
    const P = parsePositive(initialDeposit);
    const PMT = parsePositive(monthlyContribution);
    const r = parsePositive(apyPct) / 100 / 12;
    const t = parsePositive(years) * 12;
    const expenses = parsePositive(monthlyExpensesForRunway);

    let futureValue = P;
    let totalContributions = P;

    for (let i = 0; i < t; i++) {
      futureValue = (futureValue + PMT) * (1 + r);
      totalContributions += PMT;
    }

    const totalInterest = Math.max(0, futureValue - totalContributions);
    const emergencyRunwayMonths = expenses > 0 ? (futureValue / expenses).toFixed(1) : '0';

    return {
      futureValue,
      totalContributions,
      totalInterest,
      emergencyRunwayMonths,
    };
  }, [initialDeposit, monthlyContribution, apyPct, years, monthlyExpensesForRunway]);

  // Calculations for Debt Payoff (Snowball vs Avalanche simulation)
  const debtCalc = useMemo(() => {
    const extra = parsePositive(extraMonthlyPayment);
    if (debts.length === 0) {
      return {
        snowballMonths: 0,
        avalancheMonths: 0,
        snowballInterest: 0,
        avalancheInterest: 0,
        interestSaved: 0,
      };
    }

    // Simulate Snowball (smallest balance first) vs Avalanche (highest interest rate first)
    const simulatePayoff = (sortFn: (a: DebtItem, b: DebtItem) => number) => {
      let list = debts.map((d) => ({ ...d, currentBalance: d.balance }));
      let months = 0;
      let totalInterestPaid = 0;

      while (list.some((d) => d.currentBalance > 0) && months < 360) {
        months++;
        let availableExtra = extra;

        // Apply interest and min payments
        for (const d of list) {
          if (d.currentBalance <= 0) continue;
          const interest = (d.currentBalance * (d.rate / 100)) / 12;
          totalInterestPaid += interest;
          d.currentBalance += interest;

          const payment = Math.min(d.currentBalance, d.minPayment);
          d.currentBalance -= payment;
        }

        // Apply extra payment to sorted active debts
        const sorted = [...list].sort(sortFn);
        for (const d of sorted) {
          if (d.currentBalance <= 0 || availableExtra <= 0) continue;
          const applied = Math.min(d.currentBalance, availableExtra);
          d.currentBalance -= applied;
          availableExtra -= applied;
        }
      }
      return { months, totalInterestPaid };
    };

    const snowball = simulatePayoff((a, b) => a.balance - b.balance);
    const avalanche = simulatePayoff((a, b) => b.rate - a.rate);

    const interestSaved = Math.max(0, snowball.totalInterestPaid - avalanche.totalInterestPaid);

    return {
      snowballMonths: snowball.months,
      avalancheMonths: avalanche.months,
      snowballInterest: snowball.totalInterestPaid,
      avalancheInterest: avalanche.totalInterestPaid,
      interestSaved,
    };
  }, [debts, extraMonthlyPayment]);

  const formatUsd = (n: number) =>
    `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatPhp = (n: number) =>
    `₱${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const labelClass = 'block text-[11px] font-semibold uppercase tracking-wider text-slate-600';
  const numberInputClass =
    'mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm font-semibold text-slate-900 placeholder:text-slate-400 tabular-nums transition-colors focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none';

  return (
    <div className="space-y-6">
      {/* Sub-Navigation for Financial Calculators */}
      <div className="flex items-center gap-2 overflow-x-auto scroll-smooth snap-x no-scrollbar pb-1">
        {[
          { id: 'income', label: 'Income & Tax Reserve Calculator', Icon: Calculator },
          { id: 'wealth', label: 'Wealth & Emergency Fund Simulator', Icon: TrendingUp },
          { id: 'debt', label: 'Debt Payoff Accelerator (Snowball vs Avalanche)', Icon: CreditCard },
        ].map((sub) => {
          const Icon = sub.Icon;
          const isActive = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`snap-center shrink-0 inline-flex min-h-[40px] items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Remote Income & Tax Reserve Calculator */}
      {activeSubTab === 'income' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Remote Income &amp; Tax Reserve Calculator
                </h3>
                <p className="text-xs text-slate-600">
                  Calculate gross earnings, platform transfer deductions, quarterly tax reserves, and net take-home pay.
                </p>
              </div>
              <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setEarningsMode('hourly')}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                    earningsMode === 'hourly' ? 'bg-[#1D4ED8] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hourly
                </button>
                <button
                  type="button"
                  onClick={() => setEarningsMode('monthly')}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                    earningsMode === 'monthly' ? 'bg-[#1D4ED8] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly Retainer
                </button>
              </div>
            </div>

            {earningsMode === 'hourly' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Hourly Rate (USD)</label>
                  <input
                    type="number"
                    value={hourlyRateUsd}
                    onChange={(e) => setHourlyRateUsd(e.target.value)}
                    className={numberInputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Hours / Week</label>
                  <input
                    type="number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    className={numberInputClass}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className={labelClass}>Monthly Gross Retainer (USD)</label>
                <input
                  type="number"
                  value={monthlyGrossUsd}
                  onChange={(e) => setMonthlyGrossUsd(e.target.value)}
                  className={numberInputClass}
                />
              </div>
            )}

            <div>
              <span className={labelClass}>Platform Transfer Fee</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {FEE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFeePct(p.feePct)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                      feePct === p.feePct ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white' : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Tax Reserve Provision (%)</label>
                <input
                  type="number"
                  value={taxReservePct}
                  onChange={(e) => setTaxReservePct(e.target.value)}
                  className={numberInputClass}
                />
              </div>
              <div>
                <label className={labelClass}>USD to PHP Exchange Rate</label>
                <input
                  type="number"
                  value={exchangeRatePhp}
                  onChange={(e) => setExchangeRatePhp(e.target.value)}
                  className={numberInputClass}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm lg:col-span-5 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h4 className="font-display text-base font-bold text-emerald-900">Financial Breakdown</h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-emerald-200/60 pb-2">
                  <span className="text-slate-600">Gross Monthly Earnings:</span>
                  <span className="font-mono font-bold text-slate-900">{formatUsd(incomeCalc.grossMonthly)}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-200/60 pb-2">
                  <span className="text-slate-600">Platform Fees Deducted:</span>
                  <span className="font-mono font-bold text-rose-600">-{formatUsd(incomeCalc.feeDeduction)}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-200/60 pb-2">
                  <span className="text-slate-600">Quarterly Tax Reserve (Set Aside):</span>
                  <span className="font-mono font-bold text-amber-700">-{formatUsd(incomeCalc.taxReserveMonthly)}/mo</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-slate-900">Net Monthly Take-Home:</span>
                  <span className="font-mono text-base font-bold text-emerald-700">{formatUsd(incomeCalc.netTakeHomeMonthly)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Equivalent in PHP:</span>
                  <span className="font-mono">{formatPhp(incomeCalc.netMonthlyPhp)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-300 bg-white p-4 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Annual Net Take-Home</p>
              <p className="mt-1 font-mono text-2xl font-bold text-emerald-700">{formatUsd(incomeCalc.netTakeHomeAnnual)}</p>
              <p className="font-mono text-xs text-slate-600">{formatPhp(incomeCalc.netAnnualPhp)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Compound Wealth & Emergency Fund Simulator */}
      {activeSubTab === 'wealth' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7 sm:p-8 space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Compound Wealth &amp; Emergency Fund Simulator
            </h3>
            <p className="text-xs text-slate-600">
              Simulate long-term investing growth and calculate your emergency fund runway in months.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Initial Investment (USD)</label>
                <input
                  type="number"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(e.target.value)}
                  className={numberInputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Monthly Contribution (USD)</label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className={numberInputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Expected Annual Return (APY %)</label>
                <input
                  type="number"
                  step="0.5"
                  value={apyPct}
                  onChange={(e) => setApyPct(e.target.value)}
                  className={numberInputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Time Horizon (Years)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className={numberInputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Monthly Living Expenses (for Emergency Runway)</label>
              <input
                type="number"
                value={monthlyExpensesForRunway}
                onChange={(e) => setMonthlyExpensesForRunway(e.target.value)}
                className={numberInputClass}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 shadow-sm lg:col-span-5 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h4 className="font-display text-base font-bold text-blue-950">Projected Portfolio Growth</h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-blue-200 pb-2">
                  <span className="text-slate-600">Total Contributions:</span>
                  <span className="font-mono font-bold text-slate-900">{formatUsd(wealthCalc.totalContributions)}</span>
                </div>
                <div className="flex justify-between border-b border-blue-200 pb-2">
                  <span className="text-slate-600">Compound Interest Earned:</span>
                  <span className="font-mono font-bold text-emerald-700">{formatUsd(wealthCalc.totalInterest)}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-slate-900">Total Future Value:</span>
                  <span className="font-mono text-xl font-bold text-[#1D4ED8]">{formatUsd(wealthCalc.futureValue)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-blue-300 bg-white p-4 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Emergency Fund Runway</p>
              <p className="mt-1 font-mono text-3xl font-extrabold text-[#1D4ED8]">{wealthCalc.emergencyRunwayMonths} Months</p>
              <p className="text-xs text-slate-600 mt-1">Based on your current portfolio value and monthly expenses.</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Debt Payoff Accelerator (Snowball vs. Avalanche) */}
      {activeSubTab === 'debt' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7 sm:p-8 space-y-5">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Debt Payoff Accelerator (Snowball vs. Avalanche)
            </h3>
            <p className="text-xs text-slate-600">
              Compare paying off smallest balances first (Snowball) vs highest interest rates first (Avalanche).
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Active Debts</span>
                <span className="font-mono text-xs text-slate-500">{debts.length} liabilities</span>
              </div>
              {debts.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{d.name}</span>
                    <span className="ml-2 font-mono text-slate-600">{formatUsd(d.balance)} @ {d.rate}%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDebts((prev) => prev.filter((item) => item.id !== d.id))}
                    className="text-rose-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className={labelClass}>Extra Monthly Debt Payment (USD)</label>
              <input
                type="number"
                value={extraMonthlyPayment}
                onChange={(e) => setExtraMonthlyPayment(e.target.value)}
                className={numberInputClass}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm lg:col-span-5 sm:p-8 space-y-6">
            <h4 className="font-display text-base font-bold text-slate-900">Strategy Comparison</h4>
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                <p className="font-bold text-[#1D4ED8]">Snowball Method (Smallest Balance First)</p>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payoff Timeline:</span>
                  <span className="font-mono font-bold text-slate-900">{debtCalc.snowballMonths} Months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Interest:</span>
                  <span className="font-mono font-bold text-slate-900">{formatUsd(debtCalc.snowballInterest)}</span>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-2">
                <p className="font-bold text-emerald-900">Avalanche Method (Highest Interest First)</p>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payoff Timeline:</span>
                  <span className="font-mono font-bold text-emerald-900">{debtCalc.avalancheMonths} Months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Interest Saved vs Snowball:</span>
                  <span className="font-mono font-bold text-emerald-700">{formatUsd(debtCalc.interestSaved)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
