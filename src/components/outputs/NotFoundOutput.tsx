import React from 'react';
import { profile } from '@/content/profile';

interface NotFoundOutputProps {
  command: string;
}

export const NotFoundOutput: React.FC<NotFoundOutputProps> = ({ command }) => {
  return (
    <div className="text-term-dim font-mono leading-relaxed">
      {profile.notFound(command)}
    </div>
  );
};
