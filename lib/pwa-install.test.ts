import { describe, expect, it } from 'vitest';
import {
  PWA_INSTALL_DISMISS_KEY,
  PWA_INSTALL_OPEN_DELAY_MS,
  detectInstallPlatform,
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
  it('stays hidden until a full minute on a first visit', () => {
    expect(
      installPromptPhase({
        installed: false,
        dismissed: false,
        elapsedMs: PWA_INSTALL_OPEN_DELAY_MS - 1,
      }),
    ).toBe('hidden');
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

describe('detectInstallPlatform', () => {
  it('recognizes Chromium, iOS Safari, iOS Chrome, Mac Safari, and everyone else', () => {
    expect(detectInstallPlatform({ userAgent: CHROME_MAC })).toBe('chromium');
    expect(detectInstallPlatform({ userAgent: IPHONE_SAFARI })).toBe('ios-safari');
    expect(detectInstallPlatform({ userAgent: IPHONE_CHROME })).toBe('ios-other');
    expect(detectInstallPlatform({ userAgent: SAFARI_MAC, platform: 'MacIntel', maxTouchPoints: 0 })).toBe(
      'mac-safari',
    );
    expect(
      detectInstallPlatform({ userAgent: SAFARI_MAC, platform: 'MacIntel', maxTouchPoints: 5 }),
    ).toBe('ios-safari');
    expect(detectInstallPlatform({ userAgent: FIREFOX_MAC })).toBe('other');
  });
});

describe('installInstructions', () => {
  it('offers the native install button only when Chromium can prompt', () => {
    expect(installInstructions('chromium', true)).toEqual({
      body: 'Install Toolblip for quick access, even when you are offline.',
      showNativeInstall: true,
    });
    expect(installInstructions('chromium', false).showNativeInstall).toBe(false);
    expect(installInstructions('chromium', false).body).toMatch(/address bar/i);
  });

  it('tells iOS visitors how to add the home screen icon', () => {
    expect(installInstructions('ios-safari', false).body).toBe('Tap Share, then Add to Home Screen.');
    expect(installInstructions('ios-other', false).body).toMatch(/Safari/);
    expect(installInstructions('mac-safari', false).body).toBe('Choose File, then Add to Dock.');
    expect(installInstructions('other', false).body).toMatch(/Install app or Add to Home Screen/);
  });
});
