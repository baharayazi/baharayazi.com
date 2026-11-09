'use client';

import React, { useEffect, useRef } from 'react';
import { profile } from '@/content/profile';

interface QuickViewProps {
  open: boolean;
  onClose: () => void;
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`qv-${id}`} className="space-y-3">
      <h3
        id={`qv-${id}`}
        className="flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-term-accent"
      >
        <span aria-hidden="true" className="text-term-dim">
          ##
        </span>
        {title}
        <span aria-hidden="true" className="h-px flex-1 bg-term-border" />
      </h3>
      {children}
    </section>
  );
}

const linkPill =
  'inline-flex items-center gap-1.5 rounded-full border border-term-border px-3 py-1 font-mono text-xs text-term-text transition-colors hover:border-term-prompt hover:text-term-prompt';

/**
 * The whole site on one readable page, for visitors who would rather scroll
 * than type. Built from the same profile data as the terminal.
 */
export const QuickView: React.FC<QuickViewProps> = ({ open, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      dialog.querySelector<HTMLElement>('.qv-scroll')?.scrollTo({ top: 0 });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const { whoami, about, experience, projects, research, education, skills, contact, cv } = profile;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="qv-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // A click on the backdrop (outside the panel) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
      className="quick-view m-auto h-[min(92dvh,940px)] max-h-none w-[min(94vw,820px)] max-w-none overflow-hidden rounded-xl border border-term-border bg-term-panel p-0 text-term-text"
    >
      {open && (
        <div className="flex h-full flex-col">
          <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-term-border bg-term-bar px-3 font-mono text-xs text-term-dim sm:px-4">
            <span className="truncate">
              <span aria-hidden="true" className="mr-2 text-term-accent">
                ▤
              </span>
              bahar-ayazi.md · the one-page version
            </span>
            <button type="button" onClick={onClose} className="toolbar-btn shrink-0" autoFocus>
              <span aria-hidden="true">esc</span>
              <span>back to terminal</span>
            </button>
          </div>

          <div className="qv-scroll terminal-screen flex-1 overflow-y-auto overscroll-contain px-5 py-6 font-sans text-[15px] leading-relaxed sm:px-10 sm:py-9">
            <div className="mx-auto max-w-[640px] space-y-9">
              <header className="space-y-3">
                <h2 id="qv-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
                  <span className="name-gradient">{whoami.name}</span>
                </h2>
                <p className="text-base font-medium text-term-text">{whoami.line1}</p>
                <p className="text-term-dim">{whoami.line2}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a href={`mailto:${contact.email}`} className={linkPill}>
                    <span aria-hidden="true">✉</span>
                    {contact.email}
                  </a>
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={linkPill}>
                    LinkedIn <span aria-hidden="true">↗</span>
                  </a>
                  <a href={contact.github} target="_blank" rel="noopener noreferrer" className={linkPill}>
                    GitHub <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href={cv.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkPill} border-term-accent text-term-accent`}
                  >
                    <span aria-hidden="true">↓</span>
                    CV (PDF)
                  </a>
                </div>
              </header>

              <Section id="about" title="About">
                <p>{about.paragraph1}</p>
                <p>{about.paragraph2}</p>
              </Section>

              <Section id="experience" title="Experience">
                <div className="space-y-6">
                  {experience.map((job) => (
                    <article key={`${job.company}-${job.period}`} className="space-y-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <h4 className="font-semibold">
                          {job.role} <span className="text-term-dim">·</span>{' '}
                          <span className="text-term-prompt">{job.company}</span>
                        </h4>
                        <span className="font-mono text-xs text-term-dim">{job.period}</span>
                      </div>
                      <ul className="list-disc space-y-1 pl-5 text-term-text marker:text-term-dim">
                        {job.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </Section>

              <Section id="projects" title="Projects">
                <div className="space-y-6">
                  {projects.items.map((p) => (
                    <article key={p.title} className="space-y-1.5">
                      <h4 className="font-semibold">
                        {p.href ? (
                          <a href={p.href} target="_blank" rel="noopener noreferrer" className="term-link">
                            {p.title}
                            <span aria-hidden="true"> ↗</span>
                          </a>
                        ) : (
                          p.title
                        )}
                      </h4>
                      {p.meta && <p className="font-mono text-xs text-term-dim">{p.meta}</p>}
                      <p>{p.description}</p>
                      {p.highlight && (
                        <p className="border-l-2 border-term-prompt pl-3 text-term-text">{p.highlight}</p>
                      )}
                      <p className="flex flex-wrap gap-1.5 pt-1">
                        {p.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded border border-term-border px-1.5 py-0.5 font-mono text-[11px] text-term-dim"
                          >
                            {s}
                          </span>
                        ))}
                      </p>
                    </article>
                  ))}
                  <p className="text-term-dim">{projects.coursework}</p>
                </div>
              </Section>

              <Section id="research" title="Research">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h4 className="font-semibold">{research.title}</h4>
                    <span className="font-mono text-xs text-term-dim">{research.period}</span>
                  </div>
                  <p className="text-term-dim">{research.header}</p>
                  {research.bullets.map((b) => (
                    <p key={b}>{b}</p>
                  ))}
                </div>
              </Section>

              <Section id="education" title="Education">
                <div className="space-y-5">
                  {education.map((e) => (
                    <article key={e.degree} className="space-y-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <h4 className="font-semibold">
                          {e.degree} <span className="text-term-dim">·</span>{' '}
                          <span className="text-term-prompt">{e.institution}</span>
                        </h4>
                        <span className="font-mono text-xs text-term-dim">{e.period}</span>
                      </div>
                      {e.details?.map((d) => (
                        <p key={d} className="text-term-dim">
                          {d}
                        </p>
                      ))}
                    </article>
                  ))}
                </div>
              </Section>

              <Section id="skills" title="Skills">
                <dl className="grid grid-cols-1 gap-y-2 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-4">
                  {skills.map((s) => (
                    <React.Fragment key={s.label}>
                      <dt className="font-mono text-xs font-semibold text-term-accent sm:pt-1">{s.label}</dt>
                      <dd className="-mt-1 sm:mt-0">{s.skills}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </Section>

              <footer className="border-t border-term-border pt-5 font-mono text-xs text-term-dim">
                Prefer the terminal? Press Esc, or try{' '}
                <button type="button" onClick={onClose} className="term-link">
                  the interactive version
                </button>
                .
              </footer>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
};
