export interface BankInfo {
  slug: string;
  name: string;
  shortName: string;
  /** 3-digit NBS unique identification number per "Odluka o određivanju jedinstvenih identifikacionih brojeva pružalaca platnih usluga" (April 2025). */
  accountPrefixes: ReadonlyArray<string>;
  /** Mobile banking app name. Optional — treasury accounts (840) and legacy/specialty banks have no consumer app. */
  mBankApp?: string;
  /** Path inside the mobile app to find the IPS QR scanner. */
  qrScanPath?: string;
  /** Step-by-step instructions for scanning. Empty for banks without a consumer scanner. */
  scanSteps?: ReadonlyArray<string>;
  /** FAQ-style entries for documented bank quirks. */
  commonIssues?: ReadonlyArray<{ problem: string; solution: string }>;
  customerSupportUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  /** Whether to render a public bank detail page at /banke/{slug}. Set false for treasury / interbank-only entities. */
  hasPublicPage?: boolean;
}

export const BANKS: ReadonlyArray<BankInfo> = [
  {
    slug: 'raiffeisen',
    name: 'Raiffeisen Bank',
    shortName: 'Raiffeisen',
    mBankApp: 'Raiffeisen Direct',
    qrScanPath: 'Plaćanja → Skeniraj QR',
    accountPrefixes: ['265'],
    scanSteps: [
      'Otvori Raiffeisen Direct aplikaciju i prijavi se PIN-om ili biometrijom.',
      'Tap na "Plaćanja" u glavnom meniju.',
      'Izaberi "Skeniraj QR kod" iz liste opcija.',
      'Uperi kameru na IPS QR kod — polja se popune automatski.',
      'Proveri iznos i poziv na broj, pa potvrdi PIN-om.',
    ],
    commonIssues: [
      {
        problem: 'Aplikacija ne može da prepozna QR.',
        solution:
          'Proveri osvetljenje. Ako QR potiče sa printanja niske kvalitete, povećaj kontrast ili uperi pod blagim uglom.',
      },
      {
        problem: 'Polje "poziv na broj" ostaje prazno.',
        solution:
          'Raiffeisen Direct može da odbije model 97 ako kontrolna cifra ne valja. Validiraj poziv na broj na /alat/sifre-placanja.',
      },
    ],
    customerSupportUrl: 'https://www.raiffeisenbank.rs',
  },
  {
    slug: 'komercijalna',
    name: 'NLB Komercijalna banka',
    shortName: 'Komercijalna',
    mBankApp: 'KomBank Trader / m-bank',
    qrScanPath: 'Transakcije → IPS QR',
    accountPrefixes: ['205'],
    scanSteps: [
      'Pokreni KomBank m-bank aplikaciju i prijavi se.',
      'Iz donjeg menija izaberi "Transakcije".',
      'Tap na ikonicu QR koda u gornjem desnom uglu.',
      'Skeniraj IPS QR — KomBank popuni sva polja automatski.',
      'Potvrdi plaćanje SMS kodom ili PIN-om.',
    ],
    commonIssues: [
      {
        problem: 'KomBank traži dodatnu autorizaciju.',
        solution:
          'Kod novijih verzija aplikacije, prvi put kad koristiš QR plaćanje moraš da aktiviraš opciju u podešavanjima.',
      },
    ],
    customerSupportUrl: 'https://www.kombank.com',
  },
  {
    slug: 'banca-intesa',
    name: 'Banca Intesa',
    shortName: 'Banca Intesa',
    mBankApp: 'Intesa Mobi',
    qrScanPath: 'Plaćanja → Skeniraj QR',
    accountPrefixes: ['160'],
    scanSteps: [
      'Otvori Intesa Mobi aplikaciju i unesi PIN.',
      'Tap "Plati" iz glavnog ekrana.',
      'Izaberi "Skeniraj QR".',
      'Uperi kameru na IPS QR kod.',
      'Pregledaj podatke i potvrdi plaćanje.',
    ],
    commonIssues: [
      {
        problem: 'Intesa Mobi crash-uje kad uperim kameru.',
        solution:
          'Ažuriraj aplikaciju na najnoviju verziju. Stariji buildovi imaju problem na iOS 17+.',
      },
    ],
    customerSupportUrl: 'https://www.bancaintesa.rs',
  },
  {
    slug: 'otp',
    name: 'OTP banka Srbija',
    shortName: 'OTP',
    mBankApp: 'OTP mBank',
    qrScanPath: 'Plaćanja → Skeniraj',
    accountPrefixes: ['325'],
    scanSteps: [
      'Otvori OTP mBank aplikaciju i prijavi se.',
      'Tap "Plaćanja".',
      'Izaberi "Skeniraj IPS QR".',
      'Uperi kameru na QR kod.',
      'Potvrdi sve podatke i autorizuj PIN-om.',
    ],
    commonIssues: [
      {
        problem: 'OTP mBank traži dozvolu za kameru pri svakom skeniranju.',
        solution: 'Idi u podešavanja telefona → OTP mBank → Kamera → "Uvek dozvoli".',
      },
    ],
    customerSupportUrl: 'https://www.otpbanka.rs',
  },
  {
    slug: 'aik',
    name: 'AIK Banka',
    shortName: 'AIK',
    mBankApp: 'AIK mBank',
    qrScanPath: 'Plati → IPS QR',
    accountPrefixes: ['105'],
    scanSteps: [
      'Pokreni AIK mBank aplikaciju.',
      'Tap "Plati" u glavnom meniju.',
      'Izaberi "IPS QR" opciju.',
      'Skeniraj QR kod sa ekrana ili papira.',
      'Potvrdi plaćanje.',
    ],
    commonIssues: [
      {
        problem: 'AIK traži posebnu šemu plaćanja za neke transakcije.',
        solution:
          'AIK ima svoju kontrolu nad načinima plaćanja — ako QR ne prolazi, koristi standardnu uplatnicu.',
      },
    ],
    customerSupportUrl: 'https://www.aikbanka.rs',
  },
  {
    slug: 'procredit',
    name: 'ProCredit Bank',
    shortName: 'ProCredit',
    mBankApp: 'ProB@nking',
    qrScanPath: 'Plaćanja → Skeniraj QR',
    accountPrefixes: ['220'],
    scanSteps: [
      'Otvori ProB@nking aplikaciju.',
      'Iz menija izaberi "Plaćanja".',
      'Tap "Skeniraj QR".',
      'Skeniraj IPS QR.',
      'Potvrdi.',
    ],
    commonIssues: [],
    customerSupportUrl: 'https://www.procreditbank.rs',
  },
  {
    slug: 'erste',
    name: 'Erste Bank',
    shortName: 'Erste',
    mBankApp: 'Erste mBanking',
    qrScanPath: 'Plaćanja → IPS QR',
    accountPrefixes: ['340'],
    scanSteps: [
      'Pokreni Erste mBanking aplikaciju.',
      'Tap "Plaćanja".',
      'Izaberi "IPS QR plaćanje".',
      'Skeniraj kod.',
      'Potvrdi PIN-om ili biometrijom.',
    ],
    commonIssues: [
      {
        problem: 'Erste mBanking traži dodatnu verifikaciju za prva 2-3 QR plaćanja.',
        solution:
          'Normalno — Erste koristi adaptive security. Posle nekoliko uspešnih plaćanja prestaje.',
      },
    ],
    customerSupportUrl: 'https://www.erstebank.rs',
  },
  {
    slug: 'eurobank-direktna',
    name: 'Eurobank Direktna',
    shortName: 'Eurobank Direktna',
    mBankApp: 'Eurobank Direktna mBanking',
    qrScanPath: 'Transakcije → QR',
    accountPrefixes: ['150'],
    scanSteps: [
      'Otvori Eurobank Direktna mBanking aplikaciju.',
      'Tap "Transakcije".',
      'Izaberi "Skeniraj QR".',
      'Uperi kameru na IPS QR.',
      'Potvrdi.',
    ],
    commonIssues: [],
    customerSupportUrl: 'https://www.eurobank-direktna.rs',
  },
  {
    slug: 'unicredit',
    name: 'UniCredit Bank Srbija',
    shortName: 'UniCredit',
    mBankApp: 'UniCredit Mobilno bankarstvo',
    qrScanPath: 'Plaćanja → QR plaćanje',
    accountPrefixes: ['170'],
    scanSteps: [
      'Pokreni UniCredit Mobilno bankarstvo.',
      'Tap "Plaćanja".',
      'Izaberi "QR plaćanje".',
      'Skeniraj IPS QR.',
      'Pregledaj i potvrdi.',
    ],
    commonIssues: [],
    customerSupportUrl: 'https://www.unicreditbank.rs',
  },
  {
    slug: 'halkbank',
    name: 'Halkbank',
    shortName: 'Halkbank',
    mBankApp: 'Halk mBank',
    qrScanPath: 'Plaćanja → Skeniraj',
    accountPrefixes: ['155'],
    scanSteps: [
      'Otvori Halk mBank aplikaciju.',
      'Iz glavnog menija "Plaćanja".',
      'Tap "Skeniraj QR".',
      'Skeniraj IPS QR.',
      'Potvrdi PIN-om.',
    ],
    commonIssues: [],
    customerSupportUrl: 'https://www.halkbank.rs',
  },
  {
    slug: 'yettel-bank',
    name: 'Yettel Bank',
    shortName: 'Yettel',
    mBankApp: 'Yettel Bank (ranije NEXT)',
    qrScanPath: 'Plaćanja → Skeniraj QR',
    accountPrefixes: ['115'],
    scanSteps: [
      'Otvori Yettel Bank aplikaciju i prijavi se.',
      'Tap "Plaćanja" → "Skeniraj QR".',
      'Skeniraj IPS QR kod.',
      'Proveri podatke i potvrdi PIN-om / biometrijom.',
    ],
    commonIssues: [],
    customerSupportUrl: 'https://www.yettelbank.rs',
  },
  {
    slug: 'postanska-stedionica',
    name: 'Banka Poštanska štedionica',
    shortName: 'Poštanska',
    mBankApp: 'mPS — mBanking Poštanske štedionice',
    qrScanPath: 'Plaćanja → IPS QR',
    accountPrefixes: ['200'],
    scanSteps: [
      'Otvori mPS aplikaciju i prijavi se.',
      'Iz menija odaberi "Plaćanja".',
      'Tap "Skeniraj IPS QR".',
      'Potvrdi podatke i PIN.',
    ],
    commonIssues: [],
    customerSupportUrl: 'https://www.posted.co.rs',
  },
  {
    slug: 'addiko',
    name: 'Addiko Bank',
    shortName: 'Addiko',
    mBankApp: 'Addiko Mobile',
    qrScanPath: 'Plaćanja → Skeniraj IPS QR',
    accountPrefixes: ['165'],
    scanSteps: [
      'Otvori Addiko Mobile.',
      'Tap "Plaćanja" → "Skeniraj IPS QR".',
      'Skeniraj kod, proveri iznos i potvrdi.',
    ],
    commonIssues: [],
    customerSupportUrl: 'https://www.addiko.rs',
  },
  {
    slug: 'api-bank',
    name: 'API Bank',
    shortName: 'API',
    mBankApp: 'API mBank',
    qrScanPath: 'Plaćanja → IPS QR',
    accountPrefixes: ['375'],
    scanSteps: [
      'Otvori API mBank aplikaciju.',
      'Tap "Plaćanja" → "Skeniraj IPS".',
      'Skeniraj kod i potvrdi PIN-om.',
    ],
    commonIssues: [],
    customerSupportUrl: 'https://www.apibank.rs',
  },
  // ─── Banke bez consumer-grade aplikacije / interbank only ───
  {
    slug: 'adriatic-bank',
    name: 'Adriatic Bank',
    shortName: 'Adriatic',
    accountPrefixes: ['145'],
    customerSupportUrl: 'https://www.adriaticbank.com',
    hasPublicPage: false,
  },
  {
    slug: 'alta-banka',
    name: 'ALTA Banka',
    shortName: 'ALTA',
    accountPrefixes: ['190'],
    customerSupportUrl: 'https://www.altabanka.rs',
    hasPublicPage: false,
  },
  {
    slug: 'srpska-banka',
    name: 'Srpska Banka',
    shortName: 'Srpska',
    accountPrefixes: ['295'],
    customerSupportUrl: 'https://www.srpskabanka.rs',
    hasPublicPage: false,
  },
  {
    slug: '3-banka',
    name: '3 Banka',
    shortName: '3 Banka',
    accountPrefixes: ['370'],
    customerSupportUrl: 'https://www.3banka.com',
    hasPublicPage: false,
  },
  {
    slug: 'mirabank',
    name: 'Mirabank',
    shortName: 'Mirabank',
    accountPrefixes: ['380'],
    customerSupportUrl: 'https://www.mirabankserbia.com',
    hasPublicPage: false,
  },
  {
    slug: 'bank-of-china-srbija',
    name: 'Bank of China Srbija',
    shortName: 'Bank of China',
    accountPrefixes: ['385'],
    customerSupportUrl: 'https://www.bankofchina.com/rs',
    hasPublicPage: false,
  },
  // ─── Treasury / NBS — these aren't banks but show up as account prefixes ───
  {
    slug: 'trezor-rs',
    name: 'Republika Srbija — Uprava za trezor',
    shortName: 'Trezor RS',
    accountPrefixes: ['840'],
    customerSupportUrl: 'https://www.trezor.gov.rs',
    hasPublicPage: false,
  },
  {
    slug: 'nbs',
    name: 'Narodna banka Srbije',
    shortName: 'NBS',
    accountPrefixes: ['908'],
    customerSupportUrl: 'https://www.nbs.rs',
    hasPublicPage: false,
  },
];

export function getBankBySlug(slug: string): BankInfo | undefined {
  return BANKS.find((b) => b.slug === slug);
}

/**
 * Look up the bank that issues accounts with the given 3-digit prefix.
 * Accepts either the prefix alone ("265") or any longer string starting with it
 * (full account, formatted account, etc.) so callers don't need to pre-strip.
 *
 * Returns `undefined` if no bank matches (small/specialty banks not in our list).
 */
export function getBankByAccount(accountOrPrefix: string): BankInfo | undefined {
  const cleaned = accountOrPrefix.replace(/[\s-]/g, '');
  if (cleaned.length < 3) return undefined;
  const prefix = cleaned.slice(0, 3);
  return BANKS.find((b) => b.accountPrefixes.includes(prefix));
}
