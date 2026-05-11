import { AUTHOR, getSiteUrl, SITE } from '@/lib/site';

import { FAQ } from './faq-data';

export function personLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR.name,
    url: AUTHOR.url,
    jobTitle: AUTHOR.jobTitle,
    sameAs: AUTHOR.sameAs,
  };
}

export function softwareApplicationLd() {
  const base = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE.name,
    description: SITE.description,
    url: base,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser, iOS, Android',
    inLanguage: 'sr-Latn-RS',
    isAccessibleForFree: true,
    author: {
      '@type': 'Person',
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RSD',
    },
    featureList: [
      'Generisanje NBS IPS QR koda online bez registracije',
      'Skeniranje IPS QR koda kamerom uređaja',
      'Validacija MOD 97-10 kontrolne cifre računa',
      'Čuvanje šablona za redovne uplatnice',
      'Sinhronizacija šablona i istorije na više uređaja',
      'Radi offline kao Progressive Web App',
      'Bez reklama, bez pretplata, bez SMS verifikacije',
    ],
    softwareVersion: '0.1.0',
  };
}

export function organizationLd() {
  const base = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: base,
    logo: `${base}/icons/icon-512.png`,
    founder: {
      '@type': 'Person',
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
  };
}

export function webSiteLd() {
  const base = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: base,
    inLanguage: 'sr-Latn-RS',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${base}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function articleLd(post: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  category?: string;
}) {
  const base = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    url: `${base}/blog/${post.slug}`,
    image: `${base}/blog/${post.slug}/opengraph-image`,
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    inLanguage: 'sr-Latn-RS',
    articleSection: post.category,
    author: {
      '@type': 'Person',
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: base,
      logo: {
        '@type': 'ImageObject',
        url: `${base}/icons/icon-512.png`,
      },
    },
  };
}

export function breadcrumbLd(items: ReadonlyArray<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function howToLd(props: {
  name: string;
  description: string;
  totalTime?: string;
  steps: ReadonlyArray<{ name: string; text: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: props.name,
    description: props.description,
    totalTime: props.totalTime,
    step: props.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/**
 * HowTo schema for the landing page demo flow.
 * Targets long-tail queries like "kako napraviti IPS QR" / "kako generisati uplatnicu QR".
 */
export function homeHowToLd() {
  const base = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Kako napraviti NBS IPS QR za uplatnicu',
    description:
      'Generiši validan NBS IPS QR kod za uplatnicu u Srbiji, bez registracije. QR skeniraš sa bilo kojom domaćom mBank aplikacijom.',
    inLanguage: 'sr-Latn-RS',
    totalTime: 'PT30S',
    tool: [{ '@type': 'HowToTool', name: 'Web pregledač ili mobilni telefon' }],
    supply: [
      { '@type': 'HowToSupply', name: 'Iznos uplate u dinarima' },
      { '@type': 'HowToSupply', name: 'Ime primaoca' },
      { '@type': 'HowToSupply', name: '18-cifreni račun primaoca' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Unesi iznos i primaoca',
        text: 'Unesi iznos uplate u dinarima i ime primaoca u formu na početnoj strani.',
        url: `${base}/#probaj`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Unesi račun primaoca',
        text: 'Ukucaj 18-cifreni račun primaoca u formatu XXX-YYYYYYYYYYYYY-ZZ ili kao 18 spojenih cifara. Sistem proverava MOD 97-10 kontrolnu cifru u realnom vremenu.',
        url: `${base}/#probaj`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Klikni Generiši QR',
        text: 'Klikni na dugme Generiši QR. Validan NBS IPS QR kod se odmah pojavljuje ispod forme.',
        url: `${base}/#probaj`,
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Skeniraj sa mBank aplikacijom',
        text: 'Otvori mBank aplikaciju (Raiffeisen, Komercijalna, Banca Intesa, NLB, OTP, AIK…), izaberi opciju IPS QR plaćanje i skeniraj QR sa ekrana.',
        url: `${base}/#probaj`,
      },
    ],
  };
}

export function faqPageLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };
}
