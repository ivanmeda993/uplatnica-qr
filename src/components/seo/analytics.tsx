import { GoogleAnalytics } from '@next/third-parties/google';
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

      {gaMeasurementId && <GoogleAnalytics gaId={gaMeasurementId} />}
    </>
  );
}
