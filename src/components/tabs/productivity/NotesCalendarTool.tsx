import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  StickyNote,
  Trash2,
} from 'lucide-react';
import type { UserNote } from '../../../types';
import { loadUserNotes, saveUserNotes } from '../../../utils/storage';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function loadInitialNotes(): UserNote[] {
  const existing = loadUserNotes();
  if (existing.length === 0) return [];
  if (existing.length === 1 && existing[0].id === 'note-welcome') {
    return [];
  }
  return existing;
}

export const NotesCalendarTool: React.FC = () => {
  const todayIso = toIsoDate(new Date());
  const [viewDate, setViewDate] = useState<Date>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDateIso, setSelectedDateIso] = useState<string>(todayIso);

  const [notes, setNotes] = useState<UserNote[]>(loadInitialNotes);

  const [activeNoteId, setActiveNoteId] = useState<string>(
    () => notes[0]?.id || ''
  );

  useEffect(() => {
    saveUserNotes(notes);
  }, [notes]);

  const activeNote =
    notes.find((n) => n.id === activeNoteId) || notes[0] || null;

  const calendarCells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ day: number | null; iso: string | null }> = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ day: null, iso: null });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`;
      cells.push({ day, iso });
    }
    return cells;
  }, [viewDate]);

  const noteDatesSet = useMemo(
    () => new Set(notes.map((n) => n.updatedAt)),
    [notes]
  );

  const createNote = (forDate = selectedDateIso) => {
    const next: UserNote = {
      id: `note-${Date.now()}`,
      title: '',
      content: '',
      updatedAt: forDate,
    };
    setNotes((prev) => [next, ...prev]);
    setActiveNoteId(next.id);
  };

  const updateActiveNote = (field: 'title' | 'content', value: string) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNote.id
          ? { ...n, [field]: value, updatedAt: selectedDateIso }
          : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const remaining = prev.filter((n) => n.id !== id);
      if (activeNoteId === id) {
        setActiveNoteId(remaining[0]?.id || '');
      }
      return remaining;
    });
  };

  const exportTxt = () => {
    if (!activeNote) return;
    const noteTitle = activeNote.title.trim() || `Note ${activeNote.updatedAt}`;
    const body = `${noteTitle}\nDate: ${activeNote.updatedAt}\n\n${activeNote.content}`;
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${noteTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const monthLabel = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Monthly Interactive Calendar */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-5">
        <div className="h-1 w-full bg-[#1D4ED8]" />
        <div className="p-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
            <h2 className="font-display text-base font-bold text-slate-900">
              {monthLabel}
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setViewDate(
                    (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
                  )
                }
                aria-label="Previous month"
                className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
                  setSelectedDateIso(todayIso);
                }}
                className="min-h-[36px] rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() =>
                  setViewDate(
                    (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)
                  )
                }
                aria-label="Next month"
                className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-500">
            {WEEKDAYS.map((wd) => (
              <div key={wd} className="py-1">
                {wd}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {calendarCells.map((cell, idx) => {
              if (!cell.day || !cell.iso) {
                return <div key={`empty-${idx}`} className="h-10" />;
              }
              const isSelected = cell.iso === selectedDateIso;
              const isToday = cell.iso === todayIso;
              const hasNote = noteDatesSet.has(cell.iso);

              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => setSelectedDateIso(cell.iso!)}
                  className={`relative flex h-10 flex-col items-center justify-center rounded-xl font-mono text-xs font-semibold tabular-nums transition-all ${
                    isSelected
                      ? 'bg-[#1D4ED8] text-white shadow-sm'
                      : isToday
                        ? 'border border-blue-200 bg-blue-50 text-[#1D4ED8]'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{cell.day}</span>
                  {hasNote && (
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 h-1 w-1 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-emerald-600'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                Saved Notes ({notes.length})
              </span>
              <button
                type="button"
                onClick={() => createNote(selectedDateIso)}
                className="inline-flex min-h-[36px] items-center gap-1 rounded-full bg-[#1D4ED8] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1E40AF]"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>New Note</span>
              </button>
            </div>

            {notes.length === 0 ? (
              <p className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">
                No notes saved yet. Click New Note to start.
              </p>
            ) : (
              <div className="mt-3 max-h-48 space-y-1.5 overflow-y-auto">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 transition-colors ${
                      activeNote?.id === n.id
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveNoteId(n.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-xs font-semibold text-slate-900">
                        {n.title || 'Untitled Note'}
                      </p>
                      <p className="font-mono text-[11px] text-slate-500 tabular-nums">
                        {n.updatedAt}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteNote(n.id)}
                      aria-label={`Delete ${n.title || 'Untitled Note'}`}
                      className="inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Local Notepad Editor */}
      <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-7">
        <div className="h-1 w-full bg-[#1D4ED8]" />
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          {activeNote ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                <span className="font-mono text-xs text-slate-600 tabular-nums">
                  Selected Date:{' '}
                  <span className="font-semibold text-[#1D4ED8]">{selectedDateIso}</span> · Saved
                  locally
                </span>
                <button
                  type="button"
                  onClick={exportTxt}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
                >
                  <Download className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Export .txt</span>
                </button>
              </div>

              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateActiveNote('title', e.target.value)}
                placeholder="Note title (e.g. Daily Standup or Role Shortlist)..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-display text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />

              <textarea
                rows={13}
                value={activeNote.content}
                onChange={(e) => updateActiveNote('content', e.target.value)}
                placeholder="Write meeting notes, daily tasks, or scratchpad ideas..."
                className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
              <StickyNote
                className="h-8 w-8 text-[#1D4ED8]"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm font-semibold text-slate-900">
                Create a Note for {selectedDateIso}
              </p>
              <p className="mt-1 max-w-xs text-xs text-slate-600">
                Keep daily checklists, interview prep scratchpads, and private notes stored locally in your browser.
              </p>
              <button
                type="button"
                onClick={() => createNote(selectedDateIso)}
                className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#1D4ED8] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1E40AF]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Create Note</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
