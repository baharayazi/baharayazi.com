'use client';

import React from 'react';
import { profile } from '@/content/profile';
import { useTerminal } from '../terminal-context';

export const LsOutput: React.FC = () => {
  const { run } = useTerminal();

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1">
      {profile.ls.map((item) => {
        const isFile = item.includes('.');
        const command = item === 'cv.pdf' ? 'cv' : isFile ? `cat ${item}` : item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => run(command)}
            title={`Run "${command}"`}
            className={`rounded-sm font-semibold hover:underline ${
              isFile ? 'text-term-accent' : 'text-term-link'
            }`}
          >
            {item}
            {!isFile && <span className="text-term-dim">/</span>}
          </button>
        );
      })}
    </div>
  );
};
