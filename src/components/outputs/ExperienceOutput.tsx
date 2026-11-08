import React from 'react';
import { profile } from '@/content/profile';

export const ExperienceOutput: React.FC = () => {
  return (
    <div className="space-y-4">
      {profile.experience.map((item, idx) => (
        <div key={idx} className="space-y-1">
          <div>
            <span className="text-term-accent font-semibold">{item.role}</span>
            <span className="text-term-dim"> · </span>
            <span className="text-term-text">{item.company}</span>
            <span className="text-term-dim"> · </span>
            <span className="text-term-dim">{item.period}</span>
          </div>
          <ul className="space-y-0.5 pl-2 sm:pl-4">
            {item.bullets.map((bullet, bIdx) => (
              <li key={bIdx} className="text-term-text leading-relaxed">
                <span className="text-term-dim mr-2">-</span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
