export interface PaymentCode {
  code: string;
  group: 'roba' | 'zarade' | 'porezi' | 'transferi' | 'krediti' | 'ostalo';
  name: string;
  example?: string;
}

/**
 * NBS šifre plaćanja (Prilog 2a Odluke o obliku, sadržini i načinu korišćenja
 * obrazaca platnih naloga).
 *
 * Trocifrena šifra: prva cifra = oblik plaćanja (1 = gotovinski, 2 = bezgotovinski,
 * 3 = obračunski, 9 = preknjižavanje), druga i treća cifra = osnov plaćanja.
 *
 * Aplikacija lista samo bezgotovinske (2xx) šifre jer se IPS QR kôd skenira u
 * mBank aplikaciji i izvršava prenosom s računa na račun. Za gotovinske
 * uplate na šalteru postoji ekvivalentna 1xx šifra (npr. 189 ↔ 289).
 */
export const PAYMENT_CODES: ReadonlyArray<PaymentCode> = [
  // Roba i usluge (220-231)
  { code: '220', group: 'roba', name: 'Promet robe i usluga – međufazna potrošnja' },
  {
    code: '221',
    group: 'roba',
    name: 'Promet robe i usluga – finalna potrošnja',
    example: 'EPS struja, JKP Vodovod, Infostan, internet, fakturisana kirija',
  },
  {
    code: '222',
    group: 'roba',
    name: 'Usluge javnih preduzeća',
    example: 'Komunalne usluge, taksi javnih preduzeća',
  },
  { code: '223', group: 'roba', name: 'Investicije u objekte i opremu' },
  { code: '224', group: 'roba', name: 'Investicije – ostalo' },
  {
    code: '225',
    group: 'roba',
    name: 'Zakupnine stvari u javnoj svojini',
    example: 'Zakup poslovnog prostora od države/opštine',
  },
  {
    code: '226',
    group: 'roba',
    name: 'Zakupnine',
    example: 'Zakup nekretnina i pokretnih stvari (oporezivo)',
  },
  { code: '227', group: 'roba', name: 'Subvencije, regresi i premije s posebnih računa' },
  { code: '228', group: 'roba', name: 'Subvencije, regresi i premije s ostalih računa' },
  { code: '231', group: 'roba', name: 'Carine i druge uvozne dažbine' },

  // Zarade i naknade (240-249)
  {
    code: '240',
    group: 'zarade',
    name: 'Zarade i druga primanja zaposlenih',
    example: 'Isplata zarade zaposlenom',
  },
  {
    code: '241',
    group: 'zarade',
    name: 'Neoporeziva primanja zaposlenih',
    example: 'Naknada troškova prevoza, dnevnice, jubilarna nagrada',
  },
  { code: '242', group: 'zarade', name: 'Naknade zarada na teret poslodavca' },
  { code: '244', group: 'zarade', name: 'Isplate preko omladinskih i studentskih zadruga' },
  { code: '245', group: 'zarade', name: 'Penzije' },
  { code: '246', group: 'zarade', name: 'Obustave od penzija i zarada' },
  { code: '247', group: 'zarade', name: 'Naknade zarada na teret drugih isplatilaca' },
  {
    code: '248',
    group: 'zarade',
    name: 'Prihodi fizičkih lica od kapitala i drugih imovinskih prava',
    example: 'Kamata, dividenda, prihod od izdavanja nepokretnosti',
  },
  {
    code: '249',
    group: 'zarade',
    name: 'Ostali prihodi fizičkih lica',
    example: 'Honorar po ugovoru o delu, autorske naknade',
  },

  // Porezi i javni prihodi (253-258, 264-265)
  {
    code: '253',
    group: 'porezi',
    name: 'Uplata javnih prihoda izuzev poreza i doprinosa po odbitku',
    example: 'Porez na imovinu, takse, naknade lokalne poreske administracije',
  },
  {
    code: '254',
    group: 'porezi',
    name: 'Uplata poreza i doprinosa po odbitku',
    example: 'Porez na zarade i pripadajući doprinosi',
  },
  { code: '257', group: 'porezi', name: 'Povraćaj više ili pogrešno naplaćenih tekućih prihoda' },
  {
    code: '258',
    group: 'porezi',
    name: 'Preknjižavanje više ili pogrešno uplaćenih tekućih prihoda',
  },
  { code: '264', group: 'porezi', name: 'Prenos sredstava iz budžeta za povraćaj tekućih prihoda' },
  { code: '265', group: 'porezi', name: 'Uplata pazara' },

  // Transferi i osiguranje (260-263, 266)
  {
    code: '260',
    group: 'transferi',
    name: 'Premije osiguranja i nadoknada štete',
    example: 'Polisa kasko, životnog ili imovinskog osiguranja',
  },
  { code: '261', group: 'transferi', name: 'Raspored tekućih prihoda' },
  { code: '262', group: 'transferi', name: 'Transferi u okviru državnih organa' },
  { code: '263', group: 'transferi', name: 'Ostali transferi' },
  { code: '266', group: 'transferi', name: 'Isplata gotovine' },

  // Krediti i depoziti (270-279)
  { code: '270', group: 'krediti', name: 'Kratkoročni krediti' },
  {
    code: '271',
    group: 'krediti',
    name: 'Dugoročni krediti',
    example: 'Stambeni i drugi dugoročni krediti — odobrenje',
  },
  { code: '272', group: 'krediti', name: 'Aktivna kamata' },
  { code: '273', group: 'krediti', name: 'Polaganje oročenih depozita' },
  { code: '275', group: 'krediti', name: 'Ostali plasmani' },
  {
    code: '276',
    group: 'krediti',
    name: 'Otplata kratkoročnih kredita',
    example: 'Mesečna rata gotovinskog kredita',
  },
  {
    code: '277',
    group: 'krediti',
    name: 'Otplata dugoročnih kredita',
    example: 'Mesečna rata stambenog ili auto kredita',
  },
  { code: '278', group: 'krediti', name: 'Povraćaj oročenih depozita' },
  { code: '279', group: 'krediti', name: 'Pasivna kamata' },

  // Kartice, devize i ostalo (280-290)
  { code: '280', group: 'ostalo', name: 'Eskont hartija od vrednosti' },
  { code: '281', group: 'ostalo', name: 'Pozajmice osnivača za likvidnost' },
  { code: '282', group: 'ostalo', name: 'Povraćaj pozajmice za likvidnost osnivaču' },
  { code: '283', group: 'ostalo', name: 'Naplata čekova građana' },
  { code: '284', group: 'ostalo', name: 'Platne kartice' },
  { code: '285', group: 'ostalo', name: 'Menjački poslovi' },
  { code: '286', group: 'ostalo', name: 'Kupoprodaja deviza' },
  { code: '287', group: 'ostalo', name: 'Donacije i sponzorstva' },
  { code: '288', group: 'ostalo', name: 'Donacije' },
  {
    code: '289',
    group: 'ostalo',
    name: 'Transakcije po nalogu građana',
    example: 'Najčešća šifra za uplate građana: kirija, članarina, prijatelju, vrtić, polisa',
  },
  {
    code: '290',
    group: 'ostalo',
    name: 'Druge transakcije',
    example: 'Sve što se ne uklapa u specifičnije šifre',
  },
];

