import { Elysia, t } from 'elysia';

import { authContext } from './context';

export const recipientsRouter = new Elysia({ prefix: '/recipients' })
  .use(authContext)
  .get('/', async ({ user, prisma }) => {
    const items = await prisma.recipient.findMany({
      where: { userId: user.id, archived: false },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return { items };
  })
  .post(
    '/',
    async ({ body, user, prisma }) => {
      const recipient = await prisma.recipient.create({
        data: {
          userId: user.id,
          label: body.label,
          name: body.name,
          account: body.account,
          purpose: body.purpose ?? null,
          paymentCode: body.paymentCode ?? null,
          reference: body.reference ?? null,
          defaultAmount: body.defaultAmount ?? null,
          color: body.color ?? null,
        },
      });
      return { recipient };
    },
    {
      body: t.Object({
        label: t.String({ minLength: 1, maxLength: 50 }),
        name: t.String({ minLength: 1, maxLength: 70 }),
        account: t.String({ pattern: '^\\d{18}$' }),
        purpose: t.Optional(t.String({ maxLength: 35 })),
        paymentCode: t.Optional(t.String({ pattern: '^\\d{3}$' })),
        reference: t.Optional(t.String({ maxLength: 35 })),
        defaultAmount: t.Optional(t.String()),
        color: t.Optional(t.String({ pattern: '^#[0-9a-fA-F]{6}$' })),
      }),
    }
  )
  .patch(
    '/:id',
    async ({ params, body, user, prisma, status }) => {
      const existing = await prisma.recipient.findFirst({
        where: { id: params.id, userId: user.id },
        select: { id: true },
      });
      if (!existing) return status(404, { error: 'Nije pronađeno', code: 'NOT_FOUND' });

      const recipient = await prisma.recipient.update({
        where: { id: params.id },
        data: {
          label: body.label,
          name: body.name,
          account: body.account,
          purpose: body.purpose ?? null,
          paymentCode: body.paymentCode ?? null,
          reference: body.reference ?? null,
          defaultAmount: body.defaultAmount ?? null,
          color: body.color ?? null,
        },
      });
      return { recipient };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        label: t.String({ minLength: 1, maxLength: 50 }),
        name: t.String({ minLength: 1, maxLength: 70 }),
        account: t.String({ pattern: '^\\d{18}$' }),
        purpose: t.Optional(t.String({ maxLength: 35 })),
        paymentCode: t.Optional(t.String({ pattern: '^\\d{3}$' })),
        reference: t.Optional(t.String({ maxLength: 35 })),
        defaultAmount: t.Optional(t.String()),
        color: t.Optional(t.String({ pattern: '^#[0-9a-fA-F]{6}$' })),
      }),
    }
  )
  .delete(
    '/:id',
    async ({ params, user, prisma, status }) => {
      const existing = await prisma.recipient.findFirst({
        where: { id: params.id, userId: user.id },
        select: { id: true },
      });
      if (!existing) return status(404, { error: 'Nije pronađeno', code: 'NOT_FOUND' });

      await prisma.recipient.update({
        where: { id: params.id },
        data: { archived: true },
      });
      return { ok: true as const };
    },
    {
      params: t.Object({ id: t.String() }),
    }
  );
