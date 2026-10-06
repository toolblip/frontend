'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { hashFromFields, readHash } from '@/lib/tool-hash';

export function useToolHash(
  fields: Record<string, string>,
  apply: (params: URLSearchParams) => void,
) {
  const applyRef = useRef(apply);
  applyRef.current = apply;
  const [ready, setReady] = useState(false);
  const serialized = hashFromFields(fields);

  useLayoutEffect(() => {
    const params = readHash(window.location.hash);
    if (params) applyRef.current(params);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const nextUrl = `${window.location.pathname}${window.location.search}#${serialized}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (currentUrl !== nextUrl) window.history.replaceState(null, '', nextUrl);
  }, [ready, serialized]);
}
