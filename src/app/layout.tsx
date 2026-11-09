import type { Metadata, Viewport } from 'next';
import { profile } from '@/content/profile';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://baharayazi.com'),
  title: profile.meta.title,
  description: profile.meta.description,
  applicationName: profile.whoami.name,
  authors: [{ name: profile.whoami.name, url: profile.meta.canonicalUrl }],
  manifest: '/site.webmanifest',
  alternates: {
    canonical: profile.meta.canonicalUrl,
  },
  openGraph: {
    title: profile.meta.title,
    description: profile.meta.description,
    url: profile.meta.canonicalUrl,
    siteName: profile.whoami.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: profile.meta.ogImage,
        width: 1200,
        height: 630,
        alt: `${profile.whoami.name}: ${profile.whoami.line1}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: profile.meta.title,
    description: profile.meta.description,
    images: [profile.meta.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0f14',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/**
 * Runs before first paint so a saved light theme never flashes dark.
 * Keep the storage key and colors in sync with src/hooks/useTheme.ts.
 */
const themeScript = `(function(){try{var s=localStorage.getItem('bahar_theme_preference');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');var r=document.documentElement;r.setAttribute('data-theme',t);r.classList.remove('light','dark');r.classList.add(t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='light'?'#e9edf1':'#0b0f14');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();

  return (
    // The theme script changes these attributes before React hydrates.
    <html lang="en" data-theme="dark" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col items-center justify-center bg-term-bg p-2 text-term-text antialiased sm:p-4">
        <noscript>
          <div className="mx-auto my-6 w-full max-w-2xl space-y-4 rounded-lg border border-term-border bg-term-panel p-6 font-mono">
            <p className="text-2xl font-bold text-term-accent">{profile.whoami.name}</p>
            <p className="text-term-text">{profile.whoami.line1}</p>
            <p className="text-term-dim">{profile.whoami.line2}</p>
            <hr className="my-4 border-term-border" />
            <h2 className="text-lg font-bold text-term-accent">About</h2>
            <p className="text-term-text">{profile.about.paragraph1}</p>
            <p className="text-term-text">{profile.about.paragraph2}</p>
            <hr className="my-4 border-term-border" />
            <h2 className="text-lg font-bold text-term-accent">Contact</h2>
            <ul className="space-y-1">
              <li>
                Email:{' '}
                <a href={`mailto:${profile.contact.email}`} className="text-term-link underline">
                  {profile.contact.email}
                </a>
              </li>
              <li>
                LinkedIn:{' '}
                <a
                  href={profile.contact.linkedin}
                  className="text-term-link underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.contact.linkedin}
                </a>
              </li>
              <li>
                GitHub:{' '}
                <a
                  href={profile.contact.github}
                  className="text-term-link underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.contact.github}
                </a>
              </li>
              <li>
                CV:{' '}
                <a
                  href={profile.cv.href}
                  className="text-term-link underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.cv.text}
                </a>
              </li>
            </ul>
          </div>
        </noscript>

        <main className="flex w-full justify-center">{children}</main>

        <footer className="mt-3 flex w-full max-w-[880px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-1 font-mono text-[11px] text-term-dim sm:text-xs">
          <span>© {year} {profile.whoami.name}</span>
          <span className="hidden sm:inline">Tab completes · ↑ ↓ history · try “game”</span>
        </footer>
      </body>
    </html>
  );
}
