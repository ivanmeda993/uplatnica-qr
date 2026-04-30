'use client';

import { LogOut, Monitor, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useTheme } from '@/components/providers/theme-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { signOut, useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  async function onSignOut() {
    await signOut();
    router.push('/login');
    router.refresh();
  }

  const themes = [
    { id: 'light', label: 'Svetla', icon: Sun },
    { id: 'dark', label: 'Tamna', icon: Moon },
    { id: 'system', label: 'Sistem', icon: Monitor },
  ] as const;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Podešavanja</h1>
        <p className="text-muted-foreground text-sm">Personalizuj iskustvo i upravljaj nalogom.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Nalog</CardTitle>
          <CardDescription>Sinhronizovano na svim uređajima preko ovog naloga.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-border bg-surface/60 space-y-3 rounded-xl border p-4 text-sm">
            <Row label="Email" value={session?.user?.email ?? '—'} mono />
            <Separator />
            <Row label="Ime" value={session?.user?.name ?? '—'} />
          </div>
          <Button variant="outline" onClick={onSignOut}>
            <LogOut className="size-4" />
            Odjavi se
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tema</CardTitle>
          <CardDescription>
            Vizuelni stil aplikacije. „Sistem” prati podešavanja uređaja.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => {
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all',
                    active
                      ? 'border-foreground/20 bg-brand-soft text-foreground shadow-card'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  aria-pressed={active}
                >
                  <t.icon className={cn('size-5', active && 'text-brand')} />
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O aplikaciji</CardTitle>
          <CardDescription>Lokalni alat za srpske uplatnice.</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p>
            <strong className="text-foreground">Uplatnica QR</strong> generiše i skenira NBS IPS QR
            kodove kompatibilne sa svakom mobilnom bankom u Srbiji.
          </p>
          <p>
            Verzija 0.1.0 · Specifikacija:{' '}
            <a
              className="text-foreground hover:text-brand"
              href="https://ips.nbs.rs/sr_lat/qr-validacija-generisanje"
              target="_blank"
              rel="noreferrer"
            >
              ips.nbs.rs
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn('truncate', mono && 'font-mono text-xs')}>{value}</dd>
    </div>
  );
}
