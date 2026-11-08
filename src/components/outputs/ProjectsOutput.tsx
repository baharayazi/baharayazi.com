import React from 'react';
import { profile } from '@/content/profile';

export const ProjectsOutput: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="font-semibold text-term-accent">{profile.projects.header}</div>
      <ul className="space-y-4">
        {profile.projects.items.map((item) => (
          <li key={item.title} className="grid grid-cols-[2ch_minmax(0,1fr)]">
            <span className="select-none text-term-pink" aria-hidden="true">
              ▸
            </span>
            <div className="space-y-1">
              <div className="font-semibold text-term-text">
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="term-link font-semibold"
                  >
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </div>
              {item.meta && <div className="text-xs text-term-accent sm:text-[13px]">{item.meta}</div>}
              <div className="text-term-text">{item.description}</div>
              {item.highlight && (
                <div className="text-term-prompt">
                  <span aria-hidden="true">→ </span>
                  {item.highlight}
                </div>
              )}
              <div className="text-xs text-term-dim sm:text-[13px]">
                [{item.stack.join(' · ')}]
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-term-dim">{profile.projects.coursework}</p>
      <div className="text-term-dim">
        More on{' '}
        <a
          href={profile.projects.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="term-link"
        >
          github.com/baharayazi
        </a>
        .
      </div>
    </div>
  );
};
