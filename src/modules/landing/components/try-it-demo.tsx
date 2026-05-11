'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UplatnicaForm } from '@/modules/uplatnica/components/uplatnica-form';

// Account uses a valid MOD 97-10 control digit (160-0000000123456-54)
// so the demo "Generiši QR" works on first click.
const DEMO_DEFAULTS = {
  recipientName: 'EPS Snabdevanje',
  account: '160000000012345654',
  amount: '4230,00',
  purpose: 'Struja - april',
  paymentCode: '221',
} as const;

export function TryItDemo() {
  const [qrPayload, setQrPayload] = useState<string | null>(null);

  return (
    <section
      id="probaj"
      aria-labelledby="probaj-heading"
      className="mx-auto max-w-5xl scroll-mt-20 px-5 pb-20"
    >
      <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
        <Badge variant="brand" className="px-3 py-1 text-[11px] tracking-wider uppercase">
          <Sparkles className="size-3" />
          Probaj odmah, bez naloga
        </Badge>
        <h2
          id="probaj-heading"
          className="font-display text-[clamp(1.85rem,3.4vw,2.75rem)] leading-tight font-semibold tracking-tight text-balance"
        >
          Generiši svoj prvi NBS IPS QR
        </h2>
        <p className="text-muted-foreground text-base text-pretty">
          Polja su popunjena kao primer. Promeni što ti treba pa klikni{' '}
          <span className="text-foreground font-medium">Generiši QR</span> i odmah ga skeniraj mBank
          aplikacijom.
        </p>
      </div>

      <UplatnicaForm
        anonymous
        qrPayload={qrPayload}
        onQrPayload={setQrPayload}
        defaultValues={DEMO_DEFAULTS}
      />

      {qrPayload && (
        <div className="border-border-strong bg-card mx-auto mt-8 flex max-w-3xl flex-col items-center gap-4 rounded-3xl border p-6 text-center sm:flex-row sm:text-left">
          <div className="bg-brand-soft text-brand flex size-12 shrink-0 items-center justify-center rounded-2xl">
            <Sparkles className="size-5" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-medium">Sviđa ti se? Sačuvaj kao šablon.</p>
            <p className="text-muted-foreground text-sm">
              Sa nalogom ti je sledeći QR za istog primaoca dva klika dalje. Šabloni se sinhronizuju
              između telefona i laptopa.
            </p>
          </div>
          <Button variant="brand" size="lg" asChild className="shrink-0">
            <Link href="/register">
              Napravi nalog
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
