'use client';

import { SerwistProvider } from '@serwist/turbopack/react';

export default function PwaProvider({ children }: { children: React.ReactNode }) {
  return (
    <SerwistProvider
      swUrl="/serwist/sw.js?v=3"
      disable={process.env.NODE_ENV === 'development'}
      cacheOnNavigation
      reloadOnOnline={false}
    >
      {children}
    </SerwistProvider>
  );
}
