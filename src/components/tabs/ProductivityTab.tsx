import React, { useState } from 'react';
import {
  Calculator,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  Clock,
  Headphones,
  Timer,
} from 'lucide-react';
import { AdBanner } from '../AdBanner';
import { AmbientSoundTool } from './productivity/AmbientSoundTool';
import { CalculatorTool } from './productivity/CalculatorTool';
import { ClockAlarmTool } from './productivity/ClockAlarmTool';
import { NotesCalendarTool } from './productivity/NotesCalendarTool';
import { PomodoroTool } from './productivity/PomodoroTool';
import { SnippetsTool } from './productivity/SnippetsTool';

type ProductivityToolId =
  | 'clock'
  | 'pomodoro'
  | 'snippets'
  | 'notes'
  | 'ambient'
  | 'calculator';

const PRODUCTIVITY_TOOLS: Array<{
  id: ProductivityToolId;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'clock', label: 'Clock & Alarm', Icon: Clock },
  { id: 'pomodoro', label: 'Pomodoro Timer', Icon: Timer },
  { id: 'snippets', label: 'Quick Snippets', Icon: ClipboardList },
  { id: 'notes', label: 'Notes & Calendar', Icon: CalendarDays },
  { id: 'ambient', label: 'Ambient Sound Machine', Icon: Headphones },
  { id: 'calculator', label: 'Calculator', Icon: Calculator },
];

export const ProductivityTab: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ProductivityToolId>('clock');

  return (
    <section aria-labelledby="productivity-heading" className="space-y-6">
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#1D4ED8]">
            <CheckSquare className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              Deep Work Suite
            </p>
            <h2
              id="productivity-heading"
              className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance"
            >
              Daily Productivity
            </h2>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Six offline-capable focus tools—world clock &amp; alarm, Pomodoro intervals, clipboard snippets, notes calendar, Web Audio ambient synthesizer, and scientific calculator.
        </p>
      </div>

      {/* Horizontally Scrollable Sub-Tab Bar */}
      <div className="w-full max-w-full rounded-2xl border border-slate-200 bg-slate-50 shadow-2xs">
        <div
          role="tablist"
          aria-label="Daily Productivity tools"
          className="flex w-full items-center overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade gap-2 px-3 pr-8 py-1.5"
        >
          {PRODUCTIVITY_TOOLS.map(({ id, label, Icon }) => {
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
        {activeTool === 'clock' && <ClockAlarmTool />}
        {activeTool === 'pomodoro' && <PomodoroTool />}
        {activeTool === 'snippets' && <SnippetsTool />}
        {activeTool === 'notes' && <NotesCalendarTool />}
        {activeTool === 'ambient' && <AmbientSoundTool />}
        {activeTool === 'calculator' && <CalculatorTool />}
      </div>

      <AdBanner />
    </section>
  );
};
