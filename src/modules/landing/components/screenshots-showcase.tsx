import type { ReactNode } from 'react';

import { MockupDashboard } from './mockup-dashboard';
import { MockupGenerate } from './mockup-generate';
import { MockupScan } from './mockup-scan';
import { PhoneFrame } from './phone-frame';

interface MockupItem {
  label: string;
  caption: string;
  node: ReactNode;
}

const MOCKUPS: ReadonlyArray<MockupItem> = [
  {
    label: 'Početna',
    caption: 'Tvoji primaoci i poslednje uplatnice na jednom ekranu.',
    node: <MockupDashboard />,
  },
  {
    label: 'Generisanje',
    caption: 'NBS IPS QR sa svim poljima popunjen prema specifikaciji.',
    node: <MockupGenerate />,
  },
  {
    label: 'Skeniranje',
    caption: 'Uperi kameru na štampanu uplatnicu i polja se sama popune.',
    node: <MockupScan />,
  },
];

export function ScreenshotsShowcase() {
  return (
    <section
      id="kako-izgleda"
      aria-labelledby="kako-izgleda-heading"
      className="bg-mesh-soft border-border scroll-mt-24 border-y py-20"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 max-w-2xl">
          <p className="text-brand mb-3 text-xs font-semibold tracking-wider uppercase">
            Kako izgleda
          </p>
          <h2
            id="kako-izgleda-heading"
            className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Pravljeno prvo za telefon, radi i na laptopu.
          </h2>
        </div>

        <div className="grid items-end gap-10 md:grid-cols-3 md:gap-6">
          {MOCKUPS.map((m, i) => (
            <div
              key={m.label}
              className={
                'flex flex-col items-center ' + (i === 1 ? 'md:translate-y-0' : 'md:translate-y-6')
              }
            >
              <PhoneFrame label={m.label}>{m.node}</PhoneFrame>
              <p className="text-muted-foreground mt-3 max-w-[280px] text-center text-xs leading-relaxed">
                {m.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
