import type { Metadata } from 'next';

const mechanismTitles: Record<string, { title: string; description: string }> = {
  'pattern-interruption': {
    title: 'Pattern Interruption',
    description:
      'How breaking expected patterns forces attention and makes a business impossible to ignore.',
  },
  'mental-availability': {
    title: 'Mental Availability',
    description:
      'Why the business remembered first gets chosen first, and how to build that recall on purpose.',
  },
  positioning: {
    title: 'Positioning',
    description:
      'How strategic positioning shapes perception relative to every alternative a customer could pick instead.',
  },
  'familiarity-effect': {
    title: 'Familiarity Effect',
    description:
      'How repeated exposure quietly converts recognition into trust, and why customers buy from names they have already seen.',
  },
  'decision-architecture': {
    title: 'Decision Architecture',
    description:
      'How the structure of your options decides whether people choose at all, and why fewer, clearer paths convert more.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = mechanismTitles[id];
  const title = entry?.title ?? 'Mechanism';

  return {
    title: `${title}: AR Strategies`,
    description: entry?.description,
    alternates: { canonical: `/mechanisms/${id}` },
  };
}

export default function MechanismLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
