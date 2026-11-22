import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, Pause, Play, RotateCcw, Trash2 } from 'lucide-react';
import { loadCareerState, saveCareerState } from '../../../utils/storage';

interface ScriptPreset {
  id: string;
  label: string;
  targetSeconds: number;
  text: string;
}

const SCRIPT_PRESETS: ScriptPreset[] = [
  {
    id: 'intro-pitch',
    label: '30s Remote Intro Pitch',
    targetSeconds: 30,
    text: `Hi, I'm [Your Name], a product engineer working across async remote teams. Over the last several years, I have focused on shipping accessible, reliable web software and streamlining engineering workflows. I thrive in environments where clear writing and thoughtful architecture keep distributed teams aligned, and I'd love to bring that same ownership to your team.`,
  },
  {
    id: 'commercial-read',
    label: '45s Warm Commercial Read',
    targetSeconds: 45,
    text: `Great work doesn't always happen in a crowded office. Sometimes your best thinking starts at a quiet desk, with clear goals and tools that stay out of your way. PlanetAI Hub brings transparent remote roles, calm daily planning, and practical offline utilities into one focused space—with zero clutter. Open your workspace and build something meaningful.`,
  },
  {
    id: 'technical-narration',
    label: '60s Technical Demo Narration',
    targetSeconds: 60,
    text: `Welcome to this quick walkthrough of our local-first sync engine. Notice how changes made offline immediately update the interface with zero spinner delay. Every edit is written to browser storage first, queued deterministically, and reconciled automatically once connectivity returns. Next, we'll inspect the conflict resolver and export a clean audit log for your team.`,
  },
];

function loadInitialVoiceScript(): string {
  const saved = loadCareerState<string>('voice', '');
  if (!saved || saved.includes('Jordan Reyes')) {
    return '';
  }
  return saved;
}

