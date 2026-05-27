import { describe, expect, it } from 'vitest';

import { recipientFormSchema, uplatnicaFormSchema } from '../schema';

const validRecipient = {
  label: 'Mama Ljubica',
  name: 'Ljubica Petrović',
  address: '',
  account: '265-1710320000001-66',
  purpose: '',
  paymentCode: '289',
  reference: '',
  defaultAmount: '',
  color: '#d73a31',
};

describe('recipientFormSchema', () => {
  it('accepts an optional recipient address', () => {
    expect(
      recipientFormSchema.parse({
        ...validRecipient,
        address: 'Bulevar kralja Aleksandra 1',
      }).address
    ).toBe('Bulevar kralja Aleksandra 1');
  });

  it('rejects recipient address over 70 characters', () => {
    expect(() =>
      recipientFormSchema.parse({
        ...validRecipient,
        address: 'a'.repeat(71),
      })
    ).toThrow();
  });

  it('rejects recipient name and address when combined IPS N exceeds 70 UTF-8 bytes', () => {
    expect(() =>
      recipientFormSchema.parse({
        ...validRecipient,
        name: 'a'.repeat(40),
        address: 'b'.repeat(29),
      })
    ).toThrow();
  });
});

const validUplatnica = {
  recipientId: '',
  payerName: '',
  payerAddress: '',
  recipientName: 'Ljubica Petrović',
  recipientAddress: '',
  account: '265-1710320000001-66',
  purpose: '',
  paymentCode: '289',
  reference: '',
  amount: '1000,00',
};

describe('uplatnicaFormSchema', () => {
  it('rejects recipient name and address when combined IPS N exceeds 70 UTF-8 bytes', () => {
    expect(() =>
      uplatnicaFormSchema.parse({
        ...validUplatnica,
        recipientName: 'a'.repeat(40),
        recipientAddress: 'b'.repeat(29),
      })
    ).toThrow();
  });

  it('rejects payer name and address when combined IPS P exceeds 70 UTF-8 bytes', () => {
    expect(() =>
      uplatnicaFormSchema.parse({
        ...validUplatnica,
        payerName: 'a'.repeat(40),
        payerAddress: 'b'.repeat(29),
      })
    ).toThrow();
  });
});
