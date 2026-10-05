import { describe, expect, it } from 'vitest';
import {
  PWA_INSTALL_DISMISS_KEY,
  PWA_INSTALL_OPEN_DELAY_MS,
  detectInstallTarget,
  installDeviceOptions,
  installInstructions,
  installPromptPhase,
  isRunningAsInstalledApp,
  isThisWebAppInstalled,
  shouldHideInstallAfterPrompt,
  webAppManifestUrl,
} from '@/lib/pwa-install';

const CHROME_MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const SAFARI_MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15';
const IPHONE_SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1';
const IPHONE_CHROME =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/128.0.6613.98 Mobile/15E148 Safari/604.1';
const FIREFOX_MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:130.0) Gecko/20100101 Firefox/130.0';

describe('installPromptPhase', () => {
  it('shows the button on a first visit before the card opens', () => {
    expect(
      installPromptPhase({
        installed: false,
        dismissed: false,
        elapsedMs: PWA_INSTALL_OPEN_DELAY_MS - 1,
      }),
    ).toBe('button');
  });

  it('opens the card once a minute has passed', () => {
    expect(
      installPromptPhase({
        installed: false,
        dismissed: false,
        elapsedMs: PWA_INSTALL_OPEN_DELAY_MS,
      }),
    ).toBe('open');
  });

  it('shows only the button after the card has been closed', () => {
    expect(
      installPromptPhase({
        installed: false,
        dismissed: true,
        elapsedMs: 0,
      }),
    ).toBe('button');
  });

  it('opens again when the button is used, without waiting', () => {
    expect(
      installPromptPhase({
        installed: false,
        dismissed: true,
        elapsedMs: 0,
        manuallyOpen: true,
      }),
    ).toBe('open');
  });

  it('hides every state once the app is installed', () => {
    expect(
      installPromptPhase({
        installed: true,
        dismissed: false,
        elapsedMs: PWA_INSTALL_OPEN_DELAY_MS,
        manuallyOpen: true,
      }),
    ).toBe('hidden');
  });
});

describe('install dismissal', () => {
  it('stores a permanent dismiss flag', () => {
    expect(PWA_INSTALL_DISMISS_KEY).toBe('tb_pwa_install_dismissed');
    expect(PWA_INSTALL_OPEN_DELAY_MS).toBe(60_000);
  });

  it('keeps the install UI when the native dialog is cancelled', () => {
    expect(shouldHideInstallAfterPrompt('dismissed')).toBe(false);
    expect(shouldHideInstallAfterPrompt(undefined)).toBe(false);
  });

  it('hides the install UI only after the native install is accepted', () => {
    expect(shouldHideInstallAfterPrompt('accepted')).toBe(true);
  });
});

describe('installed app detection', () => {
  it('treats standalone, minimal-ui, and fullscreen display as installed', () => {
    expect(isRunningAsInstalledApp(true, false)).toBe(true);
    expect(isRunningAsInstalledApp(false, true)).toBe(true);
    expect(isRunningAsInstalledApp(false, false)).toBe(false);
  });

  it('matches this site when Chromium reports the web app manifest', () => {
    const manifestUrl = webAppManifestUrl();
    expect(manifestUrl).toBe('https://toolblip.com/manifest.webmanifest');
    expect(webAppManifestUrl('https://preview.example/')).toBe(
      'https://preview.example/manifest.webmanifest',
    );
    expect(
      isThisWebAppInstalled(
        [{ platform: 'webapp', url: manifestUrl }],
        manifestUrl,
      ),
    ).toBe(true);
    expect(
      isThisWebAppInstalled([{ platform: 'webapp', url: 'https://other.example/manifest.webmanifest' }], manifestUrl),
    ).toBe(false);
  });
});

const EDGE_WINDOWS =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0';
const ANDROID_CHROME =
  'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36';
const ANDROID_SAMSUNG =
  'Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/128.0.0.0 Mobile Safari/537.36';
const CHROMEOS =
  'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

