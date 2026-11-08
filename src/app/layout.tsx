import type { Metadata, Viewport } from 'next';
import { profile } from '@/content/profile';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://baharayazi.com'),
  title: profile.meta.title,
  description: profile.meta.description,
  alternates: {
    canonical: profile.meta.canonicalUrl,
  },
  openGraph: {
    title: profile.meta.title,
    description: profile.meta.description,
    url: profile.meta.canonicalUrl,
    siteName: 'Bahar Ayazi',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: profile.meta.ogImage,
        width: 1200,
        height: 630,
        alt: profile.meta.title,
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
  themeColor: '#0d1117',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className="dark">
      <head>
        <script>
          {`
            (function() {
              try {
                var saved = localStorage.getItem('bahar_theme_preference');
                var theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
                document.documentElement.setAttribute('data-theme', theme);
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })();
          `}
        </script>
      </head>
      <body className="min-h-screen bg-term-bg text-term-text antialiased flex flex-col justify-center items-center p-2 sm:p-4 md:p-6">
        {/* Accessible Noscript Fallback */}
        <noscript>
          <div className="w-full max-w-2xl mx-auto my-6 p-6 border border-term-border bg-term-panel rounded-lg font-mono space-y-4">
            <h1 className="text-2xl font-bold text-term-accent">
              {profile.whoami.name}
            </h1>
            <p className="text-term-text">{profile.whoami.line1}</p>
            <p className="text-term-dim">{profile.whoami.line2}</p>
            <hr className="border-term-border my-4" />
            <h2 className="text-lg font-bold text-term-accent">About</h2>
            <p className="text-term-text">{profile.about.paragraph1}</p>
            <p className="text-term-text">{profile.about.paragraph2}</p>
            <hr className="border-term-border my-4" />
            <h2 className="text-lg font-bold text-term-accent">Contact</h2>
            <ul className="space-y-1">
              <li>
                Email:{' '}
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="text-term-link underline"
                >
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

        <main className="w-full flex justify-center items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
