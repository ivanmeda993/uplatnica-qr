/**
 * NBS IPS QR specification.
 * Source: https://ips.nbs.rs/PDF/Smernice_Generator_Validator_engl_feb2023.pdf
 *
 * Payload format: TAG:VALUE separated by '|'.
 * UTF-8. Max QR version 13 (≤331 bytes).
 */

export const IPS_TAGS = {
  /** Identification code: PR=printed invoice, PT=POS-merchant, PK=POS-customer, EK=ecommerce */
  K: 'K',
  /** Version, fixed "01" */
  V: 'V',
  /** Charset, fixed "1" (UTF-8) */
  C: 'C',
  /** Payee account, exactly 18 digits, no separators */
  R: 'R',
  /** Payee name + address, ≤70 chars, CRLF allowed */
  N: 'N',
  /** Currency + amount, format "RSD<n>,<dd>" with decimal comma */
  I: 'I',
  /** Payer account (optional) */
  O: 'O',
  /** Payer name + address (optional) */
  P: 'P',
  /** Payment code, 3 digits (optional) */
  SF: 'SF',
  /** Purpose of payment (optional) */
  S: 'S',
  /** Reference / "poziv na broj", first 2 digits = model (optional) */
  RO: 'RO',
  /** Free-form payee reference (optional) */
  RL: 'RL',
  /** Transaction reference at POS, 19 chars (optional) */
  RP: 'RP',
  /** Merchant Category Code (optional) */
  M: 'M',
  /** One-time payer code (optional) */
  JS: 'JS',
} as const;

export type IpsTag = (typeof IPS_TAGS)[keyof typeof IPS_TAGS];

export const IPS_DELIMITER = '|';
export const IPS_TAG_VALUE_SEPARATOR = ':';

export const IPS_FIXED = {
  K_PRINTED: 'PR',
  K_POS_MERCHANT: 'PT',
  K_POS_CUSTOMER: 'PK',
  K_ECOMMERCE: 'EK',
  V: '01',
  C: '1',
  CURRENCY: 'RSD',
} as const;

/** Max bytes inside a v13 QR with ECC level M */
export const IPS_MAX_BYTES = 331;
