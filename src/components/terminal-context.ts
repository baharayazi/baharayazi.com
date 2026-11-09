'use client';

import { createContext, useContext } from 'react';
import { FUN_REPLIES, findMischief } from '@/content/easter-eggs';

export type OutputType =
  | 'whoami'
  | 'about'
  | 'experience'
  | 'projects'
  | 'research'
  | 'skills'
  | 'education'
  | 'contact'
  | 'cv'
  | 'ls'
  | 'help'
  | 'theme'
  | 'sudo'
  | 'mischief'
  | 'fun'
  | 'coffee'
  | 'bahar'
  | 'gitlog'
  | 'history'
  | 'ping'
  | 'date'
  | 'uptime'
  | 'matrix'
  | 'konami'
  | 'game'
  | 'sound'
  | 'quick'
  | 'not_found'
  | 'empty';

/** Every word the terminal understands, mapped to the output it shows. */
export const COMMAND_MAP: Record<string, OutputType> = {
  whoami: 'whoami',
  info: 'whoami',
  neofetch: 'whoami',
  about: 'about',
  experience: 'experience',
  work: 'experience',
  jobs: 'experience',
  projects: 'projects',
  research: 'research',
  skills: 'skills',
  education: 'education',
  contact: 'contact',
  email: 'contact',
  links: 'contact',
  github: 'contact',
  linkedin: 'contact',
  cv: 'cv',
  resume: 'cv',
  'cv.pdf': 'cv',
  'bahar.txt': 'bahar',
  ls: 'ls',
  dir: 'ls',
  help: 'help',
  '?': 'help',
  man: 'help',
  coffee: 'coffee',
  history: 'history',
  ping: 'ping',
  date: 'date',
  time: 'date',
  uptime: 'uptime',
  matrix: 'matrix',
  game: 'game',
  play: 'game',
};

/** Words that open the one-page Quick view. */
const QUICK_WORDS = new Set(['quick', 'quickview', 'gui', 'tldr', 'recruiter']);

/** Sections that get their own shareable link: baharayazi.com/?cmd=projects */
export const SHAREABLE_SECTIONS = new Set<OutputType>([
  'about',
  'experience',
  'projects',
  'research',
  'skills',
  'education',
  'contact',
  'cv',
]);

/** Commands offered by Tab completion. */
export const COMPLETIONS = [
  ...Object.keys(COMMAND_MAP).filter((k) => /^[a-z]/.test(k) && !k.includes('.')),
  'git log',
  'cat bahar.txt',
  'theme',
  'clear',
  'quick',
  'sound',
];

/** Verbs that take a section as their argument: `cd projects`, `cat about`. */
const PASS_THROUGH_VERBS = new Set(['cd', 'cat', 'open', 'less', 'more', 'bat']);

export type ParsedCommand =
  | { kind: 'empty' }
  | { kind: 'clear' }
  | { kind: 'theme' }
  | { kind: 'sudo' }
  | { kind: 'mischief'; error: string; quip: string }
  | { kind: 'fun'; lines: string[] }
  | { kind: 'sound'; value: 'on' | 'off' | 'toggle' }
  | { kind: 'quick' }
  | { kind: 'output'; type: OutputType }
  | { kind: 'not_found' };

export function parseCommand(raw: string): ParsedCommand {
  const lower = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  const tokens = lower.split(' ').filter(Boolean);
  if (tokens.length === 0) return { kind: 'empty' };

  let [name] = tokens;
  if (name === 'sudo' || name === 'su' || name === 'doas') return { kind: 'sudo' };

  const mischief = findMischief(lower);
  if (mischief) return { kind: 'mischief', error: mischief.error, quip: mischief.quip };

  if (name === 'git' && tokens[1] === 'log') return { kind: 'output', type: 'gitlog' };

  // Whole-command jokes first (":q!", "hello"), then first-word ones ("vim notes.txt").
  const fun = FUN_REPLIES[lower] ?? FUN_REPLIES[name];
  if (fun) return { kind: 'fun', lines: fun.lines };

  if (PASS_THROUGH_VERBS.has(name) && tokens[1]) {
    name = tokens[1].replace(/\/+$/, '').replace(/^~\//, '');
  }

  if (name === 'clear' || name === 'cls') return { kind: 'clear' };
  if (name === 'sound' || name === 'mute' || name === 'unmute') {
    const arg = tokens[1];
    if (name === 'mute' || arg === 'off') return { kind: 'sound', value: 'off' };
    if (name === 'unmute' || arg === 'on') return { kind: 'sound', value: 'on' };
    return { kind: 'sound', value: 'toggle' };
  }
  if (QUICK_WORDS.has(name)) return { kind: 'quick' };
  if (name === 'theme') return { kind: 'theme' };

  const type = COMMAND_MAP[name];
  return type ? { kind: 'output', type } : { kind: 'not_found' };
}

export function isCoarsePointer(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches
  );
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

interface TerminalContextValue {
  run: (command: string) => void;
}

export const TerminalContext = createContext<TerminalContextValue>({
  run: () => {},
});

export function useTerminal() {
  return useContext(TerminalContext);
}
