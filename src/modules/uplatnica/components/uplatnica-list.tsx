'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleDollarSign, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { api } from '@/lib/api-client';
import { qk } from '@/lib/query-keys';
import { cn } from '@/lib/utils';
import { QrDisplay } from '@/modules/qr/components/qr-display';
import { formatAccountDisplay, formatAmountDisplay } from '@/modules/recipient/lib/format';

export interface UplatnicaListItem {
  id: string;
  amount: string;
  account: string;
  recipientName: string;
  reference: string | null;
  paymentCode: string | null;
  purpose: string | null;
  qrPayload: string;
  createdAt: string | Date;
  recipient: { id: string; label: string; color: string | null } | null;
  payments: { id: string; paidAt: string | Date }[];
  _count: { payments: number };
}

interface UplatnicaListProps {
  items: UplatnicaListItem[];
  /** Group rows by day with a date heading */
  grouped?: boolean;
  /** Query key the mutations should invalidate (defaults to all uplatnice queries). */
  invalidateQueryKey?: readonly unknown[];
}

/**
 * Shared interactive list of uplatnice rows.
 * Owns: paid toggle (optimistic), QR view drawer, delete confirmation.
 */
export function UplatnicaList({
  items,
  grouped = false,
  invalidateQueryKey = qk.uplatnice.all,
}: UplatnicaListProps) {
  const queryClient = useQueryClient();
  const [viewing, setViewing] = useState<UplatnicaListItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<UplatnicaListItem | null>(null);

  const togglePaidMutation = useMutation({
    mutationFn: async ({ id, paid }: { id: string; paid: boolean }) => {
      if (paid) {
        const res = await api.api.v1.history.post({ uplatnicaId: id });
        if (res.error) throw new Error(String(res.error.value));
        return res.data;
      }
      const res = await api.api.v1.history.uplatnica({ uplatnicaId: id }).delete();
      if (res.error) throw new Error(String(res.error.value));
      return res.data;
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
      void queryClient.invalidateQueries({ queryKey: qk.history.all });
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.api.v1.uplatnice({ id }).delete();
      if (res.error) throw new Error(String(res.error.value));
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
      toast.success('Uplatnica obrisana');
      setPendingDelete(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const sections = grouped ? groupByDay(items) : [{ day: null, items }];

  return (
    <>
      <div className="space-y-6">
        {sections.map(({ day, items: dayItems }) => (
          <section key={day ?? 'all'} className="space-y-2">
            {day && (
              <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                {day}
              </h3>
            )}
            <ul className="border-border bg-card rounded-2xl border">
              {dayItems.map((u, idx) => (
                <UplatnicaRow
                  key={u.id}
                  item={u}
                  showDivider={idx > 0}
                  onView={() => setViewing(u)}
                  onDelete={() => setPendingDelete(u)}
                  onTogglePaid={(paid) => togglePaidMutation.mutate({ id: u.id, paid })}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* QR view drawer */}
      <Drawer open={viewing !== null} onOpenChange={(o) => !o && setViewing(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{viewing?.recipient?.label || viewing?.recipientName || 'QR'}</DrawerTitle>
            <DrawerDescription>
              {viewing && `${formatAmountDisplay(viewing.amount)} RSD`}
            </DrawerDescription>
          </DrawerHeader>
          {viewing && (
            <div className="mx-auto w-full max-w-2xl px-5 pt-2 pb-2 sm:px-6">
              <QrDisplay
                payload={viewing.qrPayload}
                size={260}
                caption={`${viewing.recipient?.label || viewing.recipientName} · ${formatAmountDisplay(viewing.amount)} RSD`}
                filename={`IPS-${(viewing.recipient?.label || viewing.recipientName)
                  .replace(/\s+/g, '_')
                  .slice(0, 24)}`}
              />
              <dl className="border-border bg-surface/60 mt-6 space-y-1.5 rounded-xl border p-4 text-xs">
                <Row label="Račun" value={formatAccountDisplay(viewing.account)} mono />
                {viewing.reference && <Row label="Poziv na broj" value={viewing.reference} mono />}
                {viewing.paymentCode && <Row label="Šifra" value={viewing.paymentCode} />}
                {viewing.purpose && <Row label="Svrha" value={viewing.purpose} />}
                <Row
                  label="Kreirano"
                  value={new Date(viewing.createdAt).toLocaleString('sr-Latn-RS')}
                />
              </dl>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      {/* Delete confirmation */}
      <AlertDialog open={pendingDelete !== null} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Obriši uplatnicu</AlertDialogTitle>
            <AlertDialogDescription>
              Ovo briše uplatnicu i sve oznake plaćanja vezane za nju. Akcija je trajna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Otkaži</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Brišem…' : 'Obriši'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface UplatnicaRowProps {
  item: UplatnicaListItem;
  showDivider: boolean;
  onView: () => void;
  onDelete: () => void;
  onTogglePaid: (paid: boolean) => void;
}

function UplatnicaRow({ item, showDivider, onView, onDelete, onTogglePaid }: UplatnicaRowProps) {
  const paid = (item._count?.payments ?? 0) > 0;
  const stripe = item.recipient?.color || 'oklch(0.62 0.18 155)';

  return (
    <li
      className={cn(
        'relative flex flex-col gap-3 px-4 py-3.5 pr-4 first:rounded-t-2xl last:rounded-b-2xl sm:flex-row sm:items-center sm:gap-4 sm:py-3 sm:pr-5',
        showDivider && 'border-border border-t'
      )}
    >
      {/* Stripe wrapper: clips the bar to the row's rounded corners (first/last row only) */}
      <span
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        aria-hidden
      >
        <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: stripe }} />
      </span>

      {/* Paid badge — peeks out the top-right edge like a cart notification */}
      {paid && (
        <Badge
          variant="success"
          className="border-success/50 bg-success/25 ring-card absolute -top-2 right-4 z-20 border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-md ring-2"
        >
          Plaćeno
        </Badge>
      )}

      <div className="relative min-w-0 flex-1 pr-20 pl-3 sm:pr-0">
        <p className="truncate text-sm font-semibold">
          {item.recipient?.label || item.recipientName}
        </p>
        <p className="text-muted-foreground mt-0.5 truncate font-mono text-[11px]">
          {formatAccountDisplay(item.account)}
        </p>
        <p className="text-muted-foreground text-[11px]">
          {new Date(item.createdAt).toLocaleString('sr-Latn-RS', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
          {item.reference ? ` · ${item.reference}` : ''}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <p className="shrink-0 text-base font-semibold tabular-nums">
          {formatAmountDisplay(item.amount)}{' '}
          <span className="text-muted-foreground text-[11px] font-normal">RSD</span>
        </p>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="iconSm"
            onClick={() => onTogglePaid(!paid)}
            aria-label={paid ? 'Označi kao neplaćeno' : 'Označi kao plaćeno'}
            aria-pressed={paid}
            className={cn(
              'transition-colors',
              paid
                ? 'text-success hover:text-success/80'
                : 'text-muted-foreground/60 hover:text-success'
            )}
          >
            <CircleDollarSign className="size-5" strokeWidth={paid ? 2.25 : 1.75} />
          </Button>
          <Button variant="ghost" size="iconSm" onClick={onView} aria-label="Prikaži QR">
            <Eye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onDelete}
            aria-label="Obriši"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </li>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn('truncate text-right tabular-nums', mono && 'font-mono')}>{value}</dd>
    </div>
  );
}

function groupByDay<T extends { createdAt: string | Date }>(
  items: T[]
): { day: string; items: T[] }[] {
  const groups = new Map<string, T[]>();
  for (const u of items) {
    const date = new Date(u.createdAt);
    const key = date.toLocaleDateString('sr-Latn-RS', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(u);
  }
  return Array.from(groups.entries()).map(([day, items]) => ({ day, items }));
}
