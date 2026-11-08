'use client';

import React, { useEffect, useState } from 'react';
import { COFFEE_ART, COFFEE_LINES } from '@/content/easter-eggs';
import { prefersReducedMotion } from '../terminal-context';

const STEPS = 10;

export const CoffeeOutput: React.FC = () => {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setFilled(STEPS);
      return;
    }
    const timer = setInterval(() => {
      setFilled((f) => {
        if (f + 1 >= STEPS) clearInterval(timer);
        return Math.min(f + 1, STEPS);
      });
    }, 110);
    return () => clearInterval(timer);
  }, []);

  const done = filled >= STEPS;

  return (
    <div className="space-y-2">
      <pre className="font-mono leading-[1.3]" aria-hidden="true">
        {COFFEE_ART.map((line, i) => (
          <span key={i} className={`block ${i < 2 ? 'steam text-term-dim' : 'text-term-accent'}`}>
            {line}
          </span>
        ))}
      </pre>
      <div className="text-term-text">
        {COFFEE_LINES.brewing}{' '}
        <span className="text-term-accent" aria-hidden="true">
          [{'█'.repeat(filled)}
          {'░'.repeat(STEPS - filled)}]
        </span>{' '}
        {done ? '100%' : `${filled * 10}%`}
      </div>
      {done && (
        <div className="space-y-1">
          <div className="text-term-prompt">{COFFEE_LINES.done}</div>
          <div className="text-term-text">{COFFEE_LINES.quip}</div>
          <div className="text-term-dim">{COFFEE_LINES.invite}</div>
        </div>
      )}
    </div>
  );
};
