---
title: 'Kako platiti Infostan QR kodom — komunalije za 30 sekundi'
description: 'Vodič za plaćanje JKP Infostan Tehnologije računa skeniranjem IPS QR koda. Polja, šifre, česti problemi i kako da generišeš svoj QR ako Infostan nije poslao.'
datePublished: '2026-04-30'
category: Vodič
keywords:
  - infostan plaćanje
  - infostan qr
  - kako platiti komunalije
  - jkp infostan
  - kako platiti infostan online
---

Infostan (puno ime: **JKP Infostan Tehnologije Beograd**) je preko milion korisnika u Beogradu. Mesečni račun za stan ima preko 10 stavki — vodu, smeće, dimničara, lift, zajedničke prostorije, grejanje (gde važi). IPS QR sve to spaja u jedno plaćanje.

## Polja Infostan uplatnice

| Polje | Vrednost |
|-------|----------|
| **Primalac** | JKP INFOSTAN TEHNOLOGIJE BEOGRAD |
| **Račun primaoca** | `160-0000000123456-78` (varira) |
| **Šifra plaćanja** | `221` — Promet robe i usluga – finalna potrošnja |
| **Model** | `97` |
| **Poziv na broj** | `97 <kontrolna> <Infostan_broj>` |
| **Iznos** | Sa mesečne objedinjene fakture |

Tvoj **Infostan broj** je 7-cifreni jedinstveni broj za tvoj stan. Nalazi se u gornjem desnom uglu uplatnice. Ne menja se.

## Skeniranje QR-a

Postupak je identičan kao za bilo koju drugu uplatnicu:

1. Otvori mBank aplikaciju
2. "Plaćanja" → "Skeniraj QR"
3. Uperi kameru na QR sa Infostan računa
4. Proveri iznos
5. Potvrdi PIN-om

Detaljan put po banci pogledaj u [vodičima za skeniranje](/banke).

## Sačuvaj kao šablon — plati za 10 sekundi sledeći mesec

Infostan iznos varira mesec u mesec (zbog grejanja, vode, struje za zajedničke prostorije). Ali svi ostali podaci ostaju isti.

[Sačuvaj Infostan kao šablon u Uplatnica QR](/), pa svaki sledeći mesec:

1. Otvori šablon "Infostan"
2. Promeni iznos
3. Generiše se QR
4. Skeniraš sa mBank aplikacijom
5. Potvrdiš

Ukupno: ~30 sekundi vs 2-3 minuta sa kucanjem.

## Šta ako Infostan QR ne radi

### "Banka prepoznaje QR ali ne popunjava poziv na broj"

Infostan ponekad printanje QR-a ima sa MOD 97 kontrolnom cifrom koja ne valja. Validiraj poziv na broj na [našem validatoru](/alat/sifre-placanja) ili kroz [model 97 algoritam](/blog/model-97-poziv-na-broj-objasnjenje).

Ako je nevažeći, generiši svoj QR sa istim Infostan brojem ali ispravnom kontrolnom cifrom.

### "Banka traži dodatnu autorizaciju za prvo Infostan plaćanje"

Normalno. Banke imaju adaptive security — prva 2-3 plaćanja na novi račun primaoca traže dodatnu verifikaciju (SMS kod, push notifikaciju). Posle toga se pamti.

### "Iznos sa QR-a se razlikuje od printanog"

Skoro sigurno greška u skeniranju (slabo osvetljenje, oštećen QR). **Uvek pre potvrde uporedi iznos** sa printanim.

## Plaćanje na rate — kako se rade?

Infostan dozvoljava plaćanje obroka na 2 ili 3 rate kroz svoj sistem. Za to ne koristiš QR sa originalne fakture — nazovi 011/300-44-44 ili otvori njihov portal i tražiš drugačiju uplatnicu sa pravim iznosom rate.

## Sledeći koraci

- [Sačuvaj Infostan kao šablon](/) — generišeš QR za 10 sekundi sledeći mesec
- Lista [svih šifara plaćanja](/blog/sifre-placanja-srbija-spisak)
- Vodič za [EPS struju](/blog/kako-platiti-eps-racun-qr-kodom) — slična logika
