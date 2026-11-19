'use client';

import { useSyncExternalStore } from 'react';
import {
  INSTALLED_DISPLAY_QUERY,
  detectInstallTarget,
  isRunningAsInstalledApp,
  shouldHideInstallAfterPrompt,
  type InstallTarget,
} from '@/lib/pwa-install';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

declare global {
  interface Window {
    /** Set by the inline script in app/layout.tsx, which runs before this bundle. */
    __tbBip?: BeforeInstallPromptEvent;
  }
}

export type PwaInstallMode = 'hidden' | 'prompt' | 'ios-tip';

type Snapshot = { installed: boolean | null; canPrompt: boolean; target: InstallTarget };

const SERVER_SNAPSHOT: Snapshot = {
  installed: null,
  canPrompt: false,
  target: { os: 'other', browser: 'other' },
};

// One store for every caller. The browser fires `beforeinstallprompt` once,
// early; a listener per component missed it whenever the component mounted
// later (the More menu row never appeared in Chrome or Edge).
let snapshot: Snapshot | null = null;
let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function update(patch: Partial<Snapshot>) {
  snapshot = { ...getSnapshot(), ...patch };
  listeners.forEach((listener) => listener());
}

function getSnapshot(): Snapshot {
  if (snapshot) return snapshot;

  const iosStandalone = Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  const installed = isRunningAsInstalledApp(
    window.matchMedia(INSTALLED_DISPLAY_QUERY).matches,
    iosStandalone,
  );
  deferred = installed ? null : (window.__tbBip ?? null);
  snapshot = {
    installed,
    canPrompt: deferred !== null,
    target: detectInstallTarget({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints,
    }),
  };

  if (!installed) {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferred = event as BeforeInstallPromptEvent;
      update({ canPrompt: true });
    });
    window.addEventListener('appinstalled', () => {
      deferred = null;
      update({ installed: true, canPrompt: false });
    });
  }
  return snapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

async function install() {
  const evt = deferred;
  if (!evt) return;
  // A prompt event works once. Cancelling keeps the install entry: Chrome
  // fires a fresh event later.
  deferred = null;
  update({ canPrompt: false });
  try {
    await evt.prompt();
  } catch {
    return;
  }
  const choice = await evt.userChoice.catch(() => undefined);
  if (shouldHideInstallAfterPrompt(choice?.outcome)) update({ installed: true });
}

/**
 * Chrome/Edge fire `beforeinstallprompt` when the app is installable.
 * iOS browsers have no prompt API - we surface Share → Add to Home Screen tips instead.
 * The corner hint hides only while this window is the installed app.
 */
export function usePwaInstall() {
  const { installed, canPrompt, target } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => SERVER_SNAPSHOT,
  );
  const mode: PwaInstallMode =
    installed !== false ? 'hidden' : canPrompt ? 'prompt' : target.os === 'ios' ? 'ios-tip' : 'hidden';

  return { mode, install, installed, canPrompt, target };
}
