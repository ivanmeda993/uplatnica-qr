/**
 * Normalization helpers for IPS QR fields.
 * Pure functions, fully unit-testable.
 */

/**
 * Validate a Serbian bank account number's MOD 97-10 control digits.
 *
 * Layout: 16-digit base + 2-digit control. Control digits satisfy
 * `(base * 100) mod 97 = 98 − control` — the algorithm NBS prescribes for
 * žiroračuni and that all domestic banks adopt.
 *
 * Returns the result; does not throw. Use {@link assertValidAccountChecksum}
 * to throw inside normalization pipelines.
 */
export interface AccountChecksumResult {
  valid: boolean;
  /** Provided control digits (last 2 of the 18-digit account). */
  provided: string;
  /** Expected control digits per MOD 97-10. */
  expected: string;
}

export function validateAccountChecksum(account18: string): AccountChecksumResult {
  if (!/^\d{18}$/.test(account18)) {
    throw new Error('validateAccountChecksum requires an 18-digit numeric string');
  }
  const main = account18.slice(0, 16);
  const provided = account18.slice(16);
  const remainder = Number(BigInt(main + '00') % 97n);
  const expected = (98 - remainder).toString().padStart(2, '0');
  return { valid: provided === expected, provided, expected };
}

/** Throwing variant of {@link validateAccountChecksum}. */
export function assertValidAccountChecksum(account18: string): void {
  const r = validateAccountChecksum(account18);
  if (!r.valid) {
    throw new Error(
      `Račun ima neispravnu kontrolnu cifru (${r.provided}). Po MOD 97-10 trebalo bi da bude ${r.expected}.`
    );
  }
}

/**
 * Normalize a Serbian bank account to the canonical 18-digit string AND
 * verify its MOD 97-10 control digits.
 *
 * Accepts variants like:
 *   "265-1710320000001-66" → "265171032000000166"
 *   "265 1710320000001 66" → "265171032000000166"
 *   "265171032000000166"   → "265171032000000166"
 *   "908-20501-70"         → "908000020501000070" (zero-padded middle)
 *
 * Throws on bad structure OR bad checksum — encoding a QR with a typo'd
 * account would route money to the wrong place; refuse upfront.
 */
export function normalizeAccount(input: string): string {
  const cleaned = input.replace(/[\s-]/g, '');

  if (/^\d{18}$/.test(cleaned)) {
    assertValidAccountChecksum(cleaned);
    return cleaned;
  }

  const parts = input
    .split(/[\s-]+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 3) {
    const [bank, middle, control] = parts as [string, string, string];
    if (/^\d+$/.test(bank) && /^\d+$/.test(middle) && /^\d+$/.test(control)) {
      const bankPadded = bank.padStart(3, '0').slice(0, 3);
      const middlePadded = middle.padStart(13, '0').slice(-13);
      const controlPadded = control.padStart(2, '0').slice(-2);
      const account = `${bankPadded}${middlePadded}${controlPadded}`;
      assertValidAccountChecksum(account);
      return account;
    }
  }

  if (/^\d+$/.test(cleaned) && cleaned.length < 18) {
    const padded = cleaned.padStart(18, '0');
    assertValidAccountChecksum(padded);
    return padded;
  }

  throw new Error(`Invalid account format: "${input}"`);
}

/**
 * Format an amount for the IPS I tag.
 * Input: a string with optional decimal (comma OR dot) or a number.
 * Output: ALWAYS "<integer>,<dd>" with decimal comma and exactly 2 decimal digits.
 *
 * NBS IPS spec requires `RSD<int>,<dd>` — the `,<dd>` part is mandatory, even
 * for whole-number amounts. Banks (Yettel, Banca Intesa, NLB…) reject QRs that
 * omit the fractional part.
 *
 * Examples:
 *   "8612,80"   → "8612,80"
 *   "8612.80"   → "8612,80"
 *   "8612"      → "8612,00"   (whole numbers get ,00)
 *   "100,5"     → "100,50"    (single-digit fraction is padded)
 *   "100,999"   → "100,99"    (fraction beyond 2 digits is truncated)
 *   "1.025,1"   → "1025,10"   (Serbian thousands ".")
 *   "1,025.10"  → "1025,10"   (English thousands ",")
 *    8612.8     → "8612,80"   (number → 2 decimals)
 */
export function normalizeAmount(input: string | number): string {
  if (typeof input === 'number') {
    if (!Number.isFinite(input) || input < 0) {
      throw new Error(`Invalid amount: ${input}`);
    }
    return input.toFixed(2).replace('.', ',');
  }

  const trimmed = input.trim();
  if (!trimmed) throw new Error('Empty amount');

  const lastComma = trimmed.lastIndexOf(',');
  const lastDot = trimmed.lastIndexOf('.');
  let intPart: string;
  let fracPart: string;

  if (lastComma === -1 && lastDot === -1) {
    intPart = trimmed;
    fracPart = '';
  } else {
    const decimalIdx = Math.max(lastComma, lastDot);
    intPart = trimmed.slice(0, decimalIdx);
    fracPart = trimmed.slice(decimalIdx + 1);
  }

  intPart = intPart.replace(/[\s,.]/g, '');

  if (!/^\d+$/.test(intPart)) {
    throw new Error(`Invalid amount integer part: "${intPart}"`);
  }
  if (fracPart && !/^\d+$/.test(fracPart)) {
    throw new Error(`Invalid amount fraction part: "${fracPart}"`);
  }

  const intCleaned = intPart.replace(/^0+(?=\d)/, '');
  const fracPadded = (fracPart || '').slice(0, 2).padEnd(2, '0');
  return `${intCleaned},${fracPadded}`;
}

