// Validate env at build start — fails fast with clear error if anything is missing or wrong type.
import './src/env';

import withPWAInit from '@ducanh2912/next-pwa';
import type { NextConfig } from 'next';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  typedRoutes: true,
  serverExternalPackages: ['@prisma/client', 'better-auth'],
  images: {
    remotePatterns: [],
  },
};

export default withPWA(nextConfig);
