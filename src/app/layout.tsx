import type { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import CookieBanner from '@/components/CookieBanner';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Toolblip — Free Online Developer Tools',
    template: '%s | Toolblip',
  },
  description:
    'Free browser-based tools: word counter, JSON formatter, Base64, URL encoder, UUID generator, and more. 100% client-side, no uploads, no account needed.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://toolblip.com'),
  openGraph: {
    type: 'website',
    siteName: 'Toolblip',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {process.env.NEXT_PUBLIC_BING_VERIFICATION_CODE ? (
          <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_VERIFICATION_CODE} />
        ) : null}
        <Script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var d=document.documentElement;var isDark=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(isDark)d.classList.add('dark');})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased transition-colors">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-green-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Script id="ga-consent-default" strategy="afterInteractive">
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
            ? `(function(){window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});})();`
            : ''}
        </Script>
        <Script id="ga-consent-loader" strategy="afterInteractive">
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
            ? `(function(){try{var m='${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}';function l(){if(window.__tbGaLoaded)return;window.__tbGaLoaded=true;var s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id='+m;s.async=true;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};window.gtag('js',new Date());window.gtag('config',m,{send_page_view:false});}function u(){window.gtag('consent','update',{analytics_storage:'granted'});window.gtag('event','page_view',{page_location:window.location.href,page_path:window.location.pathname+window.location.search});}if(localStorage.getItem('toolblip_cookie_consent')==='accepted'){l();u();}window.addEventListener('toolblip:analytics:enable',function(){l();u();});}catch(e){}})();`
            : ''}
        </Script>
        <CookieBanner />
      </body>
    </html>
  );
}
