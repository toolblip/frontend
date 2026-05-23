'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function Analytics({ measurementId }: { measurementId?: string }) {
  useEffect(() => {
    const syncConsent = () => {
      const gtag = (window as Window & { gtag?: (...args: any[]) => void }).gtag;
      if (!gtag) return;
      gtag('consent', 'update', { analytics_storage: 'granted' });
      gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: window.location.pathname + window.location.search,
      });
    };

    const consent = localStorage.getItem('toolblip_cookie_consent');
    if (consent === 'accepted') {
      syncConsent();
    }

    window.addEventListener('toolblip:analytics:enable', syncConsent);
    return () => window.removeEventListener('toolblip:analytics:enable', syncConsent);
  }, []);

  if (!measurementId) return null;

  return (
    <>
      <Script id="ga-bootstrap" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function(){dataLayer.push(arguments);};
        window.gtag('consent', 'default', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function(){dataLayer.push(arguments);};
        window.gtag('js', new Date());
        window.gtag('config', '${measurementId}', { send_page_view: false });`}
      </Script>
    </>
  );
}
