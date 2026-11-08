import React from 'react';
import { HOME_CITY, HOME_TIMEZONE } from '@/content/easter-eggs';

function format(date: Date, timeZone?: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  }).format(date);
}

function homeHour(date: Date): number {
  return Number(
    new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: HOME_TIMEZONE }).format(date)
  ) % 24;
}

function mood(hour: number): string {
  if (hour < 6) return 'Probably asleep. Or debugging. Hard to tell at this hour.';
  if (hour < 9) return 'First coffee is brewing. Nothing happens before that.';
  if (hour < 12) return 'Coffee in hand, deep in code or papers.';
  if (hour < 17) return 'Second coffee territory. Peak productivity.';
  if (hour < 22) return 'Winding down, maybe reading one more paper.';
  return 'Late-night commits are happening. Send help (or coffee).';
}

/** `at` is the moment the command ran, so the output never changes afterwards. */
export const DateOutput: React.FC<{ at: number }> = ({ at }) => {
  const date = new Date(at);
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[9ch_minmax(0,1fr)] gap-x-2">
        <span className="text-term-accent">bahar</span>
        <span className="text-term-text">
          {format(date, HOME_TIMEZONE)} <span className="text-term-dim">({HOME_CITY})</span>
        </span>
        <span className="text-term-accent">you</span>
        <span className="text-term-text">{format(date)}</span>
      </div>
      <div className="pt-1 text-term-dim">{mood(homeHour(date))}</div>
    </div>
  );
};
