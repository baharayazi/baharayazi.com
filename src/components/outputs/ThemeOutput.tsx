import React from 'react';

interface ThemeOutputProps {
  theme: 'dark' | 'light';
}

export const ThemeOutput: React.FC<ThemeOutputProps> = ({ theme }) => {
  return (
    <div className="text-term-dim font-mono leading-relaxed">
      Switched to {theme} theme.
    </div>
  );
};
