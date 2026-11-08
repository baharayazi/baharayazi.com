'use client';

import React from 'react';

interface CommandChipsProps {
  onRunCommand: (command: string) => void;
  onFocusInput: () => void;
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

export const CommandChips: React.FC<CommandChipsProps> = ({
  onRunCommand,
  onFocusInput,
}) => {
  const handleClick = (cmd: string) => {
    onRunCommand(cmd);
    // On touch devices do not auto-focus the input after a chip tap (it would open the keyboard);
    // on desktop, focus the input.
    if (typeof window !== 'undefined') {
      const isTouch =
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;
      if (!isTouch) {
        onFocusInput();
      }
    }
  };

  return (
    <nav
      aria-label="Quick command shortcuts"
      className="p-3 border-t border-term-border bg-term-bar flex flex-wrap items-center gap-1.5 sm:gap-2"
    >
      <span className="text-xs text-term-dim font-mono select-none mr-1 hidden sm:inline">
        Quick run:
      </span>
      {CHIP_COMMANDS.map((cmd) => (
        <button
          key={cmd}
          type="button"
          onClick={() => handleClick(cmd)}
          className="px-2.5 py-1 text-xs font-mono rounded border border-term-border bg-term-panel text-term-dim hover:text-term-text hover:border-term-prompt focus-visible:ring-2 focus-visible:ring-term-accent focus-visible:outline-none transition-colors"
        >
          {cmd}
        </button>
      ))}
    </nav>
  );
};
