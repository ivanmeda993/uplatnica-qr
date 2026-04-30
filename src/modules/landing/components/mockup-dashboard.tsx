import { ChevronRight, Plus, QrCode, Search } from 'lucide-react';

interface Template {
  name: string;
  category: string;
  amount: string;
  color: string;
}

const TEMPLATES: ReadonlyArray<Template> = [
  { name: 'EPS struja', category: 'Mesečni račun', amount: '4.230,00', color: 'bg-sky-400' },
  { name: 'SBB internet', category: 'Pretplata', amount: '2.890,00', color: 'bg-violet-400' },
  {
    name: 'Infostan',
    category: 'Komunalije',
    amount: '6.840,50',
    color: 'bg-emerald-400',
  },
  { name: 'Kirija stan', category: 'Mesečna', amount: '45.000,00', color: 'bg-rose-400' },
];

export function MockupDashboard() {
  return (
    <div className="relative px-4 pb-20">
      {/* Greeting */}
      <div className="pt-2 pb-4">
        <p className="text-muted-foreground text-[11px]">Dobro jutro</p>
        <h2 className="text-foreground text-lg font-semibold tracking-tight">Marko</h2>
      </div>

      {/* Search */}
      <div className="bg-muted text-muted-foreground mb-4 flex items-center gap-2 rounded-2xl px-3 py-2.5">
        <Search className="size-3.5" />
        <span className="text-[11px]">Pretraži uplatnice…</span>
      </div>

      {/* Templates list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 pb-1">
          <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
            Šabloni
          </span>
          <span className="text-brand text-[10px] font-semibold">{TEMPLATES.length}</span>
        </div>
        {TEMPLATES.map((t) => (
          <div
            key={t.name}
            className="border-border bg-card flex items-center gap-3 rounded-2xl border p-2.5"
          >
            <div className={'size-9 rounded-xl ' + t.color + ' flex items-center justify-center'}>
              <QrCode className="size-4 text-white/90" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-[12px] font-semibold">{t.name}</p>
              <p className="text-muted-foreground text-[10px]">{t.category}</p>
            </div>
            <div className="text-right">
              <p className="text-foreground text-[11px] font-semibold tabular-nums">{t.amount}</p>
              <p className="text-muted-foreground text-[9px]">RSD</p>
            </div>
            <ChevronRight className="text-muted-foreground size-3.5" />
          </div>
        ))}
      </div>

      {/* Tab bar (anchored to bottom of phone screen) */}
      <div className="border-border bg-background absolute right-0 bottom-0 left-0 flex items-center justify-around border-t px-4 pt-2 pb-3">
        <span className="text-foreground text-[9px] font-semibold">Početna</span>
        <span className="text-muted-foreground text-[9px]">Skener</span>
        <span className="text-muted-foreground text-[9px]">Istorija</span>
        <span className="text-muted-foreground text-[9px]">Profil</span>
      </div>

      {/* FAB sits above the tab bar, anchored to its top edge */}
      <div className="bg-brand absolute right-4 bottom-12 flex size-11 items-center justify-center rounded-2xl shadow-lg ring-4 ring-[var(--background)]">
        <Plus className="text-brand-foreground size-5" />
      </div>
    </div>
  );
}
