'use client';

import { useEffect } from 'react';
import { SerwistProvider } from '@serwist/turbopack/react';

const SW_URL = '/serwist/sw.js?v=3';

/** Drop any registration that isn't the current SW URL so year-CDN-cached
 * `/serwist/sw.js` (no query) can't keep controlling the page after deploys. */
function useDropStaleServiceWorkers() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV === 'development') return;

    let cancelled = false;
    navigator.serviceWorker.getRegistrations().then((regs) => {
      if (cancelled) return;
      for (const reg of regs) {
        const url =
          reg.active?.scriptURL || reg.waiting?.scriptURL || reg.installing?.scriptURL || '';
        if (!url) continue;
        try {
          const { pathname, search } = new URL(url);
          if (`${pathname}${search}` !== SW_URL) void reg.unregister();
        } catch {
          void reg.unregister();
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);
}

export default function PwaProvider({ children }: { children: React.ReactNode }) {
  useDropStaleServiceWorkers();

  return (
    <SerwistProvider
      swUrl={SW_URL}
      disable={process.env.NODE_ENV === 'development'}
      cacheOnNavigation
      reloadOnOnline={false}
    >
      {children}
    </SerwistProvider>
  );
}
