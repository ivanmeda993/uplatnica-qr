'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="sr-Latn-RS">
      <body
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '1rem',
          background: '#fdfcf8',
          color: '#101822',
        }}
      >
        <div
          style={{
            maxWidth: 420,
            textAlign: 'center',
            padding: '2rem',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '1.5rem',
            background: 'white',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            Aplikacija je nedostupna
          </h2>
          <p
            style={{
              marginTop: '0.5rem',
              marginBottom: '1.5rem',
              color: 'rgba(0,0,0,0.6)',
              fontSize: '0.875rem',
            }}
          >
            Osveži stranicu. Ako problem ne nestane, javi se sa kodom ispod.
          </p>
          {error.digest && (
            <code
              style={{
                display: 'block',
                padding: '0.5rem 0.75rem',
                background: 'rgba(0,0,0,0.05)',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              {error.digest}
            </code>
          )}
          <button
            onClick={reset}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '999px',
              background: '#0a1f1a',
              color: 'white',
              border: 'none',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Pokušaj ponovo
          </button>
        </div>
      </body>
    </html>
  );
}
