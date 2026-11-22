import React, { useState } from 'react';
import { Cloud, KeyRound, FileJson, Clock, Copy, Check, ShieldCheck, BookOpen } from 'lucide-react';

export const B2bCloudUtilities: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'cloud' | 'jwt' | 'json' | 'cron'>('cloud');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 1. Cloud Egress Estimator
  const [trafficGb, setTrafficGb] = useState<number>(500);
  const [storageGb, setStorageGb] = useState<number>(100);
  const [requestsM, setRequestsM] = useState<number>(5);

  const legacyCost = Math.max(0, trafficGb - 100) * 0.09 + storageGb * 0.023 + requestsM * 0.4;
  const edgeCost = storageGb * 0.015 + Math.max(0, requestsM - 10) * 0.15;
  const annualSavings = Math.max(0, legacyCost - edgeCost) * 12;

  // 2. Offline JWT & Base64
  const [jwtInput, setJwtInput] = useState<string>(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzkwMjEwIiwicm9sZSI6ImFkbWluIiwiaXNzIjoicGxhbmV0YWlodWIuY29tIn0.sig'
  );
  const [b64Input, setB64Input] = useState<string>('PlanetAI Hub Edge Cloud');
  const [b64Mode, setB64Mode] = useState<'encode' | 'decode'>('encode');

  const parseJwt = (token: string) => {
    try {
      const parts = token.trim().split('.');
      const rawHeader = parts.at(0);
      const rawPayload = parts.at(1);
      if (!rawHeader || !rawPayload) {
        return { error: 'Enter a valid JWT token (header.payload.signature).' };
      }
      const decodeSeg = (seg: string) => {
        const b64 = seg.replace(/-/g, '+').replace(/_/g, '/');
        const pad = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '=');
        return JSON.stringify(JSON.parse(atob(pad)), null, 2);
      };
      return { header: decodeSeg(rawHeader), payload: decodeSeg(rawPayload), error: null };
    } catch {
      return { error: 'Invalid Base64URL encoding in JWT segments.' };
    }
  };

  const jwtParsed = parseJwt(jwtInput);

  const runBase64 = () => {
    try {
      return b64Mode === 'encode'
        ? btoa(unescape(encodeURIComponent(b64Input)))
        : decodeURIComponent(escape(atob(b64Input.trim())));
    } catch {
      return 'Invalid Base64 input.';
    }
  };

  // 3. JSON Formatter
  const [jsonInput, setJsonInput] = useState<string>(
    '{"service":"edge-worker","region":"global","ttl":3600,"zeroEgress":true}'
  );
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [jsonMsg, setJsonMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const handleJson = (minify: boolean) => {
    try {
      const obj = JSON.parse(jsonInput);
      const out = minify ? JSON.stringify(obj) : JSON.stringify(obj, null, 2);
      setJsonOutput(out);
      setJsonMsg({
        ok: true,
        text: `Valid JSON (${new Blob([out]).size} bytes)`,
      });
    } catch (e: unknown) {
      setJsonMsg({ ok: false, text: e instanceof Error ? e.message : 'Invalid JSON' });
    }
  };

  // 4. Cron Builder
  const [min, setMin] = useState('0');
  const [hour, setHour] = useState('*/6');
  const [dom, setDom] = useState('*');
  const [mon, setMon] = useState('*');
  const [dow, setDow] = useState('1-5');
  const cronStr = `${min} ${hour} ${dom} ${mon} ${dow}`;

  const copyText = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side B2B Cloud & Dev Utilities
        </div>
        <h2 className="text-2xl font-bold text-slate-900">B2B Software, Web & Cloud Utilities</h2>
        <p className="text-sm text-slate-600 mt-1">
          Estimate SaaS bandwidth savings, inspect JWTs offline, validate JSON payloads, and build UTC cron schedules.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'cloud', label: 'Cloud Egress Estimator', icon: Cloud },
          { id: 'jwt', label: 'Offline JWT & Base64', icon: KeyRound },
          { id: 'json', label: 'JSON Formatter', icon: FileJson },
          { id: 'cron', label: 'Cron Builder', icon: Clock },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id as 'cloud' | 'jwt' | 'json' | 'cron')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                activeTool === t.id
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTool === 'cloud' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Monthly Bandwidth (Egress)</span>
                <span className="font-bold text-blue-700">{trafficGb} GB</span>
              </div>
              <input type="range" min={50} max={10000} step={50} value={trafficGb} onChange={(e) => setTrafficGb(Number(e.target.value))} className="w-full accent-blue-700" />
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Object Storage</span>
                <span className="font-bold text-blue-700">{storageGb} GB</span>
              </div>
              <input type="range" min={10} max={5000} step={10} value={storageGb} onChange={(e) => setStorageGb(Number(e.target.value))} className="w-full accent-blue-700" />
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Edge Requests / Month</span>
                <span className="font-bold text-blue-700">{requestsM}M</span>
              </div>
              <input type="range" min={1} max={100} step={1} value={requestsM} onChange={(e) => setRequestsM(Number(e.target.value))} className="w-full accent-blue-700" />
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex justify-between p-3 bg-white rounded-xl border border-slate-200 text-sm">
              <span>Legacy Cloud Egress Cost</span>
              <span className="font-bold">${legacyCost.toFixed(2)}/mo</span>
            </div>
            <div className="flex justify-between p-3 bg-white rounded-xl border border-blue-200 text-sm">
              <span className="text-blue-800">Zero-Egress Edge Cost</span>
              <span className="font-bold text-blue-700">${edgeCost.toFixed(2)}/mo</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs font-bold uppercase text-emerald-800">Estimated Annual Savings</div>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">${annualSavings.toFixed(2)} / yr</div>
            </div>
          </div>
        </div>
      )}

      {activeTool === 'jwt' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <h3 className="text-base font-bold text-slate-900">Offline JWT Decoder</h3>
            <textarea rows={3} value={jwtInput} onChange={(e) => setJwtInput(e.target.value)} className="w-full rounded-xl border border-slate-300 p-3 font-mono text-xs" />
            {jwtParsed.error ? (
              <div className="p-3 rounded-xl bg-amber-50 text-xs text-amber-800">{jwtParsed.error}</div>
            ) : (
              <pre className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs overflow-x-auto">{jwtParsed.payload}</pre>
            )}
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Base64 Codec</h3>
              <div className="flex gap-1">
                <button onClick={() => setB64Mode('encode')} className={`px-2.5 py-1 text-xs rounded-lg font-semibold ${b64Mode === 'encode' ? 'bg-blue-700 text-white' : 'bg-slate-100'}`}>Encode</button>
                <button onClick={() => setB64Mode('decode')} className={`px-2.5 py-1 text-xs rounded-lg font-semibold ${b64Mode === 'decode' ? 'bg-blue-700 text-white' : 'bg-slate-100'}`}>Decode</button>
              </div>
            </div>
            <textarea rows={3} value={b64Input} onChange={(e) => setB64Input(e.target.value)} className="w-full rounded-xl border border-slate-300 p-3 font-mono text-xs" />
            <pre className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs break-all whitespace-pre-wrap">{runBase64()}</pre>
            <button onClick={() => copyText('b64', runBase64())} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold">
              {copiedKey === 'b64' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'b64' ? 'Copied' : 'Copy Output'}
            </button>
          </div>
        </div>
      )}

      {activeTool === 'json' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
JSON Formatter & Validator

<button onClick={() => handleJson(false)} className="px-3 py-1.5 rounded-xl bg-blue-700 text-white text-xs font-semibold">Format
<button onClick={() => handleJson(true)} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold">Minify



<textarea rows={6} value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} className="w-full rounded-xl border border-slate-300 p-3 font-mono text-xs" />
{jsonOutput || 'Click Format or Minify...'}

