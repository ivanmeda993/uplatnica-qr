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
      <div className="grid items-start gap-y-5 md:grid-cols-[minmax(0,1fr)_296px] md:gap-x-10">
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
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-pretty">
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
            <div className="relative">
              <Image
                src="/images/weddlist/app-store-en-wide.svg"
                width={564}
                height={168}
                alt="WeddList za iOS još nije dostupan na App Store-u"
                unoptimized
                className={BADGE_CLASS}
              />
              <span className="absolute top-0 -right-[15px] z-10 inline-flex -translate-y-1/2 rounded-full border border-[#d5b268] bg-[#e9cc8a] px-2.5 py-0.5 text-[11px] leading-4 font-semibold tracking-wide text-[#4b3512] shadow-sm">
                Uskoro
              </span>
            </div>
          )}
        </div>

        <div className="grid w-full max-w-sm grid-cols-2 items-start gap-3 md:col-start-2 md:row-span-2 md:row-start-1 md:max-w-none">
          <Image
            src="/images/weddlist/ios-guests.webp"
            width={585}
            height={1266}
            alt="WeddList iOS: pregled gostiju i potvrda dolaska"
            unoptimized
            className="border-border h-auto w-full rounded-xl border shadow-lg"
          />
          <Image
            src="/images/weddlist/ios-expenses.webp"
            width={585}
            height={1266}
            alt="WeddList iOS: pregled planiranih i plaćenih troškova"
            unoptimized
            className="border-border mt-6 h-auto w-full rounded-xl border shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
