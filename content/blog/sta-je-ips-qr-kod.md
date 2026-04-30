---
title: 'Šta je NBS IPS QR kod i kako radi'
description: 'IPS QR je standardizovani QR kod Narodne banke Srbije za instant plaćanja. Objašnjava se šta sadrži, kako se generiše, gde se koristi i zašto zamenjuje fotografisanje uplatnice.'
datePublished: '2026-04-30'
category: Objašnjenje
keywords:
  - ips qr
  - nbs qr kod
  - šta je ips qr
  - instant plaćanja srbija
---

**IPS QR** je QR kod definisan specifikacijom Narodne banke Srbije za instant plaćanja u dinarima. Sadrži strukturisane podatke uplatnice (broj računa primaoca, iznos, šifru plaćanja, model i poziv na broj) tako da bilo koja srpska mBank aplikacija može da popuni sva polja jednim skeniranjem.

Skraćenica IPS znači **Instant Payments Serbia** — sistem koji omogućava trenutne prenose novca između banaka u Srbiji 24/7, sa namirenjem za nekoliko sekundi.

## Zašto je IPS QR napravljen

Pre IPS QR-a, plaćanje računa preko mBank aplikacije značilo je ručno kucanje 18-cifarskog broja računa, pa onda još 20+ cifara modela i poziva na broj. Greška u jednoj cifri = uplata na pogrešan račun, povraćaj traje danima.

NBS je 2020. godine standardizovao IPS QR kako bi:

- **Ukinuo greške pri kucanju** brojeva računa i modela
- **Ubrzao plaćanja** — skeniranje traje par sekundi
- **Standardizovao format** tako da svaka banka isto interpretira QR

## Šta sadrži IPS QR — struktura podataka

IPS QR je u suštini **tekstualni string** sa tagovima razdvojenim znakom `|` (vertikalna crta). Svaki tag ima dvoslovni identifikator i vrednost:

```text
K:PR|V:01|C:1|R:160000000123456778|N:JKP INFOSTAN TEHNOLOGIJE|I:RSD6840,50|S:KOMUNALIJE|RO:97 84 1234567
```

### Obavezna polja

| Tag | Naziv | Sadržaj | Primer |
|-----|-------|---------|--------|
| `K` | Kanal | `PR` (printano), `PT/PK` (POS), `EK` (e-commerce) | `PR` |
| `V` | Verzija | Trenutno uvek `01` | `01` |
| `C` | Karakter | `1` = UTF-8 | `1` |
| `R` | Račun primaoca | 18 cifara, bez crtica | `160000000123456778` |
| `N` | Naziv primaoca | Do 70 karaktera, može i adresa (CRLF) | `JKP INFOSTAN` |
| `I` | Iznos | `RSD<celo>,<dve_cifre>` | `RSD6840,50` |

### Opciona polja

| Tag | Naziv | Korišćenje |
|-----|-------|------------|
| `P` | Platilac | Ime + adresa onoga ko plaća |
| `SF` | Šifra plaćanja | Trocifren NBS kod (`221`, `289`, `222`) |
| `S` | Svrha plaćanja | Slobodan tekst do 35 karaktera |
| `RO` | Poziv na broj | Model + broj (npr. `97 84 1234567`) |
| `O` | Datum izvršenja | YYYYMMDD |

## Tehnička ograničenja

- **Maksimalna veličina payload-a**: 331 bajt (UTF-8) — odgovara QR verziji 13
- **Error correction level**: M za printano, L za POS/screen
- **Encoding mode**: byte mode (UTF-8)
- **Quiet zone**: minimum 4 modula

Ako payload pređe 331 bajt, banke ne garantuju da će aplikacija moći da skenira. Praktično — ime primaoca i svrha plaćanja moraju da se skrate ako su predugi.

## Kako se IPS QR generiše

Svaka banka, fakturni server (e-računi za EPS, Infostan, telekom-e) i privatne aplikacije moraju da:

