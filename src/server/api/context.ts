import { Elysia } from 'elysia';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

/**
 * Shared context for protected routes.
 * - Resolves the Better Auth session from request headers
 * - Exposes `user` and `prisma` to handlers
 * - Throws 401 if no valid session
 */
export const authContext = new Elysia({ name: 'auth-context' }).derive(
  { as: 'global' },
  async ({ request, status }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return status(401, { error: 'Niste prijavljeni', code: 'UNAUTHORIZED' });
    }
    return {
      user: session.user,
      sessionId: session.session.id,
      prisma,
    };
  }
);
