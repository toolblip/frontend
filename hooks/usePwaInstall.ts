'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  INSTALLED_DISPLAY_QUERY,
  detectInstallPlatform,
  isRunningAsInstalledApp,
  isThisWebAppInstalled,
  shouldHideInstallAfterPrompt,
  webAppManifestUrl,
  type InstallPlatform,
} from '@/lib/pwa-install';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export type PwaInstallMode = 'hidden' | 'prompt' | 'ios-tip';

function readIosStandalone(): boolean {
  return 'standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

async function readInstalledRelatedApps(): Promise<Array<{ platform?: string; url?: string }>> {
  const getter = (
    navigator as Navigator & {
      getInstalledRelatedApps?: () => Promise<Array<{ platform?: string; url?: string }>>;
    }
  ).getInstalledRelatedApps;
  if (typeof getter !== 'function') return [];
  try {
    return await getter.call(navigator);
  } catch {
    return [];
  }
}

/**
 * Chrome/Edge fire `beforeinstallprompt` when the app is installable.
 * iOS browsers have no prompt API — we surface Share → Add to Home Screen tips instead.
 * Standalone display and an already-installed Chromium app stay hidden.
 * Cancelling the native dialog keeps the install entry available.
 */
export function usePwaInstall() {
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<PwaInstallMode>('hidden');
  const [installed, setInstalled] = useState<boolean | null>(null);
  const [canPrompt, setCanPrompt] = useState(false);
  const [platform, setPlatform] = useState<InstallPlatform>('other');

  useEffect(() => {
    let cancelled = false;
    const detected = detectInstallPlatform({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints,
    });
    setPlatform(detected);

    const markInstalled = () => {
      deferred.current = null;
      setCanPrompt(false);
      setInstalled(true);
      setMode('hidden');
    };

    if (isRunningAsInstalledApp(window.matchMedia(INSTALLED_DISPLAY_QUERY).matches, readIosStandalone())) {
      markInstalled();
      return;
    }

    if (detected === 'ios-safari' || detected === 'ios-other') setMode('ios-tip');

    const onBip = (event: Event) => {
      event.preventDefault();
      deferred.current = event as BeforeInstallPromptEvent;
      setCanPrompt(true);
      setMode('prompt');
    };

    window.addEventListener('beforeinstallprompt', onBip);
    window.addEventListener('appinstalled', markInstalled);

    const manifestUrl = webAppManifestUrl(process.env.NEXT_PUBLIC_APP_URL);
    const pending = readInstalledRelatedApps();
    let relatedTimer = 0;
    const timed = new Promise<Array<{ platform?: string; url?: string }> | undefined>((resolve) => {
      relatedTimer = window.setTimeout(() => resolve(undefined), 1500);
      pending.then(
        (apps) => {
          window.clearTimeout(relatedTimer);
          resolve(apps);
        },
        () => {
          window.clearTimeout(relatedTimer);
          resolve(undefined);
        },
      );
    });
    void timed.then(async (apps) => {
      if (cancelled) return;
      if (apps && isThisWebAppInstalled(apps, manifestUrl)) {
        markInstalled();
        return;
      }
      setInstalled(false);
      if (apps !== undefined) return;
      const settled = await pending;
      if (cancelled) return;
      if (isThisWebAppInstalled(settled, manifestUrl)) markInstalled();
    });

    return () => {
      cancelled = true;
      window.clearTimeout(relatedTimer);
      window.removeEventListener('beforeinstallprompt', onBip);
      window.removeEventListener('appinstalled', markInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    const evt = deferred.current;
    if (!evt) return;
    try {
      await evt.prompt();
    } catch {
      deferred.current = null;
      setCanPrompt(false);
      return;
    }
    const choice = await evt.userChoice.catch(() => undefined);
    deferred.current = null;
    setCanPrompt(false);
    if (shouldHideInstallAfterPrompt(choice?.outcome)) {
      setInstalled(true);
      setMode('hidden');
    }
  }, []);

  return { mode, install, installed, canPrompt, platform };
}
