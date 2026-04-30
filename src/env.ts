import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Type-safe runtime environment validation.
 * - `server`: only available on the server, blocked from client bundles
 * - `client`: must be NEXT_PUBLIC_*, exposed to the browser
 * - `runtimeEnv`: maps process.env to schema (Next.js requires explicit destructure)
 *
 * Throws at startup if required vars are missing or wrong type.
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z
      .string()
      .min(32, 'BETTER_AUTH_SECRET must be at least 32 chars (openssl rand -base64 32)'),
    BETTER_AUTH_URL: z.string().url(),

    GOOGLE_SITE_VERIFICATION: z.string().min(1).optional(),
    YANDEX_VERIFICATION: z.string().min(1).optional(),
    INDEXNOW_KEY: z
      .string()
      .regex(/^[a-f0-9]{16,}$/i, 'INDEXNOW_KEY must be hex string of 16+ chars')
      .optional(),

    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().min(1).optional(),
    NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL: z.string().url().optional(),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z
      .string()
      .regex(/^G-[A-Z0-9]+$/, 'GA4 measurement id format: G-XXXXXXXXXX')
      .optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,
    YANDEX_VERIFICATION: process.env.YANDEX_VERIFICATION,
    INDEXNOW_KEY: process.env.INDEXNOW_KEY,
    NODE_ENV: process.env.NODE_ENV,

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL: process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },
  emptyStringAsUndefined: true,
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === 'true' || process.env.npm_lifecycle_event === 'lint',
});
