'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { decodeIpsPayload, IpsDecodeError } from '@/lib/ips-qr/decode';
import type { IpsPayload } from '@/lib/ips-qr/schema';

const SAMPLE = `K:PR|V:01|C:1|R:160000000123456778|N:JKP INFOSTAN TEHNOLOGIJE|I:RSD6840,50|SF:221|S:KOMUNALIJE|RO:97 84 1234567`;

const TAG_LABELS: Record<string, string> = {
  K: 'Kanal',
  V: 'Verzija',
  C: 'Karakter set',
  R: 'Račun primaoca',
  N: 'Naziv primaoca',
  I: 'Iznos',
  P: 'Platilac',
  SF: 'Šifra plaćanja',
  S: 'Svrha plaćanja',
  RO: 'Poziv na broj',
  O: 'Datum izvršenja',
  M: 'Model',
  JS: 'Jedinstveni broj plaćanja',
  RP: 'Referenca primaoca',
  RL: 'Referenca platioca',
};

export function IpsValidatorClient() {
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const payload = decodeIpsPayload(input.trim());
      const byteLength = new TextEncoder().encode(input.trim()).length;
      return { ok: true as const, payload, byteLength };
    } catch (e) {
      if (e instanceof IpsDecodeError) {
        return { ok: false as const, error: e.message, code: e.code };
      }
      return {
        ok: false as const,
        error: e instanceof Error ? e.message : 'Nepoznata greška',
        code: 'UNKNOWN',
      };
    }
  }, [input]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-foreground mb-2 block text-sm font-medium">IPS QR payload</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="K:PR|V:01|C:1|R:..."
          rows={6}
          className="font-mono text-xs"
          spellCheck={false}
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            {input.length} karaktera · {new TextEncoder().encode(input).length} bajtova{' '}
            {new TextEncoder().encode(input).length > 331 && (
              <span className="text-destructive">(prelazi NBS limit od 331 bajta)</span>
            )}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setInput(SAMPLE)}
            disabled={input === SAMPLE}
          >
            Učitaj primer
          </Button>
        </div>
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
          <div className="mb-4 flex items-center gap-2">
            {result.ok ? (
              <>
                <CheckCircle2 className="text-success size-5" />
                <span className="text-success font-semibold">Validan IPS QR payload</span>
              </>
            ) : (
              <>
                <AlertCircle className="text-destructive size-5" />
                <span className="text-destructive font-semibold">Nevažeći payload</span>
              </>
            )}
          </div>

          {result.ok ? (
            <PayloadTable payload={result.payload} byteLength={result.byteLength} />
          ) : (
            <div className="space-y-1.5 text-sm">
              <p className="text-foreground">{result.error}</p>
              <p className="text-muted-foreground text-xs">Kod greške: {result.code}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PayloadTable({ payload, byteLength }: { payload: IpsPayload; byteLength: number }) {
  const rows = Object.entries(payload).filter(([, v]) => v !== undefined && v !== '');
  return (
    <div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-border border-b">
            <th className="text-muted-foreground py-2 pr-4 text-left text-xs font-semibold tracking-wider uppercase">
              Tag
            </th>
            <th className="text-muted-foreground py-2 pr-4 text-left text-xs font-semibold tracking-wider uppercase">
              Polje
            </th>
            <th className="text-muted-foreground py-2 text-left text-xs font-semibold tracking-wider uppercase">
              Vrednost
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([tag, value]) => (
            <tr key={tag} className="border-border/50 border-b last:border-0">
              <td className="py-2 pr-4">
                <Badge variant="outline" className="font-mono text-[10px]">
                  {tag}
                </Badge>
              </td>
              <td className="text-muted-foreground py-2 pr-4 text-xs">{TAG_LABELS[tag] ?? tag}</td>
              <td className="text-foreground py-2 font-mono text-xs break-all">{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-muted-foreground mt-4 text-xs">
        Veličina payload-a: <strong>{byteLength}</strong> bajtova (max 331)
      </p>
    </div>
  );
}
