'use client';

import { LogOut, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Logo } from '@/components/brand/logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/auth-client';

interface AppHeaderProps {
  user: { name: string | null; email: string };
}

export function AppHeader({ user }: AppHeaderProps) {
  const router = useRouter();

  async function onSignOut() {
    await signOut();
    router.push('/login');
    router.refresh();
  }

  const displayName = user.name?.trim() || user.email.split('@')[0] || 'Korisnik';
  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('') || 'U';

  return (
    <header className="safe-top border-border bg-background/85 sticky top-0 z-30 border-b backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8 md:h-16 md:px-12 lg:px-14">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size={26} />
          <span className="text-[15px] font-semibold tracking-tight md:text-base">
            Uplatnica<span className="text-brand">.</span>
          </span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="iconSm" className="rounded-full p-0">
              <Avatar className="border-border-strong size-9 border">
                <AvatarFallback className="bg-brand-soft text-brand text-[11px] font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="px-2 py-1.5">
              <p className="text-sm leading-tight font-semibold">{displayName}</p>
              <p className="text-muted-foreground text-xs font-normal">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <SettingsIcon className="size-4" />
                Podešavanja
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={onSignOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              Odjavi se
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
