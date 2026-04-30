const BANKS = [
  'Raiffeisen',
  'Komercijalna',
  'Banca Intesa',
  'NLB',
  'OTP',
  'AIK',
  'ProCredit',
  'Erste',
  'UniCredit',
  'Eurobank Direktna',
  'Halkbank',
] as const;

export function SocialProof() {
  return (
    <section aria-label="Podržane banke" className="bg-muted/40 border-border border-y py-8">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-muted-foreground mb-5 text-center text-[11px] font-semibold tracking-wider uppercase">
          Radi sa svakom srpskom mBank aplikacijom
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {BANKS.map((bank) => (
            <span
              key={bank}
              className="border-border bg-card text-muted-foreground rounded-full border px-3 py-1.5 text-xs font-medium"
            >
              {bank}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
