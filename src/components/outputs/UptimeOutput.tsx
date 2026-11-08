import React from 'react';
import { profile } from '@/content/profile';
import { CAREER_START } from '@/content/easter-eggs';

export const UptimeOutput: React.FC<{ at: number }> = ({ at }) => {
  const now = new Date(at);
  const months =
    (now.getFullYear() - CAREER_START.year) * 12 + (now.getMonth() + 1 - CAREER_START.month);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const since = new Date(CAREER_START.year, CAREER_START.month - 1).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  const companies = new Set(profile.experience.map((j) => j.company)).size;

  return (
    <div className="space-y-1">
      <div className="text-term-text">
        up{' '}
        <span className="text-term-prompt">
          {years} {years === 1 ? 'year' : 'years'}, {rest} {rest === 1 ? 'month' : 'months'}
        </span>{' '}
        <span className="text-term-dim">(shipping backend code since {since})</span>
      </div>
      <div className="text-term-text">
        {companies} companies, 1 MASc in progress, 0 production incidents mentioned on this website
      </div>
      <div className="text-term-dim">load average: coffee, coffee, coffee</div>
    </div>
  );
};
