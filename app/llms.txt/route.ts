import { posts } from '../blog/posts';
import { mechanismsData, mechanismTakeaways } from '../mechanisms/mechanisms-data';

// Static at build time; regenerated on deploy. Derived from the same content
// sources as the sitemap, so it can never drift out of sync with the site.
export const dynamic = 'force-static';

const SITE = 'https://www.arstrategists.com';

export function GET() {
  const lines: string[] = [
    '# AR Strategies',
    '',
    '> AR Strategies is the marketing agency for local businesses. We help one business per market rank at the top of Google, run Meta ads that bring real customers, and publish content people remember — done for you. The promise: be the business your city finds first.',
    '',
    'How we work: one business per industry per area (your competitors are locked out), every number reported (rankings, leads, cost per call, revenue), and no lock-in contracts. Contact: hello@arstrategists.com.',
    '',
    '## Core pages',
    `- [Home](${SITE}/): Google rankings, Meta ads, and content that sells — done for you.`,
    `- [Work With Us](${SITE}/work-with-us): Apply to be the one business we represent in your market.`,
    `- [About](${SITE}/about): Operator-led studio — who we are and how we work.`,
    `- [The 3-Second Test](${SITE}/tools/three-second-test): Free tool — what strangers decide about your business before you say a word.`,
    `- [The Weekly Fix (newsletter)](${SITE}/newsletter): One specific way local businesses get found first, every week.`,
    '',
    '## Field Notes (articles)',
    ...posts.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}): ${p.standfirst}`),
    '',
    '## Mechanisms (how attention and memory drive buying decisions)',
    ...Object.entries(mechanismsData).map(
      ([id, m]) => `- [${m.name}](${SITE}/mechanisms/${id}): ${mechanismTakeaways[id] ?? m.subtitle}`,
    ),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
