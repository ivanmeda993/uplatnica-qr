import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/seo/json-ld';
import { Button } from '@/components/ui/button';
import { BANKS, getBankBySlug } from '@/lib/banks/data';
import { breadcrumbLd, howToLd } from '@/lib/landing/jsonld';
import { getSiteUrl } from '@/lib/site';
import { SiteShell } from '@/modules/landing/components/site-shell';

interface PageProps {
  params: Promise<{ banka: string }>;
}

export function generateStaticParams() {
  // Only render guide pages for banks with consumer-facing apps and instructions.
  return BANKS.filter((b) => b.hasPublicPage !== false && b.scanSteps?.length).map((b) => ({
    banka: b.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { banka } = await params;
  const bank = getBankBySlug(banka);
  if (!bank || bank.hasPublicPage === false || !bank.mBankApp) {
    return { title: 'Banka nije pronađena' };
  }
  return {
    title: `Kako skenirati IPS QR sa ${bank.shortName} — vodič ${bank.mBankApp}`,
    description: `Korak-po-korak uputstvo kako da skeniraš NBS IPS QR kod sa ${bank.name} preko ${bank.mBankApp} aplikacije. Šta da uradiš ako ne radi.`,
    alternates: { canonical: `/banke/${bank.slug}` },
  };
}

export default async function BankPage({ params }: PageProps) {
  const { banka } = await params;
  const bank = getBankBySlug(banka);
  if (!bank || bank.hasPublicPage === false || !bank.mBankApp || !bank.scanSteps) notFound();

  const base = getSiteUrl();
  const otherBanks = BANKS.filter(
    (b) => b.slug !== bank.slug && b.hasPublicPage !== false && b.mBankApp
  ).slice(0, 4);

  return (
    <SiteShell>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Početna', url: `${base}/` },
            { name: 'Banke', url: `${base}/banke` },
            { name: bank.shortName, url: `${base}/banke/${bank.slug}` },
          ]),
          howToLd({
            name: `Kako skenirati IPS QR sa ${bank.shortName}`,
            description: `Postupak skeniranja NBS IPS QR koda preko ${bank.mBankApp} aplikacije.`,
            totalTime: 'PT1M',
            steps: bank.scanSteps.map((step, i) => ({
              name: `Korak ${i + 1}`,
              text: step,
            })),
          }),
        ]}
      />

      <article className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
        <Link
          href="/banke"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1.5 text-xs"
        >
          <ArrowLeft className="size-3.5" />
          Sve banke
        </Link>

        <header className="mb-10">
          <p className="text-brand text-xs font-semibold tracking-wider uppercase">
            Vodič za skeniranje
          </p>
          <h1 className="font-display mt-3 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            Kako skenirati IPS QR sa {bank.shortName}
          </h1>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Aplikacija: <strong className="text-foreground">{bank.mBankApp}</strong>
            <br />
            Putanja:{' '}
            <code className="bg-muted rounded px-1.5 py-0.5 text-xs">{bank.qrScanPath}</code>
            <br />
            Prefiks računa:{' '}
            {bank.accountPrefixes.map((p) => (
              <code key={p} className="bg-muted ml-1 rounded px-1.5 py-0.5 font-mono text-xs">
                {p}
              </code>
            ))}
          </p>
        </header>

        <section aria-labelledby="koraci-heading" className="mb-12">
          <h2 id="koraci-heading" className="text-foreground mb-5 text-xl font-semibold">
            Koraci
          </h2>
          <ol className="space-y-4">
            {bank.scanSteps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="bg-brand text-brand-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                  {i + 1}
                </span>
                <p className="text-foreground pt-1 text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {bank.commonIssues && bank.commonIssues.length > 0 && (
          <section aria-labelledby="problemi-heading" className="mb-12">
            <h2 id="problemi-heading" className="text-foreground mb-5 text-xl font-semibold">
              Česti problemi
            </h2>
            <ul className="space-y-4">
              {bank.commonIssues.map((issue, i) => (
                <li key={i} className="border-border bg-card rounded-2xl border p-5">
                  <p className="text-foreground font-medium">{issue.problem}</p>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {issue.solution}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {bank.customerSupportUrl && (
          <p className="text-muted-foreground mb-12 text-sm">
            Dodatne informacije i kontakt:{' '}
            <a
              href={bank.customerSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand inline-flex items-center gap-1 hover:underline"
            >
              {bank.customerSupportUrl.replace(/^https?:\/\//, '')}
              <ExternalLink className="size-3" />
            </a>
          </p>
        )}

        <div className="bg-mesh-soft border-border rounded-3xl border p-8">
          <h3 className="text-foreground font-display text-2xl font-semibold tracking-tight">
            Generiši svoj IPS QR za {bank.shortName} klijente.
          </h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Ako primaš uplate ili plaćaš redovne račune, sačuvaj uplatnicu jednom i sledeći put samo
            otvoriš šablon.
          </p>
          <Button variant="brand" size="lg" asChild className="mt-5">
            <Link href="/register">
              Napravi besplatan nalog
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <section className="mt-16">
          <h2 className="text-foreground mb-4 text-lg font-semibold">Druge banke</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {otherBanks.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/banke/${b.slug}`}
                  className="border-border bg-card hover:border-brand/40 block rounded-xl border p-4 transition-colors"
                >
                  <p className="text-foreground text-sm font-semibold">{b.name}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">{b.mBankApp}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </SiteShell>
  );
}
