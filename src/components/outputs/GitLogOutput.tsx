import React from 'react';
import { profile } from '@/content/profile';

interface Commit {
  date: string;
  message: string;
}

/** A short, stable fake hash so every commit gets the same id on every visit. */
function shortHash(text: string): string {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

function buildCommits(): Commit[] {
  const [masc, bsc] = profile.education;
  const commits: Commit[] = [
    {
      date: masc.period.split(' – ')[0],
      message: `feat: start ${masc.degree.replace(',', ' in')} at ${masc.institution}`,
    },
    ...profile.experience.map((job) => ({
      date: job.period.split(' – ')[0],
      message: `feat: join ${job.company} as ${job.role}`,
    })),
  ];
  if (bsc) {
    commits.push({
      date: bsc.period.split(' – ')[1] ?? bsc.period,
      message: `build: graduate ${bsc.degree.split(',')[0]}, ${bsc.institution}`,
    });
  }
  commits[commits.length - 1].message = commits[commits.length - 1].message.replace(
    /^build:/,
    'init:'
  );
  return commits;
}

export const GitLogOutput: React.FC = () => {
  const commits = buildCommits();
  return (
    <div className="space-y-1">
      {commits.map((c, i) => (
        <div key={c.message} className="grid grid-cols-[8ch_minmax(0,1fr)] gap-x-2">
          <span className="text-term-accent">{shortHash(c.message)}</span>
          <span>
            {i === 0 && (
              <span className="text-term-link">
                (<span className="text-term-prompt">HEAD -&gt; main</span>){' '}
              </span>
            )}
            <span className="text-term-text">{c.message}</span>
            <span className="text-term-dim"> · {c.date}</span>
          </span>
        </div>
      ))}
      <div className="pt-1 text-term-dim">Next commit: still being written. Stay tuned.</div>
    </div>
  );
};
