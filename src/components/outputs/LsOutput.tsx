import React from 'react';
import { profile } from '@/content/profile';

export const LsOutput: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono">
      {profile.ls.map((item, idx) => (
        <span
          key={idx}
          className={
            item.endsWith('.pdf')
              ? 'text-term-accent underline'
              : 'text-term-link'
          }
        >
          {item}
        </span>
      ))}
    </div>
  );
};
