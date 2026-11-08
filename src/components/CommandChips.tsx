'use client';

import React from 'react';

interface CommandChipsProps {
  onRunCommand: (command: string) => void;
}

const CHIP_COMMANDS = [
  'whoami',
  'about',
  'experience',
  'projects',
  'research',
  'skills',
  'education',
  'contact',
  'cv',
  'help',
  'theme',
  'clear',
] as const;

export const CommandChips: React.FC<CommandChipsProps> = ({ onRunCommand }) => {
  return (
    <nav
      aria-label="Quick command shortcuts"
      className="chip-row flex shrink-0 items-center gap-1.5 overflow-x-auto border-t border-term-border bg-term-bar px-3 py-2.5 sm:flex-wrap sm:overflow-visible"
    >
      {CHIP_COMMANDS.map((cmd) => (
        <button
          key={cmd}
          type="button"
          onClick={() => onRunCommand(cmd)}
          className="chip shrink-0 whitespace-nowrap rounded-full border border-term-border bg-term-panel px-2 py-1 font-mono text-xs text-term-dim transition-colors hover:border-term-prompt hover:text-term-text"
        >
          {cmd}
        </button>
      ))}
    </nav>
  );
};
