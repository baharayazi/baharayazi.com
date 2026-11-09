'use client';

import React from 'react';
import { sfx } from '@/lib/sound';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => {
        sfx.tap();
        onToggle();
      }}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme (or type "theme")`}
      className="toolbar-btn"
    >
      <span aria-hidden="true">{theme === 'dark' ? '☾' : '☼'}</span>
      <span>{theme}</span>
    </button>
  );
};
