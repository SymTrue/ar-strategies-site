import type { Metadata } from 'next';
import { mechanismMeta } from '../mechanisms-data';

const SITE_URL = 'https://www.arstrategists.com';

const videoDurations: Record<string, string> = {
  'pattern-interruption': 'PT43S',
  'mental-availability': 'PT44S',
  positioning: 'PT47S',
  'familiarity-effect': 'PT41S',
  'decision-architecture': 'PT42S',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = mechanismMeta[id];
  const title = entry?.title ?? 'Mechanism';

  return {
    title: `${title}: AR Strategies`,
    description: entry?.description,
    alternates: { canonical: `/mechanisms/${id}` },
  };
}

export default async function MechanismLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const entry = mechanismMeta[id];
  const duration = videoDurations[id];

  const jsonLd = entry
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: entry.title,
        description: entry.description,
        thumbnailUrl: `${SITE_URL}/videos/posters/${id}.jpg`,
        uploadDate: '2026-07-16',
        contentUrl: `${SITE_URL}/videos/${id}.mp4`,
        duration,
      }
    : null;

  const breadcrumbLd = entry
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Mechanisms', item: `${SITE_URL}/mechanisms` },
          { '@type': 'ListItem', position: 3, name: entry.title, item: `${SITE_URL}/mechanisms/${id}` },
        ],
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {breadcrumbLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      )}
      {children}
    </>
  );
}
