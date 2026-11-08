import React from 'react';
import { profile } from '@/content/profile';

export const ProjectsOutput: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="text-term-accent font-semibold">{profile.projects.header}</div>
      <div className="space-y-2">
        {profile.projects.items.map((item, idx) => (
          <div key={idx} className="leading-relaxed">
            <span className="font-bold text-term-text">{item.title}: </span>
            <span className="text-term-dim">{item.description}</span>
          </div>
        ))}
      </div>
      <div className="pt-1 text-term-dim">
        More on{' '}
        <a
          href={profile.projects.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-term-link underline hover:opacity-80 focus-visible:ring-1 focus-visible:ring-term-link focus-visible:outline-none rounded"
        >
          github.com/baharayazi
        </a>
        .
      </div>
    </div>
  );
};
