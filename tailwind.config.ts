import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      colors: {
        term: {
          bg: 'var(--color-bg)',
          panel: 'var(--color-panel)',
          bar: 'var(--color-bar)',
          text: 'var(--color-text)',
          dim: 'var(--color-dim)',
          prompt: 'var(--color-prompt)',
          accent: 'var(--color-accent)',
          link: 'var(--color-link)',
          pink: 'var(--color-pink)',
          violet: 'var(--color-violet)',
          red: 'var(--color-red)',
          border: 'var(--color-border)',
          'border-strong': 'var(--color-border-strong)',
        },
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
};

export default config;
