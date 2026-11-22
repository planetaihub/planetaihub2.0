import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Briefcase,
  Camera,
  Check,
  Copy,
  FileText,
  Globe,
  Mail,
  MapPin,
  Plus,
  Printer,
  RotateCcw,
  Sparkles,
  Trash2,
  User,
  X,
} from 'lucide-react';
import type { CareerPrepPayload } from '../../../utils/careerPrepTemplates';
import { loadCareerState, saveCareerState } from '../../../utils/storage';

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string;
}

interface CareerDocumentState {
  docType: 'resume' | 'cover-letter';
  fullName: string;
  targetTitle: string;
  email: string;
  location: string;
  portfolioUrl: string;
  photoDataUrl: string;
  photoShape: 'circle' | 'rounded';
  summary: string;
  skills: string;
  experiences: ExperienceItem[];
  recipientName: string;
  targetCompany: string;
  coverLetterOpening: string;
  coverLetterBody: string;
  coverLetterClosing: string;
}

const EMPTY_DOC: CareerDocumentState = {
  docType: 'resume',
  fullName: '',
  targetTitle: '',
  email: '',
  location: '',
  portfolioUrl: '',
  photoDataUrl: '',
  photoShape: 'circle',
  summary: '',
  skills: '',
  experiences: [
    {
      id: 'exp-1',
      role: '',
      company: '',
      period: '',
      bullets: '',
    },
  ],
  recipientName: '',
  targetCompany: '',
  coverLetterOpening: '',
  coverLetterBody: '',
  coverLetterClosing: '',
};

const POWER_VERBS = [
  'Architected',
  'Spearheaded',
  'Accelerated',
  'Automated',
  'Reduced latency by',
];

function loadInitialCareerDoc(): CareerDocumentState {
  const saved = loadCareerState<Partial<CareerDocumentState> | null>('doc', null);
  if (!saved) return EMPTY_DOC;

  if (
    saved.fullName === 'Jordan Reyes' &&
    saved.email === 'jordan.reyes@example.com'
  ) {
    return EMPTY_DOC;
  }

  return {
    ...EMPTY_DOC,
    ...saved,
    photoDataUrl: saved.photoDataUrl || '',
    photoShape: saved.photoShape === 'rounded' ? 'rounded' : 'circle',
    experiences:
      Array.isArray(saved.experiences) && saved.experiences.length > 0
        ? saved.experiences
        : EMPTY_DOC.experiences,
  };
}

interface ResumeBuilderToolProps {
  prepPayload?: CareerPrepPayload | null;
  clearSignal?: number;
}

