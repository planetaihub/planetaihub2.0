import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Check,
  Droplets,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import type { VitalEntry } from '../../../types';
import {
  loadVitals,
  readJson,
  saveVitals,
  STORAGE_KEYS,
  writeJson,
} from '../../../utils/storage';

type UnitSystem = 'metric' | 'imperial';

const VITAL_METRICS = [
  'Calories (kcal)',
  'Blood Sugar (mg/dL)',
  'Cholesterol (mg/dL)',
  'BP / Heart Rate',
  'Weight',
] as const;

interface WaterState {
  date: string;
  ml: number;
}

const LEGACY_VITAL_IDS = new Set(['vit-seed-1', 'vit-seed-2']);

function loadInitialVitals(): VitalEntry[] {
  const existing = loadVitals();
  if (existing.length === 0) return [];
  if (existing.every((item) => LEGACY_VITAL_IDS.has(item.id))) {
    return [];
  }
  return existing;
}

export const BmiVitalsTool: React.FC = () => {
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [weightKg, setWeightKg] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [weightLbs, setWeightLbs] = useState<string>('');
  const [heightFt, setHeightFt] = useState<string>('');
  const [heightIn, setHeightIn] = useState<string>('');

  const todayIso = new Date().toISOString().slice(0, 10);
  const [water, setWater] = useState<WaterState>(() => {
    const saved = readJson<WaterState>(STORAGE_KEYS.HEALTH_WATER, {
      date: todayIso,
      ml: 0,
    });
    return saved.date === todayIso ? saved : { date: todayIso, ml: 0 };
  });

  const [vitals, setVitals] = useState<VitalEntry[]>(loadInitialVitals);
  const [metric, setMetric] = useState<string>(VITAL_METRICS[0]);
  const [valueInput, setValueInput] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    writeJson(STORAGE_KEYS.HEALTH_WATER, water);
  }, [water]);

  useEffect(() => {
    saveVitals(vitals);
  }, [vitals]);

  const bmiData = useMemo(() => {
    let meters = 0;
    let kg = 0;
    let ready = false;

    if (unit === 'metric') {
      const w = parseFloat(weightKg);
      const h = parseFloat(heightCm);
      if (w > 0 && h > 0) {
        meters = h / 100;
        kg = w;
        ready = true;
      }
    } else {
      const w = parseFloat(weightLbs);
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      const totalInches = ft * 12 + inch;
      if (w > 0 && totalInches > 0) {
        meters = totalInches * 0.0254;
        kg = w * 0.45359237;
        ready = true;
      }
    }

    if (!ready || meters <= 0) {
      return {
        ready: false,
        bmi: 0,
        category: 'Enter height & weight',
        toneClass: 'text-slate-500',
        gaugePct: 0,
        healthyRange: '—',
      };
    }

    const bmi = kg / (meters * meters);
    const minHealthyKg = 18.5 * meters * meters;
    const maxHealthyKg = 24.9 * meters * meters;

    let category = 'Healthy Weight';
    let toneClass = 'text-emerald-700';
    if (bmi < 18.5) {
      category = 'Underweight';
      toneClass = 'text-[#1D4ED8]';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      toneClass = 'text-amber-700';
    } else if (bmi >= 30) {
      category = 'Obesity';
      toneClass = 'text-rose-700';
    }

    const gaugePct = Math.min(98, Math.max(2, ((bmi - 14) / (38 - 14)) * 100));

    return {
      ready: true,
      bmi,
      category,
      toneClass,
      gaugePct,
      healthyRange:
        unit === 'metric'
          ? `${minHealthyKg.toFixed(1)} – ${maxHealthyKg.toFixed(1)} kg`
          : `${(minHealthyKg * 2.20462).toFixed(0)} – ${(
              maxHealthyKg * 2.20462
            ).toFixed(0)} lbs`,
    };
  }, [unit, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  const clearBmi = () => {
    setWeightKg('');
    setHeightCm('');
    setWeightLbs('');
    setHeightFt('');
    setHeightIn('');
  };

  const addWaterMl = (delta: number) => {
    setWater((prev) => ({
      date: todayIso,
      ml: Math.max(0, prev.ml + delta),
    }));
  };

  const waterTargetMl = 2000;
  const waterPct = Math.min(100, Math.round((water.ml / waterTargetMl) * 100));
  const waterOz = Math.round(water.ml / 29.5735);

  const handleVitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valueInput.trim()) return;
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');

    if (editingId) {
      setVitals((prev) =>
        prev.map((v) =>
          v.id === editingId
            ? { ...v, metric, value: valueInput.trim(), recordedAt: timestamp }
            : v
        )
      );
      setEditingId(null);
    } else {
      const next: VitalEntry = {
        id: `vit-${Date.now()}`,
        metric,
        value: valueInput.trim(),
        recordedAt: timestamp,
      };
      setVitals((prev) => [next, ...prev]);
    }
    setValueInput('');
  };

  const startEditVital = (item: VitalEntry) => {
    setEditingId(item.id);
    setMetric(item.metric);
    setValueInput(item.value);
  };

  const cancelEditVital = () => {
    setEditingId(null);
    setValueInput('');
  };

  const deleteVital = (id: string) => {
    if (editingId === id) cancelEditVital();
    setVitals((prev) => prev.filter((v) => v.id !== id));
  };

  const valuePlaceholder =
    metric === 'Calories (kcal)'
      ? 'e.g. 1,850 kcal'
      : metric === 'Blood Sugar (mg/dL)'
        ? 'e.g. 96 mg/dL (Fasting)'
        : metric === 'Cholesterol (mg/dL)'
          ? 'e.g. 178 mg/dL Total'
          : metric === 'BP / Heart Rate'
            ? 'e.g. 118/76 mmHg · 68 bpm'
            : 'e.g. 68.2 kg';

  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-wider text-slate-600';
  const numberInputClass =
    'mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm font-semibold text-slate-900 placeholder:text-slate-400 tabular-nums transition-colors focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Interactive BMI Calculator with Visual Scale Gauge */}
        <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-6">
          <div className="h-1 w-full bg-[#1D4ED8]" />
          <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    BMI Calculator
                  </h2>
                  <p className="text-xs text-slate-600">
                    Switch seamlessly between Metric and Imperial units.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {(weightKg || heightCm || weightLbs || heightFt || heightIn) && (
                    <button
                      type="button"
                      onClick={clearBmi}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <RotateCcw className="h-3 w-3 text-slate-500" aria-hidden="true" />
                      <span>Clear</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                    {(['metric', 'imperial'] as const).map((sys) => (
                      <button
                        key={sys}
                        type="button"
                        onClick={() => setUnit(sys)}
                        className={`min-h-[36px] rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-all ${
                          unit === sys
                            ? 'bg-[#1D4ED8] text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {sys}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {unit === 'metric' ? (
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="bmi-weight-kg" className={labelClass}>
                      Weight (kg)
                    </label>
                    <input
                      id="bmi-weight-kg"
                      type="number"
                      min={1}
                      max={400}
                      step="0.5"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      placeholder="e.g. 68"
                      className={numberInputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="bmi-height-cm" className={labelClass}>
                      Height (cm)
                    </label>
                    <input
                      id="bmi-height-cm"
                      type="number"
                      min={50}
                      max={270}
                      step="1"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      placeholder="e.g. 172"
                      className={numberInputClass}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="bmi-weight-lbs" className={labelClass}>
                      Weight (lbs)
                    </label>
                    <input
                      id="bmi-weight-lbs"
                      type="number"
                      min={1}
                      max={800}
                      step="1"
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(e.target.value)}
                      placeholder="e.g. 150"
                      className={numberInputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="bmi-height-ft" className={labelClass}>
                      Feet
                    </label>
                    <input
                      id="bmi-height-ft"
                      type="number"
                      min={2}
                      max={8}
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="e.g. 5"
                      className={numberInputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="bmi-height-in" className={labelClass}>
                      Inches
                    </label>
                    <input
                      id="bmi-height-in"
                      type="number"
                      min={0}
                      max={11}
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="e.g. 8"
                      className={numberInputClass}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className={labelClass}>Your BMI</p>
                  <p className="mt-0.5 font-mono text-3xl font-bold text-slate-900 tabular-nums">
                    {bmiData.ready ? bmiData.bmi.toFixed(1) : '—'}
                  </p>
                  <p className={`text-xs font-semibold ${bmiData.toneClass}`}>
                    {bmiData.category}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className={labelClass}>Healthy Range for Height</p>
                  <p className="mt-0.5 font-mono text-sm font-bold text-slate-900 tabular-nums">
                    {bmiData.healthyRange}
                  </p>
                </div>
              </div>

              {/* Visual Segmented BMI Gauge */}
              <div>
                <div className="relative h-3 w-full overflow-visible rounded-full bg-slate-200">
                  <div className="flex h-full w-full overflow-hidden rounded-full">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: '18.75%' }}
                      title="Underweight (<18.5)"
                    />
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: '26.67%' }}
                      title="Healthy (18.5–24.9)"
                    />
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: '20.83%' }}
                      title="Overweight (25–29.9)"
                    />
                    <div
                      className="h-full bg-rose-500"
                      style={{ width: '33.75%' }}
                      title="Obesity (30+)"
                    />
                  </div>
                  {bmiData.ready && (
                    <div
                      aria-hidden="true"
                      className="absolute top-1/2 h-5 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-900 bg-white shadow-md transition-all duration-300"
                      style={{ left: `${bmiData.gaugePct}%` }}
                    />
                  )}
                </div>
                <div className="mt-1.5 flex justify-between font-mono text-[10px] text-slate-500 tabular-nums">
                  <span>14</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>38+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Water Intake Tracker */}
        <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-6">
          <div className="h-1 w-full bg-[#1D4ED8]" />
          <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <Droplets className="h-5 w-5 text-[#1D4ED8]" aria-hidden="true" />
                  <div>
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Daily Water Intake
                    </h2>
                    <p className="text-xs text-slate-600">
                      Target: 2,000 ml (68 oz) · Saved for {todayIso}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWater({ date: todayIso, ml: 0 })}
                  className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="mt-5 flex items-baseline justify-between">
                <p className="font-mono text-3xl font-bold text-slate-900 tabular-nums">
                  {water.ml.toLocaleString()}{' '}
                  <span className="text-base font-normal text-slate-500">ml</span>
                  <span className="ml-2 text-sm font-medium text-slate-500">
                    ({waterOz} oz)
                  </span>
                </p>
                <span className="font-mono text-xs font-semibold text-emerald-700 tabular-nums">
                  {waterPct}% of daily goal
                </span>
              </div>

              <div className="mt-3 h-3 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#1D4ED8] to-emerald-600 transition-all duration-300"
                  style={{ width: `${waterPct}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => addWaterMl(250)}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1E40AF] whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>+250 ml</span>
              </button>
              <button
                type="button"
                onClick={() => addWaterMl(237)}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>+8 oz</span>
              </button>
              <button
                type="button"
                onClick={() => addWaterMl(-250)}
                disabled={water.ml <= 0}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 disabled:opacity-40 whitespace-nowrap"
              >
                -250 ml
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Vitals Log */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <form
          onSubmit={handleVitalSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-5"
        >
          <div className="h-0.5 w-full bg-[#1D4ED8]/80" />
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="font-display text-lg font-bold text-slate-900">
                {editingId ? 'Edit Vital Entry' : 'Log Health Vital'}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEditVital}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            <div>
              <label className={labelClass}>Metric Type</label>
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              >
                {VITAL_METRICS.map((m) => (
                  <option key={m} value={m} className="bg-white text-slate-900">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Reading / Value</label>
              <input
                type="text"
                required
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                placeholder={valuePlaceholder}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#1D4ED8] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1E40AF]"
            >
              {editingId ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  <span>Update Vital</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>Save Reading Locally</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-7">
          <div className="h-0.5 w-full bg-[#1D4ED8]/80" />
          <div className="p-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Vitals History ({vitals.length})
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Stored in browser</span>
                {vitals.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setVitals([])}
                    className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <RotateCcw className="h-3 w-3 text-slate-500" aria-hidden="true" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {vitals.length === 0 ? (
              <div className="my-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                <Activity
                  className="h-7 w-7 text-[#1D4ED8]"
                  aria-hidden="true"
                />
                <p className="mt-2.5 text-sm font-semibold text-slate-900">
                  No health readings logged yet
                </p>
                <p className="mt-1 max-w-xs text-xs text-slate-600">
                  Log blood pressure, glucose, calories, or weight on the left. All entries stay private in your browser.
                </p>
              </div>
            ) : (
              <div className="mt-2 divide-y divide-slate-200">
                {vitals.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {entry.metric}
                      </p>
                      <p className="font-mono text-xs text-slate-500 tabular-nums">
                        {entry.recordedAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-emerald-700 tabular-nums">
                        {entry.value}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEditVital(entry)}
                        aria-label={`Edit ${entry.metric}`}
                        className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#1D4ED8]"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteVital(entry.id)}
                        aria-label={`Delete ${entry.metric}`}
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
