import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work With Us: AR Strategies',
  description:
    'We take one local business per market and make it the one its city finds first. Apply, and if it is a good fit we will reach back out to schedule a call.',
  alternates: { canonical: '/work-with-us' },
};

export default function WorkWithUsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
