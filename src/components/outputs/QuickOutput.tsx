'use client';

import React from 'react';
import { QUICK_LINES } from '@/content/easter-eggs';
import { useTerminal } from '../terminal-context';

export const QuickOutput: React.FC = () => {
  const { run } = useTerminal();
  return (
    <p className="text-term-text">
      {QUICK_LINES.opened}{' '}
      <button type="button" onClick={() => run('quick')} className="rounded-sm text-term-prompt hover:underline">
        Open again
      </button>
    </p>
  );
};
