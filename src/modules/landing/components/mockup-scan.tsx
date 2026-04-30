import { Camera, X, Zap } from 'lucide-react';

export function MockupScan() {
  return (
    <div className="relative bg-neutral-900 text-white">
      {/* Camera viewport simulation */}
      <div className="relative aspect-[9/16] w-full overflow-hidden">
        {/* Fake camera blur background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-950" />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <div className="absolute top-10 left-10 size-32 rounded-full bg-amber-300 blur-3xl" />
          <div className="absolute right-8 bottom-32 size-24 rounded-full bg-sky-400 blur-3xl" />
        </div>

        {/* Top bar */}
        <div className="absolute top-3 right-0 left-0 z-20 flex items-center justify-between px-4">
          <X className="size-5" />
          <span className="rounded-full bg-black/40 px-2 py-1 text-[10px] backdrop-blur">
            Skeniraj IPS QR
          </span>
          <Zap className="size-5 text-amber-300" />
        </div>

        {/* Viewfinder frame */}
        <div className="absolute inset-x-10 top-1/2 aspect-square -translate-y-1/2 rounded-2xl">
          <div className="absolute inset-0 rounded-2xl ring-2 ring-white/30" />
          {/* Corners */}
          <div className="border-brand absolute top-0 left-0 size-6 rounded-tl-2xl border-t-[3px] border-l-[3px]" />
          <div className="border-brand absolute top-0 right-0 size-6 rounded-tr-2xl border-t-[3px] border-r-[3px]" />
          <div className="border-brand absolute bottom-0 left-0 size-6 rounded-bl-2xl border-b-[3px] border-l-[3px]" />
          <div className="border-brand absolute right-0 bottom-0 size-6 rounded-br-2xl border-r-[3px] border-b-[3px]" />
          {/* Scan line */}
          <div className="bg-brand absolute inset-x-2 top-1/2 h-[2px] rounded-full opacity-90 shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
          {/* Inner hint */}
          <div className="absolute inset-x-3 bottom-3 text-center">
            <span className="text-[9px] text-white/60">poravnaj QR u okvir</span>
          </div>
        </div>

        {/* Detected toast */}
        <div className="absolute right-4 bottom-32 left-4 z-20">
          <div className="border-brand/40 bg-brand/15 text-brand flex items-center gap-2 rounded-2xl border px-3 py-2 backdrop-blur">
            <div className="bg-brand size-2 animate-pulse rounded-full" />
            <span className="text-[11px] font-semibold">Pronađen IPS QR</span>
            <span className="ml-auto text-[10px] text-white/70">EPS · 4.230,00</span>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute right-0 bottom-6 left-0 flex items-center justify-center gap-6">
          <div className="size-9 rounded-xl bg-white/10 backdrop-blur" />
          <div className="bg-brand flex size-14 items-center justify-center rounded-2xl shadow-xl">
            <Camera className="text-brand-foreground size-6" />
          </div>
          <div className="size-9 rounded-xl bg-white/10 backdrop-blur" />
        </div>
      </div>
    </div>
  );
}
