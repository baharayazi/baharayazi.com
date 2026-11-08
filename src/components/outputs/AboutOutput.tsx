import React from 'react';
import { profile } from '@/content/profile';

export const AboutOutput: React.FC = () => {
  return (
    <div className="space-y-3 max-w-3xl leading-relaxed">
      <p className="text-term-text">{profile.about.paragraph1}</p>
      <p className="text-term-text">{profile.about.paragraph2}</p>
      <p className="text-term-dim">{profile.about.paragraph3}</p>
    </div>
  );
};
