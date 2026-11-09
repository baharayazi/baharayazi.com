'use client';

import React, { useSyncExternalStore } from 'react';
import { isSoundOn, setSound, subscribeSound } from '@/lib/sound';

/** Current sound setting; always "off" during prerendering. */
export function useSoundOn(): boolean {
  return useSyncExternalStore(subscribeSound, isSoundOn, () => false);
}

export const SoundToggle: React.FC = () => {
  const on = useSoundOn();

  return (
    <button
      type="button"
      onClick={() => setSound(!on)}
      aria-pressed={on}
      aria-label="Sound effects"
      title={`Turn sound ${on ? 'off' : 'on'} (or type "sound")`}
      className="toolbar-btn"
    >
      <span aria-hidden="true" className={on ? 'text-term-prompt' : 'opacity-60'}>
        ♪
      </span>
      <span>{on ? 'on' : 'off'}</span>
    </button>
  );
};
