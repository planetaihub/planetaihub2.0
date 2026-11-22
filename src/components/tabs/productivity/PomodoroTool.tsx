import React, { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { readJson, STORAGE_KEYS, writeJson } from '../../../utils/storage';
import { playChime } from '../../../utils/webAudio';

type PomodoroMode = 'focus' | 'short' | 'long';

const MODES: Record<
  PomodoroMode,
  { label: string; seconds: number; hint: string }
> = {
  focus: {
    label: '25m Focus',
    seconds: 25 * 60,
    hint: 'Single-task deep execution block',
  },
  short: {
    label: '5m Short Break',
    seconds: 5 * 60,
    hint: 'Rest eyes, stretch, hydrate',
  },
  long: {
    label: '15m Long Break',
    seconds: 15 * 60,
    hint: 'Step away from screens and recharge',
  },
};

export const PomodoroTool: React.FC = () => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [secondsLeft, setSecondsLeft] = useState<number>(MODES.focus.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [completedFocusCount, setCompletedFocusCount] = useState<number>(() =>
    readJson<number>(STORAGE_KEYS.PRODUCTIVITY_POMODORO, 0)
  );

  useEffect(() => {
    writeJson(STORAGE_KEYS.PRODUCTIVITY_POMODORO, completedFocusCount);
  }, [completedFocusCount]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          playChime('pomodoro');
          if (mode === 'focus') {
            setCompletedFocusCount((c) => c + 1);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isRunning, mode]);

  const selectMode = (nextMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(nextMode);
    setSecondsLeft(MODES[nextMode].seconds);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(MODES[mode].seconds);
  };

  const totalSeconds = MODES[mode].seconds;
  const progress = (totalSeconds - secondsLeft) / totalSeconds;
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  const ringStroke = mode === 'focus' ? '#1D4ED8' : '#059669';

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm lg:col-span-7">
        {/* Mode Switcher */}
        <div className="mx-auto inline-flex items-center gap-1 overflow-x-auto no-scrollbar rounded-xl border border-slate-200 bg-slate-50 p-1">
          {(['focus', 'short', 'long'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => selectMode(m)}
              className={`min-h-[38px] rounded-lg px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                mode === m
                  ? 'bg-[#1D4ED8] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>

        {/* Circular SVG Ring + Countdown */}
        <div className="relative mx-auto mt-6 flex h-56 w-56 items-center justify-center">
          <svg className="h-56 w-56 -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={ringStroke}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 300ms linear',
              }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-4xl font-bold tracking-tight text-slate-900 tabular-nums">
              {mins}:{secs}
            </span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              {MODES[mode].label}
            </span>
          </div>
        </div>

        <p className="mt-2 text-xs text-slate-600">{MODES[mode].hint}</p>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsRunning((r) => !r)}
            className="inline-flex min-h-[44px] min-w-[130px] items-center justify-center gap-2 rounded-full bg-[#1D4ED8] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1E40AF]"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" aria-hidden="true" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" aria-hidden="true" />
                <span>Start</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={() => playChime('pomodoro')}
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
          >
            <Volume2 className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
            <span>Test Chime</span>
          </button>
        </div>
      </div>

      {/* Session Log & Focus Rhythm */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            Session Progress
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Completed 25-minute blocks are saved locally in your browser.
          </p>

          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Completed Focus Sessions
            </p>
            <p className="mt-1 font-mono text-4xl font-bold text-emerald-700 tabular-nums">
              {completedFocusCount}
            </p>
            <p className="mt-1 font-mono text-xs text-slate-600 tabular-nums">
              {completedFocusCount * 25} total focus minutes logged
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCompletedFocusCount(0)}
          className="mt-6 min-h-[44px] w-full rounded-full border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
        >
          Reset Completed Counter
        </button>
      </div>
    </div>
  );
};