1. **Validiraju ulazne podatke** prema NBS specifikaciji (broj računa po MOD-97, iznos sa decimalnim zarezom, model 97 sa kontrolnom cifrom)
2. **Serijalizuju u tekstualni string** prema formatu iznad, u tačnom redosledu tagova
3. **Generišu QR kod** sa odgovarajućim error correction-om

Naš [generator](/) radi tačno ovo — sačuvaš uplatnicu, on validira i generiše QR koji prolazi kroz svaku srpsku banku.

## Kako se IPS QR skenira

Ovo je deo gde se desila prava revolucija. Ranije je svaka banka imala svoj proprietary format, sad sve podržavaju isti NBS standard:

1. Otvoriš mBank aplikaciju (Raiffeisen Direct, KomBank m-bank, Intesa Mobi, NLB mKlik, OTP mBank, Erste mBanking, AIK mBank itd.)
2. Tap-uješ "Plaćanja" → "Skeniraj QR"
3. Skeniraš QR sa štampane uplatnice, ekrana ili e-računa
4. Sva polja se automatski popune
5. Potvrdiš PIN-om

Detaljna uputstva po banci su u [vodičima za skeniranje](/banke).

## Gde se IPS QR koristi

- **Štampane uplatnice** — Infostan, EPS, JKP-ovi, vrtići, fakultet, lokalna poreska administracija
- **E-računi** — PDF računi koje šalju internet provajderi (SBB, Yettel), telekomi (MTS, Telenor), kablovska
- **POS terminali** — sve više prodavnica prikazuje IPS QR umesto da naplaćuje karticom (jeftiniji za trgovca)
- **E-commerce** — webshop checkout sa "platite skeniranjem"
- **Privatne uplate** — kirija stanodavcu, plaćanje među prijateljima

## IPS QR vs druga rešenja

| | NBS IPS QR | Klasično kucanje | Fotografisanje (OCR) |
|---|---|---|---|
| Brzina | 2 sekunde | 1-2 minuta | 10-30 sekundi |
| Greška u broju računa | Nemoguća | Česta | Često (model 97) |
| Standardizacija | NBS spec | Svaka banka isto | Svaka aplikacija drugačije |
| Radi sa svim bankama | Da | Da | Ne (varijabilna podrška) |

Više o razlici između QR i fotografije u [zasebnom članku](/blog/ips-qr-vs-fotografija-uplatnice).

## Najčešća pitanja

**Da li je IPS QR isti kao "Pay by QR" koji bankari pominju?**
Da. NBS IPS QR je nacionalni standard koji svaka banka brendira pod svojim imenom ("Plati skeniranjem", "QR plaćanje", "IPS skeniranje"), ali tehnički je isti format.

**Da li mogu sam da generišem IPS QR za svoju kiriju?**
Da. To je tačno za šta je [Uplatnica QR](/) napravljena — sačuvaš uplatnicu jednom, generišeš QR svaki sledeći put. Stanodavci/zakupodavci skeniraju i plate za 2 sekunde.

**Da li IPS QR sadrži moje lične podatke?**
Sadrži samo ono što ti staviš u uplatnicu — ime primaoca i opciono ime platioca. Banke i kartice nisu uključene u QR. Sva autorizacija ide kroz mBank aplikaciju posle skeniranja.

**Šta ako štampani QR nije kvalitetan i mBank ne može da ga skenira?**
Probaj da povećaš osvetljenje, ili otvori QR sa ekrana telefona (lakše za skeniranje od papira). Ako baš ne može, koristi `/alat/ips-qr-validator` da ručno proveriš payload.

## Sledeći koraci

- Pogledaj [potpunu listu šifara plaćanja](/blog/sifre-placanja-srbija-spisak)
- Razumi [model 97 i kontrolnu cifru poziva na broj](/blog/model-97-poziv-na-broj-objasnjenje)
- [Generiši svoj prvi IPS QR](/) — registracija je besplatna
