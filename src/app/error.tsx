'use client';

import { CircleAlert, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="bg-mesh-soft flex min-h-dvh items-center justify-center px-5">
      <div className="border-border bg-card shadow-card-lg max-w-md space-y-5 rounded-3xl border p-8 text-center">
        <div className="bg-destructive/10 text-destructive mx-auto flex size-12 items-center justify-center rounded-2xl">
          <CircleAlert className="size-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">Nešto je pošlo po zlu</h2>
          <p className="text-muted-foreground text-sm">
            Pokušaj ponovo. Ako problem ne nestane, javi se i pošalji kod ispod.
          </p>
        </div>
        {error.digest && (
          <code className="border-border bg-muted text-muted-foreground block rounded-xl border px-3 py-2 text-left font-mono text-[11px]">
            {error.digest}
          </code>
        )}
        <Button variant="brand" onClick={reset} className="w-full">
          <RotateCcw className="size-4" />
          Pokušaj ponovo
        </Button>
      </div>
    </div>
  );
}
