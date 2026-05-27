import { normalizeMultiline } from './normalize';

export const IPS_NAME_FIELD_MAX_BYTES = 70;

export function utf8ByteLength(value: string) {
  return new TextEncoder().encode(value).byteLength;
}

export function combineIpsLines(lines: Array<string | null | undefined>) {
  const value = lines
    .map((line) => line?.trim())
    .filter((line): line is string => Boolean(line))
    .join('\n');
  return value ? normalizeMultiline(value) : '';
}

export function isWithinIpsNameFieldLimit(value: string) {
  return utf8ByteLength(value) <= IPS_NAME_FIELD_MAX_BYTES;
}
