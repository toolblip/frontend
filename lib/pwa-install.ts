export const PWA_INSTALL_DISMISS_KEY = 'tb_pwa_install_dismissed';
export const PWA_INSTALL_OPEN_DELAY_MS = 60_000;
export const INSTALLED_DISPLAY_QUERY =
  '(display-mode: standalone), (display-mode: minimal-ui), (display-mode: fullscreen)';

export type InstallPromptPhase = 'hidden' | 'open' | 'button';
export type InstallOs = 'ios' | 'android' | 'mac' | 'windows' | 'chromeos' | 'linux' | 'other';
export type InstallBrowser = 'safari' | 'chrome' | 'edge' | 'firefox' | 'opera' | 'samsung' | 'other';
export type InstallTarget = { os: InstallOs; browser: InstallBrowser };
export type InstallPromptOutcome = 'accepted' | 'dismissed';
export type InstallInstructions = {
  label: string;
  steps: string[];
  showNativeInstall: boolean;
};

export function installPromptPhase(input: {
  installed: boolean;
  dismissed: boolean;
  elapsedMs: number;
  manuallyOpen?: boolean;
}): InstallPromptPhase {
  if (input.installed) return 'hidden';
  if (input.manuallyOpen) return 'open';
  if (!input.dismissed && input.elapsedMs >= PWA_INSTALL_OPEN_DELAY_MS) return 'open';
  return 'button';
}

export function shouldHideInstallAfterPrompt(outcome: InstallPromptOutcome | undefined): boolean {
  return outcome === 'accepted';
}

export function isRunningAsInstalledApp(displayModeMatches: boolean, iosStandalone: boolean): boolean {
  return displayModeMatches || iosStandalone;
}

export function webAppManifestUrl(origin?: string): string {
  const base = (origin && origin.trim()) || 'https://toolblip.com';
  return `${base.replace(/\/$/, '')}/manifest.webmanifest`;
}

export function isThisWebAppInstalled(
  apps: ReadonlyArray<{ platform?: string; url?: string }>,
  manifestUrl: string,
): boolean {
  return apps.some((app) => app.platform === 'webapp' && app.url === manifestUrl);
}

const BROWSER_LABEL: Record<InstallBrowser, string> = {
  safari: 'Safari',
  chrome: 'Chrome',
  edge: 'Edge',
  firefox: 'Firefox',
  opera: 'Opera',
  samsung: 'Samsung Internet',
  other: 'Your browser',
};

const OS_LABEL: Record<InstallOs, string> = {
  ios: 'iPhone or iPad',
  android: 'Android',
  mac: 'Mac',
  windows: 'Windows',
  chromeos: 'Chromebook',
  linux: 'Linux',
  other: 'this device',
};

function detectBrowser(ua: string): InstallBrowser {
  if (/Edg\/|EdgA|EdgiOS/.test(ua)) return 'edge';
  if (/OPR\/|Opera|OPiOS/.test(ua)) return 'opera';
  if (/SamsungBrowser/.test(ua)) return 'samsung';
  if (/Firefox|FxiOS/.test(ua)) return 'firefox';
  if (/Chrome|Chromium|CriOS/.test(ua)) return 'chrome';
  if (/Safari/.test(ua)) return 'safari';
  return 'other';
}

function detectOs(input: { userAgent: string; platform?: string; maxTouchPoints?: number }): InstallOs {
  const ua = input.userAgent;
  const ios =
    /iPad|iPhone|iPod/.test(ua) ||
    (input.platform === 'MacIntel' && (input.maxTouchPoints ?? 0) > 1);
  if (ios) return 'ios';
  if (/Android/.test(ua)) return 'android';
  if (/CrOS/.test(ua)) return 'chromeos';
  if (/Macintosh|Mac OS X/.test(ua)) return 'mac';
  if (/Windows/.test(ua)) return 'windows';
  if (/Linux/.test(ua)) return 'linux';
  return 'other';
}

export function detectInstallTarget(input: {
  userAgent: string;
  platform?: string;
  maxTouchPoints?: number;
}): InstallTarget {
  return { os: detectOs(input), browser: detectBrowser(input.userAgent) };
}

function desktopInstallSteps(browser: InstallBrowser, os: InstallOs): string[] {
  if (browser === 'safari' && os === 'mac') {
    return ['In the menu bar, choose File.', 'Choose Add to Dock.'];
  }
  if (browser === 'edge') {
    return [
      'Look for the install icon in the address bar.',
      'If it is missing, open the Edge menu, choose Apps, then Install this site as an app.',
    ];
  }
  if (browser === 'chrome' || browser === 'opera') {
    const menu = browser === 'opera' ? 'Opera' : 'Chrome';
    return [
      'Look for the install icon in the address bar.',
      `If it is missing, open the ${menu} menu and choose Install Toolblip.`,
    ];
  }
  if (browser === 'firefox') {
    if (os === 'mac') {
      return [
        'Firefox on Mac does not install sites as apps.',
        'Open this page in Chrome or Edge, or use Safari and choose File, then Add to Dock.',
      ];
    }
    return [
      'Firefox does not install sites as apps.',
      'Open this page in Chrome or Edge and use the install icon in the address bar.',
    ];
  }
  return ['Open the browser menu and choose Install app or Add to Home Screen.'];
}

function phoneInstallSteps(os: InstallOs, browser: InstallBrowser): string[] {
  if (os === 'ios' && browser === 'safari') {
    return ['Tap the Share button.', 'Tap Add to Home Screen.', 'Tap Add.'];
  }
  if (os === 'ios') {
    return [
      'Open this page in Safari. Other iPhone and iPad browsers cannot add the icon.',
      'Tap Share, then Add to Home Screen.',
    ];
  }
  if (browser === 'samsung') {
    return ['Tap the menu.', 'Tap Add page to, then Home screen.'];
  }
  if (browser === 'firefox') {
    return ['Tap the menu.', 'Tap Install.'];
  }
  if (browser === 'edge') {
    return ['Tap the menu.', 'Tap Add to phone, or Apps, then Install this site as an app.'];
  }
  if (browser === 'chrome' || browser === 'opera') {
    return ['Tap the three-dot menu.', 'Tap Install app or Add to Home screen.', 'Confirm the install.'];
  }
  return ['Open the browser menu.', 'Choose Install app or Add to Home screen.'];
}

export function installInstructions(target: InstallTarget, canPrompt: boolean): InstallInstructions {
  const browser = BROWSER_LABEL[target.browser];
  const os = OS_LABEL[target.os];
  const phone = target.os === 'ios' || target.os === 'android';
  const steps = phone ? phoneInstallSteps(target.os, target.browser) : desktopInstallSteps(target.browser, target.os);
  const nativeBrowser = target.browser === 'chrome' || target.browser === 'edge' || target.browser === 'opera';
  return {
    label: `${browser} on ${os}`,
    steps,
    showNativeInstall: canPrompt && nativeBrowser && target.os !== 'ios',
  };
}
