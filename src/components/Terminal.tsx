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
import { SoundToggle } from './SoundToggle';
import { CommandChips, CHIP_COMMANDS } from './CommandChips';
import { QuickView } from './QuickView';
import {
  COMPLETIONS,
  OutputType,
  SHAREABLE_SECTIONS,
  TerminalContext,
  isCoarsePointer,
  parseCommand,
  prefersReducedMotion,
} from './terminal-context';
import { Effects, EffectName } from './Effects';
import { BOOT_LINES, KONAMI_SEQUENCE } from '@/content/easter-eggs';
import { isSoundOn, setSound, sfx } from '@/lib/sound';
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
import { GameOutput } from './outputs/GameOutput';
import { SoundOutput } from './outputs/SoundOutput';
import { QuickOutput } from './outputs/QuickOutput';

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
  soundOn?: boolean;
}

/** Where a command came from: typed, clicked, or typed by the boot sequence. */
type CommandSource = 'key' | 'click' | 'auto';

const DEFAULT_BOOT_COMMAND = 'whoami';
/** The boot log plays once per browser session. */
const BOOT_SEEN_KEY = 'bahar_booted';
const BOOT_LINE_MS = 140;

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

/** Replace the query string without adding a browser history entry. */
function replaceSearch(search: string) {
  try {
    const url = new URL(window.location.href);
    if (url.search === search) return;
    url.search = search;
    window.history.replaceState(window.history.state, '', url.toString());
  } catch {
    // Ignore: the address bar just won't update.
  }
}

/**
 * Reads a deep link like ?cmd=projects. Only real sections are accepted,
 * so a link can never type a joke or "dangerous" command for someone.
 */
