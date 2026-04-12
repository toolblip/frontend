'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Check if analytics were already consented
    const consent = localStorage.getItem('toolblip_cookie_consent');
    if (consent === 'accepted') {
      setEnabled(true);
      return;
    }

    // Listen for the accept event from CookieBanner
    function onEnable() {
      setEnabled(true);
    }

    window.addEventListener('toolblip:analytics:enable', onEnable);
    return () => window.removeEventListener('toolblip:analytics:enable', onEnable);
  }, []);

  if (!enabled || !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga4" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
