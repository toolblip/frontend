'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  INSTALLED_DISPLAY_QUERY,
  detectInstallPlatform,
  isRunningAsInstalledApp,
  shouldHideInstallAfterPrompt,
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

/**
 * Chrome/Edge fire `beforeinstallprompt` when the app is installable.
 * iOS browsers have no prompt API — we surface Share → Add to Home Screen tips instead.
 * The corner hint hides only while this window is the installed app.
 * Cancelling the native dialog keeps the install entry available.
 */
export function usePwaInstall() {
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<PwaInstallMode>('hidden');
  const [installed, setInstalled] = useState<boolean | null>(null);
  const [canPrompt, setCanPrompt] = useState(false);
  const [platform, setPlatform] = useState<InstallPlatform>('other');

  useEffect(() => {
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

    setInstalled(false);
    if (detected === 'ios-safari' || detected === 'ios-other') setMode('ios-tip');

    const onBip = (event: Event) => {
      event.preventDefault();
      deferred.current = event as BeforeInstallPromptEvent;
      setCanPrompt(true);
      setMode('prompt');
    };

    window.addEventListener('beforeinstallprompt', onBip);
    window.addEventListener('appinstalled', markInstalled);

    return () => {
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
