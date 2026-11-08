import React from 'react';
import { profile } from '@/content/profile';

export const CvOutput: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={profile.cv.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md border border-term-border bg-term-bar px-3 py-1.5 text-term-text transition-colors hover:border-term-prompt"
      >
        <span className="text-term-prompt" aria-hidden="true">
          ↓
        </span>
        {profile.cv.text}
      </a>
    </div>
  );
};
