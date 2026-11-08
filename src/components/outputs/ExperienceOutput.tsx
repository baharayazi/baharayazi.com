import React from 'react';
import { profile } from '@/content/profile';

export const ExperienceOutput: React.FC = () => {
  return (
    <div className="space-y-5">
      {profile.experience.map((item) => (
        <section key={`${item.company}-${item.period}`} className="space-y-1.5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="font-semibold">
              <span className="text-term-accent">{item.role}</span>
              <span className="text-term-dim"> @ </span>
              <span className="text-term-text">{item.company}</span>
            </h3>
            <span className="text-xs text-term-dim sm:text-[13px]">{item.period}</span>
          </div>
          <ul>
            {item.bullets.map((bullet, i) => (
              <li key={bullet} className="grid grid-cols-[3ch_minmax(0,1fr)]">
                <span className="select-none text-term-border-strong" aria-hidden="true">
                  {i === item.bullets.length - 1 ? '└─' : '├─'}
                </span>
                <span className="text-term-text">{bullet}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};
