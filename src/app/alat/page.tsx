import { Hash, QrCode, ScanSearch } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbLd } from '@/lib/landing/jsonld';
import { getSiteUrl } from '@/lib/site';
import { SiteShell } from '@/modules/landing/components/site-shell';

export const metadata: Metadata = {
  title: 'Besplatni alati za IPS QR i srpske račune',
  description:
    'IPS QR validator, validator broja računa i pretraga šifara plaćanja. Besplatni alati za developere i sve koji rade sa srpskim plaćanjima — bez registracije.',
  alternates: { canonical: '/alat' },
};

const TOOLS = [
  {
    slug: 'ips-qr-validator',
    icon: ScanSearch,
    title: 'IPS QR validator',
    description:
      'Pejstuj IPS QR payload i vidi sve tagove (K, V, C, R, N, I, RO...) u parsiranom obliku. Validacija prema NBS specifikaciji.',
  },
  {
    slug: 'iban-validator',
    icon: Hash,
    title: 'Validator broja računa',
    description:
      'Proveri da li je 18-cifren broj računa ispravan po MOD-97 algoritmu. Identifikuje banku iz prefiksa.',
  },
  {
    slug: 'sifre-placanja',
    icon: QrCode,
    title: 'Šifre plaćanja',
    description:
      'Pretraga svih NBS šifara plaćanja sa primerima korišćenja. Otkrij koju šifru koristiti za struju, kredit, porez ili kiriju.',
  },
];

export default function ToolsIndexPage() {
  const base = getSiteUrl();
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Početna', url: `${base}/` },
          { name: 'Alati', url: `${base}/alat` },
        ])}
      />

      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="mb-12 max-w-2xl">
          <p className="text-brand text-xs font-semibold tracking-wider uppercase">
            Besplatni alati
          </p>
          <h1 className="font-display mt-3 text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            Alati za IPS QR i srpske račune
          </h1>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Alati rade lokalno u browseru, bez registracije i bez slanja podataka serveru. Otvorenog
            koda.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map(({ slug, icon: Icon, title, description }) => (
            <li key={slug}>
              <Link
                href={`/alat/${slug}`}
                className="group border-border bg-card shadow-card hover:shadow-card-lg block h-full rounded-2xl border p-6 transition-all"
              >
                <div className="bg-brand-soft text-brand flex size-11 items-center justify-center rounded-2xl">
                  <Icon className="size-5" />
                </div>
                <h2 className="text-foreground group-hover:text-brand mt-4 text-base font-semibold tracking-tight transition-colors">
                  {title}
                </h2>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SiteShell>
  );
}
