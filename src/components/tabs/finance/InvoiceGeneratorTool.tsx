import React, { useEffect, useMemo, useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Plus,
  Printer,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { readJson, STORAGE_KEYS, writeJson } from '../../../utils/storage';

interface LineItem {
  id: string;
  description: string;
  quantity: string;
  rate: string;
}

interface InvoiceState {
  docKind: 'Invoice' | 'Quote';
  currencySymbol: string;
  currencyCode: string;
  docNumber: string;
  issueDate: string;
  dueDate: string;
  fromName: string;
  fromDetails: string;
  toName: string;
  toDetails: string;
  taxEnabled: boolean;
  taxRatePct: number;
  discountEnabled: boolean;
  discountPct: number;
  notes: string;
  items: LineItem[];
}

const INVOICE_CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'PHP', symbol: '₱' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'CAD', symbol: '$' },
  { code: 'AUD', symbol: '$' },
];

const EMPTY_INVOICE: InvoiceState = {
  docKind: 'Invoice',
  currencySymbol: '$',
  currencyCode: 'USD',
  docNumber: '',
  issueDate: new Date().toISOString().slice(0, 10),
  dueDate: '',
  fromName: '',
  fromDetails: '',
  toName: '',
  toDetails: '',
  taxEnabled: false,
  taxRatePct: 10,
  discountEnabled: false,
  discountPct: 5,
  notes: '',
  items: [
    {
      id: 'li-1',
      description: '',
      quantity: '',
      rate: '',
    },
  ],
};

function loadInitialInvoice(): InvoiceState {
  const saved = readJson<Partial<InvoiceState> | null>(
    STORAGE_KEYS.FINANCE_INVOICE,
    null
  );
  if (!saved) return EMPTY_INVOICE;

  if (
    saved.fromName === 'Jordan Reyes Studio' ||
    saved.toName === 'Linearity Labs Inc.'
  ) {
    return EMPTY_INVOICE;
  }

  const normalizedItems: LineItem[] =
    Array.isArray(saved.items) && saved.items.length > 0
      ? saved.items.map((item, idx) => ({
          id: item.id || `li-${idx + 1}`,
          description: typeof item.description === 'string' ? item.description : '',
          quantity:
            item.quantity === undefined || item.quantity === null
              ? ''
              : String(item.quantity),
          rate:
            item.rate === undefined || item.rate === null
              ? ''
              : String(item.rate),
        }))
      : EMPTY_INVOICE.items;

  return {
    ...EMPTY_INVOICE,
    ...saved,
    docKind: saved.docKind === 'Quote' ? 'Quote' : 'Invoice',
    currencySymbol: saved.currencySymbol || '$',
    currencyCode: saved.currencyCode || 'USD',
    docNumber: typeof saved.docNumber === 'string' ? saved.docNumber : '',
    issueDate:
      typeof saved.issueDate === 'string'
        ? saved.issueDate
        : EMPTY_INVOICE.issueDate,
    dueDate: typeof saved.dueDate === 'string' ? saved.dueDate : '',
    fromName: typeof saved.fromName === 'string' ? saved.fromName : '',
    fromDetails: typeof saved.fromDetails === 'string' ? saved.fromDetails : '',
    toName: typeof saved.toName === 'string' ? saved.toName : '',
    toDetails: typeof saved.toDetails === 'string' ? saved.toDetails : '',
    notes: typeof saved.notes === 'string' ? saved.notes : '',
    items: normalizedItems,
  };
}

