import { Elysia, t } from 'elysia';

import { encodeUplatnica } from '@/lib/ips-qr';

import { authContext } from './context';

export const uplatniceRouter = new Elysia({ prefix: '/uplatnice' })
  .use(authContext)
  .get(
    '/',
    async ({ user, prisma, query }) => {
      const limit = Math.min(query.limit ?? 50, 200);
      const items = await prisma.uplatnica.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          recipient: { select: { id: true, label: true, color: true } },
          payments: {
            orderBy: { paidAt: 'desc' },
            take: 1,
            select: { id: true, paidAt: true },
          },
          _count: { select: { payments: true } },
        },
      });
      return { items };
    },
    {
      query: t.Object({
        limit: t.Optional(t.Number({ minimum: 1, maximum: 200 })),
      }),
    }
  )
  .get(
    '/:id',
    async ({ params, user, prisma, status }) => {
      const item = await prisma.uplatnica.findFirst({
        where: { id: params.id, userId: user.id },
      });
      if (!item) return status(404, { error: 'Nije pronađeno', code: 'NOT_FOUND' });
      return { item };
    },
    {
      params: t.Object({ id: t.String() }),
    }
  )
  .post(
    '/',
    async ({ body, user, prisma, status }) => {
      try {
        const { qrString } = encodeUplatnica({
          recipientId: body.recipientId,
          payerName: body.payerName,
          payerAddress: body.payerAddress,
          recipientName: body.recipientName,
          recipientAddress: body.recipientAddress,
          account: body.account,
          purpose: body.purpose,
          paymentCode: body.paymentCode,
          reference: body.reference,
          amount: body.amount,
        });

        const created = await prisma.uplatnica.create({
          data: {
            userId: user.id,
            recipientId: body.recipientId || null,
            payerName: body.payerName || null,
            payerAddress: body.payerAddress || null,
            recipientName: body.recipientName,
            recipientAddress: body.recipientAddress || null,
            account: body.account,
            purpose: body.purpose || null,
            paymentCode: body.paymentCode || null,
            reference: body.reference || null,
            amount: body.amount,
            qrPayload: qrString,
          },
        });
        return { uplatnica: created };
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Greška pri generisanju IPS QR-a';
        return status(400, { error: msg, code: 'IPS_ENCODE_FAILED' });
      }
    },
    {
      body: t.Object({
        recipientId: t.Optional(t.String()),
        payerName: t.Optional(t.String()),
        payerAddress: t.Optional(t.String()),
        recipientName: t.String({ minLength: 1, maxLength: 70 }),
        recipientAddress: t.Optional(t.String()),
        account: t.String(),
        purpose: t.Optional(t.String({ maxLength: 35 })),
        paymentCode: t.Optional(t.String({ pattern: '^\\d{3}$' })),
        reference: t.Optional(t.String({ maxLength: 35 })),
        amount: t.String({ minLength: 1 }),
      }),
    }
  )
  .delete(
    '/:id',
    async ({ params, user, prisma, status }) => {
      const existing = await prisma.uplatnica.findFirst({
        where: { id: params.id, userId: user.id },
        select: { id: true },
      });
      if (!existing) return status(404, { error: 'Nije pronađeno', code: 'NOT_FOUND' });

      await prisma.uplatnica.delete({ where: { id: params.id } });
      return { ok: true as const };
    },
    {
      params: t.Object({ id: t.String() }),
    }
  );
