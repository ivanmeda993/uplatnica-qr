'use client';

import { Building2, ChevronRight, Pencil, QrCode, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getBankByAccount } from '@/lib/banks/data';
import { cn } from '@/lib/utils';

import { formatAccountDisplay } from '../lib/format';

export interface RecipientItem {
  id: string;
  label: string;
  name: string;
  address: string | null;
  account: string;
  reference: string | null;
  defaultAmount: string | null;
  paymentCode: string | null;
  purpose: string | null;
  color: string | null;
}

interface RecipientCardProps {
  recipient: RecipientItem;
  onEdit: () => void;
  onArchive: () => void;
}

export function RecipientCard({ recipient, onEdit, onArchive }: RecipientCardProps) {
  const stripe = recipient.color || 'oklch(0.62 0.18 155)';
  const bank = getBankByAccount(recipient.account);

  return (
    <div className="group border-border bg-card shadow-card hover:shadow-card-lg relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-4 transition-all sm:p-5">
      {/* color stripe */}
      <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: stripe }} />

      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold tracking-tight">{recipient.label}</h3>
            {recipient.purpose && (
              <Badge variant="outline" className="hidden text-[10px] sm:inline-flex">
                {recipient.purpose}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5 truncate text-xs">
            <Building2 className="size-3 shrink-0" />
            {recipient.name}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="iconSm" aria-label="Opcije">
              <span className="text-lg leading-none">⋯</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onEdit}>
              <Pencil className="size-4" />
              Izmeni
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={onArchive}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4" />
              Arhiviraj
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 pl-2 text-xs">
        <Field
          label="Iznos"
          value={recipient.defaultAmount ? `${recipient.defaultAmount} RSD` : '—'}
          emphasize
        />
        <Field label="Šifra" value={recipient.paymentCode ?? '—'} />
        <div className="col-span-2">
          <Field
            label={bank ? `Račun · ${bank.shortName}` : 'Račun'}
            value={formatAccountDisplay(recipient.account)}
            mono
          />
        </div>
        {recipient.reference && (
          <div className="col-span-2">
            <Field label="Poziv na broj" value={recipient.reference} mono />
          </div>
        )}
      </dl>

      <Button asChild variant="brand" className={cn('w-full justify-between')}>
        <Link href={{ pathname: '/generate', query: { recipientId: recipient.id } }}>
          <span className="inline-flex items-center gap-2">
            <QrCode className="size-4" />
            Generiši QR
          </span>
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}

function Field({
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
    <div className="space-y-0.5">
      <dt className="text-muted-foreground/80 text-[10px] tracking-wider uppercase">{label}</dt>
      <dd
        className={cn(
          'truncate tabular-nums',
          mono && 'font-mono text-[11px]',
          emphasize ? 'text-foreground text-sm font-semibold' : 'text-foreground/90'
        )}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}
