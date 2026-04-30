'use client';

import { Download, Loader2, Printer, Share2 } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QrDisplayProps {
  payload: string;
  size?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
  /** filename used when downloading */
  filename?: string;
  /** optional label to display under the QR + on print */
  caption?: string;
  /** show download / share / print actions */
  actions?: boolean;
}

export function QrDisplay({
  payload,
  size = 320,
  errorCorrectionLevel = 'M',
  className,
  filename = 'uplatnica-qr',
  caption,
  actions = true,
}: QrDisplayProps) {
  const [svg, setSvg] = useState<string>('');
  const [pngDataUrl, setPngDataUrl] = useState<string>('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<'download' | 'share' | null>(null);

  useEffect(() => {
    let cancelled = false;
    setErr(null);

    Promise.all([
      QRCode.toString(payload, {
        type: 'svg',
        errorCorrectionLevel,
        margin: 1,
        width: size,
      }),
      QRCode.toDataURL(payload, {
        errorCorrectionLevel,
        margin: 2,
        width: size * 2,
      }),
    ])
      .then(([svgOut, pngOut]) => {
        if (cancelled) return;
        setSvg(svgOut);
        setPngDataUrl(pngOut);
      })
      .catch((e: unknown) => {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'QR greška');
      });

    return () => {
      cancelled = true;
    };
  }, [payload, errorCorrectionLevel, size]);

  async function downloadPng() {
    if (!pngDataUrl) return;
    setBusy('download');
    try {
      const a = document.createElement('a');
      a.href = pngDataUrl;
      a.download = `${filename}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Slika sačuvana');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Greška pri preuzimanju');
    } finally {
      setBusy(null);
    }
  }

  async function shareQr() {
    if (!pngDataUrl) return;
    setBusy('share');
    try {
      const blob = await fetch(pngDataUrl).then((r) => r.blob());
      const file = new File([blob], `${filename}.png`, { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: caption ?? 'IPS QR uplatnica',
          text: caption ?? 'NBS IPS QR uplatnica',
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: caption ?? 'IPS QR uplatnica',
          text: caption ?? 'NBS IPS QR uplatnica',
        });
      } else {
        // Fallback: copy payload to clipboard
        await navigator.clipboard.writeText(payload);
        toast.info('IPS payload kopiran u clipboard');
      }
    } catch (e) {
      // User-cancelled share is normal — only toast non-AbortError
      if (e instanceof Error && e.name !== 'AbortError') {
        toast.error(e.message);
      }
    } finally {
      setBusy(null);
    }
  }

  function printReceipt() {
    window.print();
  }

  if (err) {
    return (
      <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-2xl border p-6 text-center text-sm">
        QR greška: {err}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="border-border shadow-card-lg rounded-3xl border bg-white p-4">
        {svg ? (
          <div
            className="aspect-square"
            style={{ width: size, height: size }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div
            className="bg-muted flex aspect-square items-center justify-center rounded-2xl"
            style={{ width: size, height: size }}
          >
            <Loader2 className="text-muted-foreground size-6 animate-spin" />
          </div>
        )}
      </div>

      {caption && <p className="text-muted-foreground text-xs">{caption}</p>}

      {actions && (
        <div className="no-print flex w-full max-w-sm flex-wrap justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={downloadPng}
            disabled={!pngDataUrl || busy === 'download'}
            className="min-w-[110px] flex-1"
          >
            {busy === 'download' ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Sačuvaj
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={shareQr}
            disabled={!pngDataUrl || busy === 'share'}
            className="min-w-[110px] flex-1"
          >
            {busy === 'share' ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Share2 className="size-4" />
            )}
            Podeli
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={printReceipt}
            className="min-w-[110px] flex-1"
          >
            <Printer className="size-4" />
            Štampaj
          </Button>
        </div>
      )}
    </div>
  );
}
