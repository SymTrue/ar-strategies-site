import { posts } from '../blog/posts';
import { mechanismsData, mechanismTakeaways } from '../mechanisms/mechanisms-data';

// Full-text companion to /llms.txt: the complete body copy of every Field Note
// and every Mechanism, for LLMs that ingest long-form context. Derived from the
// live content sources, so it stays in sync automatically.
export const dynamic = 'force-static';

const SITE = 'https://www.arstrategists.com';

export function GET() {
  const out: string[] = [
    '# AR Strategies — Full Content',
    '',
    '> The marketing agency for local businesses. One business per market. Top of Google, Meta ads that bring customers, and content people remember. Contact: hello@arstrategists.com.',
    '',
    '---',
    '',
    '# Field Notes',
  ];

  for (const p of posts) {
    out.push(
      '',
      `## ${p.title}`,
      `URL: ${SITE}/blog/${p.slug}`,
      `Pillar: ${p.pillar} · ${p.dateLabel} · ${p.readTime} read`,
      '',
      p.standfirst,
    );
    for (const s of p.sections) {
      out.push('');
      if (s.heading) out.push(`### ${s.heading}`);
      out.push(...s.paragraphs);
    }
    out.push('', '---');
  }

  out.push('', '# Mechanisms');
  for (const [id, m] of Object.entries(mechanismsData)) {
    out.push(
      '',
      `## ${m.name}`,
      `URL: ${SITE}/mechanisms/${id}`,
      `In one sentence: ${mechanismTakeaways[id] ?? ''}`,
      '',
      m.subtitle,
      '',
      m.whyWorks,
      '',
      '---',
    );
  }

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
