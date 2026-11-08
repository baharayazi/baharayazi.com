import React from 'react';
import { KONAMI_LINES } from '@/content/easter-eggs';

export const KonamiOutput: React.FC = () => (
  <div className="space-y-1">
    {KONAMI_LINES.map((line, i) => (
      <div key={line} className={i === 0 ? 'font-semibold text-term-pink' : 'text-term-text'}>
        {line}
      </div>
    ))}
  </div>
);
