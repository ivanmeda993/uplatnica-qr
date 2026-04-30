import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Uplatnica QR',
    short_name: 'Uplatnica',
    description: 'Generator i skener NBS IPS QR kodova za uplatnice u Srbiji',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdfcf8',
    theme_color: '#0a1224',
    orientation: 'portrait-primary',
    lang: 'sr-Latn-RS',
    categories: ['finance', 'productivity', 'utilities'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
