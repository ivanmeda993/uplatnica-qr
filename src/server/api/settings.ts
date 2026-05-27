import { Elysia, t } from 'elysia';

import { combineIpsLines, isWithinIpsNameFieldLimit } from '@/lib/ips-qr/limits';

import { authContext } from './context';

function cleanOptional(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function serializeSettings(
  settings: {
    defaultPayerName: string | null;
    defaultPayerAddress: string | null;
  } | null
) {
  return {
    defaultPayerName: settings?.defaultPayerName ?? '',
    defaultPayerAddress: settings?.defaultPayerAddress ?? '',
  };
}

function payerFitsIpsLimit(name: string | undefined, address: string | undefined) {
  return isWithinIpsNameFieldLimit(combineIpsLines([name, address]));
}

const settingsBody = t.Object({
  defaultPayerName: t.Optional(t.String({ maxLength: 70 })),
  defaultPayerAddress: t.Optional(t.String({ maxLength: 70 })),
});

export const settingsRouter = new Elysia({ prefix: '/settings' })
  .use(authContext)
  .get('/', async ({ user, prisma }) => {
    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: {
        defaultPayerName: true,
        defaultPayerAddress: true,
      },
    });

    return { settings: serializeSettings(settings) };
  })
  .patch(
    '/',
    async ({ body, user, prisma, status }) => {
      if (!payerFitsIpsLimit(body.defaultPayerName, body.defaultPayerAddress)) {
        return status(400, {
          error: 'Uplatilac i adresa zajedno ne smeju preći 70 UTF-8 bajtova',
          code: 'IPS_FIELD_TOO_LONG',
        });
      }

      const settings = await prisma.userSettings.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          defaultPayerName: cleanOptional(body.defaultPayerName),
          defaultPayerAddress: cleanOptional(body.defaultPayerAddress),
        },
        update: {
          defaultPayerName: cleanOptional(body.defaultPayerName),
          defaultPayerAddress: cleanOptional(body.defaultPayerAddress),
        },
        select: {
          defaultPayerName: true,
          defaultPayerAddress: true,
        },
      });

      return { settings: serializeSettings(settings) };
    },
    { body: settingsBody }
  );
