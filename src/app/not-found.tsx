import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="bg-mesh-soft flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <Logo size={40} />
      <p className="mt-6 text-7xl font-semibold tracking-tight tabular-nums">404</p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight">Stranica ne postoji</h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm text-pretty">
        Možda je preimenovana ili više nije dostupna. Vrati se nazad i pokušaj iz menija.
      </p>
      <Button asChild variant="brand" className="mt-6">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Nazad na početnu
        </Link>
      </Button>
    </div>
  );
}
