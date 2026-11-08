import React from 'react';
import { profile } from '@/content/profile';

export const SudoOutput: React.FC = () => {
  return (
    <div className="text-term-dim font-mono leading-relaxed">
      {profile.sudo}
    </div>
  );
};
