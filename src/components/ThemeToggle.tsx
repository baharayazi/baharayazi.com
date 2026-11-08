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
      className="text-xs px-2 py-0.5 rounded border border-term-border text-term-dim hover:text-term-text hover:border-term-dim transition-colors focus-visible:ring-2 focus-visible:ring-term-accent focus-visible:outline-none"
    >
      <span aria-hidden="true" className="mr-1">
        {theme === 'dark' ? '☼' : '☾'}
      </span>
      <span>{theme}</span>
    </button>
  );
};
