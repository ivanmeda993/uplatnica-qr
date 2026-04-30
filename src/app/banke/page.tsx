import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { JsonLd } from '@/components/seo/json-ld';
import { BANKS } from '@/lib/banks/data';
import { breadcrumbLd } from '@/lib/landing/jsonld';
import { getSiteUrl } from '@/lib/site';
import { SiteShell } from '@/modules/landing/components/site-shell';

export const metadata: Metadata = {
  title: 'Skeniranje IPS QR po bankama — vodiči za sve srpske mBank aplikacije',
  description:
    'Korak-po-korak vodiči kako da skeniraš NBS IPS QR sa Raiffeisen, Komercijalnom, Banca Intesa, NLB, OTP, AIK, Erste i ostalim srpskim bankama.',
  alternates: { canonical: '/banke' },
};

export default function BankIndexPage() {
  const base = getSiteUrl();
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Početna', url: `${base}/` },
          { name: 'Banke', url: `${base}/banke` },
        ])}
      />

      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="mb-12 max-w-2xl">
          <p className="text-brand text-xs font-semibold tracking-wider uppercase">Vodiči</p>
          <h1 className="font-display mt-3 text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            Skeniranje IPS QR po bankama
          </h1>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Tačan postupak za svaku srpsku mBank aplikaciju — koraci, putanje u meniju, česti
            problemi po banci.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BANKS.filter((b) => b.hasPublicPage !== false && b.mBankApp).map((bank) => (
            <li key={bank.slug}>
              <Link
                href={`/banke/${bank.slug}`}
                className="group border-border bg-card hover:border-brand/40 flex h-full items-center justify-between rounded-2xl border p-5 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-foreground truncate font-semibold tracking-tight">
                    {bank.name}
                  </p>
                  <p className="text-muted-foreground mt-0.5 truncate text-xs">
                    {bank.mBankApp} · {bank.qrScanPath}
                  </p>
                </div>
                <ArrowRight className="text-muted-foreground group-hover:text-brand size-4 shrink-0 transition-colors" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SiteShell>
  );
}
