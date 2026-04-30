import type { MetadataRoute } from 'next';

import { getSiteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/blog', '/banke', '/alat'],
        disallow: [
          '/api/',
          '/dashboard',
          '/generate',
          '/scan',
          '/recipients',
          '/history',
          '/settings',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
