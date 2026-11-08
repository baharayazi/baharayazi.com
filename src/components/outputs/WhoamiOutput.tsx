import React from 'react';
import { profile } from '@/content/profile';

export const WhoamiOutput: React.FC = () => {
  return (
    <div className="space-y-1">
      <h1 className="text-xl md:text-2xl font-bold text-term-accent tracking-wide">
        {profile.whoami.name}
      </h1>
      <p className="text-term-text">{profile.whoami.line1}</p>
      <p className="text-term-dim">{profile.whoami.line2}</p>
      <p className="text-term-dim pt-2">{profile.whoami.hint}</p>
    </div>
  );
};
