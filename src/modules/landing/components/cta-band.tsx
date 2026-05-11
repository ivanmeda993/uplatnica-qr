import { ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function CtaBand() {
  return (
    <section aria-label="Poziv na akciju" className="mx-auto max-w-6xl px-5 pt-10 pb-16">
      <div className="bg-foreground text-background relative overflow-hidden rounded-3xl px-8 py-14 sm:px-14">
        {/* Mesh accent */}
        <div className="bg-brand/30 absolute -top-20 -right-20 size-80 rounded-full blur-3xl" />
        <div className="bg-brand/20 absolute -bottom-32 -left-20 size-96 rounded-full blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="space-y-4">
            <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
              Probaj besplatno, bez kartice i bez probnog perioda.
            </h2>
            <p className="text-background/70 max-w-xl text-base leading-relaxed">
              Napravi nalog, dodaj prvu uplatnicu i sledeći put kad treba da platiš struju ili
              kredit, QR ti je spreman čim ga otvoriš.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <Button variant="brand" size="xl" asChild>
              <Link href="/register">
                Napravi nalog
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <span className="text-background/60 inline-flex items-center gap-1.5 text-xs">
              <ShieldCheck className="size-3.5" />
              Bez reklama i bez praćenja.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
