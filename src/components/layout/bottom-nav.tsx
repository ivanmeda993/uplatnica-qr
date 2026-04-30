'use client';

import { History, Home, Plus, User, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const tabs = [
  { href: '/dashboard', label: 'Početna', icon: Home },
  { href: '/recipients', label: 'Primaoci', icon: Users },
  { href: '/history', label: 'Istorija', icon: History },
  { href: '/settings', label: 'Profil', icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
      <nav
        className="safe-bottom border-border bg-card/90 sm:shadow-card-lg pointer-events-auto relative mx-auto max-w-md border-t backdrop-blur-lg sm:mb-3 sm:rounded-3xl sm:border"
        aria-label="Glavna navigacija"
      >
        {/* FAB — absolutely positioned over the top edge of the bar */}
        <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <span
            aria-hidden
            className="ring-background absolute inset-[-6px] -z-10 rounded-full ring-[6px]"
          />
          <div className="fab-ring shadow-fab">
            <Link
              href="/generate"
              aria-label="Generiši uplatnicu"
              className={cn(
                'group relative flex size-14 items-center justify-center rounded-full',
                'bg-brand text-brand-foreground transition-transform',
                'hover:scale-[1.04] active:scale-95'
              )}
            >
              <Plus className="size-7" strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-5 px-2 pt-2 pb-1.5">
          {tabs.slice(0, 2).map((t) => (
            <Tab key={t.href} {...t} active={pathname.startsWith(t.href)} />
          ))}
          <span aria-hidden /> {/* spacer for the FAB */}
          {tabs.slice(2).map((t) => (
            <Tab key={t.href} {...t} active={pathname.startsWith(t.href)} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function Tab({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1 text-[10px] font-medium transition-colors',
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <span
        className={cn(
          'flex h-9 w-12 items-center justify-center rounded-full transition-colors',
          active && 'bg-brand-soft text-brand'
        )}
      >
        <Icon className="size-[18px]" strokeWidth={active ? 2.5 : 2} />
      </span>
      <span>{label}</span>
    </Link>
  );
}
