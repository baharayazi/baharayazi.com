'use client';

import React from 'react';

interface CommandChipsProps {
  onRunCommand: (command: string) => void;
  /** Command whose key should look pressed (set briefly when it is typed). */
  pressed?: string | null;
}

export const CHIP_COMMANDS = [
  'whoami',
  'about',
  'experience',
  'projects',
  'research',
  'skills',
  'education',
  'contact',
  'cv',
  'game',
  'help',
  'theme',
  'clear',
] as const;

/** A row of keyboard keys: each one runs its command when pressed. */
export const CommandChips: React.FC<CommandChipsProps> = ({ onRunCommand, pressed }) => {
  return (
    <nav
      aria-label="Quick command shortcuts"
      className="chip-row flex shrink-0 items-center gap-2 overflow-x-auto border-t border-term-border bg-term-bar px-3 pb-3 pt-2.5 sm:flex-wrap sm:overflow-visible"
    >
      {CHIP_COMMANDS.map((cmd) => (
        <button
          key={cmd}
          type="button"
          onClick={() => onRunCommand(cmd)}
          className={`keycap shrink-0 whitespace-nowrap px-2.5 py-1 font-mono text-xs ${
            pressed === cmd ? 'is-pressed' : ''
          } ${cmd === 'game' ? 'keycap--fun' : ''}`}
        >
          {cmd}
        </button>
      ))}
    </nav>
  );
};
