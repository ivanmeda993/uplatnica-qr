import { describe, expect, it } from 'vitest';

import {
  assertValidAccountChecksum,
  normalizeAccount,
  normalizeAmount,
  normalizeMultiline,
  normalizeReference,
  validateAccountChecksum,
} from '../normalize';

describe('normalizeAmount', () => {
  it('returns whole numbers with mandatory ,00 (NBS spec requires <int>,<dd>)', () => {
    expect(normalizeAmount('7821')).toBe('7821,00');
    expect(normalizeAmount('1000')).toBe('1000,00');
    expect(normalizeAmount('1')).toBe('1,00');
  });

  it('preserves comma decimals and pads single-digit fraction', () => {
    expect(normalizeAmount('7821,90')).toBe('7821,90');
    expect(normalizeAmount('7821,9')).toBe('7821,90');
    expect(normalizeAmount('100,5')).toBe('100,50');
  });

  it('converts dot decimals to comma', () => {
    expect(normalizeAmount('8612.80')).toBe('8612,80');
    expect(normalizeAmount('8612.8')).toBe('8612,80');
  });

  it('strips Serbian thousands separator (.)', () => {
    expect(normalizeAmount('1.025,1')).toBe('1025,10');
    expect(normalizeAmount('1.000.000,00')).toBe('1000000,00');
  });

  it('strips English thousands separator (,)', () => {
    expect(normalizeAmount('1,025.10')).toBe('1025,10');
    expect(normalizeAmount('1,000,000.00')).toBe('1000000,00');
  });

  it('handles numeric input with toFixed(2)', () => {
    expect(normalizeAmount(8612.8)).toBe('8612,80');
    expect(normalizeAmount(7821)).toBe('7821,00');
    expect(normalizeAmount(0.5)).toBe('0,50');
  });

  it('truncates fraction beyond 2 digits', () => {
    expect(normalizeAmount('100,999')).toBe('100,99');
  });

  it('strips leading zeros from integer part but keeps single 0', () => {
    expect(normalizeAmount('00100')).toBe('100,00');
    expect(normalizeAmount('0,50')).toBe('0,50');
  });

  it('throws on invalid input', () => {
    expect(() => normalizeAmount('')).toThrow();
    expect(() => normalizeAmount('abc')).toThrow();
    expect(() => normalizeAmount(-1)).toThrow();
    expect(() => normalizeAmount(NaN)).toThrow();
  });
});

describe('normalizeAccount', () => {
  it('normalizes XXX-YYYYYYYYYYYYY-ZZ to 18 digits', () => {
    expect(normalizeAccount('265-1710320000001-66')).toBe('265171032000000166');
  });

  it('zero-pads middle segment to 13 digits', () => {
    // 908 (bank, 3) + 20501 padded left to 13 = 0000000020501 + 70 (control, 2) = 18 digits
    const result = normalizeAccount('908-20501-70');
    expect(result).toHaveLength(18);
    expect(result.slice(0, 3)).toBe('908');
    expect(result.slice(3, 16)).toBe('0000000020501');
    expect(result.slice(16)).toBe('70');
  });

  it('accepts 18 contiguous digits as-is', () => {
    expect(normalizeAccount('170003001370600358')).toBe('170003001370600358');
  });

  it('strips spaces', () => {
    expect(normalizeAccount('170 0030013706 0035 8')).toBe('170003001370600358');
  });

  it('throws on invalid', () => {
    expect(() => normalizeAccount('abc-def-ghi')).toThrow();
    expect(() => normalizeAccount('')).toThrow();
  });
});

describe('validateAccountChecksum (MOD 97-10)', () => {
  it('passes for a real 18-digit Serbian account', () => {
    // 170003001370600358 = Banca Intesa Telekom recipient (real)
    expect(validateAccountChecksum('170003001370600358').valid).toBe(true);
  });

  it('reports the correct expected control on a typo', () => {
    // Flip one digit so the checksum no longer matches
    const r = validateAccountChecksum('170003001370600359');
    expect(r.valid).toBe(false);
    expect(r.provided).toBe('59');
    expect(r.expected).toMatch(/^\d{2}$/);
    expect(r.expected).not.toBe('59');
  });

  it('throws if not 18 digits', () => {
    expect(() => validateAccountChecksum('123')).toThrow();
    expect(() => validateAccountChecksum('17000300137060035X')).toThrow();
  });

  it('assertValidAccountChecksum throws with helpful message on mismatch', () => {
    expect(() => assertValidAccountChecksum('170003001370600359')).toThrow(/MOD 97-10/);
  });

  it('normalizeAccount rejects valid-structure account with bad checksum', () => {
    // Same as above — proves the encoder pipeline catches typos before QR emission
    expect(() => normalizeAccount('170003001370600359')).toThrow(/MOD 97-10/);
    expect(() => normalizeAccount('170-0030013706-59')).toThrow(/MOD 97-10/);
  });
});

describe('normalizeMultiline', () => {
  it('joins with CRLF and trims lines', () => {
    expect(normalizeMultiline('Telekom Srbija A.D.\nTakovska 2\nBeograd')).toBe(
      'Telekom Srbija A.D.\r\nTakovska 2\r\nBeograd'
    );
  });

  it('limits to 3 lines by default', () => {
    expect(normalizeMultiline('a\nb\nc\nd\ne')).toBe('a\r\nb\r\nc');
  });

  it('drops blank lines', () => {
    expect(normalizeMultiline('Line 1\n\n\nLine 2')).toBe('Line 1\r\nLine 2');
  });
});

describe('normalizeReference', () => {
  it('strips spaces and dashes', () => {
    expect(normalizeReference('97-082900-643729715')).toBe('97082900643729715');
    expect(normalizeReference('97 0829 6437 29715')).toBe('97082964372971' + '5');
  });
});
