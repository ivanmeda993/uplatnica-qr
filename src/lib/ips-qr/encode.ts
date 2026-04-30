import {
  normalizeAccount,
  normalizeAmount,
  normalizeMultiline,
  normalizeReferenceModel,
} from './normalize';
import { type IpsPayload, ipsPayloadSchema, type UplatnicaFormInput } from './schema';
import { IPS_DELIMITER, IPS_FIXED, IPS_MAX_BYTES, IPS_TAG_VALUE_SEPARATOR, IPS_TAGS } from './spec';

/**
 * Build a canonical IPS payload from raw form input.
 * Performs all required normalization (account, amount, multiline).
 */
export function buildIpsPayload(input: UplatnicaFormInput): IpsPayload {
  const recipientName = input.recipientAddress
    ? normalizeMultiline(`${input.recipientName}\n${input.recipientAddress}`)
    : normalizeMultiline(input.recipientName);

  const payerLines = [input.payerName, input.payerAddress].filter(Boolean).join('\n');
  const payerNormalized = payerLines ? normalizeMultiline(payerLines) : undefined;

  const amount = `${IPS_FIXED.CURRENCY}${normalizeAmount(input.amount)}`;

  const candidate: Record<string, string | undefined> = {
    K: IPS_FIXED.K_PRINTED,
    R: normalizeAccount(input.account),
    N: recipientName,
    I: amount,
    P: payerNormalized,
    SF: input.paymentCode || undefined,
    S: input.purpose || undefined,
    RO: input.reference ? normalizeReferenceModel(input.reference) : undefined,
  };

  return ipsPayloadSchema.parse(candidate);
}

/**
 * Serialize a canonical IpsPayload into the IPS QR text string.
 * Order is fixed: K, V, C, R, N, I, then optional tags in canonical order.
 * Empty optional tags are omitted entirely.
 */
export function encodeIpsPayload(payload: IpsPayload): string {
  const parts: string[] = [];

  const writeTag = (tag: string, value: string | undefined) => {
    if (value === undefined || value === '') return;
    parts.push(`${tag}${IPS_TAG_VALUE_SEPARATOR}${value}`);
  };

  writeTag(IPS_TAGS.K, payload.K);
  writeTag(IPS_TAGS.V, IPS_FIXED.V);
  writeTag(IPS_TAGS.C, IPS_FIXED.C);
  writeTag(IPS_TAGS.R, payload.R);
  writeTag(IPS_TAGS.N, payload.N);
  writeTag(IPS_TAGS.I, payload.I);
  writeTag(IPS_TAGS.P, payload.P);
  writeTag(IPS_TAGS.SF, payload.SF);
  writeTag(IPS_TAGS.S, payload.S);
  writeTag(IPS_TAGS.RO, payload.RO);
  writeTag(IPS_TAGS.O, payload.O);
  writeTag(IPS_TAGS.M, payload.M);
  writeTag(IPS_TAGS.JS, payload.JS);
  writeTag(IPS_TAGS.RP, payload.RP);
  writeTag(IPS_TAGS.RL, payload.RL);

  const out = parts.join(IPS_DELIMITER);

  const byteLength = new TextEncoder().encode(out).length;
  if (byteLength > IPS_MAX_BYTES) {
    throw new Error(
      `IPS QR payload predugačak: ${byteLength} bajtova (max ${IPS_MAX_BYTES}). ` +
        `Skrati naziv primaoca ili svrhu plaćanja.`
    );
  }

  return out;
}

/** Convenience: build and serialize in one go. */
export function encodeUplatnica(input: UplatnicaFormInput): {
  payload: IpsPayload;
  qrString: string;
} {
  const payload = buildIpsPayload(input);
  const qrString = encodeIpsPayload(payload);
  return { payload, qrString };
}
