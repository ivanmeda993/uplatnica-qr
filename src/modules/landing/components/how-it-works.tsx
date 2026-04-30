import { Camera, type LucideIcon, QrCode, Save } from 'lucide-react';

interface Step {
  n: number;
  icon: LucideIcon;
  title: string;
  body: string;
}

const STEPS: ReadonlyArray<Step> = [
  {
    n: 1,
    icon: Save,
    title: 'Sačuvaj uplatnicu jednom',
    body: 'Uneseš podatke (primalac, račun, šifra, poziv na broj) ili skeniraš postojeću papirnu uplatnicu. Sačuvaš kao šablon sa nazivom i bojom.',
  },
  {
    n: 2,
    icon: QrCode,
    title: 'Otvori i generiši QR',
    body: 'Sledeći put kad treba da platiš — otvoriš šablon, eventualno promeniš iznos, i NBS IPS QR se prikaže na ekranu za 2 sekunde.',
  },
  {
    n: 3,
    icon: Camera,
    title: 'Skeniraj sa svoje banke',
    body: 'Otvoriš mBank aplikaciju, izabereš plaćanje skeniranjem QR-a, i polja se automatski popune. Samo potvrdiš PIN-om.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="kako-radi"
      aria-labelledby="kako-radi-heading"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20"
    >
      <div className="mb-12 max-w-2xl">
        <p className="text-brand mb-3 text-xs font-semibold tracking-wider uppercase">Kako radi</p>
        <h2
          id="kako-radi-heading"
          className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          Tri koraka. Bez kucanja brojeva računa, bez fotografisanja, bez OCR grešaka.
        </h2>
      </div>

      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map(({ n, icon: Icon, title, body }) => (
          <li
            key={n}
            className="border-border bg-card shadow-card relative overflow-hidden rounded-3xl border p-6"
          >
            <div className="text-brand/15 font-display absolute -top-2 right-4 text-[6rem] leading-none font-bold select-none">
              {n}
            </div>
            <div className="bg-brand-soft text-brand relative flex size-12 items-center justify-center rounded-2xl">
              <Icon className="size-5" />
            </div>
            <h3 className="text-foreground relative mt-5 text-lg font-semibold tracking-tight">
              {title}
            </h3>
            <p className="text-muted-foreground relative mt-2 text-sm leading-relaxed">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
