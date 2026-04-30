import { Elysia, t } from 'elysia';

import { authContext } from './context';

export const historyRouter = new Elysia({ prefix: '/history' })
  .use(authContext)
  .get('/', async ({ user, prisma }) => {
    const items = await prisma.paymentHistory.findMany({
      where: { userId: user.id },
      orderBy: { paidAt: 'desc' },
      take: 100,
      include: {
        uplatnica: {
          select: { id: true, recipientName: true, amount: true, account: true },
        },
      },
    });
    return { items };
  })
  .post(
    '/',
    async ({ body, user, prisma, status }) => {
      const uplatnica = await prisma.uplatnica.findFirst({
        where: { id: body.uplatnicaId, userId: user.id },
        select: { id: true },
      });
      if (!uplatnica) return status(404, { error: 'Uplatnica nije pronađena', code: 'NOT_FOUND' });

      const entry = await prisma.paymentHistory.create({
        data: {
          userId: user.id,
          uplatnicaId: body.uplatnicaId,
          note: body.note ?? null,
        },
      });
      return { entry };
    },
    {
      body: t.Object({
        uplatnicaId: t.String(),
        note: t.Optional(t.String({ maxLength: 200 })),
      }),
    }
  )
  .delete(
    '/uplatnica/:uplatnicaId',
    async ({ params, user, prisma, status }) => {
      const uplatnica = await prisma.uplatnica.findFirst({
        where: { id: params.uplatnicaId, userId: user.id },
        select: { id: true },
      });
      if (!uplatnica) return status(404, { error: 'Uplatnica nije pronađena', code: 'NOT_FOUND' });

      await prisma.paymentHistory.deleteMany({
        where: { uplatnicaId: params.uplatnicaId, userId: user.id },
      });
      return { ok: true as const };
    },
    {
      params: t.Object({ uplatnicaId: t.String() }),
    }
  );
