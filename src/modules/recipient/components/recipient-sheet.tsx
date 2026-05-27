'use client';

import { useState } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import type { RecipientItem } from './recipient-card';
import { RecipientForm } from './recipient-form';

interface RecipientSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipient?: RecipientItem;
}

export function RecipientSheet({ open, onOpenChange, recipient }: RecipientSheetProps) {
  // Force re-mount when recipient changes so RHF picks up new defaults
  const [key, setKey] = useState(0);

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        if (next) setKey((k) => k + 1);
        onOpenChange(next);
      }}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{recipient ? 'Izmeni primaoca' : 'Novi primalac'}</DrawerTitle>
          <DrawerDescription>
            {recipient
              ? 'Izmene se primenjuju i na nove uplatnice koje napraviš.'
              : 'Podesi default-e za primaoca da brže generišeš QR-ove.'}
          </DrawerDescription>
        </DrawerHeader>
        <RecipientForm
          key={key}
          recipientId={recipient?.id}
          defaultValues={
            recipient
              ? {
                  label: recipient.label,
                  name: recipient.name,
                  address: recipient.address ?? '',
                  account: recipient.account,
                  reference: recipient.reference ?? '',
                  defaultAmount: recipient.defaultAmount ?? '',
                  paymentCode: recipient.paymentCode ?? '',
                  purpose: recipient.purpose ?? '',
                  color: recipient.color ?? undefined,
                }
              : undefined
          }
          onSuccess={() => onOpenChange(false)}
        />
      </DrawerContent>
    </Drawer>
  );
}
