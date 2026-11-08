import React from 'react';
import { profile } from '@/content/profile';

/** A small blossom: "bahar" means spring in Persian. */
const BLOSSOM: { text: string; tone: 'petal' | 'stem' }[] = [
  { text: '    _ _    ', tone: 'petal' },
  { text: "  _{ ' }_  ", tone: 'petal' },
  { text: ' { `.!.` } ', tone: 'petal' },
  { text: " ',_/Y\\_,' ", tone: 'petal' },
  { text: '   {_,_}   ', tone: 'petal' },
  { text: '     |     ', tone: 'stem' },
  { text: '   \\ | /   ', tone: 'stem' },
  { text: '    \\|/    ', tone: 'stem' },
];

const SWATCHES = [
  'bg-term-red',
  'bg-term-accent',
  'bg-term-prompt',
  'bg-term-link',
  'bg-term-pink',
  'bg-term-violet',
  'bg-term-dim',
  'bg-term-text',
];

/** Renders `text` with the first occurrence of `word` in the prompt color. */
function Highlight({ text, word }: { text: string; word: string }) {
  const at = text.indexOf(word);
  if (at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="text-term-prompt">{word}</span>
      {text.slice(at + word.length)}
    </>
  );
}

export const WhoamiOutput: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex gap-6 sm:gap-8">
        <div className="hidden shrink-0 select-none sm:block" aria-hidden="true">
          <pre className="font-mono leading-[1.35]">
            {BLOSSOM.map((line, i) => (
              <span
                key={i}
                className={`block ${line.tone === 'petal' ? 'text-term-pink' : 'text-term-prompt'}`}
              >
                {line.text}
              </span>
            ))}
          </pre>
          <p className="mt-2 text-center text-xs text-term-dim">bahar = spring</p>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="name-gradient text-2xl font-bold tracking-tight sm:text-3xl">
              {profile.whoami.name}
            </p>
            <p className="mt-1 text-term-text">{profile.whoami.line1}</p>
          </div>

          <div className="h-px w-full max-w-md bg-term-border" aria-hidden="true" />

          <dl className="grid grid-cols-[9ch_minmax(0,1fr)] gap-x-3 gap-y-1">
            {profile.whoami.facts.map((fact) => (
              <React.Fragment key={fact.label}>
                <dt className="font-semibold text-term-accent">{fact.label}</dt>
                <dd className="text-term-text">{fact.value}</dd>
              </React.Fragment>
            ))}
          </dl>

          <div className="flex gap-1.5 pt-1" aria-hidden="true">
            {SWATCHES.map((cls) => (
              <span key={cls} className={`h-3.5 w-5 rounded-sm ${cls}`} />
            ))}
          </div>
        </div>
      </div>

      <p className="text-term-dim">
        <Highlight text={profile.whoami.hint} word="help" />
      </p>
    </div>
  );
};
