import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { WEDDLIST_LINKS } from '@/modules/landing/weddlist-links';

// Both badges share one box, so they render at the same size on every width.
const BADGE_CLASS = 'aspect-[564/168] h-auto w-full object-contain md:h-10 md:w-auto md:max-w-none';

export function WeddlistPromo() {
  return (
    <section
      aria-labelledby="weddlist-heading"
      className="bg-card border-border mt-12 rounded-3xl border p-4 sm:p-8"
    >
      <div className="grid items-start gap-y-5 md:grid-cols-[minmax(0,1fr)_148px] md:gap-x-12">
        <div>
          <h2 id="weddlist-heading">
            <Image
              src="/images/weddlist/logo-lockup.webp"
              width={896}
              height={199}
              alt="WeddList"
              unoptimized
              className="h-auto w-56 max-w-full"
            />
          </h2>
          <p className="text-foreground mt-4 text-base font-medium">
            Planiranje venčanja i proslava.
          </p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Aplikacija na srpskom za goste, raspored stolova, troškove i poklone, pozivnicu,
            galeriju i planer.
          </p>
          <Button variant="outline" asChild className="mt-5">
            <a href={WEDDLIST_LINKS.website} target="_blank" rel="noopener noreferrer">
              Upoznaj WeddList
              <ArrowUpRight aria-hidden="true" />
              <span className="sr-only"> (otvara se u novom tabu)</span>
            </a>
          </Button>
        </div>

        {/* Stacked below 360px, where two columns would drop under Apple's 40px minimum. */}
        <div className="grid max-w-sm grid-cols-1 items-start gap-3.5 min-[360px]:grid-cols-2 md:col-start-1 md:row-start-2 md:flex md:max-w-none md:gap-3">
          <a
            href={WEDDLIST_LINKS.android}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-sm"
          >
            <Image
              src="/images/weddlist/google-play-en.png"
              width={564}
              height={168}
              alt="Preuzmi WeddList na Google Play-u"
              unoptimized
              className={BADGE_CLASS}
            />
            <span className="sr-only"> (otvara se u novom tabu)</span>
          </a>
          {WEDDLIST_LINKS.ios ? (
            <a
              href={WEDDLIST_LINKS.ios}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-sm"
            >
              <Image
                src="/images/weddlist/app-store-en-wide.svg"
                width={564}
                height={168}
                alt="Preuzmi WeddList na App Store-u"
                unoptimized
                className={BADGE_CLASS}
              />
              <span className="sr-only"> (otvara se u novom tabu)</span>
            </a>
          ) : (
            <div>
              <Image
                src="/images/weddlist/app-store-en-wide.svg"
                width={564}
                height={168}
                alt="WeddList za iOS još nije dostupan na App Store-u"
                unoptimized
                className={BADGE_CLASS}
              />
              <p className="text-muted-foreground mt-3.5 text-center text-xs">Uskoro</p>
            </div>
          )}
        </div>

        <figure className="w-full max-w-sm md:col-start-2 md:row-span-2 md:row-start-1 md:w-[148px]">
          <Image
            src="/images/weddlist/ios-guests.webp"
            width={585}
            height={1266}
            alt="WeddList iOS: pregled gostiju i potvrda dolaska"
            unoptimized
            className="border-border h-auto w-full rounded-2xl border"
          />
          <figcaption className="text-muted-foreground mt-3 text-center text-[11px]">
            Izgled iOS aplikacije
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
