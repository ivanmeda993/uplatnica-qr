import { describe, expect, it } from 'vitest';

import { decodeIpsPayload, payloadToFormInput } from '../decode';

const TELEKOM_RAW =
  'K:PR|V:01|C:1|R:170003001370600358|N:Telekom Srbija A.D.\r\nTakovska 2\r\nBeograd|I:RSD7821,90|P:SANDRA BUDIMIROVIĆ\r\nCVETINA BRKIĆA 155\r\n15356 GLUŠCI|SF:189|S:MTS Račun 11/2025 5667276/2|RO:97082900643729715';

const SIMPLE_RAW = 'K:PR|V:01|C:1|R:115038163722714208|N:Ivan Milicevic|I:RSD7821|SF:289|S:test';

describe('decodeIpsPayload', () => {
  it('parses real Telekom bill QR', () => {
    const p = decodeIpsPayload(TELEKOM_RAW);
    expect(p.R).toBe('170003001370600358');
    expect(p.I).toBe('RSD7821,90');
    expect(p.RO).toBe('97082900643729715');
    expect(p.N).toContain('Telekom Srbija A.D.');
  });

  it('decoder remains permissive: accepts amount without ,XX (legacy/buggy generators)', () => {
    const p = decodeIpsPayload(SIMPLE_RAW);
    expect(p.I).toBe('RSD7821');
  });

  it('throws on empty input', () => {
    expect(() => decodeIpsPayload('')).toThrow();
  });

  it('throws on leading/trailing pipe', () => {
    expect(() => decodeIpsPayload('|K:PR|V:01')).toThrow();
    expect(() => decodeIpsPayload('K:PR|V:01|')).toThrow();
  });

  it('throws when V is missing or not 01', () => {
    expect(() => decodeIpsPayload('K:PR|C:1|R:170003001370600358|N:X|I:RSD1,00')).toThrow();
    expect(() => decodeIpsPayload('K:PR|V:02|C:1|R:170003001370600358|N:X|I:RSD1,00')).toThrow();
  });
});

describe('payloadToFormInput', () => {
  it('splits N into name + address by CRLF', () => {
    const p = decodeIpsPayload(TELEKOM_RAW);
    const f = payloadToFormInput(p);
    expect(f.recipientName).toBe('Telekom Srbija A.D.');
    expect(f.recipientAddress).toBe('Takovska 2\nBeograd');
    expect(f.payerName).toBe('SANDRA BUDIMIROVIĆ');
    expect(f.payerAddress).toBe('CVETINA BRKIĆA 155\n15356 GLUŠCI');
  });

  it('strips RSD prefix from amount', () => {
    const p = decodeIpsPayload(TELEKOM_RAW);
    const f = payloadToFormInput(p);
    expect(f.amount).toBe('7821,90');
  });
});
