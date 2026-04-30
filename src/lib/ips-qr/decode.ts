import { type IpsPayload, ipsPayloadDecodeSchema } from './schema';
import { IPS_DELIMITER, IPS_FIXED, IPS_TAG_VALUE_SEPARATOR } from './spec';

export class IpsDecodeError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'EMPTY'
      | 'TRAILING_DELIMITER'
      | 'INVALID_TAG'
      | 'MISSING_MANDATORY'
      | 'INVALID_VALUE'
  ) {
    super(message);
    this.name = 'IpsDecodeError';
  }
}

/**
 * Parse an IPS QR text string into a structured payload.
 * Validates mandatory tags (K, V, C, R, N, I) and fixed values (V=01, C=1).
 */
export function decodeIpsPayload(qrString: string): IpsPayload {
  if (!qrString || !qrString.trim()) {
    throw new IpsDecodeError('Prazan QR sadržaj', 'EMPTY');
  }

  if (qrString.startsWith(IPS_DELIMITER) || qrString.endsWith(IPS_DELIMITER)) {
    throw new IpsDecodeError('QR ne sme početi ni završiti se sa "|"', 'TRAILING_DELIMITER');
  }

  const segments = qrString.split(IPS_DELIMITER);
  const map = new Map<string, string>();

  for (const seg of segments) {
    const sepIdx = seg.indexOf(IPS_TAG_VALUE_SEPARATOR);
    if (sepIdx <= 0) {
      throw new IpsDecodeError(`Neispravan segment: "${seg}"`, 'INVALID_TAG');
    }
    const tag = seg.slice(0, sepIdx).trim().toUpperCase();
    const value = seg.slice(sepIdx + 1);
    if (!tag) {
      throw new IpsDecodeError(`Prazan tag u segmentu: "${seg}"`, 'INVALID_TAG');
    }
    map.set(tag, value);
  }

  const v = map.get('V');
  const c = map.get('C');
  if (v !== IPS_FIXED.V) {
    throw new IpsDecodeError(`V mora biti "${IPS_FIXED.V}", dobijeno: "${v}"`, 'INVALID_VALUE');
  }
  if (c !== IPS_FIXED.C) {
    throw new IpsDecodeError(`C mora biti "${IPS_FIXED.C}", dobijeno: "${c}"`, 'INVALID_VALUE');
  }

  const candidate: Record<string, string | undefined> = {
    K: map.get('K'),
    R: map.get('R'),
    N: map.get('N'),
    I: map.get('I'),
    P: map.get('P'),
    SF: map.get('SF'),
    S: map.get('S'),
    RO: map.get('RO'),
    O: map.get('O'),
    M: map.get('M'),
    JS: map.get('JS'),
    RP: map.get('RP'),
    RL: map.get('RL'),
  };

  const result = ipsPayloadDecodeSchema.safeParse(candidate);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new IpsDecodeError(`Neispravna IPS struktura: ${issues}`, 'INVALID_VALUE');
  }

  return result.data;
}

/**
 * Convert a decoded payload back into form-friendly fields for UI prefilling.
 */
export function payloadToFormInput(payload: IpsPayload) {
  const [recipientName, ...recipientAddrLines] = payload.N.split(/\r?\n/);
  const [payerName, ...payerAddrLines] = (payload.P ?? '').split(/\r?\n/);

  const amountWithoutCurrency = payload.I.startsWith(IPS_FIXED.CURRENCY)
    ? payload.I.slice(IPS_FIXED.CURRENCY.length)
    : payload.I;

  return {
    recipientName: recipientName ?? '',
    recipientAddress: recipientAddrLines.join('\n'),
    payerName: payerName ?? '',
    payerAddress: payerAddrLines.join('\n'),
    account: payload.R,
    purpose: payload.S ?? '',
    paymentCode: payload.SF ?? '',
    reference: payload.RO ?? '',
    amount: amountWithoutCurrency,
  };
}
