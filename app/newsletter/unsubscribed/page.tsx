import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';

export const metadata: Metadata = {
  title: 'Unsubscribed: AR Strategies',
  robots: { index: false, follow: false },
};

export default async function UnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="site-shell min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <SiteHeader />
      <section className="px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-xl mx-auto text-center">
          {error ? (
            <>
              <h1 className="font-display uppercase text-3xl md:text-4xl mb-4">
                That link didn&apos;t work
              </h1>
              <p className="text-[var(--text-secondary)] text-lg">
                The unsubscribe link is invalid or expired. Reply to any of our emails and we
                will remove you directly, or email{' '}
                <a href="mailto:hello@arstrategists.com" className="underline decoration-brand/60 underline-offset-4">
                  hello@arstrategists.com
                </a>
                .
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display uppercase text-3xl md:text-4xl mb-4">
                You&apos;re unsubscribed
              </h1>
              <p className="text-[var(--text-secondary)] text-lg">
                You will not get any more weekly emails from AR Strategies. Changed your mind?
                You can always sign back up from the homepage.
              </p>
            </>
          )}
          <Link
            href="/"
            className="btn-primary inline-block mt-10 px-8 py-3.5 rounded-full font-semibold transition-colors"
          >
            Back to homepage
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
