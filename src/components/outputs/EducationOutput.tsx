import React from 'react';
import { profile } from '@/content/profile';

export const EducationOutput: React.FC = () => {
  return (
    <div className="space-y-2">
      {profile.education.map((item, idx) => (
        <div key={idx} className="leading-relaxed">
          <span className="text-term-accent font-semibold">{item.degree}</span>
          <span className="text-term-text"> — {item.institution}</span>
          <span className="text-term-dim"> · {item.period}</span>
        </div>
      ))}
    </div>
  );
};
