/**
 * Synthesized sound effects using the Web Audio API.
 * No external audio files required — everything is generated at runtime.
 */

let _ctx: AudioContext | null = null;

function ctx(): AudioContext {
  if (!_ctx) {
    _ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume if suspended (browsers require user-gesture before playing audio)
  if (_ctx.state === "suspended") {
    _ctx.resume().catch(() => {});
  }
  return _ctx;
}

/* ─── helpers ─── */

function tone(
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.12,
) {
  const ac = ctx();
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, startTime);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function noise(startTime: number, duration: number, gain = 0.06) {
  const ac = ctx();
  const buf = ac.createBuffer(1, ac.sampleRate * duration, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, startTime);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  // band-pass to make it a soft snare-like click
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 3000;
  filter.Q.value = 0.7;
  src.connect(filter).connect(g).connect(ac.destination);
  src.start(startTime);
  src.stop(startTime + duration);
}

/* ─── public API ─── */

/** Short click when the player taps HI or LO */
export function playBetSound() {
  try {
    const t = ctx().currentTime;
    tone(800, t, 0.06, "square", 0.08);
    tone(1200, t + 0.03, 0.06, "square", 0.06);
  } catch { /* audio not available */ }
}

/** Rapid ascending tick sequence while "Rolling…" */
export function playRollSound() {
  try {
    const t = ctx().currentTime;
    const steps = 6;
    for (let i = 0; i < steps; i++) {
      const freq = 400 + i * 120;
      tone(freq, t + i * 0.06, 0.07, "triangle", 0.07);
    }
    noise(t, 0.08, 0.04);
  } catch { /* audio not available */ }
}

/** Bright ascending arpeggio on WIN */
export function playWinSound() {
  try {
    const t = ctx().currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((f, i) => {
      tone(f, t + i * 0.09, 0.22, "sine", 0.13);
      tone(f * 1.5, t + i * 0.09, 0.18, "triangle", 0.04); // shimmer harmonic
    });
  } catch { /* audio not available */ }
}

/** Descending two-tone on LOSE */
export function playLoseSound() {
  try {
    const t = ctx().currentTime;
    tone(440, t, 0.18, "sine", 0.10);
    tone(330, t + 0.12, 0.22, "sine", 0.10);
    tone(260, t + 0.26, 0.30, "sine", 0.08);
  } catch { /* audio not available */ }
}

/** Neutral single boop on PUSH */
export function playPushSound() {
  try {
    const t = ctx().currentTime;
    tone(520, t, 0.15, "sine", 0.10);
    tone(520, t + 0.18, 0.15, "sine", 0.08);
  } catch { /* audio not available */ }
}
