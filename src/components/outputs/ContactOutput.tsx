import React from 'react';
import { profile } from '@/content/profile';

export const ContactOutput: React.FC = () => {
  return (
    <div className="space-y-1.5 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-baseline">
        <span className="text-term-accent font-medium sm:w-[10ch] shrink-0">email:</span>
        <a
          href={`mailto:${profile.contact.email}`}
          className="text-term-link underline hover:opacity-80 focus-visible:ring-1 focus-visible:ring-term-link focus-visible:outline-none rounded"
        >
          {profile.contact.email}
        </a>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-baseline">
        <span className="text-term-accent font-medium sm:w-[10ch] shrink-0">linkedin:</span>
        <a
          href={profile.contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-term-link underline hover:opacity-80 focus-visible:ring-1 focus-visible:ring-term-link focus-visible:outline-none rounded"
        >
          {profile.contact.linkedin}
        </a>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-baseline">
        <span className="text-term-accent font-medium sm:w-[10ch] shrink-0">github:</span>
        <a
          href={profile.contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-term-link underline hover:opacity-80 focus-visible:ring-1 focus-visible:ring-term-link focus-visible:outline-none rounded"
        >
          {profile.contact.github}
        </a>
      </div>
    </div>
  );
};
