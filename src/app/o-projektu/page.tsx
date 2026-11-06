import { ArrowUpRight, Code2, LockKeyhole, WifiOff } from 'lucide-react';
import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { TrackedPortfolioLink } from '@/components/seo/tracked-portfolio-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { breadcrumbLd } from '@/lib/landing/jsonld';
import { AUTHOR, getSiteUrl, SITE } from '@/lib/site';
import { SiteShell } from '@/modules/landing/components/site-shell';

const ABOUT_TITLE = 'O projektu Uplatnica QR';
const ABOUT_DESCRIPTION =
  'Saznaj zašto je Uplatnica QR napravljena, kako štiti privatnost, šta radi offline i ko je dizajnirao i razvio proizvod.';

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: '/o-projektu' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    url: '/o-projektu',
  },
  twitter: {
    card: 'summary_large_image',
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
  },
};

const PRINCIPLES = [
  {
    icon: LockKeyhole,
    title: 'Privatnost po dizajnu',
    description:
      'Javni generator i validatori obrađuju unete podatke lokalno u pregledaču. Nalog služi za čuvanje i sinhronizaciju tvojih šablona i istorije.',
  },
  {
    icon: WifiOff,
    title: 'Lokalni i offline rad',
    description:
      'PWA podrška omogućava da se ključne funkcije koriste i kada je veza nestabilna, bez oslanjanja na bankarski sistem za samu QR generaciju.',
  },
  {
    icon: Code2,
    title: 'Proverljiva pravila',
    description:
      'IPS payload, iznosi, računi i poziv na broj prolaze kroz centralizovanu validaciju prema NBS IPS formatu i MOD 97-10 pravilima.',
  },
] as const;

export default function AboutProjectPage() {
  const base = getSiteUrl();

  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Početna', url: `${base}/` },
          { name: 'O projektu', url: `${base}/o-projektu` },
        ])}
      />

      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-brand text-xs font-semibold tracking-wider uppercase">O projektu</p>
          <h1 className="font-display mt-3 text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            Uplatnica koja smanjuje ponavljanje, bez komplikovanja plaćanja
          </h1>
          <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">
            Uplatnica QR je napravljena da podatke za redovna plaćanja uneseš jednom, zatim
            generišeš ispravan NBS IPS QR i proveriš ga pre nego što otvoriš mBank aplikaciju.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="shadow-none">
              <CardContent className="p-5 sm:p-6">
                <div className="bg-brand-soft text-brand flex size-11 items-center justify-center rounded-2xl">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h2 className="text-foreground mt-4 font-semibold tracking-tight">{title}</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="space-y-10">
            <section aria-labelledby="problem-heading">
              <h2
                id="problem-heading"
                className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Problem koji rešava
              </h2>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                Računi za kredit, komunalije, internet ili kiriju često traže iste podatke iz meseca
                u mesec. Ručno prepisivanje iznosa, računa i poziva na broj je sporo i podložno
                greškama. Uplatnica QR čuva strukturu šablona i pretvara je u format koji domaće
                mBank aplikacije mogu da skeniraju.
              </p>
            </section>

            <section aria-labelledby="technical-heading">
              <h2
                id="technical-heading"
                className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Kratak tehnički pregled
              </h2>
              <ul className="text-muted-foreground mt-4 space-y-3 text-sm leading-relaxed">
                <li className="border-border border-l-2 pl-4">
                  Next.js 16, React 19 i TypeScript čine web aplikaciju i responzivni interfejs.
                </li>
                <li className="border-border border-l-2 pl-4">
                  Poseban IPS sloj kodira, dekodira i validira NBS QR podatke, uključujući MOD
                  97-10.
                </li>
                <li className="border-border border-l-2 pl-4">
                  Better Auth, Prisma i PostgreSQL omogućavaju naloge i sinhronizaciju sačuvanih
                  podataka.
                </li>
                <li className="border-border border-l-2 pl-4">
                  PWA sloj podržava instalaciju aplikacije i korišćenje keširanih funkcija kada nema
                  stabilne veze.
                </li>
              </ul>
            </section>
          </div>

          <aside className="bg-mesh-soft border-border h-fit rounded-3xl border p-6 sm:p-8">
            <p className="text-brand text-[11px] font-semibold tracking-wider uppercase">
              Autor proizvoda
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight">
              Dizajnirao i razvio Ivan Milićević
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Full-stack product developer fokusiran na korisne, pouzdane web proizvode i tehnička
              iskustva koja ostaju jasna ljudima koji ih koriste.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Button variant="brand" asChild>
                <a href={`mailto:${AUTHOR.email}`}>Kontakt za tehničku saradnju</a>
              </Button>
              <Button variant="outline" asChild>
                <TrackedPortfolioLink
                  href={AUTHOR.url}
                  target="_blank"
                  rel="author noopener noreferrer"
                  placement="about_project"
                >
                  Pogledaj portfolio
                  <ArrowUpRight aria-hidden="true" />
                </TrackedPortfolioLink>
              </Button>
            </div>

            <p className="text-muted-foreground mt-5 text-xs leading-relaxed">
              Tehnički case study je u pripremi. Do tada, IPS Uplatnicu možeš da vidiš u{' '}
              <TrackedPortfolioLink
                href={AUTHOR.caseStudyUrl}
                target="_blank"
                rel="noopener noreferrer"
                placement="about_project"
                className="text-foreground hover:text-brand rounded-sm font-medium underline underline-offset-4"
              >
                Selected Work
              </TrackedPortfolioLink>
              .
            </p>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
