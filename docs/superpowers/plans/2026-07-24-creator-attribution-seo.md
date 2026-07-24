# Creator Attribution SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prirodno povezati Uplatnicu QR, njenog autora i portfolio kroz diskretne creator signale, ispravan JSON-LD i merljive crawlable linkove.

**Architecture:** Jedan centralni autor i jedan aktivni case study URL žive u `src/lib/site.ts`. Jedna client link komponenta dodaje Vercel Analytics događaj bez preuzimanja navigacije, dok server komponente zadržavaju postojeću strukturu stranica i dizajn sistem.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Schema.org JSON-LD, Vercel Web Analytics 2.0.1.

**Status:** Implemented, verified, uncommitted

## Global Constraints

- Ne menjati sadržaj blog članaka, glavni header ili primarni product funnel.
- Creator card prikazati samo na tri navedena najposećenija članka.
- Koristiti `https://ivanmilicevic.dev/#work` dok planirani case study URL vraća 404.
- Svi portfolio linkovi ostaju pravi `<a href>` linkovi sa jasnim focus stanjem.
- Analytics šalje `portfolio_referral_click` sa jednim od četiri zahtevana `placement` podatka i ne sprečava navigaciju.
- Ne dodavati dependency, modal, popup, sticky ponašanje, commit ili push.

---

### Task 1: Centralni autor, link i Analytics primitive

**Files:**

- Modify: `src/lib/site.ts`
- Create: `src/components/seo/tracked-portfolio-link.tsx`

**Interfaces:**

- Produces: `AUTHOR.id`, `AUTHOR.caseStudyUrl`, `AUTHOR.email`
- Produces: `TrackedPortfolioLink` sa `placement` vrednostima `article_creator`, `article_byline`, `about_project`, `footer_creator`

- [x] Dodati `https://ivanmilicevic.dev/#person`, provereni fallback case study URL i javni kontakt u centralni `AUTHOR` objekat.
- [x] Napraviti client `<a>` komponentu koja u `onClick` poziva `track('portfolio_referral_click', { placement })`.
- [x] Ne pozivati `preventDefault`; proslediti standardne anchor atribute da bi link ostao crawlable i pristupačan.

### Task 2: Blog creator signal i structured data

**Files:**

- Create: `src/components/blog/creator-card.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/lib/landing/jsonld.ts`

**Interfaces:**

- Consumes: `AUTHOR.caseStudyUrl` i `TrackedPortfolioLink`
- Produces: `CreatorCard`

- [x] Izgraditi diskretan responsive creator card od postojećih `Card` i `Button` komponenti sa traženim tekstom i sekundarnim kontekstom.
- [x] Renderovati card posle postojećeg product CTA bloka, pre povezanih članaka, samo za tri zahtevana sluga.
- [x] Zameniti byline anchor praćenim crawlable linkom, bez promene vidljivog teksta ili `rel` vrednosti.
- [x] Dodati isti Person `@id`, ime i URL u Article i SoftwareApplication identitet autora/creatora.

### Task 3: Stranica O projektu i footer

**Files:**

- Create: `src/app/o-projektu/page.tsx`
- Modify: `src/modules/landing/components/landing-footer.tsx`
- Modify: `src/app/sitemap.ts`

**Interfaces:**

- Consumes: centralni `AUTHOR`, `TrackedPortfolioLink`, postojeći `SiteShell`

- [x] Napraviti `/o-projektu` sa potvrđenim product problemom, privatnošću, lokalnim/offline principima, tehničkim pregledom, autorstvom i kontaktom.
- [x] Dodati jedinstvene metadata, canonical i OpenGraph podatke, plus breadcrumb JSON-LD.
- [x] Dodati link u footer Resources grupu i uključiti stranicu u sitemap.
- [x] Zameniti postojeći footer creator anchor praćenim crawlable linkom.

### Task 4: Verifikacija i dokaz

**Files:**

- Modify: `docs/superpowers/plans/2026-07-24-creator-attribution-seo.md`

- [x] Pokrenuti format check nad izmenjenim fajlovima, `pnpm lint`, `pnpm typecheck`, `pnpm build` i React Doctor.
- [x] Pokrenuti aplikaciju i proveriti creator card i `/o-projektu` na desktop i mobile viewportima.
- [x] Kliknuti nove portfolio linkove, proveriti finalne HTTP statuse, browser konzolu i horizontalni overflow.
- [x] Iz renderovanog DOM-a pročitati `script[type="application/ld+json"]` i potvrditi Person identitet.
- [x] Sačuvati desktop i mobile screenshots, pregledati finalni diff i ažurirati status/progress log.

## Progress log

- 2026-07-24: Git tree potvrđen kao čist. Planirani case study URL vraća 404, a fallback `https://ivanmilicevic.dev/#work` vraća 200.
- 2026-07-24: Centralni autor i tracked crawlable link su implementirani, bez novih dependencyja. Focused ESLint i TypeScript provera prolaze.
- 2026-07-24: Creator card je dodat samo na tri zahtevana članka, byline je instrumentiran, a Article, SoftwareApplication i Organization koriste isti Person `@id`. Focused ESLint i TypeScript provera prolaze.
- 2026-07-24: `/o-projektu` je dodat sa metadata, OpenGraph, canonical i breadcrumb podacima. Footer i sitemap su povezani, a portfolio i footer creator linkovi se mere. Focused ESLint i TypeScript provera prolaze.
- 2026-07-24: Finalna verifikacija prolazi: Prettier, 62 testa, TypeScript, production build i browser QA. ESLint ima 0 grešaka i 59 pre-existing upozorenja. React Doctor je 96/100 sa jednim pre-existing performance upozorenjem u `sitemap.ts`. Desktop i mobile nemaju horizontalni overflow, konzola nema error/warn poruke, svi novi portfolio linkovi otvaraju HTTP 200 destinaciju i renderovani JSON-LD koristi isti Person identitet kao vidljivi autor.
