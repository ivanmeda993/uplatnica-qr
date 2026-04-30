---
title: 'Kako skenirati uplatnicu telefonom — IPS QR vs OCR uplatnice'
description: 'Postupak skeniranja IPS QR koda mobilnim telefonom, koje banke podržavaju, šta da uradiš ako QR ne radi i kako da skeniraš starije uplatnice bez QR-a.'
datePublished: '2026-04-30'
category: Vodič
keywords:
  - skeniranje uplatnice
  - qr skener uplatnica
  - kako skenirati račun
  - skeniraj uplatnicu telefonom
  - mbank qr
---

Skeniranje uplatnice telefonom traje **2-5 sekundi** ako uplatnica ima IPS QR kod. Ovaj vodič pokriva sve tri varijante: NBS IPS QR (najlakše), QR od strane treće aplikacije, i fotografisanje starih uplatnica bez QR-a (OCR).

## 1. NBS IPS QR — najlakša opcija

Sve mBank aplikacije srpskih banaka od 2021. podržavaju NBS IPS QR. Postupak je isti svuda:

1. Otvori mBank aplikaciju
2. "Plaćanja" → "Skeniraj QR" (ili "IPS QR" ili "QR plaćanje" — varira po banci)
3. Uperi kameru na QR
4. Polja se popune automatski
5. Potvrdi PIN-om

### Tačan put po banci

| Banka | Putanja u aplikaciji |
|-------|---------------------|
| [Raiffeisen Direct](/banke/raiffeisen) | Plaćanja → Skeniraj QR |
| [KomBank m-bank](/banke/komercijalna) | Transakcije → IPS QR |
| [Intesa Mobi](/banke/banca-intesa) | Plati → Skeniraj QR |
| [NLB mKlik](/banke/nlb) | Plaćanja → QR plaćanje |
| [OTP mBank](/banke/otp) | Plaćanja → Skeniraj |
| [AIK mBank](/banke/aik) | Plati → IPS QR |
| [Erste mBanking](/banke/erste) | Plaćanja → IPS QR |

Potpuna lista i screenshoti: [vodiči po bankama](/banke).

## 2. Skeniranje preko Uplatnica QR aplikacije

Ako želiš da **sačuvaš uplatnicu** kao šablon (a ne samo da je platiš), [koristi naš skener](/scan):

1. Otvori `/scan` u Uplatnica QR aplikaciji
2. Dozvoli pristup kameri
3. Skeniraj IPS QR
4. Sva polja se popune u formu
5. Sačuvaj kao šablon ili odmah generiši svoj QR

Korisno za:

- **Stanodavac koji prima više kirija** — sačuva uplatnice svojih stanara
- **Roditelj koji plaća više vrtića/škola** — uplatnice za svako dete
- **Mali biznis** — sačuva česte dobavljače

## 3. Stara uplatnica bez QR-a — fotografisanje (OCR)

Uplatnice pre 2021. često nemaju QR. Tu se kretiraš ka **OCR rešenjima**:

### Banke koje podržavaju OCR fotografisanje

- **Raiffeisen Direct** — "Plaćanja" → "Skeniraj uplatnicu" (foto). Prepoznaje 80-90% polja sa boljim kvalitetom slika.
- **NLB mKlik** — Sličan postupak, dobra preciznost.
- **Intesa Mobi** — "Plati račun" → "Foto skeniranje".
- **Erste mBanking** — "Plaćanja" → "OCR".

### Problemi sa OCR-om

- **Greške pri prepoznavanju** — model 97 i poziv na broj često budu pogrešni
- **Ne radi sa zgužvanim ili oštećenim uplatnicama**
- **Sporije** — obrada 5-15 sekundi, dok je QR instant
- **Nije standardizovano** — svaka banka drugačije parsira

Zato se preporučuje da **starije uplatnice unesete jednom u Uplatnica QR**, sačuvate kao šablon, i sledeći put generišete vlastiti IPS QR koji garantovano prolazi.

## Najčešći problemi pri skeniranju

### Kamera ne fokusira

Pomeraj telefon napred-nazad. Većina kamera ne može da fokusira na manje od 10cm udaljenosti.

### QR ima refleksiju (sjajna naleplnica)

Pomeraj telefon pod uglom 15-30°. Refleksija nestaje kad ne gledaš pravo.

### QR je oštećen / poderan

Ako je više od 30% QR-a oštećeno, nijedan skener ga neće pročitati. Generiši zamenski QR sa istim podacima kroz [Uplatnica QR](/).

### "QR nije validan IPS QR"

Aplikacija ne prepoznaje format. Razlozi:

1. Nije IPS QR već neki drugi tip (npr. WhatsApp QR za chat, eUverenje QR)
2. IPS QR sa starije specifikacije (verzija 00 umesto 01)
3. Štampani QR sa nedovoljnim Quiet Zone

Validiraj na [/alat/ips-qr-validator](/alat/ips-qr-validator) — pokaže ti tačno šta je u QR-u.

## Bezbednost: da li je sigurno skenirati QR sa nepoznate uplatnice?

Da. **IPS QR ne sadrži malicioznu logiku** — samo strukturisane podatke uplatnice. mBank aplikacija ti svakako prikazuje sve podatke pre nego što potvrdiš plaćanje, pa imaš priliku da otkažeš ako vidiš nešto sumnjivo.

Pravilo: **uvek proveri iznos i ime primaoca pre potvrde.**

## Sledeći koraci

- Pogledaj [vodiče za skeniranje po banci](/banke)
- Razumi [šta je IPS QR kod](/blog/sta-je-ips-qr-kod)
- [Probaj naš skener](/scan)
