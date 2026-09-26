'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { browserPolicyKey } from '@/lib/browser-policy.mjs';

/** Root-layout lifetime: a client transition cannot change document headers. */
export default function BrowserPolicyBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const policy = browserPolicyKey(pathname, process.env.NEXT_PUBLIC_BASE_PATH);
  const documentPolicy = useRef(policy);
  const replacing = useRef(false);
  const needsDocument = policy !== documentPolicy.current;

  useEffect(() => {
    if (needsDocument && !replacing.current) {
      replacing.current = true;
      // Next has already committed the destination URL/history entry. Replace
      // that entry, preserving query/hash and Back, without adding a duplicate.
      window.location.replace(window.location.href);
    }
  }, [needsDocument]);

  // Both SSR and hydration render children on the initial route. On later
  // policy changes withhold them during render, before any child passive effect
  // can issue a request under the previous document's policy.
  return needsDocument ? null : children;
}
