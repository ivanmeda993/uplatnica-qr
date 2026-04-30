import '@/styles/globals.css';

import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'sonner';

import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Analytics } from '@/components/seo/analytics';
import { getSiteUrl, getVerificationCodes, SITE } from '@/lib/site';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'latin-ext'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.title,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'uplatnica QR',
    'IPS QR',
    'IPS QR online',
    'NBS QR kod',
    'NBS IPS QR',
    'QR generator Srbija',
    'IPS QR generator',
    'uplatnica generator',
    'generator uplatnica online',
    'kako napraviti IPS QR',
    'kako generisati QR za uplatnicu',
    'instant uplatnica QR',
    'besplatan QR generator',
    'QR za uplatnicu bez naloga',
    'QR bez registracije',
    'skeniraj uplatnicu',
    'IPS validator',
    'mobilno bankarstvo Srbija',
    'plaćanje računa QR',
    'kredit uplata QR',
    'struja uplata QR',
    'EPS uplatnica',
    'EPS QR',
    'infostan QR',
    'kirija QR',
    'porez QR',
    'Raiffeisen QR',
    'Komercijalna QR',
    'Banca Intesa QR',
    'NLB QR',
    'OTP QR',
    'PWA Srbija',
  ],
  applicationName: SITE.name,
  authors: [{ name: 'Uplatnica QR' }],
  creator: 'Uplatnica QR',
  publisher: 'Uplatnica QR',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE_URL,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: 'Uplatnica',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
  formatDetection: { telephone: false, email: false, address: false },
  category: 'finance',
  verification: getVerificationCodes(),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfcf8' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1224' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr-Latn-RS" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'bg-background text-foreground min-h-dvh font-sans antialiased'
        )}
      >
        <ThemeProvider>
          <QueryProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
            <Toaster
              position="top-center"
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  toast: 'rounded-2xl border-border-strong shadow-card-lg',
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
