---
title: 'Model 97 i poziv na broj — objašnjenje, kontrolna cifra i primeri'
description: 'Šta je model 97 u pozivu na broj, kako se računa kontrolna cifra (ISO 7064 MOD 97-10), zašto banka odbija plaćanje i kako da generišeš ispravan poziv na broj za EPS, Infostan, kredit ili porez.'
datePublished: '2026-04-30'
category: Objašnjenje
keywords:
  - model 97
  - poziv na broj
  - kontrolna cifra modela 97
  - mod 97 kalkulator
  - poziv na broj objašnjenje
---

**Model 97** je sistem provere ispravnosti poziva na broj koji koristi NBS po ISO 7064 (MOD 97-10) standardu. Pre poziva na broj se dodaje dvocifrena **kontrolna cifra** koja garantuje da poziv nije pogrešno otkucan ili oštećen.

Ako mBank aplikacija ili banka odbija tvoju uplatu sa porukom "neispravan poziv na broj" — najverovatnije je kontrolna cifra modela 97 pogrešna.

## Kako izgleda poziv na broj sa modelom 97

Format na uplatnici:

```
Model: 97
Poziv na broj: 84 1234567
```

Što se zapisuje u IPS QR-u kao:

```
RO:97 84 1234567
```

Pri čemu:

- `97` = oznaka modela (kontrola po MOD 97-10)
- `84` = **dvocifrena kontrolna cifra** (izračunata)
- `1234567` = tvoj **referentni broj** (ED broj, broj kredita, JMBG, broj polise...)

## Kako se kontrolna cifra računa

Algoritam je standardizovan:

1. Uzmi **referentni broj** (`1234567` u primeru)
2. Dodaj na kraj **`00`** (dva nula-mesta za buduću kontrolnu cifru)
3. Podeli ceo broj sa **97**
4. Uzmi **ostatak** deljenja
5. Oduzmi ostatak od **98**
6. Rezultat je dvocifrena kontrolna cifra (sa vodećom nulom ako treba)

### Primer korak-po-korak

Referentni broj: `1234567`

```
1. broj_sa_00 = 123456700
2. 123456700 mod 97 = 14
3. kontrolna_cifra = 98 - 14 = 84
4. Konačan poziv na broj = 97 84 1234567
```

### Pseudokod

```typescript
function mod97ControlDigit(reference: string): string {
  const padded = reference + '00';
  const remainder = BigInt(padded) % 97n;
  const control = 98n - remainder;
  return control.toString().padStart(2, '0');
}
```

Za referentne brojeve sa slovima ili separatorima (crtice, razmaci), prvo ih treba ukloniti, a slova zameniti brojevima po ISO 7064 mapi (A=10, B=11, ...). U praksi za srpske uplatnice referentni brojevi su uvek numerički.

## Kada se koristi model 97

Model 97 je **obavezan** za:

- **Plaćanje kredita** kod svih banaka u Srbiji
- **Plaćanje EPS struje** (osim u specifičnim slučajevima)
- **Plaćanje JKP usluga** (Vodovod, Toplane, Infostan)
- **Plaćanje poreza i javnih dažbina** (LPA, Republika)
- **Plaćanje vrtića i škola**
- **Plaćanje telekomunikacionih računa** (najveći operateri)

## Drugi modeli (kratko)

Pored modela 97, postoje:

| Model | Kontrola | Korišćenje |
|-------|----------|------------|
| `00` | Bez kontrole | Slobodan poziv na broj — kirija, prijatelji |
| `97` | MOD 97-10 | Najčešći — krediti, komunalije, porez |
| `11` | MOD 11 | Stari sistem, retko viđen |

Ako ne znaš koji model da koristiš, **pogledaj uplatnicu primaoca**. Banke i fakturni sistemi uvek štampaju model pored poziva na broj.

## Najčešće greške i poruke iz mBank aplikacija

### "Pogrešna kontrolna cifra"

Ako otkucaš poziv na broj sa pogrešnom kontrolnom cifrom, mBank aplikacije Raiffeisen-a, Komercijalne, Banca Intese i ostalih će odbiti uplatu pre nego što stigne do banke.

**Šta da uradiš**: dvostruko proveri da si tačno uneo kontrolnu cifru. Najčešće je sa starije/zgužvane uplatnice teško razlikovati `8` i `B`, ili `0` i `O`.

### "Poziv na broj nije ispravan"

Ako sva polja izgledaju OK ali se i dalje javlja greška:

1. Proveri da nisi greškom uneo razmak ili crticu unutar referentnog dela
2. Validiraj kontrolnu cifru manuelno (videti algoritam iznad) ili na našem [validatoru poziva na broj](/alat/sifre-placanja)
3. Ako je validno a banka i dalje odbija — kontaktiraj primaoca, možda je njihov sistem pogrešno generisao QR

### "Model nije podržan"

Neke starije mBank aplikacije podržavaju samo model 97. Ako uplatnica ima model 11 ili neki retki model, koristi standardno plaćanje umesto QR-a.

## Kako Uplatnica QR pomaže

Kada generišeš IPS QR kroz [Uplatnica QR](/), mi:

1. **Validiramo poziv na broj** pre generisanja QR-a
2. **Računamo kontrolnu cifru automatski** ako uneseš samo referentni broj sa modelom 97
3. **Odbijamo nepravilno otkucan poziv na broj** sa jasnom porukom

Tako se nikad ne dešava da generišeš QR koji banka ne može da skenira.

## Praktičan saveti

- **Sačuvaj uplatnicu jednom** — referenca po pravilu ostaje ista (npr. ED broj za EPS, kreditna partija). Sledeći put samo promeniš iznos.
- **Za kirije i privatne uplate** — koristi model `00` (bez kontrole) jer nemaš zvaničan referentni broj
- **Ako primaš uplate** (kao freelancer ili stanodavac) — generiši svojim klijentima IPS QR sa svojim računom i model `00 ime-meseca`. Lakše im je za plaćanje.

## Sledeći koraci

- Razumi [šta je IPS QR](/blog/sta-je-ips-qr-kod) ako tek počinješ
- Spisak svih [šifara plaćanja](/blog/sifre-placanja-srbija-spisak)
- [Generiši validan IPS QR sa automatskom MOD-97 proverom](/) — registracija je besplatna
