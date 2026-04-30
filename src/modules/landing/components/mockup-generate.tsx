import { ArrowLeft, Share2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import { FakeQrPattern } from './fake-qr-pattern';

export function MockupGenerate() {
  return (
    <div className="px-4 pt-1 pb-6">
      {/* Top bar */}
      <div className="flex items-center justify-between pb-4">
        <ArrowLeft className="text-muted-foreground size-4" />
        <span className="text-foreground text-[11px] font-semibold">QR kod</span>
        <Share2 className="text-muted-foreground size-4" />
      </div>

      {/* QR card */}
      <div className="border-border bg-card shadow-card overflow-hidden rounded-2xl border p-3">
        <div className="ring-border aspect-square rounded-xl bg-white p-3 ring-1">
          <FakeQrPattern seed={3} />
        </div>
        <div className="mt-2 flex items-center justify-between px-1 pt-2">
          <span className="text-muted-foreground text-[9px] font-semibold tracking-wider">
            EPS STRUJA
          </span>
          <Badge variant="success" className="text-[8px]">
            IPS QR
          </Badge>
        </div>
      </div>

      {/* Details */}
      <div className="mt-3 space-y-1.5">
        <div className="border-border/70 flex items-center justify-between border-b border-dashed pb-1">
          <span className="text-muted-foreground text-[10px]">Iznos</span>
          <span className="text-foreground text-xs font-semibold tabular-nums">4.230,00 RSD</span>
        </div>
        <div className="border-border/70 flex items-center justify-between border-b border-dashed pb-1">
          <span className="text-muted-foreground text-[10px]">Račun</span>
          <span className="text-foreground font-mono text-[9px]">160-0000000123456-78</span>
        </div>
        <div className="border-border/70 flex items-center justify-between border-b border-dashed pb-1">
          <span className="text-muted-foreground text-[10px]">Šifra</span>
          <span className="text-foreground text-[10px]">221 — Komunalije</span>
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-muted-foreground text-[10px]">Poziv na broj</span>
          <span className="text-foreground font-mono text-[9px]">97 84 1234567</span>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-brand text-brand-foreground mt-4 flex items-center justify-center rounded-2xl py-2.5 text-[11px] font-semibold">
        Sačuvaj u galeriju
      </div>
    </div>
  );
}
