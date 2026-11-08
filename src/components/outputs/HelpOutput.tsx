'use client';

import React from 'react';
import { profile } from '@/content/profile';
import { useTerminal } from '../terminal-context';

const EXTRAS = ['coffee', 'git log', 'history', 'ping', 'date', 'uptime', 'matrix', 'neofetch', 'cat bahar.txt'];

export const HelpOutput: React.FC = () => {
  const { run } = useTerminal();

  return (
    <div className="space-y-3">
      <div className="font-semibold text-term-accent">Available commands:</div>
      <dl className="grid grid-cols-1 gap-y-1.5 sm:grid-cols-[13ch_minmax(0,1fr)] sm:gap-x-3 sm:gap-y-1">
        {profile.help.map((item) => (
          <React.Fragment key={item.command}>
            <dt>
              <button
                type="button"
                onClick={() => run(item.command)}
                className="rounded-sm font-semibold text-term-prompt hover:underline"
              >
                {item.command}
              </button>
            </dt>
            <dd className="-mt-1 text-term-dim sm:mt-0">{item.description}</dd>
          </React.Fragment>
        ))}
      </dl>
      <div className="pt-1">
        <span className="font-semibold text-term-accent">Extras: </span>
        {EXTRAS.map((cmd, i) => (
          <React.Fragment key={cmd}>
            {i > 0 && <span className="text-term-dim"> · </span>}
            <button
              type="button"
              onClick={() => run(cmd)}
              className="rounded-sm text-term-pink hover:underline"
            >
              {cmd}
            </button>
          </React.Fragment>
        ))}
      </div>
      <p className="text-term-dim">There are a few secrets too. Some of them look dangerous. Go ahead, try.</p>
      <p className="pt-1 text-xs text-term-dim sm:text-[13px]">
        <span className="font-semibold text-term-text">Aliases: </span>
        {profile.aliases}
      </p>
      <p className="hidden text-xs text-term-dim sm:block sm:text-[13px]">
        <span className="font-semibold text-term-text">Keys: </span>
        Tab completes · ↑ ↓ walk history · Ctrl+L clears
      </p>
    </div>
  );
};
