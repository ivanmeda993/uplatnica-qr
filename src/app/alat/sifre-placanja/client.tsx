'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  GROUP_LABELS,
  PAYMENT_CODES,
  type PaymentCode,
  POPULAR_CODES,
} from '@/lib/payment-codes/data';

export function SifrePlacanjaClient() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PAYMENT_CODES;
    return PAYMENT_CODES.filter(
      (c) =>
        c.code.includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.example?.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const out: Record<string, PaymentCode[]> = {};
    for (const code of filtered) {
      out[code.group] ||= [];
      out[code.group]!.push(code);
    }
    return out;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="bg-card border-border flex items-center gap-3 rounded-2xl border px-4 py-3">
        <Search className="text-muted-foreground size-4" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pretraži (npr. 221, kredit, porez)…"
          className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            očisti
          </button>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        Prikazano: <strong className="text-foreground">{filtered.length}</strong> od{' '}
        {PAYMENT_CODES.length}
      </p>

      {filtered.length === 0 ? (
        <div className="border-border bg-card rounded-2xl border p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Nema šifri koje odgovaraju pretrazi <strong>"{query}"</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {!query && (
            <section>
              <h2 className="text-brand mb-3 text-xs font-semibold tracking-wider uppercase">
                Najčešće korišćene
              </h2>
              <ul className="space-y-2">
                {POPULAR_CODES.map((code) => (
                  <li
                    key={`popular-${code.code}`}
                    className="border-brand/30 bg-brand-soft/40 flex items-start gap-4 rounded-xl border p-4"
                  >
                    <div className="bg-brand text-brand-foreground min-w-[56px] rounded-lg px-3 py-1.5 text-center font-mono text-sm font-semibold">
                      {code.code}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm font-medium">{code.name}</p>
                      {code.example && (
                        <p className="text-muted-foreground mt-0.5 text-xs">{code.example}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {Object.entries(grouped).map(([group, codes]) => (
            <section key={group}>
              <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                {GROUP_LABELS[group as PaymentCode['group']]}
              </h2>
              <ul className="space-y-2">
                {codes.map((code) => (
                  <li
                    key={code.code}
                    className="border-border bg-card flex items-start gap-4 rounded-xl border p-4"
                  >
                    <div className="bg-brand-soft text-brand min-w-[56px] rounded-lg px-3 py-1.5 text-center font-mono text-sm font-semibold">
                      {code.code}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm font-medium">{code.name}</p>
                      {code.example && (
                        <p className="text-muted-foreground mt-0.5 text-xs">{code.example}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
