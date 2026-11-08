import React from 'react';
import { PERSISTENCE_NOTE, PERSISTENCE_THRESHOLD } from '@/content/easter-eggs';

interface MischiefOutputProps {
  error: string;
  quip: string;
  /** How many mischief commands this visitor has tried, including this one. */
  attempt: number;
}

export const MischiefOutput: React.FC<MischiefOutputProps> = ({ error, quip, attempt }) => {
  return (
    <div className="space-y-1">
      <div className="text-term-red">{error}</div>
      <div className="text-term-text">
        <span className="text-term-accent" aria-hidden="true">
          ¯\_(ツ)_/¯{' '}
        </span>
        {quip}
      </div>
      {attempt >= PERSISTENCE_THRESHOLD && (
        <div className="text-term-prompt">{PERSISTENCE_NOTE.replace('{n}', String(attempt))}</div>
      )}
    </div>
  );
};
