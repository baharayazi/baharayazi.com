import { Terminal } from '@/components/Terminal';
import { profile } from '@/content/profile';

const SITE_URL = profile.meta.canonicalUrl;

/**
 * Structured data for search engines: who this site is about and what the site
 * is called. Google uses it for the site name in results and to connect this
 * page with the LinkedIn and GitHub profiles.
 */
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      url: SITE_URL,
      name: profile.whoami.name,
      alternateName: ['baharayazi', 'baharayazi.com'],
      inLanguage: 'en',
      publisher: { '@id': `${SITE_URL}#person` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}#profile`,
      url: SITE_URL,
      name: profile.meta.title,
      isPartOf: { '@id': `${SITE_URL}#website` },
      mainEntity: { '@id': `${SITE_URL}#person` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}#person`,
      name: profile.whoami.name,
      url: SITE_URL,
      email: `mailto:${profile.contact.email}`,
      jobTitle: 'Software Engineer',
      description: profile.meta.description,
      image: `${SITE_URL}og-image.png`,
      affiliation: {
        '@type': 'CollegeOrUniversity',
        name: 'University of Victoria',
        url: 'https://www.uvic.ca/',
      },
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Isfahan University of Technology',
      },
      knowsAbout: [
        'Backend engineering',
        'Distributed systems',
        'Python',
        'Django',
        'Machine learning',
        'Security',
      ],
      knowsLanguage: ['English', 'Persian'],
      sameAs: [profile.contact.linkedin, profile.contact.github],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output contains no user input; escaping "<" keeps it inert.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      {/* The terminal fills in after JavaScript runs, so give search engines and
          screen readers a real heading and summary in the static HTML. */}
      <h1 className="sr-only">
        {profile.whoami.name}: {profile.whoami.line1}
      </h1>
      <p className="sr-only">{profile.whoami.line2}</p>
      <Terminal />
    </>
  );
}
