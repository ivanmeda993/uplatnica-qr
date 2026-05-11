'use client';

import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Plus,
  QrCode,
  ScanLine,
  Sparkles,
  Users,
} from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import { qk } from '@/lib/query-keys';
import { cn } from '@/lib/utils';
import { formatAccountDisplay, formatAmountDisplay } from '@/modules/recipient/lib/format';
import {
  UplatnicaList,
  type UplatnicaListItem,
} from '@/modules/uplatnica/components/uplatnica-list';

interface DashboardContentProps {
  greetingName: string;
}

export function DashboardContent({ greetingName }: DashboardContentProps) {
  const recipientsQuery = useQuery({
    queryKey: qk.recipients.list(),
    queryFn: async () => {
      const res = await api.api.v1.recipients.get();
      if (res.error) throw new Error(String(res.error.value));
      return res.data?.items ?? [];
    },
  });

  const uplatniceQuery = useQuery({
    queryKey: qk.uplatnice.list(8),
    queryFn: async () => {
      const res = await api.api.v1.uplatnice.get({ query: { limit: 8 } });
      if (res.error) throw new Error(String(res.error.value));
      return res.data?.items ?? [];
    },
  });

  const recipients = recipientsQuery.data ?? [];
  const uplatnice = uplatniceQuery.data ?? [];

  const totalPaid = uplatnice.filter((u) => (u._count?.payments ?? 0) > 0).length;

  return (
    <div className="space-y-7">
      {/* Greeting */}
      <header className="bg-mesh-soft border-border-strong shadow-card relative -mx-5 -mt-5 border-b px-5 pt-5 pb-7 sm:mx-0 sm:rounded-3xl sm:border sm:px-8 sm:pt-7">
        <Link
          href="/"
          aria-label="Početna"
          className="absolute top-5 right-5 transition-opacity hover:opacity-80 sm:top-7 sm:right-8"
        >
          <Logo withWordmark size={26} />
        </Link>
        <p className="text-muted-foreground text-sm font-medium">
          {timeOfDayGreeting()}, {greetingName} 👋
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          Spremno za uplatu.
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          {recipients.length > 0
            ? `Imaš ${recipients.length} ${pluralRecipients(recipients.length)} i ${uplatnice.length} ${pluralUplatnica(uplatnice.length)} u istoriji.`
            : 'Dodaj prvog primaoca pa ti je sledeći QR samo klik dalje.'}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild variant="brand">
            <Link href="/generate">
              <Sparkles className="size-4" />
              Generiši QR
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/scan">
              <ScanLine className="size-4" />
              Skeniraj
            </Link>
          </Button>
        </div>
      </header>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          icon={Users}
          label="Primaoci"
          value={recipientsQuery.isLoading ? '…' : `${recipients.length}`}
        />
        <Stat
          icon={QrCode}
          label="Uplatnica"
          value={uplatniceQuery.isLoading ? '…' : `${uplatnice.length}`}
        />
        <Stat
          icon={Clock}
          label="Plaćeno"
          value={uplatniceQuery.isLoading ? '…' : `${totalPaid}`}
        />
        <Stat
          icon={Sparkles}
          label="Šablon najčešće"
          value={mostUsedRecipient(uplatnice) ?? '—'}
          truncate
        />
      </div>

      {/* Recipients quick row */}
      <section className="space-y-3">
        <SectionHeader
          title="Tvoji primaoci"
          subtitle="Pritisni za brzo generisanje"
          actionHref="/recipients"
          actionLabel="Svi primaoci"
        />
        {recipientsQuery.isLoading ? (
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-32 w-56 shrink-0" />
            ))}
          </div>
        ) : recipients.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Još nemaš sačuvane primaoce"
            description="Dodaj kredit, struju, internet ili šta već plaćaš svaki mesec."
            action={
              <Button asChild variant="brand">
                <Link href="/recipients">
                  <Plus className="size-4" />
                  Dodaj primaoca
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {recipients.map((r) => (
              <Link
                key={r.id}
                href={{ pathname: '/generate', query: { recipientId: r.id } }}
                className="group border-border bg-card shadow-card hover:shadow-card-lg relative flex w-56 shrink-0 flex-col gap-2 overflow-hidden rounded-2xl border p-4 transition-all sm:w-auto"
              >
                <div
                  className="absolute inset-y-0 left-0 w-1.5"
                  style={{ background: r.color || 'oklch(0.62 0.18 155)' }}
                />
                <div className="flex items-start justify-between gap-2 pl-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{r.label}</p>
                    <p className="text-muted-foreground truncate text-[11px]">{r.name}</p>
                  </div>
                  <ArrowRight className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="pl-2">
                  {r.defaultAmount && (
                    <p className="text-base font-semibold tabular-nums">
                      {formatAmountDisplay(r.defaultAmount)}{' '}
                      <span className="text-muted-foreground text-xs">RSD</span>
                    </p>
                  )}
                  <p className="text-muted-foreground font-mono text-[10px]">
                    {formatAccountDisplay(r.account)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent uplatnice */}
      <section className="space-y-3">
        <SectionHeader
          title="Skorašnje uplatnice"
          subtitle="Poslednjih 8 generisanih"
          actionHref="/history"
          actionLabel="Cela istorija"
        />
        {uplatniceQuery.isLoading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : uplatnice.length === 0 ? (
          <EmptyState
            icon={QrCode}
            title="Još nema generisanih uplatnica"
            description="Generiši prvi QR — automatski se čuva u istoriji."
            action={
              <Button asChild variant="brand">
                <Link href="/generate">
                  <Sparkles className="size-4" />
                  Generiši QR
                </Link>
              </Button>
            }
          />
        ) : (
          <UplatnicaList items={uplatnice as UplatnicaListItem[]} />
        )}
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  truncate,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="border-border bg-card shadow-card flex flex-col gap-1.5 rounded-2xl border p-4">
      <div className="bg-brand-soft text-brand flex size-9 items-center justify-center rounded-xl">
        <Icon className="size-4" />
      </div>
      <p
        className={cn('text-lg font-semibold tracking-tight tabular-nums', truncate && 'truncate')}
      >
        {value}
      </p>
      <p className="text-muted-foreground text-[11px]">{label}</p>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  actionHref,
  actionLabel,
}: {
  title: string;
  subtitle?: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
      </div>
      <Link
        href={actionHref}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium"
      >
        {actionLabel}
        <ChevronRight className="size-3.5" />
      </Link>
    </div>
  );
}

function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Dobro jutro';
  if (h < 18) return 'Dobar dan';
  return 'Dobro veče';
}

function pluralRecipients(n: number) {
  // 1 primaoca · 2-4 primaoca · 5+ primalaca (genitive plural)
  return isPaucal(n) ? 'primaoca' : 'primalaca';
}

function pluralUplatnica(n: number) {
  // 1 uplatnicu · 2-4 uplatnice · 5+ uplatnica
  if (n % 10 === 1 && n % 100 !== 11) return 'uplatnicu';
  if (isPaucal(n)) return 'uplatnice';
  return 'uplatnica';
}

function isPaucal(n: number): boolean {
  const last = n % 10;
  const last2 = n % 100;
  if (last2 >= 11 && last2 <= 14) return false;
  return last >= 1 && last <= 4;
}

interface UplatnicaItem {
  recipient?: { label?: string | null } | null;
  recipientName: string;
}

function mostUsedRecipient(items: UplatnicaItem[]): string | null {
  if (items.length === 0) return null;
  const counts = new Map<string, number>();
  for (const u of items) {
    const key = u.recipient?.label || u.recipientName;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let best: { label: string; count: number } | null = null;
  for (const [label, count] of counts) {
    if (!best || count > best.count) best = { label, count };
  }
  return best?.label ?? null;
}
