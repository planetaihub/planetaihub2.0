import React, { useState } from 'react';
import { ShieldAlert, Scale, Calculator, FileText, Info, BookOpen } from 'lucide-react';

export const LegalInsuranceCalculators: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<'insurance' | 'contractor' | 'contract'>('insurance');

  // 1. Business & Liability Insurance Coverage Estimator
  const [annualRevenue, setAnnualRevenue] = useState<number>(85000);
  const [largestContract, setLargestContract] = useState<number>(25000);
  const [handlesClientData, setHandlesClientData] = useState<boolean>(true);

  const recommendedEoLimit = Math.max(500000, Math.ceil((largestContract * 4) / 250000) * 250000);
  const estimatedAnnualPolicyCost =
    420 + (annualRevenue / 1000) * 3.2 + (handlesClientData ? 240 : 0);
  const recommendedHealthEmergencyBuffer = Math.round((annualRevenue / 12) * 3.5);

  // 2. Contractor vs. W-2 Employee Rate Comparator
  const [targetW2Salary, setTargetW2Salary] = useState<number>(90000);
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState<number>(32);
  const [annualBenefitsValue, setAnnualBenefitsValue] = useState<number>(14000);

  const selfEmploymentTaxBuffer = targetW2Salary * 0.0765;
  const totalEquivalentCompensation = targetW2Salary + annualBenefitsValue + selfEmploymentTaxBuffer;
  const requiredHourlyRate = totalEquivalentCompensation / (billableHoursPerWeek * 48);

  // 3. Contract Late-Fee & IP Buyout Calculator
  const [invoiceAmount, setInvoiceAmount] = useState<number>(4500);
  const [daysOverdue, setDaysOverdue] = useState<number>(30);
  const [monthlyAprPercent, setMonthlyAprPercent] = useState<number>(1.5);
  const [ipMultiplier, setIpMultiplier] = useState<number>(1.35);

  const accruedLateFee = invoiceAmount * (monthlyAprPercent / 100) * (daysOverdue / 30);
  const totalOverdueDue = invoiceAmount + accruedLateFee;
  const ipBuyoutPrice = invoiceAmount * ipMultiplier;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Scale className="w-3.5 h-3.5" /> Freelance & Remote Business Protection Suite • USD
        </div>
        <h3 className="text-xl font-bold text-slate-900">Business Insurance & Legal Contract Estimators</h3>
        <p className="text-sm text-slate-600 mt-1">
          Benchmark Professional Liability (E&amp;O) coverage, convert full-time W-2 salaries into true contractor hourly rates, and calculate late fees or IP buyouts.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'insurance', label: 'Business & Liability Insurance', icon: ShieldAlert },
          { id: 'contractor', label: 'Contractor vs. W-2 Rate', icon: Calculator },
          { id: 'contract', label: 'Late-Fee & IP Buyout', icon: FileText },
        ].map((item) => {
          const Icon = item.icon;
          const active = activeCalc === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveCalc(item.id as 'insurance' | 'contractor' | 'contract')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                active
                  ? 'bg-[#1D4ED8] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {activeCalc === 'insurance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900">Contractor Risk Profile</h4>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Projected Annual Gross Revenue (USD)</span>
                <span className="text-[#1D4ED8]">${annualRevenue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={20000}
                max={500000}
                step={5000}
                value={annualRevenue}
                onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                className="w-full accent-[#1D4ED8]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Largest Single Client Contract</span>
                <span className="text-[#1D4ED8]">${largestContract.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={250000}
                step={2500}
                value={largestContract}
                onChange={(e) => setLargestContract(Number(e.target.value))}
                className="w-full accent-[#1D4ED8]"
              />
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <span className="text-xs font-medium text-slate-700">
                Handle sensitive client data, source code, or AI datasets
              </span>
              <input
                type="checkbox"
                checked={handlesClientData}
                onChange={(e) => setHandlesClientData(e.target.checked)}
                className="w-4 h-4 accent-[#1D4ED8]"
              />
            </label>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="p-4 bg-white rounded-xl border border-blue-200">
              <div className="text-[11px] font-bold uppercase text-[#1D4ED8]">Recommended E&amp;O Liability Limit</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                ${recommendedEoLimit.toLocaleString()} Aggregate
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {handlesClientData
                  ? 'Includes Cyber & Data Breach coverage for remote software and AI roles.'
                  : 'Standard Errors & Omissions protection for consulting and services.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-500">Est. Annual Premium</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  ~${Math.round(estimatedAnnualPolicyCost).toLocaleString()}/yr
                </div>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-500">Health &amp; Income Buffer</div>
                <div className="text-lg font-bold text-emerald-700 mt-0.5">
                  ${recommendedHealthEmergencyBuffer.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeCalc === 'contractor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900">Full-Time W-2 vs. Contractor Inputs</h4>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Comparable Full-Time W-2 Salary</span>
                <span className="text-[#1D4ED8]">${targetW2Salary.toLocaleString()}/yr</span>
              </div>
              <input
                type="range"
                min={30000}
                max={300000}
                step={5000}
                value={targetW2Salary}
                onChange={(e) => setTargetW2Salary(Number(e.target.value))}
                className="w-full accent-[#1D4ED8]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Billable Hours per Week</span>
                <span className="text-[#1D4ED8]">{billableHoursPerWeek} hrs/wk</span>
              </div>
              <input
                type="range"
                min={15}
                max={45}
                step={1}
                value={billableHoursPerWeek}
                onChange={(e) => setBillableHoursPerWeek(Number(e.target.value))}
                className="w-full accent-[#1D4ED8]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Health Insurance &amp; Overhead Value</span>
                <span className="text-[#1D4ED8]">${annualBenefitsValue.toLocaleString()}/yr</span>
              </div>
              <input
                type="range"
                min={3000}
                max={40000}
                step={1000}
                value={annualBenefitsValue}
                onChange={(e) => setAnnualBenefitsValue(Number(e.target.value))}
                className="w-full accent-[#1D4ED8]"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-3">
            <div className="p-4 bg-white rounded-xl border border-blue-200">
Equivalent Contractor Rate

${requiredHourlyRate.toFixed(2)} / hr USD


Includes 48 billable weeks/year (4 weeks PTO), FICA tax offset, and benefits overhead.



Target Gross Annual Billing:
${Math.round(totalEquivalentCompensation).toLocaleString()}/yr



)}
{activeCalc === 'contract' && (


Invoice & IP Ownership Terms
Base Invoice Amount (USD)
<input
type="number"
value={invoiceAmount}
onChange={(e) => setInvoiceAmount(Math.max(0, Number(e.target.value)))}
className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold"
/>


Days Overdue
<input
type="number"
value={daysOverdue}
onChange={(e) => setDaysOverdue(Math.max(0, Number(e.target.value)))}
className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold"
/>

Monthly Late Fee (%)
<input
type="number"
step="0.25"
value={monthlyAprPercent}
onChange={(e) => setMonthlyAprPercent(Math.max(0, Number(e.target.value)))}
className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold"
/>


Exclusive Work-for-Hire IP Buyout Multiplier ({ipMultiplier}x)
<input
type="range"
min={1.1}
max={2.5}
step={0.05}
value={ipMultiplier}
onChange={(e) => setIpMultiplier(Number(e.target.value))}
className="w-full accent-[#1D4ED8]"
/>

Accrued Contractual Late Fee ({daysOverdue} days)
+${accruedLateFee.toFixed(2)} USD

Total Balance Due: ${totalOverdueDue.toFixed(2)} USD



Exclusive IP Buyout Quote
${ipBuyoutPrice.toFixed(2)} USD

Includes +{Math.round((ipMultiplier - 1) * 100)}% surcharge for full underlying rights transfer.




)}
Educational Planning Disclaimer: These calculators provide mathematical benchmarks for independent contractors and remote businesses. They do not constitute formal legal advice, tax preparation, or insurance underwriting.

 Independent Contractor & Business Protection Guide


Pricing Contractor Hourly Rates, Professional Liability Coverage, and Contract Clauses


Independent contractors and remote specialists must factor self-employment taxes, private health coverage, and unpaid time off into their hourly quotes. Pairing a sustainable hourly rate with clear net-15 late-fee terms and $500,000–$1,000,000 in Errors & Omissions (E&O) liability protection helps solo professionals qualify for higher-paying US and European enterprise contracts.



);
};
export default LegalInsuranceCalculators;

---

### Step 2: Replace `src/components/tabs/FinanceDocsTab.tsx` (Complete File)

Now replace **`src/components/tabs/FinanceDocsTab.tsx`** with this complete file so **`Insurance & Legal Estimators`** appears right alongside your 4 existing Finance tools:

```tsx
import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Calculator,
  FileText,
  Receipt,
  Scale,
  Wallet,
} from 'lucide-react';
import { AdBanner } from '../AdBanner';
import { CurrencyConverterTool } from './finance/CurrencyConverterTool';
import { ExpenseTrackerTool } from './finance/ExpenseTrackerTool';
import { InvoiceGeneratorTool } from './finance/InvoiceGeneratorTool';
import { RateCalculatorsTool } from './finance/RateCalculatorsTool';
import { LegalInsuranceCalculators } from './LegalInsuranceCalculators';

type FinanceToolId = 'expenses' | 'calculators' | 'invoice' | 'converter' | 'legal-insurance';

const FINANCE_TOOLS: Array<{
  id: FinanceToolId;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'expenses', label: 'Expense & Budget Tracker', Icon: Receipt },
  { id: 'calculators', label: 'Take-Home & Reverse Rate', Icon: Calculator },
  { id: 'invoice', label: 'Invoice & Quote Generator', Icon: FileText },
  { id: 'converter', label: 'Currency Converter', Icon: ArrowLeftRight },
  { id: 'legal-insurance', label: 'Insurance & Legal Estimators', Icon: Scale },
];

export const FinanceDocsTab: React.FC = () => {
  const [activeTool, setActiveTool] = useState<FinanceToolId>('expenses');

  return (
    <section aria-labelledby="finance-docs-heading" className="space-y-6">
      <div className="no-print border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#1D4ED8]">
            <Wallet className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              USD Contractor Desk
            </p>
            <h2
              id="finance-docs-heading"
              className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance"
            >
              Finance &amp; Documents
            </h2>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          USD-first expense tracking, remote contractor pay calculators, printable PDF/Word/CSV invoicing, offline currency conversion, and business insurance/legal estimators.
        </p>
      </div>

      {/* Horizontally Scrollable Sub-Tab Bar */}
      <div className="no-print w-full max-w-full rounded-2xl border border-slate-200 bg-slate-50 shadow-2xs">
        <div
          role="tablist"
          aria-label="Finance and Document tools"
          className="flex w-full items-center overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade gap-2 px-3 pr-8 py-1.5"
        >
          {FINANCE_TOOLS.map(({ id, label, Icon }) => {
            const isSelected = activeTool === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={(e) => {
                  setActiveTool(id);
                  if (window.innerWidth <= 768) {
                    e.currentTarget.scrollIntoView({
                      behavior: 'smooth',
                      inline: 'center',
                      block: 'nearest',
                    });
                  }
                }}
                className={`snap-center inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap min-h-[38px] rounded-xl px-4 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#1D4ED8] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {activeTool === 'expenses' && <ExpenseTrackerTool />}
        {activeTool === 'calculators' && <RateCalculatorsTool />}
        {activeTool === 'invoice' && <InvoiceGeneratorTool />}
        {activeTool === 'converter' && <CurrencyConverterTool />}
        {activeTool === 'legal-insurance' && <LegalInsuranceCalculators />}
      </div>

      <AdBanner />
    </section>
  );
};
