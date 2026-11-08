import React from 'react';
import { SUDO_LINES } from '@/content/easter-eggs';

export const SudoOutput: React.FC = () => {
  return (
    <div className="space-y-1">
      <div className="text-term-red">{SUDO_LINES.error}</div>
      <div className="text-term-text">{SUDO_LINES.quip}</div>
    </div>
  );
};
