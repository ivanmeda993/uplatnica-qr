import { CreditCard, Home, Lightbulb, type LucideIcon, Receipt, School, Wifi } from 'lucide-react';

interface UseCase {
  icon: LucideIcon;
  tag: string;
  title: string;
  example: string;
  color: string;
}

const CASES: ReadonlyArray<UseCase> = [
  {
    icon: CreditCard,
    tag: 'Mesečni krediti',
    title: 'Stambeni i gotovinski krediti',
    example: 'Šifra 277 · model 97 · poziv na broj kreditne partije',
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30',
  },
  {
    icon: Lightbulb,
    tag: 'Komunalije',
    title: 'Struja, voda, grejanje',
    example: 'EPS, JKP Vodovod, Beogradske elektrane — svaki mesec isto',
    color: 'text-sky-600 bg-sky-50 dark:bg-sky-900/30',
  },
  {
    icon: Wifi,
    tag: 'Pretplate',
    title: 'Internet, TV, mobilni',
    example: 'SBB, Yettel, MTS, Telenor — fiksna mesečna pretplata',
    color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/30',
  },
  {
    icon: Home,
    tag: 'Kirija',
    title: 'Stanarina i zajednička uprava',
    example: 'Plaćanje stanodavcu ili upravniku zgrade',
    color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/30',
  },
  {
    icon: Receipt,
    tag: 'Porez',
    title: 'Porez na imovinu i takse',
    example: 'Lokalna poreska administracija — kvartalne rate',
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30',
  },
  {
    icon: School,
    tag: 'Vrtić i škola',
    title: 'Vrtić, školarine, ekskurzije',
    example: 'Predškolska, privatne škole, fakulteti — isti račun po deci',
    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30',
  },
];

export function UseCases() {
  return (
    <section
      id="primeri"
      aria-labelledby="primeri-heading"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20"
    >
      <div className="mb-12 max-w-2xl">
        <p className="text-brand mb-3 text-xs font-semibold tracking-wider uppercase">
          Za šta ljudi koriste
        </p>
        <h2
          id="primeri-heading"
          className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          Sve što plaćaš jednom mesečno — sačuvaj jednom.
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CASES.map(({ icon: Icon, tag, title, example, color }) => (
          <div
            key={tag}
            className="border-border bg-card shadow-card hover:shadow-card-lg relative overflow-hidden rounded-2xl border p-5 transition-all"
          >
            <div className={'flex size-10 items-center justify-center rounded-xl ' + color}>
              <Icon className="size-5" />
            </div>
            <p className="text-muted-foreground mt-4 text-[11px] font-semibold tracking-wider uppercase">
              {tag}
            </p>
            <h3 className="text-foreground mt-1 text-base font-semibold tracking-tight">{title}</h3>
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{example}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
