'use client';

import { useEffect, useState } from 'react';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import {
  PWA_INSTALL_DISMISS_KEY,
  PWA_INSTALL_OPEN_DELAY_MS,
  installInstructions,
  installPromptPhase,
} from '@/lib/pwa-install';

export default function InstallAppPrompt() {
  const { installed, canPrompt, platform, install } = usePwaInstall();
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [due, setDue] = useState(false);
  const [manuallyOpen, setManuallyOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(PWA_INSTALL_DISMISS_KEY) === '1';
    setDismissed(stored);
    setReady(true);
    if (stored) return;
    const timer = window.setTimeout(() => setDue(true), PWA_INSTALL_OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready || installed !== false) return null;

  const phase = installPromptPhase({
    installed: false,
    dismissed,
    elapsedMs: due ? PWA_INSTALL_OPEN_DELAY_MS : 0,
    manuallyOpen,
  });

  if (phase === 'hidden') return null;

  const close = () => {
    window.localStorage.setItem(PWA_INSTALL_DISMISS_KEY, '1');
    setDismissed(true);
    setManuallyOpen(false);
  };

  if (phase === 'button') {
    return (
      <div className="tb-pwa-install">
        <button type="button" className="tb-pwa-install-chip" onClick={() => setManuallyOpen(true)}>
          Install app
        </button>
      </div>
    );
  }

  const instructions = installInstructions(platform, canPrompt);

  return (
    <aside className="tb-pwa-install" aria-label="Install Toolblip">
      <div className="tb-pwa-install-card">
        <button
          type="button"
          className="tb-pwa-install-close"
          aria-label="Close install instructions"
          onClick={close}
        >
          <span aria-hidden="true">×</span>
        </button>
        <p className="tb-pwa-install-title">Install Toolblip</p>
        <p className="tb-pwa-install-body">{instructions.body}</p>
        {instructions.showNativeInstall ? (
          <button
            type="button"
            className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-sm"
            onClick={() => void install()}
          >
            Install
          </button>
        ) : null}
      </div>
    </aside>
  );
}
