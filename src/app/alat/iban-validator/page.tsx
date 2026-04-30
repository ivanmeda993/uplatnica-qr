import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbLd } from '@/lib/landing/jsonld';
import { getSiteUrl } from '@/lib/site';
import { SiteShell } from '@/modules/landing/components/site-shell';

import { IbanValidatorClient } from './client';

export const metadata: Metadata = {
  title: 'Validator broja računa — provera srpskog bankovnog računa (MOD-97)',
  description:
    'Proveri da li je 18-cifren broj računa ispravan po MOD-97 algoritmu. Identifikuje banku iz prefiksa (Raiffeisen, Komercijalna, Banca Intesa, NLB, OTP, AIK).',
  alternates: { canonical: '/alat/iban-validator' },
};

export default function IbanValidatorPage() {
  const base = getSiteUrl();
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Početna', url: `${base}/` },
          { name: 'Alati', url: `${base}/alat` },
          { name: 'Validator broja računa', url: `${base}/alat/iban-validator` },
        ])}
      />

      <article className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
        <header className="mb-8">
          <p className="text-brand text-xs font-semibold tracking-wider uppercase">Validator</p>
          <h1 className="font-display mt-2 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            Validator broja računa
          </h1>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Proveri da li je 18-cifren srpski bankovni račun ispravan i identifikuj banku iz
            prefiksa. MOD-97 kontrola se vrši lokalno u browseru.
          </p>
        </header>

        <IbanValidatorClient />

        <section className="mt-12 space-y-3 text-sm">
          <h2 className="text-foreground font-semibold">Format broja računa</h2>
          <p className="text-muted-foreground leading-relaxed">
            Srpski broj računa ima 18 cifara podeljenih u 3 dela:
          </p>
          <pre className="bg-foreground text-background overflow-x-auto rounded-2xl p-4 text-[12px]">
            {`265 - 1710320000001 - 66
↑     ↑                 ↑
3     13                2
banka subračun          kontrola`}
          </pre>
          <p className="text-muted-foreground leading-relaxed">
            Kontrolne 2 cifre se računaju iz prvih 16 po MOD-97. Ako se ne slažu, broj računa je
            netačan ili pogrešno prepisan.
          </p>
        </section>
      </article>
    </SiteShell>
  );
}
