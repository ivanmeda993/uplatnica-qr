import { z } from 'zod';

/**
 * Zod schemas for IPS QR input.
 * These represent USER INPUT before normalization — flexible accepts.
 * Use `normalize.ts` to canonicalize before encoding.
 */

const trimmed = z.string().trim();

/** 3-13-2 with optional dashes, OR 18 contiguous digits. */
const accountInput = trimmed
  .min(8, 'Račun mora imati najmanje 8 znakova')
  .max(22, 'Račun je predugačak')
  .refine(
    (v) => {
      const cleaned = v.replace(/[\s-]/g, '');
      return /^\d+$/.test(cleaned) && cleaned.length >= 8 && cleaned.length <= 18;
    },
    { message: 'Račun mora biti u formatu XXX-YYYYYYY-ZZ ili 18 cifara' }
  );

/** Allow comma OR dot decimal. Reject negatives. */
const amountInput = trimmed.min(1, 'Iznos je obavezan').refine(
  (v) => {
    const cleaned = v.replace(/[\s.,]/g, '');
    return /^\d+$/.test(cleaned) && cleaned.length > 0 && cleaned.length <= 14;
  },
  { message: 'Neispravan iznos' }
);

/** Optional 3-digit payment code. */
const paymentCodeInput = trimmed
  .regex(/^\d{3}$/, 'Šifra plaćanja mora imati tačno 3 cifre')
  .optional()
  .or(z.literal(''));

/** Reference: digits, optionally with dashes (except model 97). */
const referenceInput = trimmed.max(35, 'Poziv na broj je predugačak').optional().or(z.literal(''));

export const recipientFormSchema = z.object({
  label: trimmed.min(1, 'Naziv šablona je obavezan').max(50),
  name: trimmed.min(1, 'Ime primaoca je obavezno').max(70),
  account: accountInput,
  purpose: trimmed.max(35).optional().or(z.literal('')),
  paymentCode: paymentCodeInput,
  reference: referenceInput,
  defaultAmount: trimmed.optional().or(z.literal('')),
  color: trimmed
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional()
    .or(z.literal('')),
});

export const uplatnicaFormSchema = z.object({
  recipientId: z.string().cuid().optional().or(z.literal('')),

  payerName: trimmed.max(70).optional().or(z.literal('')),
  payerAddress: trimmed.max(70).optional().or(z.literal('')),

  recipientName: trimmed.min(1, 'Ime primaoca je obavezno').max(70),
  recipientAddress: trimmed.max(70).optional().or(z.literal('')),
  account: accountInput,
  purpose: trimmed.max(35).optional().or(z.literal('')),
  paymentCode: paymentCodeInput,
  reference: referenceInput,
  amount: amountInput,
});

export type RecipientFormInput = z.infer<typeof recipientFormSchema>;
export type UplatnicaFormInput = z.infer<typeof uplatnicaFormSchema>;

/** UTF-8 byte length (NBS spec measures in bytes, not JS code units). */
const utf8Bytes = (v: string) => new TextEncoder().encode(v).byteLength;
const maxUtf8Bytes = (max: number, label: string) =>
  z.string().refine((v) => utf8Bytes(v) <= max, {
    message: `${label} ne sme biti duži od ${max} bajtova (UTF-8)`,
  });

/**
 * Canonical encoded form (post-normalization). Strict — this is what we ENCODE.
 * Decoder uses a separate, more permissive schema (see ipsPayloadDecodeSchema).
 *
 * I is `RSD<int>,<dd>` with mandatory 2-digit decimal — banks (Yettel, Intesa,
 * NLB) reject QRs without the comma+dd fraction.
 */
export const ipsPayloadSchema = z.object({
  K: z.literal('PR').or(z.literal('PT')).or(z.literal('PK')).or(z.literal('EK')).default('PR'),
  R: z.string().regex(/^\d{18}$/, 'R mora biti 18 cifara'),
  N: maxUtf8Bytes(70, 'N (primalac + adresa)').refine((v) => v.length >= 1, 'N je obavezno'),
  I: z.string().regex(/^RSD\d{1,12},\d{2}$/, 'I mora biti u formatu RSD<n>,<dd>'),
  P: maxUtf8Bytes(70, 'P (platilac + adresa)').optional(),
  SF: z
    .string()
    .regex(/^\d{3}$/)
    .optional(),
  S: maxUtf8Bytes(35, 'S (svrha plaćanja)').optional(),
  RO: z.string().max(35).optional(),
  O: z
    .string()
    .regex(/^\d{18}$/)
    .optional(),
  M: z.string().optional(),
  JS: z.string().optional(),
  RP: z.string().length(19).optional(),
  RL: maxUtf8Bytes(35, 'RL').optional(),
});

/**
 * Permissive schema used ONLY when decoding QR codes from external sources
 * (other apps, legacy systems). Accepts amounts without ,XX so we can still
 * extract data from non-conformant QRs and surface it to the user.
 */
export const ipsPayloadDecodeSchema = ipsPayloadSchema.extend({
  I: z.string().regex(/^RSD\d{1,12}(,\d{1,2})?$/, 'I mora biti u formatu RSD<n>[,dd]'),
});

export type IpsPayload = z.infer<typeof ipsPayloadSchema>;