export const GROUP_LABELS: Record<PaymentCode['group'], string> = {
  roba: 'Roba i usluge',
  zarade: 'Zarade i naknade',
  porezi: 'Porezi i javni prihodi',
  transferi: 'Transferi i osiguranje',
  krediti: 'Krediti i depoziti',
  ostalo: 'Kartice, devize i ostalo',
};

/**
 * Najčešće korišćene šifre za uplate fizičkih lica iz mBank aplikacije.
 * Redosled je po praktičnoj učestalosti — 289 je univerzalni fallback za
 * sve transfere s ličnog računa, 221 pokriva sve mesečne račune
 * (struja/voda/internet/infostan), itd. Prikazujemo ih kao "Najčešće"
 * sekciju iznad pune NBS klasifikacije u dropdown-u i na referentnoj stranici.
 */
export const POPULAR_PAYMENT_CODES: ReadonlyArray<string> = [
  '289', // Transakcije po nalogu građana — univerzalni fallback za fizička lica
  '221', // Promet robe i usluga – finalna potrošnja (struja, voda, internet, infostan)
  '253', // Uplata javnih prihoda izuzev poreza po odbitku (porez na imovinu, takse)
  '277', // Otplata dugoročnih kredita (stambeni, auto)
  '260', // Premije osiguranja (polise)
  '290', // Druge transakcije (krajnji fallback)
];

export const POPULAR_CODES: ReadonlyArray<PaymentCode> = POPULAR_PAYMENT_CODES.map(
  (code) => PAYMENT_CODES.find((c) => c.code === code)!
);
