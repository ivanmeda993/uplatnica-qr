---
title: 'Kako platiti EPS struju IPS QR kodom — vodič za 2 minuta'
description: 'Korak-po-korak vodič za plaćanje EPS računa za struju preko mBank aplikacije skeniranjem IPS QR koda. Sa primerom polja: šifra, model, poziv na broj.'
datePublished: '2026-04-30'
category: Vodič
keywords:
  - kako platiti eps
  - eps račun qr
  - eps qr kod
  - epsplus aplikacija
  - elektroprivreda srbija plaćanje
---

EPS račun za struju ima IPS QR kod od 2021. godine — ne moraš više da kucaš 18-cifren broj računa i ED broj. Skeniraš sa mBank aplikacijom, potvrdiš PIN-om, gotovo.

Ovaj vodič pokriva:

- Koje šifre i polja idu u EPS uplatnicu
- Kako da skeniraš QR sa printanog ili digitalnog računa
- Kako da generišeš sopstveni QR ako ti EPS nije poslao u dobrom kvalitetu
- Šta da uradiš ako mBank odbija plaćanje

## Šta sve EPS uplatnica sadrži

| Polje | Vrednost |
|-------|----------|
| **Primalac** | ELEKTROPRIVREDA SRBIJE BEOGRAD |
| **Račun primaoca** | Varira po regionu — najčešće `160-...` (Banca Intesa) ili `170-...` (UniCredit). Tačan broj je na tvom računu. |
| **Šifra plaćanja** | `221` — Promet robe i usluga – finalna potrošnja (faktura ka fizičkom licu) |
| **Model** | `97` |
| **Poziv na broj** | `97 <kontrolna_cifra> <ED_broj>` — ED broj je tvoj jedinstveni identifikator iz računa |
| **Iznos** | Prema mesečnom računu |

ED broj se ne menja — isti je svaki mesec za isto brojilo. Pogledaj [šta je model 97 i kontrolna cifra](/blog/model-97-poziv-na-broj-objasnjenje) ako prvi put srećeš.

## Skeniranje EPS QR-a sa printane uplatnice

### Korak 1 — pripremi mBank aplikaciju

Otvori aplikaciju svoje banke i prijavi se. QR plaćanje radi sa svim srpskim mBank aplikacijama:

- [Raiffeisen Direct](/banke/raiffeisen)
- [KomBank m-bank](/banke/komercijalna)
- [Intesa Mobi](/banke/banca-intesa)
- [NLB mKlik](/banke/nlb)
- [OTP mBank](/banke/otp)
- [Erste mBanking](/banke/erste)
- + ostale (videti [potpuna lista](/banke))

### Korak 2 — uperi kameru

Tap na "Plaćanja" → "Skeniraj QR" (tačan put zavisi od banke, vidi gore linkove). Uperi kameru na QR kod sa EPS računa.

EPS printane uplatnice imaju QR u donjem desnom uglu, rotiran za 90°. To je u redu — mBank aplikacije ga prepoznaju iz svakog ugla.

### Korak 3 — proveri i potvrdi

Aplikacija će automatski popuniti:

- Iznos
- Račun primaoca
- Model i poziv na broj

**Uvek proveri iznos pre nego što potvrdiš.** Greška u skeniranju je retka, ali se dešava na oštećenim štampanjima.

Potvrdi PIN-om ili biometrijom. Plaćanje je instant — EPS dobija uplatu u roku od par sekundi.

## Šta ako EPS nije poslao QR ili je oštećen

Stariji računi (pre 2021) nemaju QR. Takođe, neke poštanske kopije bivaju toliko slabog kvaliteta da ni najbolja kamera ne može da pročita.

U tim slučajevima koristiš [Uplatnica QR](/) — sačuvaš EPS uplatnicu jednom (uneseš sve podatke ručno, samo prvi put), i sledeće mesece samo promeniš iznos i generišeš svoj QR. Skeniraš sa svojim telefonom kao da je sa papira.

Prednosti vlastitog generisanja:

- **Uvek čitljiv** — generisan na ekranu visoke rezolucije
- **Sa bojama i imenom šablona** — ne moraš da pamtiš ED broj
- **Validacija MOD-97** — naš generator odbija nevažeće poziva na broj pre štampanja

## Najčešći problemi i rešenja

### "Banka odbija sa porukom 'pogrešan poziv na broj'"

ED broj na tvojoj uplatnici je verovatno otkucan sa pogrešnom kontrolnom cifrom (greška EPS-ovog štampača). Ručno proveri kontrolnu cifru po [model-97 algoritmu](/blog/model-97-poziv-na-broj-objasnjenje) ili koristi [naš validator](/alat/sifre-placanja).

### "Banka prepoznaje QR ali neće da popuni iznos"

Stariji EPS QR (do 2022) ne uključuje uvek polje iznosa — moraš ručno da uneseš. Novi formati uvek imaju iznos.

### "QR se skenira ali transakcija ne prolazi"

Verovatno tvoj račun nema dovoljno sredstava ili je dnevni limit prekoračen. Proveri stanje pre nego što ponovo pokušaš.

### "ED broj na uplatnici se razlikuje od onog što EPS šalje SMS-om"

Nazovi EPS Reklamacije (0700 200 200) i traži potvrdu pravog ED broja. SMS notifikacije ponekad imaju kraću skraćenu verziju koja ne valja kao poziv na broj.

## EPS Plus aplikacija — alternativa

EPS od 2023. ima sopstvenu mobilnu aplikaciju **EPS Plus** koja prikazuje tvoje račune i generiše QR direktno iz nje. Korisno ako redovno plaćaš struju i ne želiš da čekaš poštu.

Ali, ako imaš više brojila (kuća + vikendica) ili plaćaš kako svojima, tako i tuđim — Uplatnica QR je fleksibilniji jer ti dozvoljava da sačuvaš više EPS šablona pod različitim imenima.

## Sledeći koraci

- [Sačuvaj svoju EPS uplatnicu kao šablon](/) — sledeći mesec je samo promena iznosa
- Razumi [šta je IPS QR kod](/blog/sta-je-ips-qr-kod)
- Pogledaj uputstva za [skeniranje sa svoju banku](/banke)
