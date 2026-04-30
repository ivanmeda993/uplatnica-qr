import { ArrowRight, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { FakeQrPattern } from './fake-qr-pattern';

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-8 pb-20 sm:pt-16 lg:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-slide-up space-y-7">
          <Badge variant="brand" className="px-3 py-1 text-[11px] tracking-wider uppercase">
            <Sparkles className="size-3" />
            NBS IPS QR · besplatno
          </Badge>
          <h1 className="font-display text-[clamp(2.5rem,6.5vw,4.75rem)] leading-[1.02] font-semibold tracking-tight text-balance">
            Plati račun u Srbiji za{' '}
            <span className="relative inline-block">
              <span className="relative z-10">2 sekunde</span>
              <span
                aria-hidden
                className="bg-brand/35 absolute inset-x-0 bottom-1 -z-0 h-3 rounded-full sm:bottom-2 sm:h-4"
              />
            </span>
            .
          </h1>
          <p className="text-muted-foreground max-w-xl text-base text-pretty sm:text-lg">
            Sačuvaj svoje redovne uplatnice — struja, internet, komunalije, kredit, kirija — i
            generiši NBS IPS QR kod za par sekundi. Skeniraš sa{' '}
            <strong className="text-foreground">Raiffeisen</strong>,{' '}
            <strong className="text-foreground">Komercijalnom</strong>,{' '}
            <strong className="text-foreground">Banca Intesa</strong>, NLB, OTP, AIK i ostalim
            srpskim mBank aplikacijama.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="brand" size="xl" asChild>
              <Link href="/register">
                Napravi besplatan nalog
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/login">Već imaš nalog?</Link>
            </Button>
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="text-brand size-3.5" />
              Tvoji podaci ostaju samo na tvom nalogu
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="text-brand size-3.5" />
              PWA — radi i offline na telefonu
            </span>
          </div>
        </div>

        {/* Visual: floating phone with QR */}
        <div className="relative mx-auto max-w-[340px] sm:max-w-[400px]">
          <div className="from-brand/30 via-brand/10 absolute inset-x-6 -top-6 -bottom-6 rounded-[3rem] bg-gradient-to-br to-transparent blur-2xl" />
          <div className="border-border-strong bg-card shadow-card-lg relative rounded-[2.4rem] border p-3">
            <div className="border-border bg-background rounded-[2.1rem] border p-5">
              <div className="flex items-center justify-between pb-4">
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider">
                  EPS STRUJA
                </span>
                <Badge variant="success" className="text-[10px]">
                  IPS QR
                </Badge>
              </div>
              <div className="ring-border aspect-square rounded-2xl bg-white p-4 ring-1">
                <FakeQrPattern />
              </div>
              <dl className="mt-5 space-y-2 text-xs">
                <Row label="Iznos" value="4.230,00 RSD" emphasize />
                <Row label="Račun" value="160-0000000123456-78" mono />
                <Row label="Poziv na broj" value="97 84 1234567" mono />
                <Row label="Šifra plaćanja" value="221 — Komunalije" />
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  mono,
  emphasize,
}: {
  label: string;
  value: string;
  mono?: boolean;
  emphasize?: boolean;
}) {
  return (
    <div className="border-border/70 flex items-center justify-between gap-4 border-b border-dashed pb-1.5 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={
          (mono ? 'font-mono text-[11px] ' : '') +
          (emphasize ? 'text-base font-semibold' : 'text-foreground') +
          'tabular-nums'
        }
      >
        {value}
      </dd>
    </div>
  );
}