export const ResumeBuilderTool: React.FC<ResumeBuilderToolProps> = ({
  prepPayload,
  clearSignal = 0,
}) => {
  const [doc, setDoc] = useState<CareerDocumentState>(loadInitialCareerDoc);
  const [copied, setCopied] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastAppliedNonceRef = useRef<number | null>(null);
  const lastClearSignalRef = useRef<number>(clearSignal);

  useEffect(() => {
    saveCareerState('doc', doc);
  }, [doc]);

  useEffect(() => {
    if (clearSignal > lastClearSignalRef.current) {
      lastClearSignalRef.current = clearSignal;
      setPhotoError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setDoc({
        ...EMPTY_DOC,
        experiences: [
          {
            id: `exp-${Date.now()}`,
            role: '',
            company: '',
            period: '',
            bullets: '',
          },
        ],
      });
    }
  }, [clearSignal]);

  useEffect(() => {
    if (!prepPayload?.resume || lastAppliedNonceRef.current === prepPayload.nonce) {
      return;
    }
    lastAppliedNonceRef.current = prepPayload.nonce;
    const {
      targetTitle,
      targetCompany,
      summary,
      skills,
      experienceRole,
      experienceBullets,
    } = prepPayload.resume;

    setDoc((prev) => {
      const updatedExperiences =
        prev.experiences.length > 0
          ? prev.experiences.map((exp, idx) =>
              idx === 0
                ? {
                    ...exp,
                    role: experienceRole || exp.role || targetTitle,
                    bullets: experienceBullets || exp.bullets,
                  }
                : exp
            )
          : [
              {
                id: 'exp-1',
                role: experienceRole || targetTitle,
                company: '',
                period: '',
                bullets: experienceBullets || '',
              },
            ];

      return {
        ...prev,
        docType: 'resume',
        targetTitle,
        targetCompany,
        summary,
        skills,
        experiences: updatedExperiences,
      };
    });
  }, [prepPayload]);

  const updateField = <K extends keyof CareerDocumentState>(
    field: K,
    value: CareerDocumentState[K]
  ) => {
    setDoc((prev) => ({ ...prev, [field]: value }));
  };

  const updateExperience = (
    id: string,
    field: keyof ExperienceItem,
    value: string
  ) => {
    setDoc((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addExperience = () => {
    setDoc((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: `exp-${Date.now()}`,
          role: '',
          company: '',
          period: '',
          bullets: '',
        },
      ],
    }));
  };

  const removeExperience = (id: string) => {
    setDoc((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  const appendBulletChip = (expId: string, chip: string) => {
    setDoc((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        const trimmed = exp.bullets.trim();
        const addition = `${chip} `;
        return {
          ...exp,
          bullets: trimmed ? `${trimmed}\n${addition}` : addition,
        };
      }),
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose a PNG, JPG, or WebP image file.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setPhotoError('Please select an image smaller than 4 MB.');
      return;
    }
    setPhotoError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('photoDataUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoError('');
    updateField('photoDataUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearForm = () => {
    setPhotoError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setDoc((prev) => ({
      ...EMPTY_DOC,
      docType: prev.docType,
      experiences: [
        {
          id: `exp-${Date.now()}`,
          role: '',
          company: '',
          period: '',
          bullets: '',
        },
      ],
    }));
  };

  const buildPlainText = (): string => {
    const contactLine = [doc.email, doc.location, doc.portfolioUrl]
      .filter((s) => s.trim().length > 0)
      .join(' | ');
    const header = [doc.fullName, doc.targetTitle, contactLine]
      .filter((s) => s.trim().length > 0)
      .join('\n');

    if (doc.docType === 'cover-letter') {
      const greeting = `Dear ${doc.recipientName.trim() || 'Hiring Team'}${
        doc.targetCompany.trim() ? ` at ${doc.targetCompany.trim()}` : ''
      },`;
      return [
        header,
        header ? '' : null,
        greeting,
        '',
        doc.coverLetterOpening,
        doc.coverLetterBody ? `\n${doc.coverLetterBody}` : null,
        doc.coverLetterClosing ? `\n${doc.coverLetterClosing}` : null,
        '',
        'Sincerely,',
        doc.fullName,
      ]
        .filter((part): part is string => part !== null)
        .join('\n');
    }

    const expText = doc.experiences
      .filter(
        (exp) =>
          exp.role.trim() ||
          exp.company.trim() ||
          exp.period.trim() ||
          exp.bullets.trim()
      )
      .map((exp) => {
        const lines = exp.bullets
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => `- ${l}`)
          .join('\n');
        const heading = [exp.role, exp.company].filter(Boolean).join(' — ');
        const periodSuffix = exp.period ? ` (${exp.period})` : '';
        return `${heading}${periodSuffix}${lines ? `\n${lines}` : ''}`;
      })
      .join('\n\n');

    return [
      header,
      doc.summary.trim() ? `\nSUMMARY\n${doc.summary.trim()}` : '',
      expText ? `\nEXPERIENCE\n${expText}` : '',
      doc.skills.trim() ? `\nSKILLS\n${doc.skills.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const atsAnalysis = useMemo(() => {
    let score = 0;
    const identityFields = [
      doc.fullName,
      doc.targetTitle,
      doc.email,
      doc.location,
      doc.portfolioUrl,
    ].filter((v) => v.trim().length > 2).length;
    score += Math.min(25, identityFields * 5);

    if (doc.docType === 'resume') {
      if (doc.summary.trim().length >= 100) score += 20;
      else if (doc.summary.trim().length >= 30) score += 10;

      const allBullets = doc.experiences
        .flatMap((e) => e.bullets.split('\n'))
        .map((b) => b.trim())
        .filter(Boolean);
      const metricBullets = allBullets.filter((b) => /\d+|%|\$/.test(b)).length;
      if (allBullets.length >= 3) score += 20;
      else if (allBullets.length >= 1) score += 10;
      if (metricBullets >= 2) score += 20;
      else if (metricBullets === 1) score += 10;

      const skillCount = doc.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean).length;
      if (skillCount >= 5) score += 15;
      else if (skillCount >= 2) score += 8;
    } else {
      if (doc.recipientName.trim() || doc.targetCompany.trim()) score += 15;
      if (doc.coverLetterOpening.trim().length >= 60) score += 20;
      if (doc.coverLetterBody.trim().length >= 80) score += 25;
      if (doc.coverLetterClosing.trim().length >= 30) score += 15;
    }

    const clamped = Math.min(100, Math.max(0, score));
    const status =
      clamped === 0
        ? 'Empty Draft'
        : clamped >= 85
          ? 'Strong'
          : clamped >= 50
            ? 'In Progress'
            : 'Needs Detail';
    return { score: clamped, status };
  }, [doc]);

  const wordCount = useMemo(() => {
    const rawParts =
      doc.docType === 'resume'
        ? [
            doc.fullName,
            doc.targetTitle,
            doc.summary,
            doc.skills,
            ...doc.experiences.map(
              (e) => `${e.role} ${e.company} ${e.period} ${e.bullets}`
            ),
          ]
        : [
            doc.fullName,
            doc.targetTitle,
            doc.recipientName,
            doc.targetCompany,
            doc.coverLetterOpening,
            doc.coverLetterBody,
            doc.coverLetterClosing,
          ];
    const combined = rawParts.join(' ').trim();
    return combined ? combined.split(/\s+/).length : 0;
  }, [doc]);

  const handleCopyText = async () => {
    const text = buildPlainText().trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const labelClass =
    'flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600';
  const inputClass =
    'mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none';
  const textareaClass =
    'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none';

  const hasPopulatedExperience = doc.experiences.some(
    (exp) =>
      exp.role.trim() ||
      exp.company.trim() ||
      exp.period.trim() ||
      exp.bullets.trim()
  );

  const hasHeaderContent = Boolean(
    doc.fullName.trim() ||
      doc.targetTitle.trim() ||
      doc.email.trim() ||
      doc.location.trim() ||
      doc.portfolioUrl.trim() ||
      doc.photoDataUrl
  );

  return (
    <div className="space-y-5">
      {/* Copied Toast Notification */}
      {copied && (
        <div
          role="status"
          className="no-print fixed right-5 bottom-20 z-50 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-700 shadow-lg md:bottom-6"
        >
          <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          <span>Copied ✓</span>
        </div>
      )}

      {/* Floating Studio Toolbar */}
      <div className="no-print flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-2xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented Document Mode Toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => updateField('docType', 'resume')}
              className={`min-h-[36px] rounded-lg px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                doc.docType === 'resume'
                  ? 'bg-[#1D4ED8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resume Builder
            </button>
            <button
              type="button"
              onClick={() => updateField('docType', 'cover-letter')}
              className={`min-h-[36px] rounded-lg px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                doc.docType === 'cover-letter'
                  ? 'bg-[#1D4ED8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cover Letter
            </button>
          </div>

          {/* Live ATS Readability & Completeness Meter */}
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
            <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  atsAnalysis.score >= 85
                    ? 'bg-emerald-600'
                    : 'bg-[#1D4ED8]'
                }`}
                style={{ width: `${atsAnalysis.score}%` }}
              />
            </div>
            <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums whitespace-nowrap">
              Completeness:{' '}
              <span
                className={
                  atsAnalysis.score >= 85 ? 'text-emerald-700' : 'text-[#1D4ED8]'
                }
              >
                {atsAnalysis.score}%
              </span>{' '}
              <span className="text-slate-400">·</span>{' '}
              <span className="text-slate-600">{atsAnalysis.status}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleClearForm}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            <span>Clear Form</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                <span className="text-emerald-700">Copied ✓</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Export / Print PDF</span>
          </button>
        </div>
      </div>

      {/* Split Workspace: Light SaaS Form Editor + Crisp White Paper Document Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left: Light SaaS Editor */}
        <div className="no-print overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm lg:col-span-6">
          <div className="h-1 w-full bg-[#1D4ED8]" />
          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  {doc.docType === 'resume'
                    ? 'Resume Details'
                    : 'Cover Letter Details'}
                </h3>
                <p className="text-xs text-slate-500">
                  Clean ATS-ready structure · Saved automatically in your browser
                </p>
              </div>
              <span className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#1D4ED8] tabular-nums">
                {wordCount} words
              </span>
            </div>

            {/* Optional Profile Photo Upload (Resume Mode) */}
            {doc.docType === 'resume' && (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    {doc.photoDataUrl ? (
                      <img
                        src={doc.photoDataUrl}
                        alt="Uploaded profile"
                        className={`h-12 w-12 shrink-0 border border-slate-200 object-cover ${
                          doc.photoShape === 'circle'
                            ? 'rounded-full'
                            : 'rounded-xl'
                        }`}
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-blue-50 text-[#1D4ED8]">
                        <Camera className="h-5 w-5" aria-hidden="true" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        Profile Photo (Optional)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Processed locally in your browser · Included in PDF export
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      aria-label="Upload profile photo"
                      className="sr-only"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] transition-colors hover:bg-blue-100"
                    >
                      <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {doc.photoDataUrl ? 'Change Photo' : 'Upload Photo'}
                      </span>
                    </button>

                    {doc.photoDataUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Photo Shape Toggle */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <span className="text-[11px] font-medium text-slate-500">
                    Photo Frame Shape
                  </span>
                  <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-0.5">
                    {(
                      [
                        { id: 'circle', label: 'Circle' },
                        { id: 'rounded', label: 'Rounded Square' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateField('photoShape', opt.id)}
                        className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${
                          doc.photoShape === opt.id
                            ? 'bg-[#1D4ED8] text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {photoError && (
                  <p className="mt-2 text-xs text-rose-600">{photoError}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  <User className="h-3 w-3 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={doc.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <Briefcase className="h-3 w-3 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Target Role Title</span>
                </label>
                <input
                  type="text"
                  value={doc.targetTitle}
                  onChange={(e) => updateField('targetTitle', e.target.value)}
                  placeholder="e.g. Senior AI & Product Engineer"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <Mail className="h-3 w-3 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={doc.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@domain.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <Globe className="h-3 w-3 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Portfolio / GitHub</span>
                </label>
                <input
                  type="text"
                  value={doc.portfolioUrl}
                  onChange={(e) => updateField('portfolioUrl', e.target.value)}
                  placeholder="github.com/yourhandle"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  <MapPin className="h-3 w-3 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Location &amp; Timezone Overlap</span>
                </label>
                <input
                  type="text"
                  value={doc.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="e.g. Remote · UTC+8 (Americas / EMEA Overlap)"
                  className={inputClass}
                />
              </div>
            </div>

            {doc.docType === 'resume' ? (
              <>
                <div className="border-t border-slate-200 pt-4">
                  <label className={labelClass}>
                    <Sparkles className="h-3 w-3 text-[#1D4ED8]" aria-hidden="true" />
                    <span>Executive Summary</span>
                  </label>
                  <textarea
                    rows={3}
                    value={doc.summary}
                    onChange={(e) => updateField('summary', e.target.value)}
                    placeholder="Summarize your core experience, technical specialties, and measurable remote impact in 2–3 concise sentences..."
                    className={textareaClass}
                  />
                </div>

                <div className="space-y-3 border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className={labelClass}>
                      <Briefcase className="h-3 w-3 text-[#1D4ED8]" aria-hidden="true" />
                      <span>Experience History</span>
                    </span>
                    <button
                      type="button"
                      onClick={addExperience}
                      className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1D4ED8] transition-colors hover:bg-blue-100"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Add Role</span>
                    </button>
                  </div>

                  {doc.experiences.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#1D4ED8]">
                          Role 0{idx + 1}
                        </span>
                        {doc.experiences.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExperience(exp.id)}
                            aria-label={`Remove experience ${idx + 1}`}
                            className="inline-flex min-h-[30px] min-w-[30px] items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) =>
                            updateExperience(exp.id, 'role', e.target.value)
                          }
                          placeholder="Role Title"
                          className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(exp.id, 'company', e.target.value)
                          }
                          placeholder="Company"
                          className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) =>
                            updateExperience(exp.id, 'period', e.target.value)
                          }
                          placeholder="e.g. 2023 – Present"
                          className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2.5 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                        />
                      </div>

                      <textarea
                        rows={3}
                        value={exp.bullets}
                        onChange={(e) =>
                          updateExperience(exp.id, 'bullets', e.target.value)
                        }
                        placeholder="Add one quantified achievement per line (e.g. Reduced API latency by 35%...)"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                      />

                      {/* Quick Action Verb Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Insert Verb:
                        </span>
                        {POWER_VERBS.map((verb) => (
                          <button
                            key={verb}
                            type="button"
                            onClick={() => appendBulletChip(exp.id, verb)}
                            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 transition-colors hover:border-[#1D4ED8]/40 hover:bg-blue-50 hover:text-[#1D4ED8]"
                          >
                            + {verb}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <label className={labelClass}>
                    <span>Core Skills (comma-separated)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={doc.skills}
                    onChange={(e) => updateField('skills', e.target.value)}
                    placeholder="e.g. TypeScript, React, Tailwind CSS, Python, Prompt Evaluation, PostgreSQL"
                    className={textareaClass}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4 border-t border-slate-200 pt-4">
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      <span>Recipient / Hiring Manager</span>
                    </label>
                    <input
                      type="text"
                      value={doc.recipientName}
                      onChange={(e) =>
                        updateField('recipientName', e.target.value)
                      }
                      placeholder="e.g. Hiring Team or Manager Name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      <span>Target Company</span>
                    </label>
                    <input
                      type="text"
                      value={doc.targetCompany}
                      onChange={(e) =>
                        updateField('targetCompany', e.target.value)
                      }
                      placeholder="e.g. Anthropic"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    <span>Opening Hook</span>
                  </label>
                  <textarea
                    rows={3}
                    value={doc.coverLetterOpening}
                    onChange={(e) =>
                      updateField('coverLetterOpening', e.target.value)
                    }
                    placeholder="State the role you are applying for and why the company's mission or product aligns with your background..."
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <span>Evidence &amp; Remote Fit Paragraph</span>
                  </label>
                  <textarea
                    rows={4}
                    value={doc.coverLetterBody}
                    onChange={(e) =>
                      updateField('coverLetterBody', e.target.value)
                    }
                    placeholder="Highlight 1–2 concrete projects, measurable outcomes, and your async collaboration strengths..."
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <span>Closing Call to Action</span>
                  </label>
                  <textarea
                    rows={2}
                    value={doc.coverLetterClosing}
                    onChange={(e) =>
                      updateField('coverLetterClosing', e.target.value)
                    }
                    placeholder="Thank the team for reviewing your application and express interest in discussing next steps..."
                    className={textareaClass}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live High-Contrast Crisp White A4 Paper Document Preview */}
        <div className="space-y-3 lg:col-span-6 lg:sticky lg:top-24">
          <div className="no-print flex flex-wrap items-center justify-between gap-2 px-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <FileText className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
              <span>
                {doc.docType === 'resume'
                  ? 'Live Resume Preview'
                  : 'Live Cover Letter Preview'}
              </span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Copy className="h-3 w-3 text-[#1D4ED8]" aria-hidden="true" />
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1 rounded-lg bg-[#1D4ED8] px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-[#1E40AF]"
              >
                <Printer className="h-3 w-3" aria-hidden="true" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          <div
            id="printable-career-doc"
            className="min-h-[680px] rounded-xl border border-slate-200 bg-white p-8 font-sans text-slate-900 shadow-lg sm:p-10"
          >
            {/* Document Top Header */}
            <div className="flex items-center justify-between gap-5 border-b border-slate-200 pb-5">
              <div className="min-w-0 flex-1">
                {doc.fullName.trim() ? (
                  <h3 className="text-2xl font-bold tracking-tight text-slate-950">
                    {doc.fullName}
                  </h3>
                ) : (
                  <h3 className="no-print text-2xl font-bold tracking-tight text-slate-300">
                    Your Full Name
                  </h3>
                )}

                {doc.targetTitle.trim() ? (
                  <p className="mt-0.5 text-sm font-semibold text-slate-700">
                    {doc.targetTitle}
                  </p>
                ) : (
                  <p className="no-print mt-0.5 text-sm font-medium text-slate-300">
                    Target Role Title
                  </p>
                )}

                {doc.email.trim() || doc.location.trim() || doc.portfolioUrl.trim() ? (
                  <p className="mt-2 text-xs text-slate-600">
                    {[doc.email, doc.location, doc.portfolioUrl]
                      .map((v) => v.trim())
                      .filter(Boolean)
                      .join('  ·  ')}
                  </p>
                ) : (
                  <p className="no-print mt-2 text-xs text-slate-300">
                    Email · Location · Portfolio URL
                  </p>
                )}
              </div>

              {/* Optional Uploaded Profile Photo (only rendered when uploaded) */}
              {doc.docType === 'resume' && doc.photoDataUrl && (
                <img
                  src={doc.photoDataUrl}
                  alt={doc.fullName || 'Candidate portrait'}
                  className={`h-20 w-20 shrink-0 border border-slate-300 object-cover shadow-sm ${
                    doc.photoShape === 'circle' ? 'rounded-full' : 'rounded-xl'
                  }`}
                />
              )}
            </div>

            {doc.docType === 'resume' ? (
              <div className="mt-6 space-y-6 text-sm text-slate-800">
                {!hasHeaderContent &&
                !doc.summary.trim() &&
                !hasPopulatedExperience &&
                !doc.skills.trim() ? (
                  <div className="no-print rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
                    <p className="text-sm font-semibold text-slate-500">
                      Start typing on the left to build your live resume
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Every section updates here in real time and exports cleanly to PDF.
                    </p>
                  </div>
                ) : (
                  <>
                    {(doc.summary.trim() || hasHeaderContent) && (
                      <div>
                        <h4 className="border-b border-slate-200 pb-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          Executive Summary
                        </h4>
                        {doc.summary.trim() ? (
                          <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-slate-700">
                            {doc.summary}
                          </p>
                        ) : (
                          <p className="no-print mt-2 text-xs italic text-slate-300">
                            Add an executive summary on the left...
                          </p>
                        )}
                      </div>
                    )}

                    {(hasPopulatedExperience || hasHeaderContent) && (
                      <div>
                        <h4 className="border-b border-slate-200 pb-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          Professional Experience
                        </h4>
                        <div className="mt-3 space-y-4">
                          {hasPopulatedExperience ? (
                            doc.experiences
                              .filter(
                                (exp) =>
                                  exp.role.trim() ||
                                  exp.company.trim() ||
                                  exp.period.trim() ||
                                  exp.bullets.trim()
                              )
                              .map((exp) => {
                                const bulletLines = exp.bullets
                                  .split('\n')
                                  .map((l) => l.trim())
                                  .filter(Boolean);
                                return (
                                  <div key={exp.id}>
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                      <p className="text-sm font-bold text-slate-950">
                                        {exp.role || 'Role Title'}
                                        {exp.company.trim() && (
                                          <span className="font-medium text-slate-600">
                                            {' '}
                                            — {exp.company}
                                          </span>
                                        )}
                                      </p>
                                      {exp.period.trim() && (
                                        <span className="font-mono text-xs text-slate-500 tabular-nums">
                                          {exp.period}
                                        </span>
                                      )}
                                    </div>
                                    {bulletLines.length > 0 && (
                                      <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-700">
                                        {bulletLines.map((line, i) => (
                                          <li key={i}>{line}</li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                );
                              })
                          ) : (
                            <p className="no-print text-xs italic text-slate-300">
                              Add your roles and quantified achievements on the left...
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {(doc.skills.trim() || hasHeaderContent) && (
                      <div>
                        <h4 className="border-b border-slate-200 pb-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          Technical &amp; Core Skills
                        </h4>
                        {doc.skills.trim() ? (
                          <p className="mt-2 text-xs leading-relaxed text-slate-700">
                            {doc.skills}
                          </p>
                        ) : (
                          <p className="no-print mt-2 text-xs italic text-slate-300">
                            List your core skills separated by commas...
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
                <p className="font-semibold text-slate-950">
                  Dear {doc.recipientName.trim() || 'Hiring Team'}
                  {doc.targetCompany.trim() ? ` at ${doc.targetCompany.trim()}` : ''}
                  ,
                </p>

                {!doc.coverLetterOpening.trim() &&
                !doc.coverLetterBody.trim() &&
                !doc.coverLetterClosing.trim() ? (
                  <div className="no-print rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
                    <p className="text-sm font-semibold text-slate-500">
                      Start writing your cover letter on the left
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Your formatted letter updates live here and prints cleanly to PDF.
                    </p>
                  </div>
                ) : (
                  <>
                    {doc.coverLetterOpening.trim() && (
                      <p className="whitespace-pre-line">
                        {doc.coverLetterOpening}
                      </p>
                    )}
                    {doc.coverLetterBody.trim() && (
                      <p className="whitespace-pre-line">
                        {doc.coverLetterBody}
                      </p>
                    )}
                    {doc.coverLetterClosing.trim() && (
                      <p className="whitespace-pre-line">
                        {doc.coverLetterClosing}
                      </p>
                    )}
                  </>
                )}

                <div className="pt-4">
                  <p className="text-slate-600">Sincerely,</p>
                  <p className="mt-1 font-bold text-slate-950">
                    {doc.fullName.trim() || (
                      <span className="no-print font-normal text-slate-300">
                        Your Name
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
