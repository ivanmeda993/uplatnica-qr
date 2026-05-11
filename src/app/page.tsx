import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { JsonLd } from '@/components/seo/json-ld';
import { auth } from '@/lib/auth';
import {
  faqPageLd,
  homeHowToLd,
  organizationLd,
  softwareApplicationLd,
  webSiteLd,
} from '@/lib/landing/jsonld';
import { SITE } from '@/lib/site';
import { CtaBand } from '@/modules/landing/components/cta-band';
import { Faq } from '@/modules/landing/components/faq';
import { FeatureGrid } from '@/modules/landing/components/feature-grid';
import { Hero } from '@/modules/landing/components/hero';
import { HowItWorks } from '@/modules/landing/components/how-it-works';
import { ScreenshotsShowcase } from '@/modules/landing/components/screenshots-showcase';
import { SiteShell } from '@/modules/landing/components/site-shell';
import { SocialProof } from '@/modules/landing/components/social-proof';
import { TryItDemo } from '@/modules/landing/components/try-it-demo';
import { UseCases } from '@/modules/landing/components/use-cases';

const HOME_TITLE = 'Generiši NBS IPS QR online — besplatno, bez naloga | Uplatnica QR';
const HOME_DESCRIPTION =
  'Besplatan online generator NBS IPS QR koda za uplatnice u Srbiji. Probaš odmah, bez registracije: uneseš iznos i račun, klikneš Generiši i skeniraš sa Raiffeisen, Komercijalnom, Banca Intesa, NLB, OTP, AIK ili bilo kojom domaćom mBank aplikacijom.';

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect('/dashboard');

  return (
    <SiteShell variant="hero">
      <JsonLd
        data={[softwareApplicationLd(), organizationLd(), webSiteLd(), homeHowToLd(), faqPageLd()]}
      />
      <Hero />
      <TryItDemo />
      <SocialProof />
      <HowItWorks />
      <ScreenshotsShowcase />
      <FeatureGrid />
      <UseCases />
      <Faq />
      <CtaBand />
    </SiteShell>
  );
}
