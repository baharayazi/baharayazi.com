import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
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
          border: 'var(--color-border)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
