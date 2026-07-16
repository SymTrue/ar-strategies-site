import { MetadataRoute } from 'next';
import { posts } from './blog/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.arstrategists.com';
  const now = new Date();
  const latestPostDate = posts.reduce(
    (latest, post) => (post.date > latest ? post.date : latest),
    posts[0]?.date ?? now.toISOString(),
  );

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/mechanisms`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...[
      'pattern-interruption',
      'mental-availability',
      'positioning',
      'familiarity-effect',
      'decision-architecture',
    ].map((id) => ({
      url: `${baseUrl}/mechanisms/${id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${baseUrl}/tools/three-second-test`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(latestPostDate), changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
