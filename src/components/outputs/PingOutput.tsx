'use client';

import React, { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../terminal-context';

const COUNT = 4;

export const PingOutput: React.FC = () => {
  // Pick the fake round-trip times once, so re-renders keep the same numbers.
  const [times] = useState(() =>
    Array.from({ length: COUNT }, () => Math.round((8 + Math.random() * 14) * 10) / 10)
  );
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(COUNT + 1);
      return;
    }
    const timer = setInterval(() => {
      setShown((s) => {
        if (s + 1 > COUNT) clearInterval(timer);
        return Math.min(s + 1, COUNT + 1);
      });
    }, 450);
    return () => clearInterval(timer);
  }, []);

  const avg = (times.reduce((a, b) => a + b, 0) / COUNT).toFixed(1);

  return (
    <div className="space-y-0.5">
      <div className="text-term-text">PING baharayazi.com: 56 data bytes</div>
      {times.slice(0, Math.min(shown, COUNT)).map((t, i) => (
        <div key={i} className="text-term-text">
          64 bytes from baharayazi.com: icmp_seq={i} ttl=57 time=
          <span className="text-term-prompt">{t.toFixed(1)} ms</span>
        </div>
      ))}
      {shown > COUNT && (
        <div className="space-y-0.5 pt-1">
          <div className="text-term-dim">--- baharayazi.com ping statistics ---</div>
          <div className="text-term-text">
            {COUNT} packets transmitted, {COUNT} received, 0% packet loss, avg {avg} ms
          </div>
          <div className="pt-1 text-term-accent">Bahar is online. Replies are even faster by email: run contact.</div>
        </div>
      )}
    </div>
  );
};
