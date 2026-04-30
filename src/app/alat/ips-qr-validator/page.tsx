import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbLd } from '@/lib/landing/jsonld';
import { getSiteUrl } from '@/lib/site';
import { SiteShell } from '@/modules/landing/components/site-shell';

import { IpsValidatorClient } from './client';

export const metadata: Metadata = {
  title: 'IPS QR validator — proveri NBS IPS QR payload',
  description:
    'Pejstuj IPS QR string (K:PR|V:01|C:1|R:...) i vidi sve tagove parsirane prema NBS specifikaciji. Brza dijagnostika za developere i banke.',
  alternates: { canonical: '/alat/ips-qr-validator' },
};

export default function IpsValidatorPage() {
  const base = getSiteUrl();
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Početna', url: `${base}/` },
          { name: 'Alati', url: `${base}/alat` },
          { name: 'IPS QR validator', url: `${base}/alat/ips-qr-validator` },
        ])}
      />

      <article className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
        <header className="mb-8">
          <p className="text-brand text-xs font-semibold tracking-wider uppercase">Validator</p>
          <h1 className="font-display mt-2 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            IPS QR validator
          </h1>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Pejstuj IPS QR payload — alat ga parsira po NBS specifikaciji i prikaže svaki tag
            posebno. Sve radi u browseru, ništa se ne šalje serveru.
          </p>
        </header>

        <IpsValidatorClient />

        <section className="mt-12 space-y-3 text-sm">
          <h2 className="text-foreground font-semibold">Format payload-a</h2>
          <p className="text-muted-foreground leading-relaxed">
            IPS QR payload je tekstualni string sa tagovima razdvojenim znakom <code>|</code>:
          </p>
          <pre className="bg-foreground text-background overflow-x-auto rounded-2xl p-4 text-[12px]">
            {`K:PR|V:01|C:1|R:160000000123456778|N:JKP INFOSTAN|I:RSD6840,50|S:KOMUNALIJE|RO:97 84 1234567`}
          </pre>
          <p className="text-muted-foreground leading-relaxed">
            Obavezni tagovi: <code>K</code>, <code>V</code>, <code>C</code>, <code>R</code>,{' '}
            <code>N</code>, <code>I</code>. Detaljno u{' '}
            <a href="/blog/sta-je-ips-qr-kod">vodiču o IPS QR kodu</a>.
          </p>
        </section>
      </article>
    </SiteShell>
  );
}
