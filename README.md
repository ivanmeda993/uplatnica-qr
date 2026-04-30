# Uplatnica QR

Lična aplikacija za generisanje i skeniranje NBS IPS QR kodova za uplatnice u Srbiji.

- Sačuvaj redovne uplatnice (krediti, struja, voda…) kao šablone
- Generiši IPS QR kod koji svaka mBank skenira
- Skeniraj IPS QR sa tuđih računa i uvezi primaoca
- Sinhronizacija telefon ↔ laptop preko Better Auth + Postgres
- PWA — instaliraj na home screen telefona

## Stack

Next.js 16 + Elysia (mounted catch-all) + Prisma 7 + PostgreSQL + Better Auth + shadcn/ui + Tailwind v4.

## Quick start

```bash
cp .env.example .env.local
# popuni DATABASE_URL i BETTER_AUTH_SECRET (openssl rand -base64 32)

pnpm install
pnpm db:push
pnpm dev
```

Otvori http://localhost:3000.

## Komande

```bash
pnpm dev          # dev server (turbo)
pnpm build        # production build
pnpm start        # production server
pnpm typecheck    # TS bez emit-a
pnpm lint         # ESLint
pnpm format       # Prettier
pnpm db:studio    # Prisma Studio
pnpm db:migrate   # nova migracija
```

## Struktura

Vidi [AGENTS.md](AGENTS.md) za detaljan opis foldera, konvencija i NBS IPS QR specifikacije.

## NBS IPS QR

Implementacija prati zvaničnu specifikaciju [Narodne banke Srbije](https://ips.nbs.rs/). Polja, validacija i normalizacija su u `src/lib/ips-qr/`.

## Deploy

Render konfiguracija u `render.yaml`. Dockerfile za bilo koji drugi container host.
