import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbLd } from '@/lib/landing/jsonld';
import { getSiteUrl } from '@/lib/site';
import { SiteShell } from '@/modules/landing/components/site-shell';

import { SifrePlacanjaClient } from './client';

export const metadata: Metadata = {
  title: 'Šifre plaćanja — pretraga svih NBS šifara sa primerima',
  description:
    'Sve NBS šifre plaćanja u Srbiji sa primerima korišćenja: 221 (struja, infostan), 289 (transakcije po nalogu građana), 277 (otplata kredita), 253 (porez na imovinu)… Pretraga po nazivu i broju.',
  alternates: { canonical: '/alat/sifre-placanja' },
};

export default function SifrePlacanjaPage() {
  const base = getSiteUrl();
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Početna', url: `${base}/` },
          { name: 'Alati', url: `${base}/alat` },
          { name: 'Šifre plaćanja', url: `${base}/alat/sifre-placanja` },
        ])}
      />

      <article className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
        <header className="mb-8">
          <p className="text-brand text-xs font-semibold tracking-wider uppercase">Reference</p>
          <h1 className="font-display mt-2 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            Šifre plaćanja
          </h1>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Sve NBS šifre plaćanja sa kratkim opisom i primerima. Pretraga po broju (221) ili nazivu
            (struja, kredit, porez).
          </p>
        </header>

        <SifrePlacanjaClient />
      </article>
    </SiteShell>
  );
}
