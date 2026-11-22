/**
 * Synthesizes a clean melodic chime via the Web Audio API without external audio files.
 */
export function playChime(type: 'alarm' | 'pomodoro' = 'pomodoro'): void {
  if (typeof window === 'undefined') return;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    const notes =
      type === 'alarm'
        ? [523.25, 659.25, 783.99, 1046.5] // C5 - E5 - G5 - C6
        : [587.33, 880.0, 1174.66]; // D5 - A5 - D6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.16;
      const duration = 0.45;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    });

    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, 1500);
  } catch {
    // Ignore autoplay restriction errors gracefully
  }
}
