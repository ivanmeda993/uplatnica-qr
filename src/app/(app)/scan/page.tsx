'use client';

import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { type payloadToFormInput } from '@/lib/ips-qr';
import { QrScanner } from '@/modules/qr/components/qr-scanner';
import { UplatnicaForm } from '@/modules/uplatnica/components/uplatnica-form';

type ScannedInput = ReturnType<typeof payloadToFormInput>;

export default function ScanPage() {
  const [scanned, setScanned] = useState<ScannedInput | null>(null);
  const [qrPayload, setQrPayload] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Skeniraj IPS QR</h1>
          <p className="text-muted-foreground text-sm">
            Uperi kameru u QR sa računa pa će se polja automatski popuniti.
          </p>
        </div>
        {scanned && (
          <Button variant="outline" size="sm" onClick={() => setScanned(null)}>
            <ArrowLeft className="size-4" />
            Skeniraj još jedan
          </Button>
        )}
      </header>

      {!scanned ? (
        <QrScanner onResult={setScanned} />
      ) : (
        <UplatnicaForm
          defaultValues={scanned}
          qrPayload={qrPayload}
          onQrPayload={setQrPayload}
          hideRecipientSelect
          enablePayerDefaults={false}
        />
      )}
    </div>
  );
}
