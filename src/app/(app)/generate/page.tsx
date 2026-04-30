'use client';

import { parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';

import { UplatnicaForm } from '@/modules/uplatnica/components/uplatnica-form';

export default function GeneratePage() {
  const [recipientId, setRecipientId] = useQueryState('recipientId', parseAsString.withDefault(''));
  const [qrPayload, setQrPayload] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Generiši QR</h1>
        <p className="text-muted-foreground text-sm">
          Popuni polja i dobićeš NBS IPS QR koji svaka mBank skenira.
        </p>
      </header>

      <UplatnicaForm
        selectedRecipientId={recipientId || undefined}
        onRecipientChange={(id) => setRecipientId(id)}
        qrPayload={qrPayload}
        onQrPayload={setQrPayload}
      />
    </div>
  );
}
