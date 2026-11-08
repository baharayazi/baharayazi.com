import React from 'react';

export const HistoryOutput: React.FC<{ entries: string[] }> = ({ entries }) => {
  return (
    <div className="space-y-0.5">
      {entries.map((cmd, i) => (
        <div key={`${i}-${cmd}`} className="grid grid-cols-[5ch_minmax(0,1fr)]">
          <span className="text-right text-term-dim">{i + 1}&nbsp;&nbsp;</span>
          <span className="break-all text-term-text">{cmd}</span>
        </div>
      ))}
    </div>
  );
};
