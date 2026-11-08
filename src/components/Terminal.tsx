'use client';

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { profile } from '@/content/profile';
import { useTheme, Theme } from '@/hooks/useTheme';
import { ThemeToggle } from './ThemeToggle';
import { CommandChips } from './CommandChips';
import {
  COMPLETIONS,
  OutputType,
  TerminalContext,
  isCoarsePointer,
  parseCommand,
  prefersReducedMotion,
} from './terminal-context';
import { Effects, EffectName } from './Effects';
import { KONAMI_SEQUENCE } from '@/content/easter-eggs';
import { WhoamiOutput } from './outputs/WhoamiOutput';
import { AboutOutput } from './outputs/AboutOutput';
import { ExperienceOutput } from './outputs/ExperienceOutput';
import { ProjectsOutput } from './outputs/ProjectsOutput';
import { ResearchOutput } from './outputs/ResearchOutput';
import { SkillsOutput } from './outputs/SkillsOutput';
import { EducationOutput } from './outputs/EducationOutput';
import { ContactOutput } from './outputs/ContactOutput';
import { CvOutput } from './outputs/CvOutput';
import { LsOutput } from './outputs/LsOutput';
import { HelpOutput } from './outputs/HelpOutput';
import { SudoOutput } from './outputs/SudoOutput';
import { MischiefOutput } from './outputs/MischiefOutput';
import { NotFoundOutput } from './outputs/NotFoundOutput';
import { ThemeOutput } from './outputs/ThemeOutput';
import { FunOutput } from './outputs/FunOutput';
import { CoffeeOutput } from './outputs/CoffeeOutput';
import { BaharOutput } from './outputs/BaharOutput';
import { GitLogOutput } from './outputs/GitLogOutput';
import { HistoryOutput } from './outputs/HistoryOutput';
import { PingOutput } from './outputs/PingOutput';
import { DateOutput } from './outputs/DateOutput';
import { UptimeOutput } from './outputs/UptimeOutput';
import { MatrixOutput } from './outputs/MatrixOutput';
import { KonamiOutput } from './outputs/KonamiOutput';

export type { OutputType };

export interface HistoryItem {
  id: string;
  command: string;
  outputType: OutputType;
  themeState?: Theme;
  mischief?: { error: string; quip: string; attempt: number };
  /** Lines for one-liner jokes (vim, exit, tea...). */
  lines?: string[];
  /** Commands typed so far, for `history`. */
  entries?: string[];
  /** When the command ran, for `date` and `uptime`. */
  at?: number;
  reduced?: boolean;
}

const BOOT_COMMAND = 'whoami';

// useLayoutEffect warns during static prerendering; fall back to useEffect there.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function Prompt() {
  return (
    <span className="mr-2 shrink-0 select-none font-semibold text-term-prompt">
      {profile.meta.prompt}
    </span>
  );
}

