'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { profile } from '@/content/profile';
import { useTheme, Theme } from '@/hooks/useTheme';
import { ThemeToggle } from './ThemeToggle';
import { CommandChips } from './CommandChips';
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
import { NotFoundOutput } from './outputs/NotFoundOutput';
import { ThemeOutput } from './outputs/ThemeOutput';

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
  | 'not_found'
  | 'empty';

export interface HistoryItem {
  id: string;
  command: string;
  outputType: OutputType;
  themeState?: Theme;
  rawCommand?: string;
}

const AUTOCOMPLETE_COMMANDS = [
  'whoami',
  'about',
  'experience',
  'projects',
  'research',
  'skills',
  'education',
  'contact',
  'cv',
  'ls',
  'help',
  'theme',
  'clear',
  'resume',
  'work',
  'jobs',
  'email',
  'links',
  'github',
  'linkedin',
  'info',
];

export const Terminal: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [pendingInput, setPendingInput] = useState('');

  // Auto-typing states
  const [isAutoTyping, setIsAutoTyping] = useState(true);
  const [autoTypingText, setAutoTypingText] = useState('');

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const autoTypingCompletedRef = useRef(false);

  const scrollToBottom = useCallback((smooth = true) => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Finish typing instantly
  const finishAutoTyping = useCallback(() => {
    if (autoTypingCompletedRef.current) return;
    autoTypingCompletedRef.current = true;
    setIsAutoTyping(false);
    setAutoTypingText('');
    setHistory((prev) => {
      // If whoami is already in history, don't duplicate
      if (prev.some((item) => item.outputType === 'whoami')) return prev;
      return [
        ...prev,
        {
          id: 'init-whoami',
          command: 'whoami',
          outputType: 'whoami',
        },
      ];
    });
    // Scroll and focus
    setTimeout(() => {
      scrollToBottom(false);
      focusInput();
    }, 10);
  }, [focusInput, scrollToBottom]);

  // Initial auto-typing logic
  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      finishAutoTyping();
      return;
    }

    const targetText = 'whoami';
    let currentIdx = 0;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const typeNextChar = () => {
      if (autoTypingCompletedRef.current) return;

      if (currentIdx < targetText.length) {
        currentIdx += 1;
        setAutoTypingText(targetText.slice(0, currentIdx));
        timerId = setTimeout(typeNextChar, 90);
      } else {
        // Pause briefly after typing "whoami" before outputting
        timerId = setTimeout(() => {
          finishAutoTyping();
        }, 120);
      }
    };

    // Start typing after initial brief pause
    timerId = setTimeout(typeNextChar, 250);

    // Any user action during typing finishes it instantly
    const handleUserAction = () => {
      finishAutoTyping();
    };

    window.addEventListener('keydown', handleUserAction, { capture: true, once: true });
    window.addEventListener('pointerdown', handleUserAction, { capture: true, once: true });
    window.addEventListener('touchstart', handleUserAction, { capture: true, once: true });

    return () => {
      if (timerId) clearTimeout(timerId);
      window.removeEventListener('keydown', handleUserAction, { capture: true });
      window.removeEventListener('pointerdown', handleUserAction, { capture: true });
      window.removeEventListener('touchstart', handleUserAction, { capture: true });
    };
  }, [finishAutoTyping]);

  // Auto-scroll when history or typing updates
  useEffect(() => {
    scrollToBottom();
  }, [history, autoTypingText, scrollToBottom]);

  // Command parser and runner
  const executeCommand = useCallback(
    (rawCmd: string) => {
      // If typing was still going, complete it first
      if (isAutoTyping) {
        finishAutoTyping();
      }

      const trimmed = rawCmd.trim();

      // Clear input and reset history navigation
      setInputValue('');
      setHistoryIndex(-1);
      setPendingInput('');

      if (!trimmed) {
        // Empty command: display an empty prompt line
        setHistory((prev) => [
          ...prev,
          {
            id: `cmd-${Date.now()}-${Math.random()}`,
            command: '',
            outputType: 'empty',
          },
        ]);
        return;
      }

      // Add to command history
      setCommandHistory((prev) => [...prev, trimmed]);

      // Check for sudo
      if (trimmed.toLowerCase().startsWith('sudo')) {
        setHistory((prev) => [
          ...prev,
          {
            id: `cmd-${Date.now()}-${Math.random()}`,
            command: trimmed,
            outputType: 'sudo',
          },
        ]);
        return;
      }

      // Parse command and alias
      const commandName = trimmed.toLowerCase();

      // Clear command: empties screen without echoing
      if (commandName === 'clear') {
        setHistory([]);
        return;
      }

      // Theme command: toggles theme and displays switched message
      if (commandName === 'theme') {
        const nextTheme = toggleTheme();
        setHistory((prev) => [
          ...prev,
          {
            id: `cmd-${Date.now()}-${Math.random()}`,
            command: trimmed,
            outputType: 'theme',
            themeState: nextTheme,
          },
        ]);
        return;
      }

      // Normal commands & aliases mapping
      let resolvedType: OutputType | null = null;

      switch (commandName) {
        case 'whoami':
        case 'info':
          resolvedType = 'whoami';
          break;
        case 'about':
          resolvedType = 'about';
          break;
        case 'experience':
        case 'work':
        case 'jobs':
          resolvedType = 'experience';
          break;
        case 'projects':
          resolvedType = 'projects';
          break;
        case 'research':
          resolvedType = 'research';
          break;
        case 'skills':
          resolvedType = 'skills';
          break;
        case 'education':
          resolvedType = 'education';
          break;
        case 'contact':
        case 'email':
        case 'links':
        case 'github':
        case 'linkedin':
          resolvedType = 'contact';
          break;
        case 'cv':
        case 'resume':
          resolvedType = 'cv';
          break;
        case 'ls':
          resolvedType = 'ls';
          break;
        case 'help':
        case '?':
        case 'man':
          resolvedType = 'help';
          break;
        default:
          resolvedType = 'not_found';
          break;
      }

      setHistory((prev) => [
        ...prev,
        {
          id: `cmd-${Date.now()}-${Math.random()}`,
          command: trimmed,
          outputType: resolvedType,
          rawCommand: trimmed,
        },
      ]);
    },
    [isAutoTyping, finishAutoTyping, toggleTheme]
  );

  // Key navigation for input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Autocomplete on Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputValue.trim().toLowerCase();
      if (!current) return;

      const matches = AUTOCOMPLETE_COMMANDS.filter((cmd) =>
        cmd.startsWith(current)
      );

      // Tab autocompletes when exactly one command matches
      if (matches.length === 1) {
        setInputValue(matches[0]);
      }
      return;
    }

    // Command execution on Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(inputValue);
      return;
    }

    // History walk ArrowUp
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      if (historyIndex === -1) {
        // Save current input before navigating
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

    // History walk ArrowDown
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;

      if (historyIndex < commandHistory.length - 1) {
        const newIdx = historyIndex + 1;
        setHistoryIndex(newIdx);
        setInputValue(commandHistory[newIdx]);
      } else {
        // Restore pending input
        setHistoryIndex(-1);
        setInputValue(pendingInput);
      }
      return;
    }
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
      case 'not_found':
        return <NotFoundOutput command={item.rawCommand || item.command} />;
      case 'empty':
      default:
        return null;
    }
  };

  return (
    <div
      className="w-full max-w-[880px] h-[88vh] max-h-[820px] min-h-[520px] flex flex-col rounded-lg border border-term-border bg-term-panel overflow-hidden transition-colors"
      onClick={() => {
        // Clicking terminal background focuses input
        focusInput();
      }}
    >
      {/* Terminal Title Bar */}
      <div className="h-10 px-3 sm:px-4 bg-term-bar border-b border-term-border flex items-center justify-between select-none shrink-0">
        <div className="flex items-center space-x-2">
          <span
            className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block border border-[#e0443e]/40"
            aria-hidden="true"
          />
          <span
            className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block border border-[#dea123]/40"
            aria-hidden="true"
          />
          <span
            className="w-3 h-3 rounded-full bg-[#27c93f] inline-block border border-[#1aab29]/40"
            aria-hidden="true"
          />
        </div>

        <div className="text-xs sm:text-sm font-mono text-term-dim truncate px-2">
          {profile.meta.windowTitle}
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </div>

      {/* Terminal Screen */}
      <div
        ref={screenRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-mono text-xs sm:text-sm leading-relaxed"
      >
        {/* Accessible Output Log */}
        <div
          role="log"
          aria-live="polite"
          aria-label="Terminal output log"
          className="space-y-4"
        >
          {history.map((item) => (
            <div key={item.id} className="space-y-1.5">
              {item.command !== '' && (
                <div className="flex items-baseline flex-wrap">
                  <span className="text-term-prompt font-semibold mr-2 select-none">
                    {profile.meta.prompt}
                  </span>
                  <span className="text-term-text font-medium break-all">
                    {item.command}
                  </span>
                </div>
              )}
              <div className="text-term-text">{renderOutput(item)}</div>
            </div>
          ))}
        </div>

        {/* Live Auto-Typing Prompt (if active) */}
        {isAutoTyping && (
          <div className="flex items-baseline flex-wrap">
            <span className="text-term-prompt font-semibold mr-2 select-none">
              {profile.meta.prompt}
            </span>
            <span className="text-term-text font-medium">{autoTypingText}</span>
            <span
              className="inline-block w-2 h-4 bg-term-prompt ml-0.5 animate-pulse align-middle"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Real Interactive Input Line (active when not auto-typing) */}
        {!isAutoTyping && (
          <div
            className="flex items-baseline flex-wrap pt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <label
              htmlFor="terminal-command-input"
              className="text-term-prompt font-semibold mr-2 select-none shrink-0"
            >
              {profile.meta.prompt}
            </label>
            <div className="flex-1 min-w-[140px] flex items-center">
              <input
                ref={inputRef}
                id="terminal-command-input"
                type="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                aria-label="Terminal command line"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-term-text font-mono text-base sm:text-sm outline-none border-none p-0 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
        )}

        <div ref={terminalEndRef} aria-hidden="true" />
      </div>

      {/* Bottom Command Chips */}
      <div onClick={(e) => e.stopPropagation()}>
        <CommandChips
          onRunCommand={(cmd) => executeCommand(cmd)}
          onFocusInput={focusInput}
        />
      </div>
    </div>
  );
};
