import React from 'react';
import { BAHAR_TXT } from '@/content/easter-eggs';

export const BaharOutput: React.FC = () => {
  return (
    <div className="whitespace-pre-wrap">
      {BAHAR_TXT.map((line, i) => (
        <div key={line} className={i === 0 ? 'font-semibold text-term-pink' : 'text-term-text'}>
          {line}
        </div>
      ))}
    </div>
  );
};