{jsonMsg && (
<div className={p-3 rounded-xl text-xs font-medium ${jsonMsg.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}}>
{jsonMsg.text}

)}

)}
{activeTool === 'cron' && (


UTC Cron Expression Builder
<button onClick={() => copyText('cron', cronStr)} className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl font-mono text-xs">
{cronStr} {copiedKey === 'cron' ?  : }



{[
{ label: 'Minute', v: min, s: setMin },
{ label: 'Hour', v: hour, s: setHour },
{ label: 'Day', v: dom, s: setDom },
{ label: 'Month', v: mon, s: setMon },
{ label: 'Weekday', v: dow, s: setDow },
].map((f) => (
{f.label}
<input type="text" value={f.v} onChange={(e) => f.s(e.target.value)} className="w-full rounded-lg border border-slate-300 px-2 py-1 font-mono text-xs bg-white" />

))}


)}
 Cloud & SaaS Engineering Guide

Reducing SaaS Egress Fees & Securing Client-Side Developer Workflows

Legacy cloud providers charge high metered bandwidth fees whenever SaaS applications serve global assets or API payloads. Moving static bundles and edge functions onto zero-egress edge networks reduces recurring infrastructure overhead while keeping JWT token inspection and JSON schema validation strictly inside local browser memory.



);
};
export default B2bCloudUtilities;
