'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** False during SSR and hydration, true after; avoids a setState-in-effect mounted flag. */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
