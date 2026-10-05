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
  other: 'This device',
};

export type InstallDeviceOption = {
  os: InstallOs;
  label: string;
  browsers: { browser: InstallBrowser; label: string }[];
};

const INSTALL_DEVICES: { os: InstallOs; browsers: InstallBrowser[] }[] = [
  { os: 'ios', browsers: ['safari', 'chrome', 'edge', 'firefox', 'opera'] },
  { os: 'android', browsers: ['chrome', 'samsung', 'edge', 'firefox', 'opera'] },
  { os: 'mac', browsers: ['safari', 'chrome', 'edge', 'firefox', 'opera'] },
  { os: 'windows', browsers: ['chrome', 'edge', 'firefox', 'opera'] },
  { os: 'chromeos', browsers: ['chrome'] },
  { os: 'linux', browsers: ['chrome', 'edge', 'firefox', 'opera'] },
];

export function installDeviceOptions(detected: InstallTarget): InstallDeviceOption[] {
  const options: InstallDeviceOption[] = INSTALL_DEVICES.map((device) => ({
    os: device.os,
    label: OS_LABEL[device.os],
    browsers: device.browsers.map((browser) => ({ browser, label: BROWSER_LABEL[browser] })),
  }));
  const match = options.find((device) => device.os === detected.os);
  if (!match) {
    return [
      {
        os: detected.os,
        label: OS_LABEL[detected.os],
        browsers: [{ browser: detected.browser, label: BROWSER_LABEL[detected.browser] }],
      },
      ...options,
    ];
  }
  if (!match.browsers.some((browser) => browser.browser === detected.browser)) {
    match.browsers = [{ browser: detected.browser, label: BROWSER_LABEL[detected.browser] }, ...match.browsers];
  }
  return options;
}

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
    return [
      'In the menu bar at the top of the screen, open File.',
      'Choose Add to Dock.',
      'Toolblip shows up in the Dock. Open it from there the same way you open any other app.',
    ];
  }
  if (browser === 'edge') {
    return [
      'At the right end of the address bar, click the install icon. It looks like a screen with a plus.',
      "If it isn't there, open the Edge menu, choose Apps, then Install this site as an app.",
      'Click Install. After that, Toolblip opens in its own window.',
    ];
  }
  if (browser === 'chrome' || browser === 'opera') {
    const fallback =
      browser === 'opera'
        ? "If you don't see the icon, open the Opera menu and choose Install Toolblip."
        : "If you don't see the icon, open the Chrome menu, choose Cast, save, and share, then Install page as app.";
    return [
      'At the right end of the address bar, click the install icon. It looks like a small screen with a down arrow.',
      'Click Install.',
      fallback,
    ];
  }
  if (browser === 'firefox') {
    if (os === 'mac') {
      return [
        "Firefox can't add Toolblip to the Dock.",
        'Open this page in Chrome or Edge and use the install icon in the address bar.',
        'Or open it in Safari, then choose File, then Add to Dock.',
      ];
    }
    return [
      "Firefox can't install Toolblip as an app.",
      'Open this page in Chrome or Edge.',
      'Use the install icon at the right end of the address bar.',
    ];
  }
  return [
    'Open the browser menu.',
    'Look for Install app, Add to Home Screen, or Add to Dock.',
    'Confirm, and Toolblip keeps its own icon.',
  ];
}

function phoneInstallSteps(os: InstallOs, browser: InstallBrowser): string[] {
  if (os === 'ios' && browser === 'safari') {
    return [
      "Tap the Share button. It's the square with an arrow pointing up, at the bottom of Safari.",
      'Scroll the share sheet and tap Add to Home Screen.',
      'Tap Add. The Toolblip icon lands on your Home Screen.',
    ];
  }
  if (os === 'ios') {
    return [
      'iPhone and iPad only add a Home Screen icon from Safari.',
      'Open Safari, go to toolblip.com, and tap the Share button.',
      'Tap Add to Home Screen, then Add.',
    ];
  }
  if (browser === 'samsung') {
    return [
      'Tap the menu button at the bottom right.',
      'Tap Add page to, then Home screen.',
      'Tap Add. The icon shows up on your home screen.',
    ];
  }
  if (browser === 'firefox') {
    return ['Tap the menu button.', 'Tap Install.', 'Confirm, and the Toolblip icon is added to your home screen.'];
  }
  if (browser === 'edge') {
    return [
      'Tap the menu button at the bottom.',
      'Tap Add to phone.',
      'If you see Apps instead, tap Install this site as an app.',
    ];
  }
  if (browser === 'chrome' || browser === 'opera') {
    return [
      'Tap the three-dot menu at the top right.',
      "Tap Install app. If that isn't listed, tap Add to Home screen.",
      'Confirm. Toolblip gets its own icon.',
    ];
  }
  return [
    'Open the browser menu.',
    'Look for Install app or Add to Home Screen.',
    'Confirm, and Toolblip keeps its own icon.',
  ];
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
