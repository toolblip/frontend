'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function Analytics({ measurementId }: { measurementId?: string }) {
  useEffect(() => {
    const grant = () => {
      const gtag = (window as Window & { gtag?: (...args: any[]) => void }).gtag;
      gtag?.('consent', 'update', { analytics_storage: 'granted' });
    };

    window.addEventListener('toolblip:analytics:enable', grant);
    return () => window.removeEventListener('toolblip:analytics:enable', grant);
  }, []);

  if (!measurementId) return null;

  // Consent default must be queued before config; returning visitors who accepted start granted.
  // SPA navigations are tracked by GA4 enhanced measurement (browser history events).
  return (
    <>
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function(){dataLayer.push(arguments);};
        var accepted = false;
        try { accepted = localStorage.getItem('toolblip_cookie_consent') === 'accepted'; } catch (e) {}
        window.gtag('consent', 'default', {
          analytics_storage: accepted ? 'granted' : 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
        window.gtag('js', new Date());
        window.gtag('config', '${measurementId}');`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
    </>
  );
}
