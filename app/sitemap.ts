import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { fetchProducts } from '@/lib/products';
import { fetchPublishedPosts } from '@/lib/blog';

export const revalidate = 3600; // regenerate hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([fetchProducts(), fetchPublishedPosts()]);

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/producto/${product._id}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post._id}`,
    lastModified: new Date(post.createdAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/devoluciones`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    ...(posts.length > 0
      ? [
          {
            url: `${SITE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          },
        ]
      : []),
    ...productEntries,
    ...postEntries,
  ];
}
