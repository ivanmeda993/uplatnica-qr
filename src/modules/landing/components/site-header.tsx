import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { href: '/#kako-radi', label: 'Kako radi' },
  { href: '/blog', label: 'Blog' },
  { href: '/banke', label: 'Banke' },
  { href: '/alat', label: 'Alati' },
  { href: '/#faq', label: 'FAQ' },
] as const;

export function SiteHeader() {
  return (
    <header className="safe-top">
      <nav
        aria-label="Glavna navigacija"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"
      >
        <Link href="/" aria-label="Početna">
          <Logo withWordmark />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/login">Prijava</Link>
          </Button>
          <Button variant="brand" size="sm" asChild>
            <Link href="/register">
              Probaj besplatno
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
