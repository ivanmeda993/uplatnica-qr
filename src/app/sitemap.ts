import type { MetadataRoute } from 'next';

import { BANKS } from '@/lib/banks/data';
import { getAllPosts } from '@/lib/blog/posts';
import { getSiteUrl } from '@/lib/site';

const TOOLS = ['ips-qr-validator', 'iban-validator', 'sifre-placanja'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const posts = await getAllPosts();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/banke`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const toolEntries: MetadataRoute.Sitemap = TOOLS.map((slug) => ({
    url: `${base}/alat/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.dateModified ?? p.datePublished),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const bankEntries: MetadataRoute.Sitemap = BANKS.filter(
    (b) => b.hasPublicPage !== false && b.scanSteps?.length
  ).map((b) => ({
    url: `${base}/banke/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...toolEntries, ...blogEntries, ...bankEntries];
}
