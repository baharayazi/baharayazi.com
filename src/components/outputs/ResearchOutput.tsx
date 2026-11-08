import React from 'react';
import { profile } from '@/content/profile';

export const ResearchOutput: React.FC = () => {
  const { research } = profile;
  return (
    <div className="space-y-2">
      <div className="font-semibold text-term-accent">{research.header}</div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <span className="font-semibold text-term-text">{research.title}</span>
        <span className="text-xs text-term-dim sm:text-[13px]">{research.period}</span>
      </div>
      <ul>
        {research.bullets.map((bullet, i) => (
          <li key={bullet} className="grid grid-cols-[3ch_minmax(0,1fr)]">
            <span className="select-none text-term-border-strong" aria-hidden="true">
              {i === research.bullets.length - 1 ? '└─' : '├─'}
            </span>
            <span className="text-term-text">{bullet}</span>
          </li>
        ))}
      </ul>
      <div className="pt-1 text-term-dim">Interests: {research.interests}</div>
    </div>
  );
};
