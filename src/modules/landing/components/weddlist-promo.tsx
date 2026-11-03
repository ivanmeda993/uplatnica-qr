import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { WEDDLIST_LINKS } from '@/modules/landing/weddlist-links';

export function WeddlistPromo() {
  return (
    <section
      aria-labelledby="weddlist-heading"
      className="bg-card border-border mt-12 rounded-3xl border p-6 sm:p-8"
    >
      <div className="grid items-start gap-x-4 gap-y-5 min-[380px]:grid-cols-[minmax(0,1fr)_116px] md:grid-cols-[minmax(0,1fr)_148px] md:gap-x-12">
        <div className="min-[380px]:col-span-2 md:col-span-1">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Moj drugi projekat
          </p>
          <h2 id="weddlist-heading" className="mt-4">
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

        <div className="-m-3 flex flex-wrap items-start md:col-start-1 md:row-start-2">
          <a
            href={WEDDLIST_LINKS.android}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm p-3"
          >
            <Image
              src="/images/weddlist/google-play-sr.png"
              width={646}
              height={192}
              alt="Preuzmi WeddList na Google Play-u"
              unoptimized
              className="h-10 w-auto max-w-none"
            />
            <span className="sr-only"> (otvara se u novom tabu)</span>
          </a>
          {WEDDLIST_LINKS.ios ? (
            <a
              href={WEDDLIST_LINKS.ios}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm p-3"
            >
              <Image
                src="/images/weddlist/app-store-en.svg"
                width={120}
                height={40}
                alt="Preuzmi WeddList na App Store-u"
                unoptimized
                className="h-10 w-auto max-w-none"
              />
              <span className="sr-only"> (otvara se u novom tabu)</span>
            </a>
          ) : (
            <div className="p-3">
              <Image
                src="/images/weddlist/app-store-en.svg"
                width={120}
                height={40}
                alt="WeddList za iOS još nije dostupan na App Store-u"
                unoptimized
                className="h-10 w-auto max-w-none"
              />
              <p className="text-muted-foreground mt-3 text-center text-xs">Uskoro</p>
            </div>
          )}
        </div>

        <figure className="mx-auto w-[116px] min-[380px]:col-start-2 min-[380px]:row-start-2 md:row-span-2 md:row-start-1 md:w-[148px]">
          <Image
            src="/images/weddlist/ios-guests.webp"
            width={480}
            height={1039}
            alt="WeddList iOS: pregled gostiju i potvrda dolaska"
            unoptimized
            className="h-auto w-full"
          />
          <figcaption className="text-muted-foreground mt-3 text-center text-[11px]">
            Izgled iOS aplikacije
          </figcaption>
        </figure>
      </div>
      <p className="text-muted-foreground mt-6 text-[10px] leading-relaxed">
        Google Play i Google Play logo su zaštićeni znakovi kompanije Google LLC. App Store i Apple
        logo su zaštićeni znakovi kompanije Apple Inc.
      </p>
    </section>
  );
}
