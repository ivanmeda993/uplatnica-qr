import { env } from '@/env';

export function getSiteUrl(): string {
  return env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
}

export const SITE = {
  name: 'Uplatnica QR',
  shortName: 'Uplatnica',
  title: 'Uplatnica QR — generiši NBS IPS QR online, besplatno i bez naloga',
  description:
    'Generiši NBS IPS QR za uplatnicu online, bez registracije i bez reklama. Sačuvaj kredit, struju, internet, kiriju kao šablone i skeniraj sa Raiffeisen, Komercijalnom, Banca Intesa, NLB, OTP, AIK i ostalim mBank aplikacijama. Radi i offline kao PWA.',
  locale: 'sr_RS',
  twitterHandle: undefined as string | undefined,
} as const;

export const AUTHOR = {
  id: 'https://ivanmilicevic.dev/#person',
  name: 'Ivan Milićević',
  url: 'https://ivanmilicevic.dev/',
  // Replace this fallback with /work/ips-uplatnica once the case study returns HTTP 200.
  caseStudyUrl: 'https://ivanmilicevic.dev/#work',
  email: 'ivanmilicevicmeda@gmail.com',
  jobTitle: 'Senior Full-Stack Developer',
  sameAs: [
    'https://ivanmilicevic.dev/',
    'https://github.com/ivanmilicevic',
    'https://www.linkedin.com/in/ivanmilicevic-dev',
  ],
} as const;

export function getVerificationCodes() {
  return {
    google: env.GOOGLE_SITE_VERIFICATION,
    yandex: env.YANDEX_VERIFICATION,
    other: undefined,
  };
}

export function getAnalytics() {
  return {
    plausibleDomain: env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    plausibleScriptUrl: env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ?? 'https://plausible.io/js/script.js',
    gaMeasurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  };
}

export function getIndexNowKey() {
  return env.INDEXNOW_KEY;
}
