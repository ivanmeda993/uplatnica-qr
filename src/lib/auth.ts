import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';

import { env } from '@/env';
import { prisma } from '@/lib/db/prisma';

/**
 * Build trusted origin list including both apex and www variants for the
 * configured app URL. Vercel by default redirects apex → www (or vice versa),
 * so we accept either to avoid "Invalid origin" failures when an auth call
 * lands on the variant we did not configure.
 */
function buildTrustedOrigins(appUrl: string): string[] {
  const origins = new Set<string>([appUrl]);
  try {
    const u = new URL(appUrl);
    const hostNoWww = u.host.replace(/^www\./, '');
    origins.add(`${u.protocol}//${hostNoWww}`);
    origins.add(`${u.protocol}//www.${hostNoWww}`);
  } catch {
    // appUrl already validated by env schema; ignore
  }
  return Array.from(origins);
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [
    ...buildTrustedOrigins(env.NEXT_PUBLIC_APP_URL),
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  plugins: [nextCookies()],
});

export type Auth = typeof auth;
