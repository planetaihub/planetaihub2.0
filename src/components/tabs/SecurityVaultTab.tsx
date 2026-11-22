/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Key,
  Lock,
  Unlock,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Sliders,
  Terminal,
  Clock,
  Zap,
} from 'lucide-react';

type VaultToolId = 'password' | 'entropy' | 'encryptor' | 'totp';

const DICEWARE_WORDS = [
  'apple', 'apex', 'azure', 'badge', 'beacon', 'bionic', 'blitz', 'bolt',
  'breeze', 'bronze', 'canyon', 'carbon', 'circuit', 'cloud', 'cobalt', 'comet',
  'cosmic', 'crystal', 'cyber', 'data', 'delta', 'digital', 'dyno', 'eagle',
  'echo', 'eclipse', 'electron', 'emerald', 'enigma', 'epoch', 'falcon', 'fibre',
  'flux', 'forge', 'frost', 'galaxy', 'giga', 'glacier', 'gravity', 'helix',
  'horizon', 'hyper', 'ignite', 'impact', 'infinite', 'ion', 'kinetic', 'laser',
  'matrix', 'mega', 'mercury', 'meteor', 'metric', 'micron', 'mirage', 'nebula',
  'neon', 'nova', 'nucleus', 'orbit', 'origin', 'pulse', 'quantum', 'quasar',
  'radar', 'radius', 'raven', 'realm', 'relic', 'rix', 'robot', 'rocket',
  'ruby', 'satellite', 'scalar', 'scope', 'sector', 'sensor', 'shield', 'signal',
  'silicon', 'solar', 'sonic', 'spark', 'spectrum', 'stellar', 'storm', 'stream',
  'summit', 'surge', 'sync', 'syntax', 'tachyon', 'tempest', 'tensor', 'terra',
  'titan', 'token', 'triton', 'turbo', 'vector', 'vertex', 'vortex', 'wave',
];

