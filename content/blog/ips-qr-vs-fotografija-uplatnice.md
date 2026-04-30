---
title: 'IPS QR vs fotografisanje uplatnice — koja opcija je brža i sigurnija?'
description: 'Poređenje IPS QR koda i OCR (fotografisanje) za plaćanje uplatnica preko mBank aplikacije. Brzina, preciznost, podržanost u bankama i kada je koja opcija bolja.'
datePublished: '2026-04-30'
category: Objašnjenje
keywords:
  - razlika qr fotografija uplatnica
  - ocr uplatnica
  - ips qr vs ocr
  - fotografisanje uplatnice
  - šta je bolje qr ili foto
---

Banke od 2018. nude opciju "fotografisanja uplatnice" — slikaš uplatnicu, OCR (Optical Character Recognition) izvuče polja, plaćaš. Od 2021. svi računi imaju IPS QR — skeniraš QR, polja se popune odmah.

Koja opcija je bolja? Skoro uvek **IPS QR**. Evo zašto.

## Brza tabela poređenja

| | IPS QR | Fotografisanje (OCR) |
|---|--------|---------------------|
| **Brzina** | 2 sekunde | 10-30 sekundi |
| **Preciznost** | 100% — strukturisani podaci | 80-95% — varira sa kvalitetom slike |
| **Greške u model 97** | Nemoguće | Česte |
| **Podržano u svim mBank aplikacijama** | Da | Ne (samo veće banke) |
| **Radi sa štampanim računom** | Da | Da |
| **Radi sa e-računom (PDF)** | Da | Često ne (PDF tekst nije slika) |
| **Radi offline** | Da (skener radi lokalno) | Da |
| **Standardizacija** | NBS spec — uniformno | Svaka banka drugačije |
| **Trošak za banku** | Nizak (decode QR-a) | Visok (OCR ML model) |

## Kada IPS QR pobeđuje (90% slučajeva)

### 1. Nove uplatnice imaju QR

Sve uplatnice izdate od 2021. su obavezne da imaju IPS QR — EPS, Infostan, JKP-ovi, banke, telekomi, vrtići, škole. Ako uplatnica ima QR — koristi QR. Bez razmišljanja.

### 2. Nema grešaka u kucanju

OCR često pogrešno prepoznaje:

- Slovo `O` umesto cifre `0`
- Slovo `B` umesto cifre `8`
- Razmake i crtice koje briše ili dodaje na pogrešnom mestu

Posebno opasno: **kontrolna cifra modela 97**. Ako OCR otkuca `84` umesto `94`, banka odbija uplatu i moraš ručno da ispravljaš.

IPS QR je strukturisan i validiran — nemoguća greška u prepoznavanju polja.

### 3. Brzina je 5-10× bolja

QR skenira instant, OCR mora da:

1. Snimi sliku
2. Pošalje na cloud server (kod nekih banaka)
3. ML model izvuče tekst
4. Mapira tekst u polja
5. Prikaže rezultat za potvrdu

Sve to traje 10-30 sekundi po uplatnici. QR — 2 sekunde.

### 4. Radi sa svakom mBank aplikacijom

NBS standardizovao IPS QR. Sve srpske banke prepoznaju isti format. Manje banke (Halkbank, Eurobank Direktna) često **ne podržavaju OCR**, ali sve podržavaju IPS QR.

## Kada fotografisanje (OCR) ima smisla

### 1. Stara uplatnica bez QR-a

Račun pre 2021. ili sa nekog malog dobavljača koji još nije implementirao IPS QR. OCR je tu dobar fallback.

**Bolje rešenje:** unesi tu uplatnicu jednom u [Uplatnica QR](/), sačuvaj kao šablon, i sledeći put generiši vlastiti IPS QR koji garantovano radi.

### 2. QR je oštećen ili nečitljiv

Mokra, zgužvana, zabledela uplatnica gde QR ne može da se skenira. OCR je tu poslednja opcija.

### 3. Imaš samo PDF e-račun

E-računi za internet/struju često imaju **selektabilan tekst u PDF-u** — copy-paste iznosa i broja računa je brže od fotografisanja. Ali, sve modernije e-fakture sada sadrže IPS QR sliku, koja se može skenirati direktno sa ekrana.

## Praktičan workflow za maksimalnu brzinu

1. **Prvi put kad dobiješ uplatnicu** — koristi IPS QR (ili manuelno uneseš u [Uplatnica QR](/) ako je stara)
2. **Sačuvaj kao šablon** — naziv, kategorija, sve podaci
3. **Svaki sledeći put** — otvori šablon, promeniš samo iznos, generiše se QR
4. **Skeniraš svoj QR** sa mBank aplikacijom

Ukupno vreme od ideje do plaćanja: **~30 sekundi**.

Bez šablona, OCR put traje 1-2 minuta po uplatnici. Pomnoži sa 5-10 mesečnih uplatnica = 10+ minuta mesečno.

## Šta o sigurnosti?

Oba metoda su podjednako sigurna iz banke perspektive — autorizacija ide kroz mBank aplikaciju (PIN, biometrija, push notifikacija), ne kroz QR/OCR.

**IPS QR nema nikakvu malicioznu logiku** — to je čist tekstualni payload sa strukturisanim poljima. Ne može da pokrene "command injection" niti da preusmeri tvoj telefon.

**Pravilo:** uvek pre potvrde proveri **iznos i ime primaoca** na ekranu mBank aplikacije. Greška retka, ali se može desiti.

## Zaključak

IPS QR pobeđuje OCR po svakoj metrici osim "starijih uplatnica bez QR-a". Ako imaš opciju, **uvek koristi QR**.

Ako ti dobavljač i dalje šalje uplatnice bez QR-a (ili sa lošim kvalitetom QR-a), [Uplatnica QR](/) ti pomaže da generišeš sopstveni QR i preskočiš OCR korak za sva svoja redovna plaćanja.

## Sledeći koraci

- Razumi [šta je IPS QR](/blog/sta-je-ips-qr-kod)
- Pogledaj [vodič za skeniranje po banci](/banke)
- [Generiši svoj prvi IPS QR](/) — registracija je besplatna
