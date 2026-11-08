'use client';

import React, { useEffect, useRef } from 'react';

export type EffectName = 'matrix' | 'blossom';

interface EffectsProps {
  effect: EffectName | null;
  onDone: () => void;
}

const MATRIX_MS = 6000;
const BLOSSOM_MS = 6500;
const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789BAHARAYAZI<>/{}$#';

function MatrixRain({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 16;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops = Array.from({ length: Math.ceil(window.innerWidth / size) }, () =>
        Math.floor(Math.random() * -40)
      );
    };
    resize();
    window.addEventListener('resize', resize);

    const color = getComputedStyle(document.documentElement).getPropertyValue('--color-prompt').trim() || '#7ee2a8';
    let last = 0;
    let raf = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 50) return;
      last = t;
      ctx.fillStyle = 'rgba(5, 8, 11, 0.12)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = `${size}px ui-monospace, monospace`;
      drops.forEach((y, i) => {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        ctx.fillStyle = Math.random() > 0.96 ? '#e8fff1' : color;
        ctx.fillText(ch, i * size, y * size);
        drops[i] = y * size > window.innerHeight && Math.random() > 0.975 ? 0 : y + 1;
      });
    };
    raf = requestAnimationFrame(draw);

    const stop = window.setTimeout(onDone, MATRIX_MS);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(stop);
      window.removeEventListener('resize', resize);
    };
  }, [onDone]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}

function Blossoms({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const stop = window.setTimeout(onDone, BLOSSOM_MS);
    return () => window.clearTimeout(stop);
  }, [onDone]);

  // Fixed, deterministic layout so server and client agree.
  const petals = Array.from({ length: 36 }, (_, i) => ({
    left: (i * 37) % 100,
    delay: (i % 12) * 0.35,
    duration: 4 + (i % 5) * 0.6,
    size: 14 + (i % 4) * 6,
    glyph: i % 3 === 0 ? '❀' : '✿',
  }));

  return (
    <>
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal absolute top-0 text-term-pink"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.glyph}
        </span>
      ))}
    </>
  );
}

/** Full-screen visual effects. Any key or click ends them early. */
export const Effects: React.FC<EffectsProps> = ({ effect, onDone }) => {
  useEffect(() => {
    if (!effect) return;
    // Wait a moment so the key or click that started the effect does not end it.
    const arm = window.setTimeout(() => {
      window.addEventListener('keydown', onDone, { once: true });
      window.addEventListener('pointerdown', onDone, { once: true });
    }, 400);
    return () => {
      window.clearTimeout(arm);
      window.removeEventListener('keydown', onDone);
      window.removeEventListener('pointerdown', onDone);
    };
  }, [effect, onDone]);

  if (!effect) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 overflow-hidden ${
        effect === 'matrix' ? 'bg-black' : 'pointer-events-none'
      }`}
    >
      {effect === 'matrix' ? <MatrixRain onDone={onDone} /> : <Blossoms onDone={onDone} />}
    </div>
  );
};
