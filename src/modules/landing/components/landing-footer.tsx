import Link from 'next/link';

import { Logo } from '@/components/brand/logo';

export function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mx-auto max-w-6xl px-5 pt-4 pb-12">
      <div className="border-border grid gap-8 border-t pt-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo withWordmark />
          <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
            Lični alat za srpske uplatnice. Generisanje i skeniranje NBS IPS QR koda. Besplatno,
            otvorenog koda i bez reklama.
          </p>
        </div>
        <nav aria-label="Resursi" className="space-y-2 text-xs">
          <p className="text-foreground mb-2 text-[11px] font-semibold tracking-wider uppercase">
            Resursi
          </p>
          <Link href="/blog" className="text-muted-foreground hover:text-foreground block">
            Blog &amp; vodiči
          </Link>
          <Link href="/banke" className="text-muted-foreground hover:text-foreground block">
            Vodiči po bankama
          </Link>
          <Link href="/alat" className="text-muted-foreground hover:text-foreground block">
            Besplatni alati
          </Link>
          <Link href="/#faq" className="text-muted-foreground hover:text-foreground block">
            Često pitanja
          </Link>
        </nav>
        <nav aria-label="Nalog" className="space-y-2 text-xs">
          <p className="text-foreground mb-2 text-[11px] font-semibold tracking-wider uppercase">
            Nalog
          </p>
          <Link href="/login" className="text-muted-foreground hover:text-foreground block">
            Prijava
          </Link>
          <Link href="/register" className="text-muted-foreground hover:text-foreground block">
            Registracija
          </Link>
        </nav>
      </div>
      <div className="text-muted-foreground mt-8 flex flex-col items-start justify-between gap-2 text-xs sm:flex-row sm:items-center">
        <p>© {year} Uplatnica QR.</p>
        <p>
          Napravio{' '}
          <a
            href="https://ivanmilicevic.dev/"
            target="_blank"
            rel="author noopener noreferrer"
            className="text-foreground hover:text-brand font-medium underline-offset-4 hover:underline"
          >
            Ivan Milićević
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
