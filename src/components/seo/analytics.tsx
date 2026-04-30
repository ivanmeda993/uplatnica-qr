import Script from 'next/script';

import { getAnalytics } from '@/lib/site';

export function Analytics() {
  const { plausibleDomain, plausibleScriptUrl, gaMeasurementId } = getAnalytics();

  return (
    <>
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src={plausibleScriptUrl}
          strategy="afterInteractive"
        />
      )}

      {gaMeasurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
    </>
  );
}
