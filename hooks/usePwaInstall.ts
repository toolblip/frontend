'use client';

import { useEffect, useRef, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export type PwaInstallMode = 'hidden' | 'prompt' | 'ios-tip';

function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false;
  const mq = window.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone = 'standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return mq || iosStandalone;
}

function isIosBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/**
 * Chrome/Edge fire `beforeinstallprompt` when the app is installable.
 * iOS browsers have no prompt API — we surface Share → Add to Home Screen tips instead.
 * Already-installed (standalone) and unsupported browsers stay hidden.
 */
export function usePwaInstall() {
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<PwaInstallMode>('hidden');

  useEffect(() => {
    if (isStandaloneDisplay()) {
      setMode('hidden');
      return;
    }

    if (isIosBrowser()) {
      setMode('ios-tip');
      return;
    }

    const onBip = (e: Event) => {
      e.preventDefault();
      deferred.current = e as BeforeInstallPromptEvent;
      setMode('prompt');
    };
    const onInstalled = () => {
      deferred.current = null;
      setMode('hidden');
    };

    window.addEventListener('beforeinstallprompt', onBip);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBip);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async () => {
    const evt = deferred.current;
    if (!evt) return;
    await evt.prompt();
    await evt.userChoice.catch(() => undefined);
    deferred.current = null;
    setMode('hidden');
  };

  return { mode, install };
}
