import React from 'react';
import { profile } from '@/content/profile';

export const SkillsOutput: React.FC = () => {
  return (
    <div className="space-y-1.5 font-mono">
      {profile.skills.map((item, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline leading-relaxed">
          <span className="text-term-accent font-medium sm:w-[13ch] shrink-0">
            {item.label}:
          </span>
          <span className="text-term-text">{item.skills}</span>
        </div>
      ))}
    </div>
  );
};
