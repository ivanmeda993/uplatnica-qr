import Link from 'next/link';

import { Logo } from '@/components/brand/logo';
import { TrackedPortfolioLink } from '@/components/seo/tracked-portfolio-link';
import { AUTHOR } from '@/lib/site';
import { WeddlistPromo } from '@/modules/landing/components/weddlist-promo';

export function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <>
      <div className="mx-auto mb-12 w-full max-w-6xl px-5">
        <WeddlistPromo />
      </div>
      <footer className="mx-auto w-full max-w-6xl px-5 pt-4 pb-12">
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
            <Link href="/o-projektu" className="text-muted-foreground hover:text-foreground block">
              O projektu
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
            <TrackedPortfolioLink
              href={AUTHOR.url}
              target="_blank"
              rel="author noopener noreferrer"
              placement="footer_creator"
              className="text-foreground hover:text-brand rounded-sm font-medium underline-offset-4 hover:underline"
            >
              {AUTHOR.name}
            </TrackedPortfolioLink>
            .
          </p>
        </div>
      </footer>
    </>
  );
}
