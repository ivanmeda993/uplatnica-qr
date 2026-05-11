export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: ReadonlyArray<FaqItem> = [
  {
    q: 'Šta je NBS IPS QR kod?',
    a: 'IPS QR je standardizovani QR kod Narodne banke Srbije za instant plaćanja. Sadrži sva polja uplatnice (broj računa primaoca, iznos, šifru plaćanja, model i poziv na broj). Kada ga skeniraš sa mBank aplikacijom, sva polja se automatski popune i potrebno je samo da potvrdiš plaćanje.',
  },
  {
    q: 'Da li radi sa mojom bankom?',
    a: 'Da. NBS IPS QR je nacionalni standard, pa ga podržavaju sve srpske banke koje imaju mBank aplikaciju (Raiffeisen, Komercijalna, Banca Intesa, NLB, OTP, AIK, ProCredit, Erste, Eurobank Direktna, UniCredit, Halkbank i ostale).',
  },
  {
    q: 'Da li su moji podaci sigurni?',
    a: 'Da. Sve uplatnice se čuvaju isključivo na tvom nalogu, kriptovane u bazi podataka. Aplikacija ne šalje podatke trećim licima, ne prikazuje reklame i ne traži pristup tvojoj banci. Generisanje QR koda se odvija lokalno na uređaju.',
  },
  {
    q: 'Mogu li da koristim na više uređaja?',
    a: 'Da. Prijaviš se istim nalogom na telefonu, tabletu i računaru — uplatnice se sinhronizuju automatski. Podržano je instaliranje kao PWA aplikacija (Add to Home Screen) na iOS i Android.',
  },
  {
    q: 'Po čemu je bolje od fotografisanja uplatnice?',
    a: 'Fotografija zahteva da banka prepozna polja kroz OCR, što često greši kod modela 97 ili poziva na broj. IPS QR je strukturisan i validiran prema NBS specifikaciji, pa banka uvek dobija tačno onu uplatnicu koju si snimio. A jednom unetu uplatnicu kasnije otvaraš kao šablon.',
  },
  {
    q: 'Da li radi offline?',
    a: 'Da. Aplikacija je PWA (Progressive Web App) sa service worker-om; jednom učitana, generisanje QR-a iz sačuvanih uplatnica radi bez interneta. Sinhronizacija novih uplatnica zahteva konekciju.',
  },
  {
    q: 'Da li mogu da skeniram tuđu uplatnicu?',
    a: 'Da. Otvoriš /scan, dozvoliš pristup kameri, i upereš na bilo koji NBS IPS QR kod (sa štampane uplatnice, e-računa ili ekrana). Polja se automatski popune i možeš da je sačuvaš ili odmah generišeš QR za plaćanje.',
  },
  {
    q: 'Koliko košta?',
    a: 'Aplikacija je potpuno besplatna. Bez reklama, bez pretplata, bez in-app kupovina. Pravljena je kao lični alat, otvorenog koda.',
  },
];