function readDeepLink(search: string): { command: string; type: OutputType } | null {
  const raw = new URLSearchParams(search).get('cmd')?.trim().toLowerCase().slice(0, 30);
  if (!raw) return null;
  const parsed = parseCommand(raw);
  if (parsed.kind !== 'output') return null;
  const ok = SHAREABLE_SECTIONS.has(parsed.type) || parsed.type === 'help' || parsed.type === 'whoami';
  return ok ? { command: raw, type: parsed.type } : null;
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
  /** Boot log lines shown so far, or null when the boot log is not on screen. */
  const [bootCount, setBootCount] = useState<number | null>(null);
  const [effect, setEffect] = useState<EffectName | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  /** The game entry that currently owns the keyboard, if any. */
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [pressedChip, setPressedChip] = useState<string | null>(null);

  const mischiefCountRef = useRef(0);
  /** Everything typed this visit, like a real shell history. */
  const typedRef = useRef<string[]>([]);
  const endEffect = useCallback(() => setEffect(null), []);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const autoTypingCompletedRef = useRef(false);
  const idCounterRef = useRef(0);
  const bootCommandRef = useRef(DEFAULT_BOOT_COMMAND);
  /** Query string for the section on screen, restored when Quick view closes. */
  const sectionSearchRef = useRef('');
  const quickOpenRef = useRef(false);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Entry to bring to the top of the screen after the next render. */
  const scrollTargetRef = useRef<string | null>(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  /** Focus only on devices with a precise pointer, so phones do not pop up the keyboard. */
  const focusInputIfDesktop = useCallback(() => {
    if (!isCoarsePointer()) focusInput();
  }, [focusInput]);

  /** Point the address bar at the section on screen (or at nothing). */
  const setSectionUrl = useCallback((search: string) => {
    sectionSearchRef.current = search;
    if (!quickOpenRef.current) replaceSearch(search);
  }, []);

  const finishAutoTyping = useCallback(() => {
    if (autoTypingCompletedRef.current) return;
    autoTypingCompletedRef.current = true;
    setIsAutoTyping(false);
    setAutoTypingText('');
    setBootCount(null);
    try {
      window.sessionStorage.setItem(BOOT_SEEN_KEY, '1');
    } catch {
      // Ignore storage errors.
    }
    const command = bootCommandRef.current;
    const parsed = parseCommand(command);
    const outputType: OutputType = parsed.kind === 'output' ? parsed.type : 'whoami';
    setHistory((prev) =>
      prev.some((item) => item.id === 'init-whoami')
        ? prev
        : [{ id: 'init-whoami', command, outputType }, ...prev]
    );
    // Wait one frame so the real input exists before focusing it.
    requestAnimationFrame(() => {
      if (!quickOpenRef.current) focusInputIfDesktop();
    });
  }, [focusInputIfDesktop]);

  const openQuick = useCallback(() => {
    setActiveGameId(null);
    quickOpenRef.current = true;
    setQuickOpen(true);
    replaceSearch('?view=quick');
  }, []);

  const closeQuick = useCallback(() => {
    quickOpenRef.current = false;
    setQuickOpen(false);
    replaceSearch(sectionSearchRef.current);
    requestAnimationFrame(() => focusInputIfDesktop());
  }, [focusInputIfDesktop]);

  // Start-up: read deep links, play the boot log (first visit only), then
  // type the first command. Any key or click skips straight to the end.
  useEffect(() => {
    const search = window.location.search;
    const deepLink = readDeepLink(search);
    const wantsQuick = new URLSearchParams(search).get('view') === 'quick';

    if (deepLink) {
      bootCommandRef.current = deepLink.command;
      sectionSearchRef.current = SHAREABLE_SECTIONS.has(deepLink.type) ? `?cmd=${deepLink.type}` : '';
    }
    if (wantsQuick) {
      quickOpenRef.current = true;
      setQuickOpen(true);
    }
    // Tidy the address bar: drop unknown or unsafe parameters.
    if (search) replaceSearch(wantsQuick ? '?view=quick' : sectionSearchRef.current);

    if (prefersReducedMotion()) {
      finishAutoTyping();
      return;
    }

    let seenBoot = false;
    try {
      seenBoot = window.sessionStorage.getItem(BOOT_SEEN_KEY) === '1';
    } catch {
      seenBoot = false;
    }
    // Visitors arriving on a direct link or the Quick view want content, not a show.
    const showBoot = !seenBoot && !deepLink && !wantsQuick;
    const command = bootCommandRef.current;
    const charDelay = command.length > 6 ? 55 : 90;

    let timerId: ReturnType<typeof setTimeout> | null = null;
    let idx = 0;

    const typeNextChar = () => {
      if (autoTypingCompletedRef.current) return;
      if (idx < command.length) {
        idx += 1;
        setAutoTypingText(command.slice(0, idx));
        timerId = setTimeout(typeNextChar, charDelay);
      } else {
        timerId = setTimeout(finishAutoTyping, 160);
      }
    };

    let shown = 0;
    const showNextBootLine = () => {
      if (autoTypingCompletedRef.current) return;
      if (shown < BOOT_LINES.length) {
        shown += 1;
        setBootCount(shown);
        timerId = setTimeout(showNextBootLine, BOOT_LINE_MS);
      } else {
        timerId = setTimeout(() => {
          setBootCount(null);
          timerId = setTimeout(typeNextChar, 220);
        }, 380);
      }
    };

    if (showBoot) {
      setBootCount(0);
      timerId = setTimeout(showNextBootLine, 380);
    } else {
      timerId = setTimeout(typeNextChar, 300);
    }

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
  }, [history, autoTypingText, bootCount]);

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
      sfx.konami();
      if (!prefersReducedMotion()) setEffect('blossom');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // On desktop, typing anywhere on the page goes to the command line.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isAutoTyping || activeGameId || quickOpen || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length !== 1) return;
      const active = document.activeElement;
      if (active && active !== document.body && active.tagName !== 'MAIN') return;
      focusInput();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAutoTyping, activeGameId, quickOpen, focusInput]);

  useEffect(
    () => () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    },
    []
  );

  /** Briefly press the matching keycap when a command is typed. */
  const flashChip = useCallback((command: string) => {
    if (!(CHIP_COMMANDS as readonly string[]).includes(command)) return;
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    setPressedChip(command);
    pressTimerRef.current = setTimeout(() => setPressedChip(null), 160);
  }, []);

  const endGame = useCallback(() => {
    setActiveGameId(null);
    requestAnimationFrame(() => focusInputIfDesktop());
  }, [focusInputIfDesktop]);

  const executeCommand = useCallback(
    (rawCmd: string, source: CommandSource = 'key') => {
      finishAutoTyping();
      // Any new command stops a running game, like Ctrl+C.
      setActiveGameId(null);

      const display = rawCmd.replace(/\s+/g, ' ').trim();
      setInputValue('');
      setHistoryIndex(-1);
      setPendingInput('');

      if (source === 'key') {
        sfx.enter();
        flashChip(display.toLowerCase());
      } else if (source === 'click') {
        sfx.tap();
      }

      const parsed = parseCommand(display);

      if (display) typedRef.current.push(display);

      if (parsed.kind === 'clear') {
        setHistory([]);
        setSectionUrl('');
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
        sfx.error();
      } else if (parsed.kind === 'mischief') {
        mischiefCountRef.current += 1;
        item = {
          id,
          command: display,
          outputType: 'mischief',
          mischief: { error: parsed.error, quip: parsed.quip, attempt: mischiefCountRef.current },
        };
        sfx.error();
      } else if (parsed.kind === 'fun') {
        item = { id, command: display, outputType: 'fun', lines: parsed.lines };
      } else if (parsed.kind === 'sound') {
        const on = parsed.value === 'toggle' ? !isSoundOn() : parsed.value === 'on';
        setSound(on);
        item = { id, command: display, outputType: 'sound', soundOn: on };
      } else if (parsed.kind === 'quick') {
        item = { id, command: display, outputType: 'quick' };
        openQuick();
      } else if (parsed.kind === 'output') {
        item = { id, command: display, outputType: parsed.type };
        if (parsed.type === 'history') item.entries = [...typedRef.current];
        if (parsed.type === 'date' || parsed.type === 'uptime') item.at = Date.now();
        if (parsed.type === 'coffee') sfx.coffee();
        if (parsed.type === 'matrix') {
          item.reduced = prefersReducedMotion();
          if (!item.reduced) {
            setEffect('matrix');
            sfx.matrix();
          }
        }
        if (parsed.type === 'game') setActiveGameId(id);
        if (SHAREABLE_SECTIONS.has(parsed.type)) setSectionUrl(`?cmd=${parsed.type}`);
        else if (parsed.type === 'whoami') setSectionUrl('');
      } else {
        item = { id, command: display, outputType: 'not_found' };
        sfx.error();
      }
      setHistory((prev) => [...prev, item]);
    },
    [finishAutoTyping, toggleTheme, flashChip, setSectionUrl, openQuick]
  );

  /** Run a command from a click (chip, ls entry, help entry). */
  const runFromClick = useCallback(
    (cmd: string) => {
      executeCommand(cmd, 'click');
      focusInputIfDesktop();
    },
    [executeCommand, focusInputIfDesktop]
  );

  const contextValue = useMemo(() => ({ run: runFromClick }), [runFromClick]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!e.repeat && !e.metaKey && !e.ctrlKey && (e.key.length === 1 || e.key === 'Backspace')) {
      sfx.key();
    }

    if (e.key === 'Tab') {
      const current = inputValue.trim().toLowerCase();
      if (!current) return; // let Tab move focus normally
      e.preventDefault();
      const matches = COMPLETIONS.filter((cmd) => cmd.startsWith(current));
      if (matches.length === 1) {
        setInputValue(matches[0]);
        sfx.key();
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(inputValue, 'key');
      return;
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      executeCommand('clear', 'key');
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
    if (target.closest('a, button, input, .game-box')) return;
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
      case 'game':
        return <GameOutput active={activeGameId === item.id} onExit={endGame} />;
      case 'sound':
        return <SoundOutput on={!!item.soundOn} />;
      case 'quick':
        return <QuickOutput />;
      case 'not_found':
        return <NotFoundOutput command={item.command} />;
      default:
        return null;
    }
  };

  return (
    <TerminalContext.Provider value={contextValue}>
      <div className="terminal-window crt-on flex h-[calc(100dvh-4.5rem)] max-h-[820px] min-h-[460px] w-full max-w-[880px] flex-col overflow-hidden rounded-xl border border-term-border bg-term-panel transition-colors">
        {/* Title bar */}
        <div className="relative flex h-10 shrink-0 select-none items-center justify-between gap-2 border-b border-term-border bg-term-bar px-3 sm:px-4">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="size-3 rounded-full bg-[#ff5f56]" />
            <span className="size-3 rounded-full bg-[#ffbd2e]" />
            <span className="size-3 rounded-full bg-[#27c93f]" />
          </div>

          <div className="pointer-events-none absolute inset-x-24 hidden truncate text-center font-mono text-xs text-term-dim md:block md:text-sm">
            {profile.meta.windowTitle}
          </div>

          <div className="relative z-10 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                sfx.tap();
                openQuick();
              }}
              title={'Everything on one readable page (or type "quick")'}
              className="toolbar-btn toolbar-btn--accent"
            >
              <span aria-hidden="true">▤</span>
              <span>quick view</span>
            </button>
            <SoundToggle />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
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

          {bootCount !== null ? (
            <div className="space-y-0.5" aria-hidden="true">
              {BOOT_LINES.slice(0, bootCount).map((line) => (
                <div key={line.text} className="boot-line">
                  {line.status ? (
                    <>
                      <span className="text-term-dim">[</span>
                      <span className="font-semibold text-term-prompt">{` ${line.status} `}</span>
                      <span className="text-term-dim">]</span>{' '}
                      <span className="text-term-text">{line.text}</span>
                    </>
                  ) : (
                    <span className="text-term-dim">{line.text}</span>
                  )}
                </div>
              ))}
              <span className="inline-block h-[1.1em] w-[0.6em] animate-blink bg-term-prompt align-middle" />
            </div>
          ) : isAutoTyping ? (
            <div className="flex flex-wrap items-baseline">
              <Prompt />
              <span className="font-medium text-term-text">{autoTypingText}</span>
              <span
                className="ml-0.5 inline-block h-[1.1em] w-[0.6em] animate-blink self-center bg-term-prompt"
                aria-hidden="true"
              />
            </div>
          ) : activeGameId ? null : (
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

        <CommandChips onRunCommand={runFromClick} pressed={pressedChip} />
      </div>
      <Effects effect={effect} onDone={endEffect} />
      <QuickView open={quickOpen} onClose={closeQuick} />
    </TerminalContext.Provider>
  );
};
