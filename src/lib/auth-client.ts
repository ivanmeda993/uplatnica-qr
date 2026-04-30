import { createAuthClient } from 'better-auth/react';

/**
 * Same-origin client. Better Auth resolves the URL relative to the current
 * page in the browser, so we don't pass a hardcoded baseURL — that way the
 * client works on any port (3000 / 3001 / staging / prod) without rebuilds.
 */
export const authClient = createAuthClient();

export const { useSession, signIn, signUp, signOut } = authClient;
