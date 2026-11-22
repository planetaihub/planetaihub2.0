import React, { useMemo, useState } from 'react';
import {
  Building2,
  Check,
  Copy,
  Link2,
  Mail,
  RotateCcw,
  Sparkles,
  User,
} from 'lucide-react';

type EmailTemplateType = 'cold-outreach' | 'follow-up' | 'thank-you';

interface EmailInputs {
  recipientName: string;
  companyName: string;
  roleTitle: string;
  yourName: string;
  highlight: string;
  portfolioUrl: string;
}

const EMPTY_INPUTS: EmailInputs = {
  recipientName: '',
  companyName: '',
  roleTitle: '',
  yourName: '',
  highlight: '',
  portfolioUrl: '',
};

export const EmailDrafterTool: React.FC = () => {
  const [template, setTemplate] = useState<EmailTemplateType>('cold-outreach');
  const [inputs, setInputs] = useState<EmailInputs>(EMPTY_INPUTS);
  const [copiedPart, setCopiedPart] = useState<'subject' | 'body' | null>(null);

  const hasAnyInput = useMemo(
    () => Object.values(inputs).some((value) => value.trim().length > 0),
    [inputs]
  );

  const generated = useMemo(() => {
    const recipient = inputs.recipientName.trim() || '[Recipient Name]';
    const company = inputs.companyName.trim() || '[Company Name]';
    const role = inputs.roleTitle.trim() || '[Target Role]';
    const sender = inputs.yourName.trim() || '[Your Name]';
    const highlight =
      inputs.highlight.trim() || '[your key achievement or metric]';
    const link = inputs.portfolioUrl.trim();

    if (template === 'cold-outreach') {
      return {
        subject: `${role} @ ${company} — quick note from ${sender}`,
        body: [
          `Hi ${recipient},`,
          '',
          `I have been following ${company}'s product work closely and noticed the ${role} opening.`,
          '',
          `In my recent role, I ${highlight}. I work well in async remote teams and would love to bring that same ownership to ${company}.`,
          link ? `\nWork samples & background: ${link}` : '',
          '',
          `If you have 10 minutes this week—or can point me to the right person on the hiring team—I would appreciate connecting.`,
          '',
          'Best regards,',
          sender,
        ]
          .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
          .join('\n'),
      };
    }

    if (template === 'follow-up') {
      return {
        subject: `Following up: ${role} application — ${sender}`,
        body: [
          `Hi ${recipient},`,
          '',
          `I applied for the ${role} position at ${company} last week and wanted to briefly follow up to reiterate my interest.`,
          '',
          `Given ${company}'s current priorities, my background where I ${highlight} aligns closely with what your team is building.`,
          link ? `\nFor quick reference, here is my portfolio: ${link}` : '',
          '',
          `Happy to share additional code or work samples whenever convenient.`,
          '',
          'Thank you,',
          sender,
        ]
          .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
          .join('\n'),
      };
    }

    return {
      subject: `Thank you — ${role} conversation with ${company}`,
      body: [
        `Hi ${recipient},`,
        '',
        `Thank you for taking the time to speak with me today about the ${role} role at ${company}.`,
        '',
        `Our discussion around team collaboration and shipping priorities reinforced how excited I am about contributing—especially leveraging my experience where I ${highlight}.`,
        '',
        `Please let me know if any additional details would help as your team reviews next steps.`,
        '',
        'Warm regards,',
        sender,
      ].join('\n'),
    };
  }, [template, inputs]);

  const copyText = async (part: 'subject' | 'body', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPart(part);
      setTimeout(() => setCopiedPart(null), 1800);
    } catch {
      // Clipboard blocked
    }
  };

  const wordCount = useMemo(() => {
    const trimmed = generated.body.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [generated.body]);

  const mailtoHref = `mailto:?subject=${encodeURIComponent(
    generated.subject
  )}&body=${encodeURIComponent(generated.body)}`;

  const labelClass =
    'flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600';
  const inputClass =
    'mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none';

  return (
    <div className="space-y-5">
      {copiedPart && (
        <div
          role="status"
          className="fixed right-5 bottom-20 z-50 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-700 shadow-lg md:bottom-6"
        >
          <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          <span>Copied ✓</span>
        </div>
      )}

      {/* Floating Studio Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar rounded-xl border border-slate-200 bg-white p-1">
          {(
            [
              { id: 'cold-outreach', label: 'Cold Outreach' },
              { id: 'follow-up', label: 'Follow-Up' },
              { id: 'thank-you', label: 'Thank You' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTemplate(item.id)}
              className={`min-h-[36px] rounded-lg px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                template === item.id
                  ? 'bg-[#1D4ED8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setInputs(EMPTY_INPUTS)}
          disabled={!hasAnyInput}
          className="inline-flex min-h-[38px] items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 disabled:opacity-40 sm:self-center whitespace-nowrap"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          <span>Clear Form</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Variables Form */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm lg:col-span-5">
          <div className="h-1 w-full bg-[#1D4ED8]" />
          <div className="space-y-4 p-5 sm:p-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-display text-lg font-bold text-slate-900">
                Personalize Variables
              </h3>
              <p className="text-xs text-slate-500">
                High-signal outreach under 110 words for busy hiring leads.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <label className={labelClass}>
                  <User className="h-3 w-3 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Recipient First Name</span>
                </label>
                <input
                  type="text"
                  value={inputs.recipientName}
                  onChange={(e) =>
                    setInputs((p) => ({ ...p, recipientName: e.target.value }))
                  }
                  placeholder="e.g. Taylor"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <Building2 className="h-3 w-3 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Company Name</span>
                </label>
                <input
                  type="text"
                  value={inputs.companyName}
                  onChange={(e) =>
                    setInputs((p) => ({ ...p, companyName: e.target.value }))
                  }
                  placeholder="e.g. Anthropic"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span>Target Role</span>
                </label>
                <input
                  type="text"
                  value={inputs.roleTitle}
                  onChange={(e) =>
                    setInputs((p) => ({ ...p, roleTitle: e.target.value }))
                  }
                  placeholder="e.g. Senior Frontend Engineer"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span>Your Name</span>
                </label>
                <input
                  type="text"
                  value={inputs.yourName}
                  onChange={(e) =>
                    setInputs((p) => ({ ...p, yourName: e.target.value }))
                  }
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className={labelClass}>
                  <Sparkles className="h-3 w-3 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Key Proof Point / Highlight</span>
                </label>
                <textarea
                  rows={3}
                  value={inputs.highlight}
                  onChange={(e) =>
                    setInputs((p) => ({ ...p, highlight: e.target.value }))
                  }
                  placeholder="e.g. reduced API latency by 35% and shipped an offline-first workspace"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className={labelClass}>
                  <Link2 className="h-3 w-3 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Portfolio or LinkedIn URL (optional)</span>
                </label>
                <input
                  type="text"
                  value={inputs.portfolioUrl}
                  onChange={(e) =>
                    setInputs((p) => ({ ...p, portfolioUrl: e.target.value }))
                  }
                  placeholder="https://github.com/yourhandle"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Email Output */}
        <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-7">
          <div className="h-1 w-full bg-emerald-600" />
          <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Generated Draft
                  </span>
                  <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1D4ED8] tabular-nums">
                    {wordCount} words
                  </span>
                </div>
                <a
                  href={mailtoHref}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#1D4ED8]/40 hover:bg-blue-50 hover:text-[#1D4ED8] whitespace-nowrap"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Open in Mail App</span>
                </a>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Subject Line
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText('subject', generated.subject)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] transition-colors hover:text-[#1E40AF]"
                  >
                    {copiedPart === 'subject' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                        <span className="text-emerald-700">Copied ✓</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copy Subject</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">
                  {generated.subject}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {generated.body}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => copyText('body', generated.body)}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#1D4ED8] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF]"
              >
                {copiedPart === 'body' ? (
                  <>
                    <Check className="h-4 w-4 text-white" aria-hidden="true" />
                    <span>Copied ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span>Copy Email Body</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
