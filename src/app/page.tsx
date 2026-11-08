import { Terminal } from '@/components/Terminal';
import { profile } from '@/content/profile';

export default function Home() {
  return (
    <>
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
