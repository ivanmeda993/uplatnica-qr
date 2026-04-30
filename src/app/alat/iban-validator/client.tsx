'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { BANKS, getBankByAccount } from '@/lib/banks/data';
import { validateAccountChecksum } from '@/lib/ips-qr';

interface ValidationResult {
  ok: boolean;
  message: string;
  bank?: string;
  formatted?: string;
}

function validateAccount(input: string): ValidationResult {
  const cleaned = input.replace(/[\s-]/g, '');

  if (!cleaned) return { ok: false, message: 'Unesi broj računa.' };
  if (!/^\d+$/.test(cleaned))
    return { ok: false, message: 'Broj računa sme da sadrži samo cifre, razmake i crtice.' };
  if (cleaned.length !== 18)
    return {
      ok: false,
      message: `Broj računa mora imati tačno 18 cifara (uneseno: ${cleaned.length}).`,
    };

  const checksum = validateAccountChecksum(cleaned);
  if (!checksum.valid) {
    return {
      ok: false,
      message: `Kontrolna cifra je ${checksum.provided}, a po MOD 97-10 trebalo bi da bude ${checksum.expected}. Broj računa je netačan.`,
    };
  }

  const bank = getBankByAccount(cleaned);

  return {
    ok: true,
    message: 'Broj računa je validan.',
    bank: bank?.name,
    formatted: `${cleaned.slice(0, 3)}-${cleaned.slice(3, 16)}-${cleaned.slice(16)}`,
  };
}

export function IbanValidatorClient() {
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return validateAccount(input);
  }, [input]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-foreground mb-2 block text-sm font-medium">
          Broj računa (18 cifara)
        </label>
        <Input
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="npr. 265-1710320000001-66"
          className="font-mono"
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {result && (
        <div
          className={
            'rounded-2xl border p-5 ' +
            (result.ok
              ? 'border-success/30 bg-success/5'
              : 'border-destructive/30 bg-destructive/5')
          }
        >
          <div className="mb-2 flex items-center gap-2">
            {result.ok ? (
              <>
                <CheckCircle2 className="text-success size-5" />
                <span className="text-success font-semibold">Validan broj računa</span>
              </>
            ) : (
              <>
                <AlertCircle className="text-destructive size-5" />
                <span className="text-destructive font-semibold">Nevažeći broj računa</span>
              </>
            )}
          </div>
          <p className="text-foreground text-sm">{result.message}</p>
          {result.formatted && (
            <p className="text-muted-foreground mt-2 font-mono text-xs">{result.formatted}</p>
          )}
          {result.bank && (
            <p className="text-foreground mt-3 text-sm">
              Banka: <strong>{result.bank}</strong>
            </p>
          )}
          {result.ok && !result.bank && (
            <p className="text-muted-foreground mt-3 text-xs">
              Prefiks ne odgovara nijednoj zabeleženoj banci u našoj bazi. To može značiti da je u
              pitanju manja banka, namenski račun, ili stari prefiks.
            </p>
          )}
        </div>
      )}

      <section className="space-y-2 text-sm">
        <h2 className="text-foreground text-xs font-semibold tracking-wider uppercase">
          Najčešći prefiksi
        </h2>
        <ul className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
          {BANKS.flatMap((b) =>
            b.accountPrefixes.map((p) => (
              <li
                key={`${b.slug}-${p}`}
                className="border-border bg-card flex items-center gap-2 rounded-lg border px-3 py-1.5"
              >
                <span className="text-foreground font-mono font-semibold">{p}</span>
                <span className="text-muted-foreground">{b.shortName}</span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
