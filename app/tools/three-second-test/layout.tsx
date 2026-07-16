import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Three-Second Test: Free Self-Audit Tool for Local Businesses',
  description:
    'Run the same first-impression diagnostic we open every audit with. Score your search result, Google profile, homepage, and storefront in three minutes. Free, no signup.',
  alternates: { canonical: '/tools/three-second-test' },
};

export default function ThreeSecondTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
