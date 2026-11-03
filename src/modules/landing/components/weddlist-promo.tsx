import { ArrowUpRight, Heart, Smartphone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { WEDDLIST_LINKS } from '@/modules/landing/weddlist-links';

export function WeddlistPromo() {
  return (
    <section
      aria-labelledby="weddlist-heading"
      className="bg-card border-border mt-12 rounded-3xl border p-6 sm:p-8"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="max-w-lg">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Naš drugi projekat
          </p>
          <h2
            id="weddlist-heading"
            className="font-display mt-3 flex items-center gap-3 text-2xl font-semibold tracking-tight"
          >
            <span className="bg-brand-soft text-brand flex size-9 items-center justify-center rounded-xl">
              <Heart className="size-4" aria-hidden="true" />
            </span>
            WeddList
          </h2>
          <p className="text-foreground mt-4 text-base font-medium">
            Planiranje venčanja i proslava.
          </p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Aplikacija na srpskom za goste, raspored stolova, troškove i poklone, pozivnicu,
            galeriju i planer.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 md:w-56">
          <Button variant="outline" asChild>
            <a href={WEDDLIST_LINKS.website} target="_blank" rel="noopener noreferrer">
              Upoznaj WeddList
              <ArrowUpRight aria-hidden="true" />
              <span className="sr-only"> (otvara se u novom tabu)</span>
            </a>
          </Button>
          <a
            href={WEDDLIST_LINKS.android}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:bg-muted flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium"
          >
            <Smartphone className="size-4" aria-hidden="true" />
            Android · Google Play
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
            <span className="sr-only"> (otvara se u novom tabu)</span>
          </a>
          {WEDDLIST_LINKS.ios ? (
            <a
              href={WEDDLIST_LINKS.ios}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:bg-muted flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium"
            >
              iOS · App Store
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
              <span className="sr-only"> (otvara se u novom tabu)</span>
            </a>
          ) : (
            <p className="text-muted-foreground text-center text-xs">iOS · Uskoro</p>
          )}
        </div>
      </div>
    </section>
  );
}
