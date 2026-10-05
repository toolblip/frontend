'use client';

import { useEffect, useState } from 'react';
import InstallMark from '@/components/v2/InstallMarks';
import { IconInstall } from '@/components/v2/icons';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import {
  PWA_INSTALL_DISMISS_KEY,
  PWA_INSTALL_OPEN_DELAY_MS,
  installDeviceOptions,
  installInstructions,
  installPromptPhase,
  type InstallBrowser,
  type InstallOs,
  type InstallTarget,
} from '@/lib/pwa-install';

export default function InstallAppPrompt() {
  const { installed, canPrompt, target, install } = usePwaInstall();
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [due, setDue] = useState(false);
  const [manuallyOpen, setManuallyOpen] = useState(false);
  const [picked, setPicked] = useState<InstallTarget | null>(null);

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

  const open = phase === 'open';
  const devices = installDeviceOptions(target);
  const selected = resolveSelection(picked, target, devices);
  const sameAsThisDevice = selected.os === target.os && selected.browser === target.browser;
  const guide = installInstructions(selected, canPrompt && sameAsThisDevice);

  const onDevice = (os: InstallOs) => {
    const device = devices.find((item) => item.os === os) ?? devices[0];
    const browser = device.browsers.some((item) => item.browser === selected.browser)
      ? selected.browser
      : device.browsers[0].browser;
    setPicked({ os, browser });
  };

  return (
    <div className="tb-pwa-install">
      {open ? (
        <aside className="tb-pwa-install-card" aria-label="Install Toolblip">
          <div className="tb-pwa-install-top">
            <button type="button" className="tb-pwa-install-close" aria-label="Close" onClick={close}>
              <span aria-hidden="true">×</span>
            </button>
            <div className="tb-pwa-install-heading">
              <IconInstall aria-hidden="true" />
              <p className="tb-pwa-install-title">Install Toolblip</p>
            </div>
            <p className="tb-pwa-install-here">{currentDeviceLine(target, devices)}</p>
          </div>
          <div className="tb-pwa-install-group">
            <p className="tb-pwa-install-group-label" id="tb-pwa-device-label">
              Device
            </p>
            <div className="tb-pwa-install-choices" role="radiogroup" aria-labelledby="tb-pwa-device-label">
              {devices.map((device) => (
                <button
                  key={device.os}
                  type="button"
                  role="radio"
                  aria-checked={selected.os === device.os}
                  className="tb-pwa-install-choice"
                  onClick={() => onDevice(device.os)}
                >
                  <InstallMark kind={device.os} />
                  {device.label}
                </button>
              ))}
            </div>
          </div>
          <div className="tb-pwa-install-group">
            <p className="tb-pwa-install-group-label" id="tb-pwa-browser-label">
              Browser
            </p>
            <div className="tb-pwa-install-choices" role="radiogroup" aria-labelledby="tb-pwa-browser-label">
              {devices
                .find((device) => device.os === selected.os)
                ?.browsers.map((browser) => (
                  <button
                    key={browser.browser}
                    type="button"
                    role="radio"
                    aria-checked={selected.browser === browser.browser}
                    className="tb-pwa-install-choice"
                    onClick={() => setPicked({ os: selected.os, browser: browser.browser })}
                  >
                    <InstallMark kind={browser.browser} />
                    {browser.label}
                  </button>
                ))}
            </div>
          </div>
          <ol className="tb-pwa-install-steps">
            {guide.steps.map((item) => (
              <li key={`${item.marks.join('>')}:${item.where}`}>
                <span className="tb-pwa-step-num" aria-hidden="true" />
                <div>
                  <p className="tb-pwa-step-marks">
                    {item.marks.map((mark, index) => (
                      <span key={mark} className="tb-pwa-step-piece">
                        {index > 0 ? (
                          <span className="tb-pwa-step-arrow" aria-hidden="true">
                            →
                          </span>
                        ) : null}
                        <span className="tb-pwa-step-mark">{mark}</span>
                      </span>
                    ))}
                  </p>
                  <p className="tb-pwa-step-where">{item.where}</p>
                </div>
              </li>
            ))}
          </ol>
          {guide.showNativeInstall ? (
            <button type="button" className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-sm" onClick={() => void install()}>
              <IconInstall aria-hidden="true" />
              Install
            </button>
          ) : null}
        </aside>
      ) : null}
      <button
        type="button"
        className="tb-pwa-install-chip"
        aria-expanded={open}
        onClick={() => (open ? close() : setManuallyOpen(true))}
      >
        <IconInstall aria-hidden="true" />
        Install app
      </button>
    </div>
  );
}

function currentDeviceLine(
  detected: InstallTarget,
  devices: ReturnType<typeof installDeviceOptions>,
): string {
  const device = devices.find((item) => item.os === detected.os);
  const browser = device?.browsers.find((item) => item.browser === detected.browser);
  if (!device || !browser) return "This is the browser you're using.";
  return `You're on ${device.label}, in ${browser.label}.`;
}

function resolveSelection(
  picked: InstallTarget | null,
  detected: InstallTarget,
  devices: ReturnType<typeof installDeviceOptions>,
): InstallTarget {
  const choice = picked ?? detected;
  const device = devices.find((item) => item.os === choice.os) ?? devices[0];
  const browser = device.browsers.some((item) => item.browser === choice.browser)
    ? choice.browser
    : device.browsers[0].browser;
  return { os: device.os, browser };
}
