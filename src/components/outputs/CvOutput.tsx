import React from 'react';
import { profile } from '@/content/profile';

export const CvOutput: React.FC = () => {
  return (
    <div className="leading-relaxed">
      <a
        href={profile.cv.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-term-link underline hover:opacity-80 focus-visible:ring-1 focus-visible:ring-term-link focus-visible:outline-none rounded"
      >
        {profile.cv.text}
      </a>
    </div>
  );
};
