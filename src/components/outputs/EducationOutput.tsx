import React from 'react';
import { profile } from '@/content/profile';

export const EducationOutput: React.FC = () => {
  return (
    <ul className="space-y-4">
      {profile.education.map((item) => (
        <li key={item.degree} className="grid grid-cols-[2ch_minmax(0,1fr)]">
          <span className="select-none text-term-pink" aria-hidden="true">
            ◆
          </span>
          <div className="space-y-0.5">
            <div className="font-semibold text-term-accent">{item.degree}</div>
            <div>
              <span className="text-term-text">{item.institution}</span>
              <span className="text-term-dim"> · {item.period}</span>
            </div>
            {item.details?.map((line) => (
              <div key={line} className="text-term-dim">
                {line}
              </div>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
};
