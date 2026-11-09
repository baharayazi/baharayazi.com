'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GAME } from '@/content/easter-eggs';
import { sfx } from '@/lib/sound';
import { isCoarsePointer } from '../terminal-context';

const ROWS = 7;
/** Row (from the top) where lines can be flagged. */
const SCAN_ROW = 2;
const LIVES = 3;
const BEST_KEY = 'bahar_game_best';

type LineStatus = 'caught' | 'missed' | 'false';

interface LogLine {
  id: number;
  time: string;
  text: string;
  tag?: string;
  bad: boolean;
  status?: LineStatus;
}

type Phase = 'ready' | 'playing' | 'over' | 'quit';

interface GameState {
  lines: LogLine[];
  score: number;
  lives: number;
  caught: number;
  streak: number;
  seq: number;
  clock: number;
  badRun: number;
  lastText: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

function formatClock(seconds: number) {
  const h = Math.floor(seconds / 3600) % 24;
  const m = Math.floor(seconds / 60) % 60;
  return `${pad(h)}:${pad(m)}:${pad(seconds % 60)}`;
}

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

function nextLine(st: GameState, forceGood = false): LogLine {
  st.seq += 1;
  st.clock += 1 + Math.floor(Math.random() * 3);
  // Never three attacks in a row, so every attack can be caught.
  const bad = !forceGood && st.badRun < 2 && Math.random() < 0.3;
  st.badRun = bad ? st.badRun + 1 : 0;

  let text = '';
  let tag: string | undefined;
  do {
    if (bad) {
      const entry = pick(GAME.bad);
      text = entry.text;
      tag = entry.tag;
    } else {
      text = pick(GAME.good);
    }
  } while (text === st.lastText);
  st.lastText = text;

  return { id: st.seq, time: formatClock(st.clock), text, tag, bad };
}

function newGame(): GameState {
  const now = new Date();
  const st: GameState = {
    lines: [],
    score: 0,
    lives: LIVES,
    caught: 0,
    streak: 0,
    seq: 0,
    clock: now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds(),
    badRun: 0,
    lastText: '',
  };
  for (let i = 0; i < ROWS; i += 1) st.lines.push(nextLine(st, true));
  return st;
}

/** Time between log lines: starts relaxed and speeds up as attacks are caught. */
const tickDelay = (st: GameState) => Math.max(420, 1000 - st.caught * 40);

function readBest(): number {
  try {
    return Number(window.localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(score: number) {
  try {
    window.localStorage.setItem(BEST_KEY, String(score));
  } catch {
    // Ignore storage errors.
  }
}

interface GameOutputProps {
  /** True while this game owns the keyboard. Turning it off stops the game. */
  active: boolean;
  onExit: () => void;
}

export const GameOutput: React.FC<GameOutputProps> = ({ active, onExit }) => {
  const [initialState] = useState(newGame);
  const stateRef = useRef<GameState>(initialState);
  const [phase, setPhase] = useState<Phase>('ready');
  const phaseRef = useRef<Phase>('ready');
  const [, setFrame] = useState(0);
  const [message, setMessage] = useState('');
  const [best, setBest] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const [touch] = useState(() => isCoarsePointer());

  const render = useCallback(() => setFrame((n) => n + 1), []);

  const changePhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  useEffect(() => {
    setBest(readBest());
  }, []);

  const endGame = useCallback(() => {
    const st = stateRef.current;
    const previous = readBest();
    if (st.score > previous) {
      saveBest(st.score);
      setBest(st.score);
      setNewBest(true);
    } else {
      setBest(previous);
    }
    sfx.gameOver();
    changePhase('over');
    onExit();
  }, [changePhase, onExit]);

  const start = useCallback(() => {
    stateRef.current = newGame();
    setMessage('');
    sfx.gameStart();
    changePhase('playing');
  }, [changePhase]);

  const quit = useCallback(() => {
    changePhase('quit');
    onExit();
  }, [changePhase, onExit]);

  const flag = useCallback(() => {
    if (phaseRef.current !== 'playing') return;
    const st = stateRef.current;
    const line = st.lines[SCAN_ROW];
    if (!line || line.status) return;
    if (line.bad) {
      line.status = 'caught';
      st.caught += 1;
      st.streak += 1;
      const points = 10 + Math.min(st.streak - 1, 5) * 2;
      st.score += points;
      setMessage(`✔ Blocked: ${line.tag} (+${points}${st.streak > 1 ? `, streak ×${st.streak}` : ''})`);
      sfx.gameCatch();
    } else {
      line.status = 'false';
      st.streak = 0;
      st.score = Math.max(0, st.score - 5);
      setMessage('⚠ False alarm: that one was normal traffic (−5)');
      sfx.gameFalseAlarm();
    }
    render();
  }, [render]);

  // The log scrolls one line per tick while playing.
  useEffect(() => {
    if (phase !== 'playing') return;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const st = stateRef.current;
      // Pause while the tab is in the background.
      if (!document.hidden) {
        const leaving = st.lines[SCAN_ROW];
        if (leaving.bad && !leaving.status) {
          leaving.status = 'missed';
          st.lives -= 1;
          st.streak = 0;
          setMessage(
            st.lives > 0
              ? `✘ Missed: ${leaving.tag}. ${st.lives} ${st.lives === 1 ? 'life' : 'lives'} left.`
              : `✘ Missed: ${leaving.tag}.`
          );
          sfx.gameMiss();
        }
        st.lines = [...st.lines.slice(1), nextLine(st)];
        render();
        if (st.lives <= 0) {
          endGame();
          return;
        }
      }
      timer = setTimeout(tick, tickDelay(st));
    };

    timer = setTimeout(tick, tickDelay(stateRef.current));
    return () => clearTimeout(timer);
  }, [phase, endGame, render]);

  // Keyboard controls while this game is the foreground process.
  useEffect(() => {
    if (!active || (phase !== 'ready' && phase !== 'playing')) return;
    // Keep Space from also pressing whatever button was focused.
    (document.activeElement as HTMLElement | null)?.blur?.();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (e.repeat) return;
        if (phaseRef.current === 'ready') start();
        else flag();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'q') {
        e.preventDefault();
        e.stopPropagation();
        quit();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [active, phase, start, flag, quit]);

  // Another command was run (a chip, the quick view): stop like Ctrl+C.
  useEffect(() => {
    if (!active && (phaseRef.current === 'ready' || phaseRef.current === 'playing')) {
      changePhase('quit');
    }
  }, [active, changePhase]);

  const onBoxPointerDown = (e: React.PointerEvent) => {
    if (!active) return;
    e.preventDefault();
    if (phaseRef.current === 'ready') start();
    else flag();
  };

  const st = stateRef.current;
  const live = phase === 'ready' || phase === 'playing';
  const hearts = '♥'.repeat(Math.max(st.lives, 0)) + '♡'.repeat(LIVES - Math.max(st.lives, 0));
  const rank = GAME.ranks.find((r) => st.score < r.under)?.text;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="font-bold tracking-widest text-term-accent">{GAME.title}</span>
        <span className="text-xs text-term-dim">security on-call simulator</span>
      </div>

      {phase === 'ready' && (
        <div className="space-y-1 text-term-dim">
          {GAME.intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}

      <div
        aria-live="off"
        onPointerDown={onBoxPointerDown}
        className={`game-box max-w-[560px] select-none overflow-hidden rounded-md border bg-term-bg ${
          live && active ? 'cursor-pointer border-term-border-strong' : 'border-term-border'
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-term-border px-2 py-1 text-xs">
          <span className="truncate text-term-dim">$ {GAME.logFile}</span>
          <span className="shrink-0 whitespace-nowrap">
            <span className="text-term-text">score {st.score}</span>
            <span className="ml-2 text-term-red" aria-label={`${st.lives} lives`}>
              {hearts}
            </span>
          </span>
        </div>
        <div className="py-1">
          {st.lines.map((line, row) => {
            const scan = row === SCAN_ROW;
            const statusClass =
              line.status === 'caught'
                ? 'text-term-prompt line-through decoration-1'
                : line.status === 'missed'
                  ? 'text-term-red'
                  : line.status === 'false'
                    ? 'text-term-accent'
                    : scan
                      ? 'text-term-text'
                      : 'text-term-dim';
            return (
              <div
                key={line.id}
                className={`flex h-6 items-center gap-2 px-2 text-[12px] sm:text-[13px] ${
                  scan ? 'game-scan' : ''
                }`}
              >
                <span className={`w-3 shrink-0 ${scan ? 'text-term-accent' : 'text-transparent'}`} aria-hidden="true">
                  ▶
                </span>
                <span className="hidden shrink-0 text-term-dim opacity-70 sm:inline">{line.time}</span>
                <span className={`min-w-0 flex-1 truncate ${statusClass}`}>{line.text}</span>
                {line.status && (
                  <span
                    className={`shrink-0 text-[11px] font-semibold ${
                      line.status === 'caught'
                        ? 'text-term-prompt'
                        : line.status === 'missed'
                          ? 'text-term-red'
                          : 'text-term-accent'
                    }`}
                  >
                    {line.status === 'caught' ? 'BLOCKED' : line.status === 'missed' ? 'MISSED' : 'FALSE ALARM'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {phase === 'ready' && active && (
        <p className="text-term-prompt">
          {touch ? GAME.startTouch : GAME.startDesktop}
          {touch && (
            <button type="button" onClick={quit} className="ml-3 rounded-sm text-term-dim underline">
              quit
            </button>
          )}
        </p>
      )}

      {phase === 'playing' && (
        <p className="flex min-h-[1.5em] flex-wrap items-baseline justify-between gap-x-3 text-term-text">
          <span>{message || (touch ? 'Tap to flag the ▶ line.' : 'Space flags the ▶ line.')}</span>
          {touch && (
            <button type="button" onClick={quit} className="rounded-sm text-term-dim underline">
              quit
            </button>
          )}
        </p>
      )}

      {phase === 'over' && (
        <div className="space-y-1">
          <p className="font-semibold text-term-red">BREACH! {LIVES} attacks got through.</p>
          <p className="text-term-text">
            Final score <span className="text-term-accent">{st.score}</span> · caught {st.caught}{' '}
            {st.caught === 1 ? 'attack' : 'attacks'} · best {best}
            {newBest && <span className="ml-2 text-term-pink">new best!</span>}
          </p>
          <p className="text-term-dim">{rank}</p>
          <p className="text-term-dim">Play again: game</p>
        </div>
      )}

      {phase === 'quit' && (
        <p className="text-term-dim">
          ^C Game stopped. Score {st.score}. Come back any time: game
        </p>
      )}
    </div>
  );
};
