import type { Metadata } from 'next';

const mechanismTitles: Record<string, string> = {
  'pattern-interruption': 'Pattern Interruption',
  'mental-availability': 'Mental Availability',
  positioning: 'Positioning',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const title = mechanismTitles[id] ?? 'Mechanism';

  return {
    title: `${title} — AR Strategies`,
    alternates: { canonical: `/mechanisms/${id}` },
  };
}

export default function MechanismLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
