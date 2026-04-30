import { treaty } from '@elysiajs/eden';

import { env } from '@/env';
import type { App } from '@/server/api';

const baseURL = typeof window === 'undefined' ? env.NEXT_PUBLIC_APP_URL : window.location.origin;

export const api = treaty<App>(baseURL);