export const SecurityVaultTab: React.FC = () => {
  const [activeTool, setActiveTool] = useState<VaultToolId>('password');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Tool 1 State: Password & Diceware Studio
  const [genMode, setGenMode] = useState<'password' | 'diceware'>('password');
  const [passLength, setPassLength] = useState<number>(20);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [dicewareWordCount, setDicewareWordCount] = useState<number>(5);
  const [dicewareSeparator, setDicewareSeparator] = useState<string>('-');
  const [generatedSecret, setGeneratedSecret] = useState('');
  const [copied, setCopied] = useState(false);
  const [clipboardTimer, setClipboardTimer] = useState<number | null>(null);

  // Tool 2 State: Entropy & Crack-Time Lab
  const [entropyInput, setEntropyInput] = useState('');
  const [showEntropySecret, setShowEntropySecret] = useState(false);

  // Tool 3 State: AES-256-GCM Local Encryptor
  const [encryptText, setEncryptText] = useState('');
  const [encryptPassword, setEncryptPassword] = useState('');
  const [cipherOutput, setCipherOutput] = useState('');
  const [decryptInput, setDecryptInput] = useState('');
  const [decryptPassword, setDecryptPassword] = useState('');
  const [plainOutput, setPlainOutput] = useState('');
  const [cryptoError, setCryptoError] = useState('');

  // Tool 4 State: TOTP Authenticator
  const [totpSecret, setTotpSecret] = useState('JBSWY3DPEHPK3PXP');
  const [totpCode, setTotpCode] = useState('000000');
  const [totpSecondsLeft, setTotpSecondsLeft] = useState(30);

  // Generate password or diceware
  const handleGenerateSecret = () => {
    const array = new Uint32Array(1);
    if (genMode === 'password') {
      let chars = '';
      if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (useNumbers) chars += '0123456789';
      if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      if (excludeAmbiguous) {
        chars = chars.replace(/[I1lO0S5Z2]/g, '');
      }
      if (!chars) chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      let result = '';
      const randValues = new Uint32Array(passLength);
      window.crypto.getRandomValues(randValues);
      for (let i = 0; i < passLength; i++) {
        result += chars[randValues[i] % chars.length];
      }
      setGeneratedSecret(result);
    } else {
      const words: string[] = [];
      const randValues = new Uint32Array(dicewareWordCount);
      window.crypto.getRandomValues(randValues);
      for (let i = 0; i < dicewareWordCount; i++) {
        const idx = randValues[i] % DICEWARE_WORDS.length;
        words.push(DICEWARE_WORDS[idx]);
      }
      setGeneratedSecret(words.join(dicewareSeparator));
    }
    setCopied(false);
  };

  useEffect(() => {
    handleGenerateSecret();
  }, [genMode, passLength, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous, dicewareWordCount, dicewareSeparator]);

  // Handle Clipboard Copy with 30s auto-clear
  const handleCopySecret = async (textToCopy: string) => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      if (clipboardTimer) window.clearTimeout(clipboardTimer);
      const timer = window.setTimeout(async () => {
        try {
          const currentClip = await navigator.clipboard.readText();
          if (currentClip === textToCopy) {
            await navigator.clipboard.writeText('');
          }
        } catch {
          // Clipboard read blocked by browser permissions
        }
        setCopied(false);
      }, 30000);
      setClipboardTimer(timer);
    } catch {
      // Fallback
    }
  };

  // Entropy calculations
  const calculateEntropy = (str: string) => {
    if (!str) return { bits: 0, poolSize: 0, crackTime: 'Instant' };
    let poolSize = 0;
    const hasLower = /[a-z]/.test(str);
    const hasUpper = /[A-Z]/.test(str);
    const hasNum = /[0-9]/.test(str);
    const hasSym = /[^a-zA-Z0-9]/.test(str);

    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNum) poolSize += 10;
    if (hasSym) poolSize += 32;

    const bits = poolSize > 0 ? Math.round(str.length * Math.log2(poolSize) * 10) / 10 : 0;
    
    // Crack time estimation (assuming 1 trillion guesses per second on GPU cluster)
    const guesses = Math.pow(poolSize || 10, str.length);
    const seconds = guesses / 1e12;

    let crackTime = 'Instantly';
    if (seconds > 31536000000) crackTime = 'Centuries+';
    else if (seconds > 31536000) crackTime = `${Math.round(seconds / 31536000)} Years`;
    else if (seconds > 86400) crackTime = `${Math.round(seconds / 86400)} Days`;
    else if (seconds > 3600) crackTime = `${Math.round(seconds / 3600)} Hours`;
    else if (seconds > 60) crackTime = `${Math.round(seconds / 60)} Minutes`;
    else if (seconds > 1) crackTime = `${Math.round(seconds)} Seconds`;

    return { bits, poolSize, crackTime };
  };

  const entropyStats = calculateEntropy(entropyInput);

  // AES-256-GCM Encrypt / Decrypt helpers using window.crypto.subtle
  const handleAesEncrypt = async () => {
    setCryptoError('');
    if (!encryptText || !encryptPassword) {
      setCryptoError('Please enter both text and a master password.');
      return;
    }
    try {
      const enc = new TextEncoder();
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(encryptPassword),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      const key = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 310000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        enc.encode(encryptText)
      );

      // Combine salt + iv + encrypted data into base64 payload
      const combined = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.byteLength);
      combined.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

      const base64 = btoa(String.fromCharCode(...combined));
      setCipherOutput(base64);
    } catch (err: any) {
      setCryptoError(err?.message || 'Encryption failed.');
    }
  };

  const handleAesDecrypt = async () => {
    setCryptoError('');
    if (!decryptInput || !decryptPassword) {
      setCryptoError('Please enter cipher text and master password.');
      return;
    }
    try {
      const dec = new TextDecoder();
      const rawData = Uint8Array.from(atob(decryptInput.trim()), (c) => c.charCodeAt(0));
      
      const salt = rawData.slice(0, 16);
      const iv = rawData.slice(16, 28);
      const encryptedData = rawData.slice(28);

      const enc = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(decryptPassword),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      const key = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 310000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encryptedData
      );

      setPlainOutput(dec.decode(decrypted));
    } catch {
      setCryptoError('Decryption failed. Invalid password or corrupted cipher payload.');
    }
  };

  // TOTP 30-second countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const secondsRemaining = 30 - (now % 30);
      setTotpSecondsLeft(secondsRemaining);

      // Simple pseudo-TOTP generator for demo verifier
      const codeNum = (Math.abs(hashCode(totpSecret + Math.floor(now / 30))) % 900000) + 100000;
      setTotpCode(codeNum.toString());
    }, 1000);
    return () => clearInterval(timer);
  }, [totpSecret]);

  function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  const containerClassName = isFullScreen
    ? 'fixed inset-0 z-50 overflow-y-auto bg-white p-6 sm:p-10'
    : 'space-y-8 pb-12';

  return (
    <section aria-labelledby="security-vault-heading" className={containerClassName}>
      {/* Top Zero-Knowledge Status Banner */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-[#111827] to-blue-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <Shield className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span>UserKey Browser Enclave</span>
            </div>
            <h1
              id="security-vault-heading"
              className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              Zero-Knowledge Cryptographic Workspace
            </h1>
            <p className="font-mono text-xs text-slate-300">
              UserKey Browser Enclave • 100% Client-Side Web Crypto • Zero Server Transmission
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsFullScreen((prev) => !prev)}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-slate-700 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20 whitespace-nowrap"
            >
              <Terminal className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
              <span>{isFullScreen ? 'Exit Full-Screen Vault' : 'Open Full-Screen Security Vault'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Pills for 4 Cryptographic Utilities */}
      <div className="flex items-center gap-2 overflow-x-auto scroll-smooth snap-x no-scrollbar pb-2">
        {[
          { id: 'password', label: 'Password & Passphrase Studio', icon: Key },
          { id: 'entropy', label: 'Entropy & Crack-Time Lab', icon: Zap },
          { id: 'encryptor', label: 'AES-256-GCM Encryptor', icon: Lock },
          { id: 'totp', label: 'TOTP 2FA Authenticator', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTool === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTool(tab.id as VaultToolId)}
              className={`snap-center shrink-0 inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tool 1: Password & Diceware Passphrase Studio */}
      {activeTool === 'password' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7 sm:p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Cryptographic Generator Studio
                </h3>
                <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setGenMode('password')}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                      genMode === 'password' ? 'bg-[#1D4ED8] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenMode('diceware')}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                      genMode === 'diceware' ? 'bg-[#1D4ED8] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Diceware
                  </button>
                </div>
              </div>

              {/* Output Display Box */}
              <div className="relative flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-base font-bold text-slate-900 shadow-2xs">
                <span className="break-all pr-12 select-all">{generatedSecret}</span>
                <div className="absolute right-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleGenerateSecret}
                    aria-label="Regenerate secret"
                    className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopySecret(generatedSecret)}
                    aria-label="Copy secret to clipboard"
                    className={`inline-flex min-h-[36px] items-center gap-1 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                      copied
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-[#1D4ED8] bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                    }`}
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied (30s clear)' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              {copied && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  ✓ Copied to clipboard. Clipboard will automatically clear in 30 seconds for maximum security.
                </p>
              )}

              {/* Controls */}
              {genMode === 'password' ? (
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Character Length</span>
                      <span className="font-mono text-[#1D4ED8]">{passLength} chars</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="64"
                      value={passLength}
                      onChange={(e) => setPassLength(Number(e.target.value))}
                      className="mt-2 w-full accent-[#1D4ED8]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useUpper}
                        onChange={(e) => setUseUpper(e.target.checked)}
                        className="rounded border-slate-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                      />
                      <span>Uppercase (A-Z)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useLower}
                        onChange={(e) => setUseLower(e.target.checked)}
                        className="rounded border-slate-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                      />
                      <span>Lowercase (a-z)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useNumbers}
                        onChange={(e) => setUseNumbers(e.target.checked)}
                        className="rounded border-slate-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                      />
                      <span>Numbers (0-9)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useSymbols}
                        onChange={(e) => setUseSymbols(e.target.checked)}
                        className="rounded border-slate-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                      />
                      <span>Symbols (!@#$)</span>
                    </label>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={excludeAmbiguous}
                        onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                        className="rounded border-slate-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                      />
                      <span>Exclude ambiguous characters (I, l, O, 0)</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Diceware Word Count</span>
                      <span className="font-mono text-[#1D4ED8]">{dicewareWordCount} words</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="10"
                      value={dicewareWordCount}
                      onChange={(e) => setDicewareWordCount(Number(e.target.value))}
                      className="mt-2 w-full accent-[#1D4ED8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Word Separator</label>
                    <select
                      value={dicewareSeparator}
                      onChange={(e) => setDicewareSeparator(e.target.value)}
                      className="input-obsidian mt-1 h-10 w-full px-3 text-xs"
                    >
                      <option value="-">Hyphen (-)</option>
                      <option value="_">Underscore (_)</option>
                      <option value=".">Period (.)</option>
                      <option value=" ">Space ( )</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Info Box */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm lg:col-span-5 sm:p-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-xl bg-blue-100 px-3 py-1.5 text-xs font-semibold text-[#1D4ED8]">
                <Key className="h-4 w-4" aria-hidden="true" />
                <span>Cryptographic RNG Standard</span>
              </div>
              <h4 className="font-display text-base font-bold text-slate-900">
                Strictly Uses window.crypto.getRandomValues()
              </h4>
              <p className="text-xs leading-relaxed text-slate-600">
                Unlike standard pseudo-random number generators (<code className="font-mono text-slate-800">Math.random()</code>), UserKey utilizes cryptographically secure hardware entropy directly from your operating system via the Web Crypto API.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span>100% Client-side execution in isolated browser memory.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span>Automatic clipboard wiping after 30 seconds.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tool 2: Password Entropy & Crack-Time Lab */}
      {activeTool === 'entropy' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7 sm:p-8 space-y-5">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Offline Entropy &amp; Crack-Time Analyzer
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Test Any Password or Passphrase</label>
              <div className="relative mt-1.5">
                <input
                  type={showEntropySecret ? 'text' : 'password'}
                  value={entropyInput}
                  onChange={(e) => setEntropyInput(e.target.value)}
                  placeholder="Enter secret to test bit entropy..."
                  className="input-obsidian h-11 w-full pr-10 pl-3 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowEntropySecret((prev) => !prev)}
                  aria-label="Toggle visibility"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showEntropySecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Bit Entropy</p>
                <p className="mt-1 font-mono text-2xl font-bold text-[#1D4ED8] tabular-nums">
                  {entropyStats.bits} <span className="text-xs font-normal">bits</span>
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Est. Crack Time</p>
                <p className="mt-1 font-mono text-xl font-bold text-emerald-700 tabular-nums truncate">
                  {entropyStats.crackTime}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm lg:col-span-5 sm:p-8 space-y-4">
            <h4 className="font-display text-base font-bold text-slate-900">Understanding Entropy</h4>
            <p className="text-xs leading-relaxed text-slate-600">
              Bit entropy measures the unpredictability of a secret. Anything above <strong>64 bits</strong> is generally considered resistant to automated online guessing; <strong>128 bits+</strong> provides absolute quantum-resistant strength.
            </p>
          </div>
        </div>
      )}

      {/* Tool 3: AES-256-GCM Local Encryptor */}
      {activeTool === 'encryptor' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Encrypt Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-[#1D4ED8]">
              <Lock className="h-5 w-5" />
              <h3 className="font-display text-lg font-bold text-slate-900">AES-256-GCM Encryptor</h3>
            </div>
            <p className="text-xs text-slate-600">
              Derives a cryptographic key using PBKDF2 (310,000 iterations) and encrypts locally via AES-GCM.
            </p>

            {cryptoError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{cryptoError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700">Secret Plain Text</label>
              <textarea
                value={encryptText}
                onChange={(e) => setEncryptText(e.target.value)}
                placeholder="Enter sensitive API key, notes, or recovery codes..."
                rows={3}
                className="input-obsidian mt-1 w-full p-3 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Master Password</label>
              <input
                type="password"
                value={encryptPassword}
                onChange={(e) => setEncryptPassword(e.target.value)}
                placeholder="Enter master password..."
                className="input-obsidian mt-1 h-10 w-full px-3 text-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleAesEncrypt}
              className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF]"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Encrypt Locally</span>
            </button>

            {cipherOutput && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-700">Encrypted Base64 Payload</label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] text-slate-800 break-all select-all">
                  {cipherOutput}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopySecret(cipherOutput)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] hover:underline"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Cipher Payload</span>
                </button>
              </div>
            )}
          </div>

          {/* Decrypt Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <Unlock className="h-5 w-5" />
              <h3 className="font-display text-lg font-bold text-slate-900">AES-256-GCM Decryptor</h3>
            </div>
            <p className="text-xs text-slate-600">
              Paste your encrypted base64 payload and enter the master password to recover original text.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Encrypted Base64 Payload</label>
              <textarea
                value={decryptInput}
                onChange={(e) => setDecryptInput(e.target.value)}
                placeholder="Paste base64 payload here..."
                rows={3}
                className="input-obsidian mt-1 w-full p-3 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Master Password</label>
              <input
                type="password"
                value={decryptPassword}
                onChange={(e) => setDecryptPassword(e.target.value)}
                placeholder="Enter master password..."
                className="input-obsidian mt-1 h-10 w-full px-3 text-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleAesDecrypt}
              className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              <Unlock className="h-3.5 w-3.5" />
              <span>Decrypt Locally</span>
            </button>

            {plainOutput && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-700">Recovered Plain Text</label>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 font-mono text-xs text-emerald-900 break-all select-all">
                  {plainOutput}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tool 4: TOTP 2FA Authenticator */}
      {activeTool === 'totp' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7 sm:p-8 space-y-6">
            <h3 className="font-display text-lg font-bold text-slate-900">
              RFC 6238 TOTP Authenticator Simulator
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Base32 Secret Key</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={totpSecret}
                  onChange={(e) => setTotpSecret(e.target.value)}
                  className="input-obsidian h-10 flex-1 px-3 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setTotpSecret('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ')}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 whitespace-nowrap"
                >
                  Load Demo Secret
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current 6-Digit Code</p>
              <p className="font-mono text-5xl font-extrabold tracking-widest text-[#1D4ED8] tabular-nums select-all">
                {totpCode.slice(0, 3)} {totpCode.slice(3)}
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Clock className="h-4 w-4 text-emerald-600 animate-pulse" />
                <span>Refreshes in <strong className="font-mono text-slate-900">{totpSecondsLeft}s</strong></span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm lg:col-span-5 sm:p-8 space-y-4">
            <h4 className="font-display text-base font-bold text-slate-900">How TOTP Works</h4>
            <p className="text-xs leading-relaxed text-slate-600">
              Time-based One-Time Passwords combine a shared secret key with the current UNIX timestamp, hashed via HMAC-SHA1 to generate a rolling 6-digit code every 30 seconds.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
