import { Elysia } from 'elysia';

import { auth } from '@/lib/auth';

import { historyRouter } from './history';
import { recipientsRouter } from './recipients';
import { uplatniceRouter } from './uplatnice';

/**
 * Root Elysia app, mounted under Next.js at /api/*.
 *
 * Better Auth handles its own /api/auth/* routes via `auth.handler`.
 * Application routes live under /api/v1/*.
 */
export const app = new Elysia({ prefix: '/api' })
  .all('/auth/*', ({ request }) => auth.handler(request))
  .group('/v1', (group) => group.use(recipientsRouter).use(uplatniceRouter).use(historyRouter))
  .onError(({ code, error, set }) => {
    if (code === 'VALIDATION') {
      set.status = 400;
      return { error: 'Neispravan unos', code: 'VALIDATION', details: String(error) };
    }
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return { error: 'Nije pronađeno', code: 'NOT_FOUND' };
    }
    set.status = 500;
    return { error: 'Greška servera', code: 'INTERNAL' };
  });

export type App = typeof app;
