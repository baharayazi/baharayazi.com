import React from 'react';

export const MatrixOutput: React.FC<{ reduced: boolean }> = ({ reduced }) => (
  <div className="space-y-1">
    {reduced ? (
      <div className="text-term-dim">
        Matrix skipped: your system asks for reduced motion. The red pill can wait.
      </div>
    ) : (
      <>
        <div className="text-term-prompt">Wake up, visitor... The Matrix has you.</div>
        <div className="text-term-dim">Press any key or click to come back.</div>
      </>
    )}
  </div>
);