export const Terminal: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [pendingInput, setPendingInput] = useState('');

  const [isAutoTyping, setIsAutoTyping] = useState(true);
  const [autoTypingText, setAutoTypingText] = useState('');
  const [effect, setEffect] = useState<EffectName | null>(null);
  const mischiefCountRef = useRef(0);
  /** Everything typed this visit, like a real shell history. */
  const typedRef = useRef<string[]>([]);
  const endEffect = useCallback(() => setEffect(null), []);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const autoTypingCompletedRef = useRef(false);
  const idCounterRef = useRef(0);
  /** Entry to bring to the top of the screen after the next render. */
  const scrollTargetRef = useRef<string | null>(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  /** Focus only on devices with a precise pointer, so phones do not pop up the keyboard. */
  const focusInputIfDesktop = useCallback(() => {
    if (!isCoarsePointer()) focusInput();
  }, [focusInput]);

  const finishAutoTyping = useCallback(() => {
    if (autoTypingCompletedRef.current) return;
    autoTypingCompletedRef.current = true;
    setIsAutoTyping(false);
    setAutoTypingText('');
    setHistory((prev) =>
      prev.some((item) => item.id === 'init-whoami')
        ? prev
        : [{ id: 'init-whoami', command: BOOT_COMMAND, outputType: 'whoami' }, ...prev]
    );
    // Wait one frame so the real input exists before focusing it.
    requestAnimationFrame(() => focusInputIfDesktop());
  }, [focusInputIfDesktop]);

  // Boot sequence: type "whoami" once, then show its output.
  useEffect(() => {
    if (prefersReducedMotion()) {
      finishAutoTyping();
      return;
    }

    let idx = 0;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const typeNextChar = () => {
      if (autoTypingCompletedRef.current) return;
      if (idx < BOOT_COMMAND.length) {
        idx += 1;
        setAutoTypingText(BOOT_COMMAND.slice(0, idx));
        timerId = setTimeout(typeNextChar, 90);
      } else {
        timerId = setTimeout(finishAutoTyping, 160);
      }
    };

    timerId = setTimeout(typeNextChar, 300);

    const skip = () => finishAutoTyping();
    const opts = { capture: true } as const;
    window.addEventListener('keydown', skip, opts);
    window.addEventListener('pointerdown', skip, opts);

    return () => {
      if (timerId) clearTimeout(timerId);
      window.removeEventListener('keydown', skip, opts);
      window.removeEventListener('pointerdown', skip, opts);
    };
  }, [finishAutoTyping]);

  // Keep the newest command in view. Long outputs (experience, help) start at
  // the top of the screen instead of scrolling straight past their first lines.
  useIsomorphicLayoutEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
    const targetId = scrollTargetRef.current;
    scrollTargetRef.current = null;

    if (targetId) {
      const entry = screen.querySelector<HTMLElement>(`[data-entry="${targetId}"]`);
      if (entry) {
        screen.scrollTo({ top: Math.max(entry.offsetTop - 16, 0), behavior });
        return;
      }
    }
    screen.scrollTo({ top: screen.scrollHeight, behavior });
  }, [history, autoTypingText]);

  // Konami code: up up down down left right left right b a.
  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI_SEQUENCE[pos] ? pos + 1 : key === KONAMI_SEQUENCE[0] ? 1 : 0;
      if (pos < KONAMI_SEQUENCE.length) return;
      pos = 0;
      e.preventDefault();
      setInputValue('');
      const id = `cmd-${++idCounterRef.current}`;
      scrollTargetRef.current = id;
      setHistory((prev) => [...prev, { id, command: '↑ ↑ ↓ ↓ ← → ← → b a', outputType: 'konami' }]);
      if (!prefersReducedMotion()) setEffect('blossom');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // On desktop, typing anywhere on the page goes to the command line.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isAutoTyping || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length !== 1) return;
      const active = document.activeElement;
      if (active && active !== document.body && active.tagName !== 'MAIN') return;
      focusInput();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAutoTyping, focusInput]);

  const executeCommand = useCallback(
    (rawCmd: string) => {
      finishAutoTyping();

      const display = rawCmd.replace(/\s+/g, ' ').trim();
      setInputValue('');
      setHistoryIndex(-1);
      setPendingInput('');

      const parsed = parseCommand(display);

      if (display) typedRef.current.push(display);

      if (parsed.kind === 'clear') {
        setHistory([]);
        if (display) setCommandHistory((prev) => [...prev, display]);
        return;
      }

      const id = `cmd-${++idCounterRef.current}`;

      if (parsed.kind === 'empty') {
        setHistory((prev) => [...prev, { id, command: '', outputType: 'empty' }]);
        return;
      }

      setCommandHistory((prev) =>
        prev[prev.length - 1] === display ? prev : [...prev, display]
      );

      scrollTargetRef.current = id;

      let item: HistoryItem;
      if (parsed.kind === 'theme') {
        item = { id, command: display, outputType: 'theme', themeState: toggleTheme() };
      } else if (parsed.kind === 'sudo') {
        item = { id, command: display, outputType: 'sudo' };
      } else if (parsed.kind === 'mischief') {
        mischiefCountRef.current += 1;
        item = {
          id,
          command: display,
          outputType: 'mischief',
          mischief: { error: parsed.error, quip: parsed.quip, attempt: mischiefCountRef.current },
        };
      } else if (parsed.kind === 'fun') {
        item = { id, command: display, outputType: 'fun', lines: parsed.lines };
      } else if (parsed.kind === 'output') {
        item = { id, command: display, outputType: parsed.type };
        if (parsed.type === 'history') item.entries = [...typedRef.current];
        if (parsed.type === 'date' || parsed.type === 'uptime') item.at = Date.now();
        if (parsed.type === 'matrix') {
          item.reduced = prefersReducedMotion();
          if (!item.reduced) setEffect('matrix');
        }
      } else {
        item = { id, command: display, outputType: 'not_found' };
      }
      setHistory((prev) => [...prev, item]);
    },
    [finishAutoTyping, toggleTheme]
  );

  /** Run a command from a click (chip, ls entry, help entry). */
  const runFromClick = useCallback(
    (cmd: string) => {
      executeCommand(cmd);
      focusInputIfDesktop();
    },
    [executeCommand, focusInputIfDesktop]
  );

  const contextValue = useMemo(() => ({ run: runFromClick }), [runFromClick]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      const current = inputValue.trim().toLowerCase();
      if (!current) return; // let Tab move focus normally
      e.preventDefault();
      const matches = COMPLETIONS.filter((cmd) => cmd.startsWith(current));
      if (matches.length === 1) setInputValue(matches[0]);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(inputValue);
      return;
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      executeCommand('clear');
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      if (historyIndex === -1) {
        setPendingInput(inputValue);
        const newIdx = commandHistory.length - 1;
        setHistoryIndex(newIdx);
        setInputValue(commandHistory[newIdx]);
      } else if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setInputValue(commandHistory[newIdx]);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex < commandHistory.length - 1) {
        const newIdx = historyIndex + 1;
        setHistoryIndex(newIdx);
        setInputValue(commandHistory[newIdx]);
      } else {
        setHistoryIndex(-1);
        setInputValue(pendingInput);
      }
    }
  };

  // Clicking empty space focuses the input, but never steals a text selection
  // (so people can copy an email address) and never opens a phone keyboard.
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCoarsePointer()) return;
    const target = e.target as HTMLElement;
    if (target.closest('a, button, input')) return;
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;
    focusInput();
  };

  const renderOutput = (item: HistoryItem) => {
    switch (item.outputType) {
      case 'whoami':
        return <WhoamiOutput />;
      case 'about':
        return <AboutOutput />;
      case 'experience':
        return <ExperienceOutput />;
      case 'projects':
        return <ProjectsOutput />;
      case 'research':
        return <ResearchOutput />;
      case 'skills':
        return <SkillsOutput />;
      case 'education':
        return <EducationOutput />;
      case 'contact':
        return <ContactOutput />;
      case 'cv':
        return <CvOutput />;
      case 'ls':
        return <LsOutput />;
      case 'help':
        return <HelpOutput />;
      case 'theme':
        return <ThemeOutput theme={item.themeState || theme} />;
      case 'sudo':
        return <SudoOutput />;
      case 'mischief':
        return item.mischief ? <MischiefOutput {...item.mischief} /> : null;
      case 'fun':
        return <FunOutput lines={item.lines ?? []} />;
      case 'coffee':
        return <CoffeeOutput />;
      case 'bahar':
        return <BaharOutput />;
      case 'gitlog':
        return <GitLogOutput />;
      case 'history':
        return <HistoryOutput entries={item.entries ?? []} />;
      case 'ping':
        return <PingOutput />;
      case 'date':
        return <DateOutput at={item.at ?? 0} />;
      case 'uptime':
        return <UptimeOutput at={item.at ?? 0} />;
      case 'matrix':
        return <MatrixOutput reduced={!!item.reduced} />;
      case 'konami':
        return <KonamiOutput />;
      case 'not_found':
        return <NotFoundOutput command={item.command} />;
      default:
        return null;
    }
  };

  return (
    <TerminalContext.Provider value={contextValue}>
      <div className="terminal-window flex h-[calc(100dvh-4.5rem)] max-h-[820px] min-h-[460px] w-full max-w-[880px] flex-col overflow-hidden rounded-xl border border-term-border bg-term-panel transition-colors">
        {/* Title bar */}
        <div className="relative flex h-10 shrink-0 select-none items-center justify-between border-b border-term-border bg-term-bar px-3 sm:px-4">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="size-3 rounded-full bg-[#ff5f56]" />
            <span className="size-3 rounded-full bg-[#ffbd2e]" />
            <span className="size-3 rounded-full bg-[#27c93f]" />
          </div>

          <div className="pointer-events-none absolute inset-x-24 truncate text-center font-mono text-xs text-term-dim sm:text-sm">
            {profile.meta.windowTitle}
          </div>

          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        {/* Screen */}
        <div
          ref={screenRef}
          onClick={handleScreenClick}
          className="terminal-screen relative flex-1 overflow-y-auto overscroll-contain p-4 font-mono text-[13px] leading-relaxed sm:p-6 sm:text-sm"
        >
          <div
            role="log"
            aria-live="polite"
            aria-label="Terminal output log"
            className="space-y-5"
          >
            {history.map((item) => (
              <div key={item.id} data-entry={item.id} className="entry space-y-2">
                <div className="flex flex-wrap items-baseline">
                  <Prompt />
                  <span className="break-all font-medium text-term-text">{item.command}</span>
                </div>
                {item.outputType !== 'empty' && (
                  <div className="text-term-text">{renderOutput(item)}</div>
                )}
              </div>
            ))}
          </div>

          {isAutoTyping ? (
            <div className="flex flex-wrap items-baseline">
              <Prompt />
              <span className="font-medium text-term-text">{autoTypingText}</span>
              <span
                className="ml-0.5 inline-block h-[1.1em] w-[0.6em] animate-blink self-center bg-term-prompt"
                aria-hidden="true"
              />
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap items-baseline">
              <label
                htmlFor="terminal-command-input"
                className="mr-2 shrink-0 select-none font-semibold text-term-prompt"
              >
                {profile.meta.prompt}
              </label>
              <div className="flex min-w-[140px] flex-1 items-center">
                <input
                  ref={inputRef}
                  id="terminal-command-input"
                  type="text"
                  inputMode="text"
                  enterKeyHint="go"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label="Terminal command line"
                  aria-describedby="terminal-hint"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="terminal-input w-full border-none bg-transparent p-0 font-mono text-base text-term-text outline-none focus:outline-none focus:ring-0 sm:text-sm"
                />
              </div>
            </div>
          )}
          <p id="terminal-hint" className="sr-only">
            Type a command and press Enter. Type help to see every command.
          </p>
        </div>

        <CommandChips onRunCommand={runFromClick} />
      </div>
      <Effects effect={effect} onDone={endEffect} />
    </TerminalContext.Provider>
  );
};