describe('detectInstallTarget', () => {
  it('pairs the browser with the operating system', () => {
    expect(detectInstallTarget({ userAgent: CHROME_MAC })).toEqual({ os: 'mac', browser: 'chrome' });
    expect(detectInstallTarget({ userAgent: SAFARI_MAC, platform: 'MacIntel', maxTouchPoints: 0 })).toEqual({
      os: 'mac',
      browser: 'safari',
    });
    expect(detectInstallTarget({ userAgent: SAFARI_MAC, platform: 'MacIntel', maxTouchPoints: 5 })).toEqual({
      os: 'ios',
      browser: 'safari',
    });
    expect(detectInstallTarget({ userAgent: IPHONE_SAFARI })).toEqual({ os: 'ios', browser: 'safari' });
    expect(detectInstallTarget({ userAgent: IPHONE_CHROME })).toEqual({ os: 'ios', browser: 'chrome' });
    expect(detectInstallTarget({ userAgent: FIREFOX_MAC })).toEqual({ os: 'mac', browser: 'firefox' });
    expect(detectInstallTarget({ userAgent: EDGE_WINDOWS })).toEqual({ os: 'windows', browser: 'edge' });
    expect(detectInstallTarget({ userAgent: ANDROID_CHROME })).toEqual({ os: 'android', browser: 'chrome' });
    expect(detectInstallTarget({ userAgent: ANDROID_SAMSUNG })).toEqual({ os: 'android', browser: 'samsung' });
    expect(detectInstallTarget({ userAgent: CHROMEOS })).toEqual({ os: 'chromeos', browser: 'chrome' });
  });
});

describe('installDeviceOptions', () => {
  it('lists every device and keeps the detected browser available', () => {
    const options = installDeviceOptions({ os: 'windows', browser: 'edge' });
    expect(options.map((device) => device.os)).toEqual(['ios', 'android', 'mac', 'windows', 'chromeos', 'linux']);
    expect(options.find((device) => device.os === 'ios')?.browsers.map((browser) => browser.browser)).toContain(
      'safari',
    );
    expect(options.find((device) => device.os === 'android')?.browsers.map((browser) => browser.browser)).toContain(
      'samsung',
    );
    expect(options.find((device) => device.os === 'windows')?.browsers.map((browser) => browser.browser)).toContain(
      'edge',
    );
  });

  it('adds an unknown device without dropping the rest', () => {
    const options = installDeviceOptions({ os: 'other', browser: 'other' });
    expect(options[0]).toMatchObject({ os: 'other', label: 'This device' });
    expect(options.map((device) => device.os)).toContain('mac');
  });
});

function stepText(steps: { parts: { text: string }[] }[]) {
  return steps.map((item) => item.parts.map((part) => part.text).join('')).join(' ');
}

describe('installInstructions', () => {
  it('gives Chrome on Mac the address-bar steps and a native button when the browser can prompt', () => {
    const manual = installInstructions({ os: 'mac', browser: 'chrome' }, false);
    expect(manual.label).toBe('Chrome on Mac');
    expect(stepText(manual.steps)).toMatch(/address bar/i);
    expect(stepText(manual.steps)).toMatch(/Install page as app/);
    expect(manual.showNativeInstall).toBe(false);
    expect(installInstructions({ os: 'mac', browser: 'chrome' }, true).showNativeInstall).toBe(true);
  });

  it('uses the phone or desktop path for the detected browser', () => {
    const iphone = stepText(installInstructions({ os: 'ios', browser: 'safari' }, false).steps);
    expect(iphone).toMatch(/Add to Home Screen/);
    expect(iphone).toMatch(/bottom/);
    expect(iphone).toMatch(/iPad/);
    const macSafari = stepText(installInstructions({ os: 'mac', browser: 'safari' }, false).steps);
    expect(macSafari).toMatch(/menu bar/);
    expect(macSafari).toMatch(/Apple logo/);
    expect(macSafari).toMatch(/Add to Dock/);
    expect(macSafari).toMatch(/row of app icons/);
    expect(stepText(installInstructions({ os: 'ios', browser: 'chrome' }, true).steps)).toMatch(/Safari/);
    expect(installInstructions({ os: 'ios', browser: 'chrome' }, true).showNativeInstall).toBe(false);
    expect(stepText(installInstructions({ os: 'windows', browser: 'edge' }, false).steps)).toMatch(/Apps/);
    expect(stepText(installInstructions({ os: 'android', browser: 'samsung' }, false).steps)).toMatch(/Home screen/);
    expect(stepText(installInstructions({ os: 'android', browser: 'chrome' }, false).steps)).toMatch(/Install app/);
    expect(stepText(installInstructions({ os: 'linux', browser: 'firefox' }, false).steps)).toMatch(/Chrome/);
    expect(stepText(installInstructions({ os: 'linux', browser: 'firefox' }, false).steps)).toMatch(/Edge/);
  });
});
