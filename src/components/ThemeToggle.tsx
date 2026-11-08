'use client';

import React from 'react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme (or type "theme")`}
      className="relative z-10 flex items-center gap-1 rounded-md border border-term-border px-2 py-0.5 font-mono text-xs text-term-dim transition-colors hover:border-term-dim hover:text-term-text"
    >
      <span aria-hidden="true">{theme === 'dark' ? '☾' : '☼'}</span>
      <span>{theme}</span>
    </button>
  );
};
