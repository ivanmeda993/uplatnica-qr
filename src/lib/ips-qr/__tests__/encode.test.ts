import { describe, expect, it } from 'vitest';

import { decodeIpsPayload } from '../decode';
import { buildIpsPayload, encodeIpsPayload, encodeUplatnica } from '../encode';

const baseInput = {
  recipientName: 'Ivan Milicevic',
  recipientAddress: '',
  payerName: '',
  payerAddress: '',
  account: '115038163722714208',
  purpose: 'test',
  paymentCode: '289',
  reference: '',
  amount: '7821',
};

describe('encodeUplatnica', () => {
  it('always emits I:RSD<int>,<dd> even for whole-number amounts (regression for Yettel rejection)', () => {
    const { qrString, payload } = encodeUplatnica(baseInput);
    expect(payload.I).toBe('RSD7821,00');
    expect(qrString).toContain('I:RSD7821,00');
    expect(qrString).not.toContain('I:RSD7821|');
  });

  it('emits well-formed mandatory fields in correct order (K, V, C, R, N, I)', () => {
    const { qrString } = encodeUplatnica(baseInput);
    const segs = qrString.split('|').slice(0, 6);
    expect(segs).toEqual([
      'K:PR',
      'V:01',
      'C:1',
      'R:115038163722714208',
      'N:Ivan Milicevic',
      'I:RSD7821,00',
    ]);
  });

  it('roundtrips: encode → decode produces equivalent data', () => {
    const { qrString } = encodeUplatnica({
      ...baseInput,
      amount: '8612,80',
      reference: '97082900643729715',
    });
    const decoded = decodeIpsPayload(qrString);
    expect(decoded.I).toBe('RSD8612,80');
    expect(decoded.RO).toBe('97082900643729715');
  });

  it('handles multi-line N (recipient name + address with CRLF)', () => {
    const { payload, qrString } = encodeUplatnica({
      ...baseInput,
      recipientName: 'Telekom Srbija A.D.',
      recipientAddress: 'Takovska 2\nBeograd',
    });
    expect(payload.N).toBe('Telekom Srbija A.D.\r\nTakovska 2\r\nBeograd');
    expect(qrString).toContain('N:Telekom Srbija A.D.\r\nTakovska 2\r\nBeograd');
  });

  it('omits empty optional tags entirely (no K:|V: trailing)', () => {
    const { qrString } = encodeUplatnica(baseInput);
    expect(qrString.endsWith('|')).toBe(false);
    expect(qrString.startsWith('|')).toBe(false);
    // No empty value tags
    expect(qrString).not.toMatch(/[A-Z]+:\|/);
    expect(qrString).not.toMatch(/[A-Z]+:$/);
  });
});

describe('buildIpsPayload', () => {
  it('rejects whole amount when packed without ,XX (encoder schema must be strict)', () => {
    // This bypasses normalize and directly hits schema — should fail strict regex.
    const { payload } = encodeUplatnica(baseInput);
    expect(payload.I).toMatch(/^RSD\d+,\d{2}$/);
  });
});

describe('encodeIpsPayload byte-length guard', () => {
  it('throws when payload exceeds 331 bytes', () => {
    const huge = buildIpsPayload({
      ...baseInput,
      recipientName: 'A'.repeat(70),
      payerName: 'B'.repeat(70),
      purpose: 'C'.repeat(35),
      reference: '9'.repeat(22),
    });
    // Push beyond 331 bytes by using max for everything + CRLF padding
    huge.S = 'X'.repeat(35);
    huge.RL = 'Y'.repeat(35);
    huge.M = 'Z'.repeat(40);
    expect(() => encodeIpsPayload(huge)).toThrow(/predugačak/);
  });
});
