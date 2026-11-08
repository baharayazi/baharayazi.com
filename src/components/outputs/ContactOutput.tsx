import React from 'react';
import { profile } from '@/content/profile';

const pretty = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '');

export const ContactOutput: React.FC = () => {
  const rows = [
    { label: 'email', href: `mailto:${profile.contact.email}`, text: profile.contact.email, external: false },
    { label: 'linkedin', href: profile.contact.linkedin, text: pretty(profile.contact.linkedin), external: true },
    { label: 'github', href: profile.contact.github, text: pretty(profile.contact.github), external: true },
  ];

  return (
    <dl className="grid grid-cols-[9ch_minmax(0,1fr)] gap-x-3 gap-y-1.5">
      {rows.map((row) => (
        <React.Fragment key={row.label}>
          <dt className="font-semibold text-term-accent">{row.label}</dt>
          <dd className="min-w-0 break-words">
            <a
              href={row.href}
              className="term-link"
              {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {row.text}
            </a>
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
};
