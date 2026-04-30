import { describe, expect, it } from 'vitest';

import { computeMod9710Checksum, normalizeReferenceModel } from '../normalize';

describe('normalizeReferenceModel — model 97', () => {
  it('accepts a real Telekom RO with valid MOD 97-10 checksum', () => {
    // From decoded Telekom bill: RO=97082900643729715
    expect(normalizeReferenceModel('97082900643729715')).toBe('97082900643729715');
  });

  it('strips spaces inside model 97 reference', () => {
    expect(normalizeReferenceModel('97 0829 0064 3729 715')).toBe('97082900643729715');
  });

  it('rejects model 97 with dashes', () => {
    expect(() => normalizeReferenceModel('97-0829-00643729715')).toThrow(/crtice/);
  });

  it('rejects model 97 with letters', () => {
    expect(() => normalizeReferenceModel('97AB12345')).toThrow();
  });

  it('rejects model 97 with bad checksum', () => {
    expect(() => normalizeReferenceModel('9799082900643729715')).toThrow(/kontrolna suma/);
  });

  it('rejects model 97 that is too short or too long', () => {
    expect(() => normalizeReferenceModel('9701')).toThrow(/5-22/);
    expect(() => normalizeReferenceModel('97' + '0'.repeat(21))).toThrow(/5-22/);
  });
});

describe('normalizeReferenceModel — non-97 models', () => {
  it('accepts model 00 with digits only', () => {
    expect(normalizeReferenceModel('001234567890')).toBe('001234567890');
  });

  it('accepts model 11 with dashes (banks normally allow these)', () => {
    expect(normalizeReferenceModel('11-1234-5678')).toBe('1112345678');
  });

  it('accepts model 21 with mixed dashes', () => {
    expect(normalizeReferenceModel('21-9999')).toBe('219999');
  });

  it('rejects garbage non-97 reference', () => {
    expect(() => normalizeReferenceModel('11ABCDEF')).toThrow();
  });

  it('rejects reference with non-numeric model prefix', () => {
    expect(() => normalizeReferenceModel('XX1234')).toThrow(/2-cifrenim modelom/);
  });

  it('returns empty string for empty input (RO is optional)', () => {
    expect(normalizeReferenceModel('')).toBe('');
    expect(normalizeReferenceModel('   ')).toBe('');
  });

  it('rejects too-long non-97 reference (> 22 digits)', () => {
    expect(() => normalizeReferenceModel('11' + '0'.repeat(22))).toThrow(/predugačak/);
  });
});

describe('computeMod9710Checksum', () => {
  it('roundtrips: computed checksum makes the full reference valid', () => {
    const base = '0829006437297';
    const checksum = computeMod9710Checksum(base);
    const ref = `97${checksum}${base}`;
    expect(() => normalizeReferenceModel(ref)).not.toThrow();
  });

  it('returns the documented Telekom checksum for its base', () => {
    // RO=97082900643729715 → checksum=08, base=2900643729715
    expect(computeMod9710Checksum('2900643729715')).toBe('08');
  });

  it('throws on non-digit base', () => {
    expect(() => computeMod9710Checksum('123A')).toThrow();
  });
});
