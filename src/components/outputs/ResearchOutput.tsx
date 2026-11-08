import React from 'react';
import { profile } from '@/content/profile';

export const ResearchOutput: React.FC = () => {
  return (
    <div className="space-y-2 leading-relaxed">
      <div className="text-term-accent font-semibold">{profile.research.header}</div>
      <div className="text-term-text">{profile.research.topic}</div>
      <div className="text-term-dim">
        <span className="text-term-dim">Interests: </span>
        {profile.research.interests}
      </div>
      <div className="text-term-dim pt-1 italic">{profile.research.note}</div>
    </div>
  );
};
