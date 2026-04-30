/**
 * Display helpers for recipient/uplatnica fields.
 * Pure presentation — never feed these back into the IPS encoder.
 */

/** Format an 18-digit account as "XXX-YYYYYYYYYYYYY-ZZ" for display. */
export function formatAccountDisplay(account: string): string {
  const digits = account.replace(/\D/g, '');
  if (digits.length !== 18) return account;
  return `${digits.slice(0, 3)}-${digits.slice(3, 16)}-${digits.slice(16)}`;
}

/** Format a decimal-comma amount as "8.612,80 RSD" for display. */
export function formatAmountDisplay(amount: string): string {
  const [intPartRaw, fracPart] = amount.split(',');
  const intPart = intPartRaw ?? '';
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return fracPart ? `${grouped},${fracPart}` : grouped;
}

/** Color palette for recipient quick-pick. */
export const RECIPIENT_COLORS = [
  '#dc2626', // red — Komercijalna
  '#facc15', // yellow — Raiffeisen
  '#16a34a', // green
  '#2563eb', // blue
  '#9333ea', // purple
  '#ea580c', // orange
  '#0891b2', // cyan
  '#db2777', // pink
] as const;
