'use client';

/**
 * Tiny sound effects, synthesized with the Web Audio API (no audio files).
 * Sound is off until the visitor turns it on; the choice is remembered.
 * Every effect is a no-op while sound is off, so callers never need to check.
 */

const STORAGE_KEY = 'bahar_sound';
const MASTER_VOLUME = 0.2;

type Listener = () => void;

let enabled = false;
let loaded = false;
const listeners = new Set<Listener>();
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try {
    enabled = window.localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    enabled = false;
  }
}

export function isSoundOn(): boolean {
  load();
  return enabled;
}

export function subscribeSound(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setSound(on: boolean) {
  load();
  enabled = on;
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // Private mode or blocked storage: the choice just won't be remembered.
  }
  listeners.forEach((listener) => listener());
  if (on) sfx.powerOn();
}

/** Returns a running audio context, or null when sound is off or unsupported. */
function audio(): AudioContext | null {
  if (!isSoundOn() || typeof window === 'undefined') return null;
  if (!ctx) {
    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return null;
    try {
      ctx = new AudioCtor();
    } catch {
      return null;
    }
    master = ctx.createGain();
    master.gain.value = MASTER_VOLUME;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume().catch(() => {});
  return ctx;
}

interface ToneOptions {
  type?: OscillatorType;
  /** Seconds from now. */
  at?: number;
  duration: number;
  gain?: number;
  /** Glide to this frequency over the duration. */
  to?: number;
  attack?: number;
}

function tone(freq: number, { type = 'square', at = 0, duration, gain = 0.3, to, attack = 0.004 }: ToneOptions) {
  const ac = audio();
  if (!ac || !master) return;
  const start = ac.currentTime + at;
  const osc = ac.createOscillator();
  const env = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, start + duration);
  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(gain, start + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(env).connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

interface NoiseOptions {
  at?: number;
  duration: number;
  gain?: number;
  /** Band-pass center frequency. */
  freq: number;
  /** Sweep the band-pass to this frequency over the duration. */
  to?: number;
  q?: number;
  attack?: number;
}

function noise({ at = 0, duration, gain = 0.3, freq, to, q = 1.2, attack = 0.002 }: NoiseOptions) {
  const ac = audio();
  if (!ac || !master) return;
  if (!noiseBuffer) {
    noiseBuffer = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  const start = ac.currentTime + at;
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer;
  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = q;
  filter.frequency.setValueAtTime(freq, start);
  if (to) filter.frequency.exponentialRampToValueAtTime(to, start + duration);
  const env = ac.createGain();
  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(gain, start + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  src.connect(filter).connect(env).connect(master);
  src.start(start, Math.random() * 0.5);
  src.stop(start + duration + 0.02);
}

const jitter = (value: number, amount: number) => value * (1 + (Math.random() * 2 - 1) * amount);

export const sfx = {
  /** A mechanical key press, slightly different each time. */
  key() {
    noise({ duration: 0.03, freq: jitter(3200, 0.2), gain: 0.35, q: 2 });
    tone(jitter(1900, 0.05), { type: 'triangle', duration: 0.018, gain: 0.04 });
  },
  /** A lower, rounder keycap "thock" for clicks on buttons. */
  tap() {
    noise({ duration: 0.05, freq: jitter(1300, 0.1), gain: 0.4, q: 1.6 });
    tone(jitter(210, 0.05), { type: 'sine', duration: 0.06, gain: 0.25 });
  },
  /** Enter: a short two-step blip. */
  enter() {
    tone(880, { duration: 0.05, gain: 0.12 });
    tone(1320, { at: 0.05, duration: 0.07, gain: 0.1 });
  },
  /** Wrong or "dangerous" command: a low double buzz. */
  error() {
    tone(170, { type: 'sawtooth', at: 0.06, duration: 0.12, gain: 0.16, to: 120 });
    tone(150, { type: 'sawtooth', at: 0.22, duration: 0.16, gain: 0.16, to: 95 });
  },
  /** Coffee: a pour, a few bubbles, then a ding when the cup is full. */
  coffee() {
    noise({ at: 0.05, duration: 1.05, freq: 500, to: 1500, gain: 0.25, q: 0.9, attack: 0.08 });
    for (let i = 0; i < 6; i += 1) {
      tone(jitter(650, 0.3), { type: 'sine', at: 0.2 + i * 0.14 + Math.random() * 0.05, duration: 0.05, gain: 0.08, to: jitter(950, 0.2) });
    }
    tone(1568, { type: 'sine', at: 1.15, duration: 0.7, gain: 0.18 });
    tone(2349, { type: 'sine', at: 1.15, duration: 0.5, gain: 0.07 });
  },
  /** Konami code: a little 8-bit victory jingle. */
  konami() {
    [523, 659, 784, 1047, 784, 1047, 1319].forEach((freq, i) => {
      tone(freq, { at: i * 0.085, duration: 0.09, gain: 0.12 });
    });
    tone(1568, { type: 'triangle', at: 0.62, duration: 0.5, gain: 0.14 });
  },
  /** Matrix: a burst of glitchy digital notes. */
  matrix() {
    for (let i = 0; i < 14; i += 1) {
      tone(200 + Math.random() * 1400, { at: i * 0.035, duration: 0.03, gain: 0.07 });
    }
    tone(1200, { type: 'sawtooth', at: 0.5, duration: 0.5, gain: 0.06, to: 60 });
  },
  /** Played when sound is switched on. */
  powerOn() {
    tone(220, { type: 'sine', duration: 0.28, gain: 0.2, to: 880 });
    tone(1319, { type: 'triangle', at: 0.26, duration: 0.35, gain: 0.12 });
  },
  gameStart() {
    [440, 660, 880].forEach((freq, i) => tone(freq, { at: i * 0.07, duration: 0.08, gain: 0.12 }));
  },
  gameCatch() {
    tone(988, { duration: 0.06, gain: 0.12 });
    tone(1319, { at: 0.06, duration: 0.09, gain: 0.12 });
  },
  gameFalseAlarm() {
    tone(196, { type: 'triangle', duration: 0.14, gain: 0.3 });
  },
  gameMiss() {
    tone(880, { type: 'sawtooth', duration: 0.12, gain: 0.08 });
    tone(660, { type: 'sawtooth', at: 0.13, duration: 0.16, gain: 0.08 });
  },
  gameOver() {
    [784, 659, 523, 392].forEach((freq, i) => tone(freq, { at: i * 0.14, duration: 0.15, gain: 0.12 }));
    tone(196, { type: 'triangle', at: 0.58, duration: 0.5, gain: 0.25 });
  },
};
