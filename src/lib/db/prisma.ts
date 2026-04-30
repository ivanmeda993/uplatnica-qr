import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import { env } from '@/env';

declare global {
  var __prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

function createPrisma() {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma = globalForPrisma.__prisma ?? createPrisma();

if (env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}
