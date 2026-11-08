import React from 'react';
import { profile } from '@/content/profile';

export const SkillsOutput: React.FC = () => {
  return (
    <dl className="grid grid-cols-1 gap-y-2 sm:grid-cols-[12ch_minmax(0,1fr)] sm:gap-x-3 sm:gap-y-1.5">
      {profile.skills.map((item) => (
        <React.Fragment key={item.label}>
          <dt className="font-semibold text-term-accent">{item.label}</dt>
          <dd className="-mt-1.5 text-term-text sm:mt-0">
            {item.skills.split(/,\s*/).map((skill, i) => (
              <React.Fragment key={skill}>
                {i > 0 && <span className="text-term-dim"> · </span>}
                {skill}
              </React.Fragment>
            ))}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
};
