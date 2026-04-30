'use client';

import { type IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import jsQR from 'jsqr';
import { Camera, ImageUp, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { decodeIpsPayload, payloadToFormInput } from '@/lib/ips-qr';

interface QrScannerProps {
  onResult: (decoded: ReturnType<typeof payloadToFormInput>) => void;
}

export function QrScanner({ onResult }: QrScannerProps) {
  const [enabled, setEnabled] = useState(false);
  const [decoding, setDecoding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleRawPayload(raw: string) {
    try {
      const payload = decodeIpsPayload(raw);
      onResult(payloadToFormInput(payload));
      setEnabled(false);
      toast.success('QR uspešno skeniran');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Nepoznat IPS QR format');
    }
  }

  function handleScan(codes: IDetectedBarcode[]) {
    const raw = codes[0]?.rawValue;
    if (!raw) return;
    handleRawPayload(raw);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    setDecoding(true);
    try {
      const raw = await decodeQrFromImageFile(file);
      if (!raw) {
        toast.error(
          'QR kod nije pronađen. Probaj oštriju fotografiju, snimi pravo iznad uplatnice i izbegni senke.'
        );
        return;
      }
      handleRawPayload(raw);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Greška pri čitanju slike');
    } finally {
      setDecoding(false);
    }
  }

  return (
    <div className="space-y-3">
      {!enabled ? (
        <Card className="bg-mesh-soft">
          <CardContent className="flex flex-col items-center gap-5 px-5 py-12 text-center sm:px-6 sm:py-14">
            <div className="bg-card text-brand shadow-card flex size-16 items-center justify-center rounded-3xl">
              <Camera className="size-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight">Skeniraj uplatnicu</h2>
              <p className="text-muted-foreground max-w-sm text-sm text-pretty">
                Pokreni kameru ili učitaj sliku uplatnice iz galerije. Sve se dešava lokalno na tvom
                uređaju.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button variant="brand" size="lg" onClick={() => setEnabled(true)}>
                <Sparkles className="size-4" />
                Pokreni kameru
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={decoding}
              >
                <ImageUp className="size-4" />
                {decoding ? 'Čitam sliku…' : 'Učitaj sliku'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="border-border-strong shadow-card-lg overflow-hidden rounded-3xl border bg-black">
            <Scanner
              onScan={handleScan}
              onError={(e) => {
                const msg = e instanceof Error ? e.message : 'Greška sa kamerom';
                toast.error(msg);
                setEnabled(false);
              }}
              constraints={{ facingMode: 'environment' }}
              allowMultiple={false}
              components={{ finder: true, torch: true }}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setEnabled(false)}
              className="w-full sm:w-auto"
            >
              Zaustavi kameru
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={decoding}
              className="w-full sm:w-auto"
            >
              <ImageUp className="size-4" />
              {decoding ? 'Čitam sliku…' : 'Učitaj sliku'}
            </Button>
          </div>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
      />
    </div>
  );
}

/**
 * Decode an IPS QR from an uploaded image. Tries the original orientation first,
 * then 90°/180°/270° rotations to handle photos of printed bills taken from any angle.
 * Uses jsQR with `attemptBoth` to handle inverted (white-on-black) prints.
 */
async function decodeQrFromImageFile(file: File): Promise<string | null> {
  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  // Cap size so jsQR doesn't choke on huge phone-camera shots.
  const MAX_DIM = 1600;
  const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
  const baseW = Math.round(img.naturalWidth * scale);
  const baseH = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  for (const rotation of [0, 90, 180, 270] as const) {
    if (rotation === 90 || rotation === 270) {
      canvas.width = baseH;
      canvas.height = baseW;
    } else {
      canvas.width = baseW;
      canvas.height = baseH;
    }
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img, -baseW / 2, -baseH / 2, baseW, baseH);
    ctx.restore();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = jsQR(imageData.data, canvas.width, canvas.height, {
      inversionAttempts: 'attemptBoth',
    });
    if (result?.data) return result.data;
  }

  return null;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Ne mogu da pročitam izabranu sliku'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Slika nije validna'));
    img.src = src;
  });
}
