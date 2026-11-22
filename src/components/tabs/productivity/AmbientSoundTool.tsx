import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

type ChannelId = 'rain' | 'brown' | 'white' | 'lofi';

interface SoundChannelState {
  id: ChannelId;
  name: string;
  description: string;
  enabled: boolean;
  volume: number; // 0 to 100
}

const INITIAL_CHANNELS: SoundChannelState[] = [
  {
    id: 'rain',
    name: 'Steady Rain',
    description: 'Band-pass filtered rainfall texture with gentle cadence',
    enabled: false,
    volume: 55,
  },
  {
    id: 'brown',
    name: 'Brown Noise',
    description: 'Deep low-frequency rumble to mask traffic and chatter',
    enabled: false,
    volume: 50,
  },
  {
    id: 'white',
    name: 'White Noise',
    description: 'Balanced full-spectrum acoustic masking',
    enabled: false,
    volume: 35,
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Hum',
    description: 'Warm filtered harmonic chord drone for deep reading',
    enabled: false,
    volume: 45,
  },
];

interface ActiveAudioNodes {
  gain: GainNode;
  stop: () => void;
}

export const AmbientSoundTool: React.FC = () => {
  const [channels, setChannels] =
    useState<SoundChannelState[]>(INITIAL_CHANNELS);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Partial<Record<ChannelId, ActiveAudioNodes>>>({});

  const ensureContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  };

  const createNoiseBuffer = (
    ctx: AudioContext,
    type: 'white' | 'brown' | 'pink'
  ): AudioBuffer => {
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'brown') {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }
    } else {
      let b0 = 0,
        b1 = 0,
        b2 = 0,
        b3 = 0,
        b4 = 0,
        b5 = 0,
        b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  };

  const startChannel = (id: ChannelId, volume: number) => {
    const ctx = ensureContext();
    if (!ctx) return;

    nodesRef.current[id]?.stop();

    const masterGain = ctx.createGain();
    const scaled = (volume / 100) * 0.35;
    masterGain.gain.setValueAtTime(scaled, ctx.currentTime);
    masterGain.connect(ctx.destination);

    if (id === 'rain') {
      const source = ctx.createBufferSource();
      source.buffer = createNoiseBuffer(ctx, 'pink');
      source.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1150, ctx.currentTime);
      bandpass.Q.setValueAtTime(0.65, ctx.currentTime);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.18, ctx.currentTime);
      lfoGain.gain.setValueAtTime(220, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(bandpass.frequency);

      source.connect(bandpass);
      bandpass.connect(masterGain);

      source.start();
      lfo.start();

      nodesRef.current[id] = {
        gain: masterGain,
        stop: () => {
          try {
            source.stop();
            lfo.stop();
            source.disconnect();
            lfo.disconnect();
            masterGain.disconnect();
          } catch {
            // Already stopped
          }
        },
      };
    } else if (id === 'brown' || id === 'white') {
      const source = ctx.createBufferSource();
      source.buffer = createNoiseBuffer(ctx, id);
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(
        id === 'brown' ? 420 : 5200,
        ctx.currentTime
      );

      source.connect(filter);
      filter.connect(masterGain);
      source.start();

      nodesRef.current[id] = {
        gain: masterGain,
        stop: () => {
          try {
            source.stop();
            source.disconnect();
            masterGain.disconnect();
          } catch {
            // Already stopped
          }
        },
      };
    } else {
      const freqs = [130.81, 164.81, 196.0, 246.94];
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(360, ctx.currentTime);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.22, ctx.currentTime);
      filter.connect(subGain);
      subGain.connect(masterGain);

      const oscs = freqs.map((f, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        osc.detune.setValueAtTime(idx % 2 === 0 ? -4 : 4, ctx.currentTime);
        osc.connect(filter);
        osc.start();
        return osc;
      });

      nodesRef.current[id] = {
        gain: masterGain,
        stop: () => {
          oscs.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {
              // Already stopped
            }
          });
          try {
            masterGain.disconnect();
          } catch {
            // Ignore
          }
        },
      };
    }
  };

  const stopChannel = (id: ChannelId) => {
    nodesRef.current[id]?.stop();
    delete nodesRef.current[id];
  };

  const toggleChannel = (id: ChannelId) => {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id !== id) return ch;
        const nextEnabled = !ch.enabled;
        if (nextEnabled) {
          startChannel(id, ch.volume);
        } else {
          stopChannel(id);
        }
        return { ...ch, enabled: nextEnabled };
      })
    );
  };

  const updateVolume = (id: ChannelId, volume: number) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, volume } : ch))
    );
    const activeNode = nodesRef.current[id];
    if (activeNode && ctxRef.current) {
      activeNode.gain.gain.setTargetAtTime(
        (volume / 100) * 0.35,
        ctxRef.current.currentTime,
        0.04
      );
    }
  };

  const stopAll = () => {
    (['rain', 'brown', 'white', 'lofi'] as ChannelId[]).forEach(stopChannel);
    setChannels((prev) => prev.map((ch) => ({ ...ch, enabled: false })));
  };

  useEffect(() => {
    return () => {
      (['rain', 'brown', 'white', 'lofi'] as ChannelId[]).forEach((id) => {
        nodesRef.current[id]?.stop();
      });
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  const anyActive = channels.some((c) => c.enabled);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            Ambient Sound Synthesizer
          </h2>
          <p className="text-xs text-slate-600">
            100% synthesized in real time via Web Audio API—works offline with zero audio downloads.
          </p>
        </div>

        <button
          type="button"
          onClick={stopAll}
          disabled={!anyActive}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 disabled:opacity-40"
        >
          <VolumeX className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <span>Stop All Channels</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className={`rounded-2xl border p-5 transition-all ${
              ch.enabled
                ? 'border-emerald-300 bg-emerald-50/50 text-slate-900 shadow-sm'
                : 'border-slate-200 bg-white text-slate-900 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">
                  {ch.name}
                </h3>
                <p className="mt-1 text-xs text-slate-600">{ch.description}</p>
              </div>

              <button
                type="button"
                onClick={() => toggleChannel(ch.id)}
                aria-pressed={ch.enabled}
                className={`inline-flex min-h-[42px] min-w-[92px] shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
                  ch.enabled
                    ? 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-[#1D4ED8] text-white shadow-sm hover:bg-[#1E40AF]'
                }`}
              >
                {ch.enabled ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Playing</span>
                  </>
                ) : (
                  <span>Play</span>
                )}
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                Volume
              </span>
              <input
                type="range"
                min={0}
                max={100}
                aria-label={`${ch.name} volume`}
                value={ch.volume}
                onChange={(e) => updateVolume(ch.id, Number(e.target.value))}
                className={`flex-1 ${
                  ch.enabled ? 'accent-emerald-600' : 'accent-[#1D4ED8]'
                }`}
              />
              <span className="w-10 text-right font-mono text-xs font-medium text-slate-700 tabular-nums">
                {ch.volume}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
