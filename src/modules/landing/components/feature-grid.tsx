import { Camera, Cloud, type LucideIcon,Moon, QrCode, Users, WifiOff } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: ReadonlyArray<Feature> = [
  {
    icon: Users,
    title: 'Šabloni sa bojama',
    description:
      'Raiffeisen kredit, EPS struja, SBB internet — svaka uplatnica sačuvana sa nazivom, bojom i kategorijom.',
  },
  {
    icon: QrCode,
    title: 'NBS IPS QR u sekundi',
    description:
      'Validan format prema NBS specifikaciji (max 331 bajt, ECC level M). Radi sa svakom srpskom mBank aplikacijom.',
  },
  {
    icon: Camera,
    title: 'Skeniranje kamerom',
    description:
      'Dobio si štampanu uplatnicu? Uperi kameru — polja se automatski parsiraju i popune u formi.',
  },
  {
    icon: Cloud,
    title: 'Sinhronizacija',
    description:
      'Prijaviš se istim nalogom na telefonu, tabletu i računaru. Uplatnice idu sa tobom svuda.',
  },
  {
    icon: WifiOff,
    title: 'Radi offline',
    description:
      'PWA aplikacija — instalirana na telefon generiše QR i bez interneta. Dodaj na Home Screen i imaš ikonicu.',
  },
  {
    icon: Moon,
    title: 'Light i dark mode',
    description:
      'Lepo izgleda u oba moda. Prati sistemsku temu ili biraš ručno. Visok kontrast za čitljivost po danu i noću.',
  },
];

export function FeatureGrid() {
  return (
    <section
      id="funkcionalnosti"
      aria-labelledby="funkcionalnosti-heading"
      className="bg-mesh-soft border-border scroll-mt-24 border-y py-20"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 max-w-2xl">
          <p className="text-brand mb-3 text-xs font-semibold tracking-wider uppercase">
            Funkcionalnosti
          </p>
          <h2
            id="funkcionalnosti-heading"
            className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Sve što ti treba — ništa što ti ne treba.
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Bez reklama, bez analitike koja te prati, bez pretplata. Aplikacija pravi tačno jednu
            stvar i pravi je dobro.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description }: Feature) {
  return (
    <div className="group border-border bg-card shadow-card hover:shadow-card-lg relative overflow-hidden rounded-2xl border p-6 transition-all">
      <div className="bg-brand-soft text-brand flex size-11 items-center justify-center rounded-2xl">
        <Icon className="size-5" />
      </div>
      <h3 className="text-foreground mt-4 text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