function formatTimer(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

interface VoiceSampleToolProps {
  clearSignal?: number;
}

export const VoiceSampleTool: React.FC<VoiceSampleToolProps> = ({
  clearSignal = 0,
}) => {
  const [scriptText, setScriptText] = useState<string>(loadInitialVoiceScript);
  const [targetSeconds, setTargetSeconds] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1.0);
  const [fontSize, setFontSize] = useState<'md' | 'lg' | 'xl'>('lg');
  const [darkStage, setDarkStage] = useState(false);

  const prompterRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const lastClearSignalRef = useRef<number>(clearSignal);

  useEffect(() => {
    saveCareerState('voice', scriptText);
  }, [scriptText]);

  useEffect(() => {
    if (clearSignal > lastClearSignalRef.current) {
      lastClearSignalRef.current = clearSignal;
      setIsPlaying(false);
      setElapsedSeconds(0);
      setScriptText('');
      if (prompterRef.current) {
        prompterRef.current.scrollTop = 0;
      }
    }
  }, [clearSignal]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = timestamp;
      }
      const deltaMs = timestamp - lastFrameRef.current;
      lastFrameRef.current = timestamp;

      const el = prompterRef.current;
      if (el) {
        const pxPerSecond = 28 * scrollSpeed;
        el.scrollTop += (pxPerSecond * deltaMs) / 1000;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
          setIsPlaying(false);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, scrollSpeed]);

  const wordCount = useMemo(() => {
    const trimmed = scriptText.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [scriptText]);

  const estimatedSeconds = wordCount > 0 ? Math.max(1, Math.round((wordCount / 140) * 60)) : 0;

  const handleSelectPreset = (preset: ScriptPreset) => {
    setIsPlaying(false);
    setElapsedSeconds(0);
    setTargetSeconds(preset.targetSeconds);
    setScriptText(preset.text);
    if (prompterRef.current) prompterRef.current.scrollTop = 0;
  };

  const handleResetTimer = () => {
    setIsPlaying(false);
    setElapsedSeconds(0);
    if (prompterRef.current) {
      prompterRef.current.scrollTop = 0;
    }
  };

  const handleClearScript = () => {
    setIsPlaying(false);
    setElapsedSeconds(0);
    setScriptText('');
    if (prompterRef.current) {
      prompterRef.current.scrollTop = 0;
    }
  };

  const fontSizeClass =
    fontSize === 'xl'
      ? 'text-2xl sm:text-3xl leading-relaxed'
      : fontSize === 'lg'
        ? 'text-xl sm:text-2xl leading-relaxed'
        : 'text-base sm:text-lg leading-relaxed';

  return (
    <div className="space-y-5">
      {/* Presets & Stage Controls */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-2xs">
        <div className="h-1 w-full bg-[#1D4ED8]" />
        <div className="space-y-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                Templates:
              </span>
              {SCRIPT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="min-h-[36px] rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#1D4ED8]/40 hover:bg-blue-50 hover:text-[#1D4ED8] whitespace-nowrap shrink-0"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 font-mono text-xs text-[#1D4ED8] tabular-nums">
              <span>{wordCount} words</span>
              <span aria-hidden="true">·</span>
              <span>~{estimatedSeconds}s @ 140 WPM</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-3.5">
            {/* Play / Pause / Reset & Timer */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                disabled={!scriptText.trim()}
                onClick={() => setIsPlaying((p) => !p)}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] disabled:opacity-40 whitespace-nowrap"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" aria-hidden="true" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" aria-hidden="true" />
                    <span>Start Read</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetTimer}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 whitespace-nowrap"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                <span>Rewind</span>
              </button>

              <button
                type="button"
                onClick={handleClearScript}
                disabled={!scriptText}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 disabled:opacity-40 whitespace-nowrap"
              >
                <Trash2 className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                <span>Clear Script</span>
              </button>

              <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-mono text-sm font-bold text-slate-900 tabular-nums">
                <span className={isPlaying ? 'text-emerald-700' : 'text-slate-900'}>
                  {formatTimer(elapsedSeconds)}
                </span>{' '}
                <span className="font-normal text-slate-400">
                  / {formatTimer(targetSeconds)}
                </span>
              </div>
            </div>

            {/* Speed, Font Size & Contrast Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span>Speed</span>
                <input
                  type="range"
                  min={0.5}
                  max={2.5}
                  step={0.25}
                  value={scrollSpeed}
                  onChange={(e) => setScrollSpeed(Number(e.target.value))}
                  className="w-24 accent-[#1D4ED8]"
                />
                <span className="w-9 font-mono text-[#1D4ED8] tabular-nums">
                  {scrollSpeed.toFixed(2)}x
                </span>
              </label>

              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-0.5">
                {(['md', 'lg', 'xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setFontSize(sz)}
                    className={`min-h-[32px] rounded-lg px-2.5 text-xs font-semibold uppercase transition-all ${
                      fontSize === sz
                        ? 'bg-[#1D4ED8] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setDarkStage((d) => !d)}
                className="min-h-[36px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 whitespace-nowrap"
              >
                {darkStage ? 'Light Studio Stage' : 'Dark Studio Stage'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Teleprompter Viewport & Script Editor */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div
          className={`relative rounded-2xl border p-6 shadow-sm lg:col-span-7 ${
            darkStage
              ? 'border-slate-800 bg-[#0F172A] text-white'
              : 'border-slate-200 bg-white text-slate-900'
          }`}
        >
          <div className="mb-3 flex items-center justify-between text-xs">
            <span
              className={`inline-flex items-center gap-1.5 font-semibold ${
                darkStage ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${
                  isPlaying ? 'bg-emerald-500' : 'bg-[#1D4ED8]'
                }`}
              />
              Teleprompter Reader
            </span>
            <span className={darkStage ? 'text-slate-400' : 'text-slate-500'}>
              Scrolls smoothly on Start Read
            </span>
          </div>

          <div
            ref={prompterRef}
            className={`h-72 overflow-y-auto pr-2 font-display font-medium ${fontSizeClass}`}
          >
            {scriptText.trim() ? (
              <p className="whitespace-pre-line py-8">{scriptText}</p>
            ) : (
              <div
                className={`flex h-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center ${
                  darkStage
                    ? 'border-white/15 bg-white/5'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <Mic
                  className={`h-7 w-7 ${
                    darkStage ? 'text-blue-300' : 'text-[#1D4ED8]'
                  }`}
                  aria-hidden="true"
                />
                <p
                  className={`mt-2.5 text-sm font-semibold ${
                    darkStage ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Teleprompter Ready
                </p>
                <p
                  className={`mt-1 max-w-sm text-xs leading-relaxed ${
                    darkStage ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Type or paste your audition script on the right, or select an optional practice template above.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm lg:col-span-5">
          <div className="h-0.5 w-full bg-[#1D4ED8]" />
          <div className="p-5">
            <label
              htmlFor="voice-script-editor"
              className="block font-display text-sm font-bold text-slate-900"
            >
              Audition or Pitch Script
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Updates the teleprompter immediately and saves locally in your browser.
            </p>
            <textarea
              id="voice-script-editor"
              rows={10}
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              placeholder="Paste your voice sample script, interview intro, or narration here..."
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
