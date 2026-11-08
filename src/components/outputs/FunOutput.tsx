import React from 'react';

export const FunOutput: React.FC<{ lines: string[] }> = ({ lines }) => {
  return (
    <div className="space-y-1">
      {lines.map((line, i) => (
        <div key={line} className={i === 0 ? 'text-term-accent' : 'text-term-text'}>
          {line}
        </div>
      ))}
    </div>
  );
};
