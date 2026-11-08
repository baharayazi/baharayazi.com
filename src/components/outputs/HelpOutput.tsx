import React from 'react';
import { profile } from '@/content/profile';

export const HelpOutput: React.FC = () => {
  return (
    <div className="space-y-2 font-mono leading-relaxed">
      <div className="text-term-accent font-semibold">Available commands:</div>
      <div className="space-y-1">
        {profile.help.map((item) => (
          <div
            key={item.command}
            className="flex flex-col sm:flex-row sm:items-baseline"
          >
            <span className="text-term-prompt font-semibold sm:w-[14ch] shrink-0">
              {item.command}
            </span>
            <span className="text-term-dim">{item.description}</span>
          </div>
        ))}
      </div>
      <div className="text-term-dim text-xs pt-2">
        <span className="text-term-text font-semibold">Aliases: </span>
        resume → cv, work/jobs → experience, email/links/github/linkedin → contact, ?/man → help, info → whoami
      </div>
    </div>
  );
};
