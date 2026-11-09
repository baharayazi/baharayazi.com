'use client';

import React from 'react';
import { SOUND_LINES } from '@/content/easter-eggs';

export const SoundOutput: React.FC<{ on: boolean }> = ({ on }) => (
  <div className="space-y-1">
    <p className={on ? 'text-term-prompt' : 'text-term-text'}>{on ? SOUND_LINES.on : SOUND_LINES.off}</p>
    <p className="text-term-dim">{SOUND_LINES.usage}</p>
  </div>
);
