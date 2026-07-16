import { MetadataRoute } from 'next';
import { posts } from './blog/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.arstrategists.com';

  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/mechanisms`, changeFrequency: 'weekly', priority: 0.8 },
    ...[
      'pattern-interruption',
      'mental-availability',
      'positioning',
      'familiarity-effect',
      'decision-architecture',
    ].map((id) => ({
      url: `${baseUrl}/mechanisms/${id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${baseUrl}/tools/three-second-test`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