function toNum(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export const InvoiceGeneratorTool: React.FC = () => {
  const [inv, setInv] = useState<InvoiceState>(loadInitialInvoice);

  useEffect(() => {
    writeJson(STORAGE_KEYS.FINANCE_INVOICE, inv);
  }, [inv]);

  const totals = useMemo(() => {
    const subtotal = inv.items.reduce(
      (sum, item) => sum + toNum(item.quantity) * toNum(item.rate),
      0
    );
    const discountAmount = inv.discountEnabled
      ? subtotal * (Math.max(0, inv.discountPct) / 100)
      : 0;
    const taxable = Math.max(0, subtotal - discountAmount);
    const taxAmount = inv.taxEnabled
      ? taxable * (Math.max(0, inv.taxRatePct) / 100)
      : 0;
    const total = taxable + taxAmount;
    return { subtotal, discountAmount, taxAmount, total };
  }, [inv]);

  const fmt = (val: number) =>
    `${inv.currencySymbol}${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const addLineItem = () => {
    setInv((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `li-${Date.now()}`,
          description: '',
          quantity: '',
          rate: '',
        },
      ],
    }));
  };

  const updateItem = (
    id: string,
    field: keyof LineItem,
    value: string
  ) => {
    setInv((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeItem = (id: string) => {
    setInv((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleClearForm = () => {
    setInv({
      ...EMPTY_INVOICE,
      issueDate: new Date().toISOString().slice(0, 10),
      items: [{ id: `li-${Date.now()}`, description: '', quantity: '', rate: '' }],
    });
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const escapeCsv = (v: string | number) =>
      `"${String(v).replace(/"/g, '""')}"`;

    const rows = [
      [inv.docKind, inv.docNumber, `Currency: ${inv.currencyCode}`],
      ['Issue Date', inv.issueDate, 'Due Date', inv.dueDate],
      ['From', inv.fromName, inv.fromDetails],
      ['Bill To', inv.toName, inv.toDetails],
      [],
      ['Description', 'Quantity', 'Rate', 'Line Total'],
      ...inv.items
        .filter((item) => item.description.trim() || toNum(item.rate) > 0)
        .map((item) => {
          const qty = toNum(item.quantity);
          const rate = toNum(item.rate);
          return [
            item.description,
            qty,
            rate.toFixed(2),
            (qty * rate).toFixed(2),
          ];
        }),
      [],
      ['Subtotal', '', '', totals.subtotal.toFixed(2)],
      ...(inv.discountEnabled
        ? [
            [
              `Discount (${inv.discountPct}%)`,
              '',
              '',
              `-${totals.discountAmount.toFixed(2)}`,
            ],
          ]
        : []),
      ...(inv.taxEnabled
        ? [[`Tax (${inv.taxRatePct}%)`, '', '', totals.taxAmount.toFixed(2)]]
        : []),
      ['Total', '', '', `${inv.currencyCode} ${totals.total.toFixed(2)}`],
    ];

    const csv = rows.map((r) => r.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, `${inv.docNumber || 'document'}.csv`);
  };

  const exportWordDoc = () => {
    const itemRowsHtml = inv.items
      .filter((item) => item.description.trim() || toNum(item.rate) > 0)
      .map((item) => {
        const qty = toNum(item.quantity);
        const rate = toNum(item.rate);
        return `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${item.description}</td>
          <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;">${qty}</td>
          <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;">${fmt(rate)}</td>
          <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;"><strong>${fmt(
            qty * rate
          )}</strong></td>
        </tr>`;
      })
      .join('');

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${inv.docKind} ${inv.docNumber}</title></head>
<body style="font-family:Arial,sans-serif;color:#0f172a;padding:24px;">
  <h1 style="margin:0 0 4px 0;">${inv.docKind.toUpperCase()}${
      inv.docNumber ? ` #${inv.docNumber}` : ''
    }</h1>
  <p style="color:#475569;margin:0 0 20px 0;">Issued: ${inv.issueDate || '—'}${
      inv.dueDate ? ` | Due: ${inv.dueDate}` : ''
    }</p>
  <table style="width:100%;margin-bottom:24px;">
    <tr>
      <td style="vertical-align:top;width:50%;">
        <strong>From:</strong><br/>${inv.fromName}<br/><span style="color:#475569;">${inv.fromDetails}</span>
      </td>
      <td style="vertical-align:top;width:50%;">
        <strong>Bill To:</strong><br/>${inv.toName}<br/><span style="color:#475569;">${inv.toDetails}</span>
      </td>
    </tr>
  </table>
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
    <thead>
      <tr style="background:#f8fafc;">
        <th style="padding:8px;text-align:left;border-bottom:2px solid #0f172a;">Description</th>
        <th style="padding:8px;text-align:right;border-bottom:2px solid #0f172a;">Qty</th>
        <th style="padding:8px;text-align:right;border-bottom:2px solid #0f172a;">Rate</th>
        <th style="padding:8px;text-align:right;border-bottom:2px solid #0f172a;">Amount</th>
      </tr>
    </thead>
    <tbody>${itemRowsHtml}</tbody>
  </table>
  <p style="text-align:right;">Subtotal: ${fmt(totals.subtotal)}</p>
  ${
    inv.discountEnabled
      ? `<p style="text-align:right;">Discount (${inv.discountPct}%): -${fmt(
          totals.discountAmount
        )}</p>`
      : ''
  }
  ${
    inv.taxEnabled
      ? `<p style="text-align:right;">Tax (${inv.taxRatePct}%): ${fmt(
          totals.taxAmount
        )}</p>`
      : ''
  }
  <h2 style="text-align:right;">Total (${inv.currencyCode}): ${fmt(
      totals.total
    )}</h2>
  ${
    inv.notes
      ? `<p style="margin-top:24px;color:#475569;font-size:13px;">${inv.notes}</p>`
      : ''
  }
</body>
</html>`;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    triggerDownload(blob, `${inv.docNumber || 'document'}.doc`);
  };

  const populatedItems = inv.items.filter(
    (item) =>
      item.description.trim() || toNum(item.quantity) > 0 || toNum(item.rate) > 0
  );

  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-wider text-slate-600';
  const compactInputClass =
    'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none';

  return (
    <div className="space-y-5">
      {/* Studio Toolbar */}
      <div className="no-print flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
            {(['Invoice', 'Quote'] as const).map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => setInv((p) => ({ ...p, docKind: kind }))}
                className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  inv.docKind === kind
                    ? 'bg-[#1D4ED8] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {kind}
              </button>
            ))}
          </div>

          <select
            aria-label="Invoice currency"
            value={inv.currencyCode}
            onChange={(e) => {
              const found =
                INVOICE_CURRENCIES.find((c) => c.code === e.target.value) ||
                INVOICE_CURRENCIES[0];
              setInv((p) => ({
                ...p,
                currencyCode: found.code,
                currencySymbol: found.symbol,
              }));
            }}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
          >
            {INVOICE_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-white text-slate-900">
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleClearForm}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            <span>Clear Form</span>
          </button>

          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 whitespace-nowrap"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
            <span>Export Excel (.csv)</span>
          </button>

          <button
            type="button"
            onClick={exportWordDoc}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 whitespace-nowrap"
          >
            <FileText className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
            <span>Export Word (.doc)</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1E40AF] whitespace-nowrap"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Editor */}
        <div className="no-print overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-6">
          <div className="h-1 w-full bg-[#1D4ED8]" />
          <div className="space-y-4 p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Document #</label>
                <input
                  type="text"
                  value={inv.docNumber}
                  onChange={(e) =>
                    setInv((p) => ({ ...p, docNumber: e.target.value }))
                  }
                  placeholder="e.g. INV-2026-001"
                  className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                />
              </div>
              <div>
                <label className={labelClass}>Issue Date</label>
                <input
                  type="date"
                  value={inv.issueDate}
                  onChange={(e) =>
                    setInv((p) => ({ ...p, issueDate: e.target.value }))
                  }
                  className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-xs text-slate-900 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                />
              </div>
              <div>
                <label className={labelClass}>Due Date</label>
                <input
                  type="date"
                  value={inv.dueDate}
                  onChange={(e) =>
                    setInv((p) => ({ ...p, dueDate: e.target.value }))
                  }
                  className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-xs text-slate-900 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className={labelClass}>From (Sender)</label>
                <input
                  type="text"
                  value={inv.fromName}
                  onChange={(e) =>
                    setInv((p) => ({ ...p, fromName: e.target.value }))
                  }
                  placeholder="Your Name / Business"
                  className={compactInputClass}
                />
                <input
                  type="text"
                  value={inv.fromDetails}
                  onChange={(e) =>
                    setInv((p) => ({ ...p, fromDetails: e.target.value }))
                  }
                  placeholder="Email · City / Country"
                  className={compactInputClass}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Bill To (Client)</label>
                <input
                  type="text"
                  value={inv.toName}
                  onChange={(e) =>
                    setInv((p) => ({ ...p, toName: e.target.value }))
                  }
                  placeholder="Client or Company Name"
                  className={compactInputClass}
                />
                <input
                  type="text"
                  value={inv.toDetails}
                  onChange={(e) =>
                    setInv((p) => ({ ...p, toDetails: e.target.value }))
                  }
                  placeholder="Client Email · Address"
                  className={compactInputClass}
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2.5 border-t border-slate-200 pt-3.5">
              <div className="flex items-center justify-between">
                <span className={labelClass}>Line Items</span>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1D4ED8] transition-colors hover:bg-blue-100"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Add Item</span>
                </button>
              </div>

              {inv.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center gap-2"
                >
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, 'description', e.target.value)
                    }
                    placeholder="Service or deliverable description"
                    className="col-span-6 h-10 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.5"
                    aria-label="Quantity"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, 'quantity', e.target.value)
                    }
                    placeholder="Qty"
                    className="col-span-2 h-10 rounded-lg border border-slate-200 bg-white px-2 font-mono text-xs text-slate-900 placeholder:text-slate-400 tabular-nums focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                  />
                  <input
                    type="number"
                    min={0}
                    step="1"
                    aria-label="Unit rate"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(item.id, 'rate', e.target.value)
                    }
                    placeholder="Rate"
                    className="col-span-3 h-10 rounded-lg border border-slate-200 bg-white px-2 font-mono text-xs text-slate-900 placeholder:text-slate-400 tabular-nums focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove line item"
                    disabled={inv.items.length <= 1}
                    className="col-span-1 flex min-h-[40px] items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            {/* Tax & Discount Toggles */}
            <div className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-3.5 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={inv.discountEnabled}
                    onChange={(e) =>
                      setInv((p) => ({
                        ...p,
                        discountEnabled: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[#1D4ED8]"
                  />
                  <span>Discount %</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  disabled={!inv.discountEnabled}
                  value={inv.discountPct}
                  onChange={(e) =>
                    setInv((p) => ({
                      ...p,
                      discountPct: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  className="h-8 w-16 rounded-lg border border-slate-200 bg-white px-2 text-right font-mono text-xs text-slate-900 tabular-nums disabled:opacity-40 focus:border-[#1D4ED8] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={inv.taxEnabled}
                    onChange={(e) =>
                      setInv((p) => ({ ...p, taxEnabled: e.target.checked }))
                    }
                    className="h-4 w-4 accent-[#1D4ED8]"
                  />
                  <span>Tax %</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  disabled={!inv.taxEnabled}
                  value={inv.taxRatePct}
                  onChange={(e) =>
                    setInv((p) => ({
                      ...p,
                      taxRatePct: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  className="h-8 w-16 rounded-lg border border-slate-200 bg-white px-2 text-right font-mono text-xs text-slate-900 tabular-nums disabled:opacity-40 focus:border-[#1D4ED8] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Payment Terms / Notes</label>
              <textarea
                rows={2}
                value={inv.notes}
                onChange={(e) => setInv((p) => ({ ...p, notes: e.target.value }))}
                placeholder="e.g. Payment via bank transfer or Wise within 14 days."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Elevated Crisp White Executive Invoice Sheet */}
        <div className="space-y-3 lg:col-span-6">
          <div className="no-print flex flex-wrap items-center justify-between gap-2 px-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <FileText className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
              <span>Executive {inv.docKind} Sheet</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-[11px] font-semibold text-emerald-700">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-emerald-600"
              />
              A4 Print Ready · Auto-Saved
            </span>
          </div>

          <div
            id="printable-finance-doc"
            className="rounded-xl border border-slate-200 bg-white p-8 font-sans text-slate-900 shadow-lg sm:p-10"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500">
                  {inv.docKind}
                </p>
                {inv.docNumber.trim() ? (
                  <h3 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-950">
                    {inv.docNumber}
                  </h3>
                ) : (
                  <h3 className="no-print mt-0.5 text-2xl font-bold tracking-tight text-slate-300">
                    INV-001
                  </h3>
                )}
              </div>
              <div className="text-right font-mono text-xs text-slate-600 tabular-nums">
                {inv.issueDate && <p>Issued: {inv.issueDate}</p>}
                {inv.dueDate && <p className="mt-0.5">Due: {inv.dueDate}</p>}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
              <div>
                <p className="font-bold uppercase tracking-wider text-slate-400">
                  From
                </p>
                {inv.fromName.trim() ? (
                  <p className="mt-1 text-sm font-bold text-slate-950">
                    {inv.fromName}
                  </p>
                ) : (
                  <p className="no-print mt-1 text-sm font-semibold text-slate-300">
                    Sender Name
                  </p>
                )}
                {inv.fromDetails.trim() && (
                  <p className="mt-0.5 text-slate-600">{inv.fromDetails}</p>
                )}
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider text-slate-400">
                  Bill To
                </p>
                {inv.toName.trim() ? (
                  <p className="mt-1 text-sm font-bold text-slate-950">
                    {inv.toName}
                  </p>
                ) : (
                  <p className="no-print mt-1 text-sm font-semibold text-slate-300">
                    Client Name
                  </p>
                )}
                {inv.toDetails.trim() && (
                  <p className="mt-0.5 text-slate-600">{inv.toDetails}</p>
                )}
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-900 bg-slate-50 text-slate-600">
                    <th className="px-2 py-2 font-bold">Description</th>
                    <th className="px-2 py-2 text-right font-bold">Qty</th>
                    <th className="px-2 py-2 text-right font-bold">Rate</th>
                    <th className="px-2 py-2 text-right font-bold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {populatedItems.length === 0 ? (
                    <tr className="no-print">
                      <td
                        colSpan={4}
                        className="px-2 py-6 text-center text-xs text-slate-400"
                      >
                        Add line items on the left to calculate totals.
                      </td>
                    </tr>
                  ) : (
                    populatedItems.map((item) => {
                      const qty = toNum(item.quantity);
                      const rate = toNum(item.rate);
                      return (
                        <tr key={item.id}>
                          <td className="px-2 py-2.5 pr-3 font-medium text-slate-900">
                            {item.description || 'Item'}
                          </td>
                          <td className="px-2 py-2.5 text-right font-mono tabular-nums">
                            {qty}
                          </td>
                          <td className="px-2 py-2.5 text-right font-mono tabular-nums">
                            {fmt(rate)}
                          </td>
                          <td className="px-2 py-2.5 text-right font-mono font-bold text-slate-950 tabular-nums">
                            {fmt(qty * rate)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col items-end space-y-1.5 border-t border-slate-200 pt-4 text-xs">
              <div className="flex w-56 justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">
                  {fmt(totals.subtotal)}
                </span>
              </div>
              {inv.discountEnabled && (
                <div className="flex w-56 justify-between text-slate-600">
                  <span>Discount ({inv.discountPct}%)</span>
                  <span className="font-mono tabular-nums">
                    -{fmt(totals.discountAmount)}
                  </span>
                </div>
              )}
              {inv.taxEnabled && (
                <div className="flex w-56 justify-between text-slate-600">
                  <span>Tax ({inv.taxRatePct}%)</span>
                  <span className="font-mono tabular-nums">
                    {fmt(totals.taxAmount)}
                  </span>
                </div>
              )}
              <div className="flex w-56 justify-between border-t border-slate-300 pt-2 text-sm font-bold text-slate-950">
                <span>Total ({inv.currencyCode})</span>
                <span className="font-mono text-emerald-700 tabular-nums">
                  {fmt(totals.total)}
                </span>
              </div>
            </div>

            {inv.notes.trim() && (
              <p className="mt-6 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500">
                {inv.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