/**
 * Strip whitespace and dashes from a reference number.
 * Model 97 specifically forbids dashes.
 */
export function normalizeReference(input: string): string {
  return input.replace(/[\s-]/g, '');
}

/**
 * Validate and normalize an IPS reference (RO tag) per its model.
 * The first two characters define the model:
 *   - "97" → MOD 97-10 with mandatory checksum (digits only, no dashes)
 *   - other ("00", "11", "12", "21"…) → digits + optional dashes
 *
 * Model 97 layout per NBS spec: "97" + <2-digit checksum> + <up to 18 base digits>.
 * The checksum is computed over the base so that
 * (numeric value of base digits) * 100 + checksum ≡ 98 (mod 97).
 *
 * Throws a descriptive error if the structure is invalid. Returns the
 * normalized (whitespace + dash stripped) reference on success.
 */
export function normalizeReferenceModel(input: string): string {
  const stripped = input.replace(/\s/g, '');
  if (!stripped) return '';

  const modelChars = stripped.slice(0, 2);
  if (!/^\d{2}$/.test(modelChars)) {
    throw new Error(
      `Poziv na broj mora počinjati 2-cifrenim modelom (npr. 97, 00, 11): "${input}"`
    );
  }

  if (modelChars === '97') {
    // Model 97 forbids dashes/spaces inside the reference.
    if (/-/.test(input)) {
      throw new Error('Model 97 ne sme da sadrži crtice u pozivu na broj');
    }
    if (!/^\d+$/.test(stripped)) {
      throw new Error(`Model 97 mora biti samo cifre: "${input}"`);
    }
    if (stripped.length < 5 || stripped.length > 22) {
      throw new Error(`Model 97 mora imati 5-22 cifara, ima ${stripped.length}`);
    }
    const checksum = stripped.slice(2, 4);
    const base = stripped.slice(4);
    if (!base) {
      throw new Error('Model 97 mora imati bar 1 osnovnu cifru posle kontrolne sume');
    }
    if (!isValidMod9710(base, checksum)) {
      throw new Error(`Model 97: kontrolna suma "${checksum}" se ne slaže sa osnovom "${base}"`);
    }
    return stripped;
  }

  // Other models: allow digits + dashes (NBS allows separators in non-97 models).
  // Strip dashes for canonical storage; banks generally accept either form.
  const cleaned = stripped.replace(/-/g, '');
  if (!/^\d+$/.test(cleaned)) {
    throw new Error(`Poziv na broj sme da sadrži samo cifre i crtice: "${input}"`);
  }
  if (cleaned.length > 22) {
    throw new Error(`Poziv na broj je predugačak (max 22 cifre)`);
  }
  return cleaned;
}

/**
 * MOD 97-10 verification per ISO 7064 (used by Serbian Model 97).
 * Concatenated digits (base + checksum) interpreted as a single integer must
 * leave a remainder of 1 when divided by 97. Verified against real-world QRs
 * (e.g. Telekom Srbija RO=97082900643729715).
 */
function isValidMod9710(base: string, checksum: string): boolean {
  // Walk digit-by-digit to avoid BigInt; same as taking the full integer mod 97.
  let remainder = 0;
  for (const ch of base) {
    remainder = (remainder * 10 + Number(ch)) % 97;
  }
  remainder = (remainder * 100 + Number(checksum)) % 97;
  return remainder === 1;
}

/**
 * Compute the MOD 97-10 (ISO 7064) checksum for a base string.
 * Returns a 2-digit zero-padded string. Useful for UI helpers / generators.
 *
 *   checksum = (98 − (base · 100 mod 97)) mod 97
 *
 * so that (base · 100 + checksum) mod 97 === 1.
 */
export function computeMod9710Checksum(base: string): string {
  if (!/^\d+$/.test(base)) {
    throw new Error(`Base mora biti samo cifre: "${base}"`);
  }
  let remainder = 0;
  for (const ch of base) {
    remainder = (remainder * 10 + Number(ch)) % 97;
  }
  const product = (remainder * 100) % 97;
  const checksum = (98 - product + 97) % 97;
  return checksum.toString().padStart(2, '0');
}

/**
 * Normalize multiline name/address to use CRLF (\r\n) as line separator,
 * trimming each line and collapsing consecutive blank lines.
 */
export function normalizeMultiline(input: string, maxLines = 3): string {
  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, maxLines);
  return lines.join('\r\n');
}
