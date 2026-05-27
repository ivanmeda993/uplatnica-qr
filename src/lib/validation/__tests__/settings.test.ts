import { describe, expect, it } from 'vitest';

import { settingsFormSchema } from '../settings';

describe('settingsFormSchema', () => {
  it('accepts empty payer defaults', () => {
    expect(
      settingsFormSchema.parse({
        defaultPayerName: '',
        defaultPayerAddress: '',
      })
    ).toEqual({
      defaultPayerName: '',
      defaultPayerAddress: '',
    });
  });

  it('trims payer defaults', () => {
    expect(
      settingsFormSchema.parse({
        defaultPayerName: '  Petar Petrović  ',
        defaultPayerAddress: '  Bulevar 1  ',
      })
    ).toEqual({
      defaultPayerName: 'Petar Petrović',
      defaultPayerAddress: 'Bulevar 1',
    });
  });

  it('rejects payer fields over 70 characters', () => {
    const tooLong = 'a'.repeat(71);

    expect(() =>
      settingsFormSchema.parse({
        defaultPayerName: tooLong,
        defaultPayerAddress: '',
      })
    ).toThrow();

    expect(() =>
      settingsFormSchema.parse({
        defaultPayerName: '',
        defaultPayerAddress: tooLong,
      })
    ).toThrow();
  });

  it('rejects payer name and address when combined IPS P exceeds 70 UTF-8 bytes', () => {
    expect(() =>
      settingsFormSchema.parse({
        defaultPayerName: 'a'.repeat(40),
        defaultPayerAddress: 'b'.repeat(29),
      })
    ).toThrow();
  });
});
