export const PWA_INSTALL_DISMISS_KEY = 'tb_pwa_install_dismissed';
export const PWA_INSTALL_OPEN_DELAY_MS = 60_000;
export const INSTALLED_DISPLAY_QUERY =
  '(display-mode: standalone), (display-mode: minimal-ui), (display-mode: fullscreen)';

export type InstallPromptPhase = 'hidden' | 'open' | 'button';
export type InstallOs = 'ios' | 'android' | 'mac' | 'windows' | 'chromeos' | 'linux' | 'other';
export type InstallBrowser = 'safari' | 'chrome' | 'edge' | 'firefox' | 'opera' | 'samsung' | 'other';
export type InstallTarget = { os: InstallOs; browser: InstallBrowser };
export type InstallPromptOutcome = 'accepted' | 'dismissed';
export type InstallStep = { marks: string[]; where: string };
export type InstallInstructions = {
  label: string;
  steps: InstallStep[];
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

function step(marks: string | string[], where: string): InstallStep {
  return { marks: Array.isArray(marks) ? marks : [marks], where };
}

function desktopInstallSteps(browser: InstallBrowser, os: InstallOs): InstallStep[] {
  if (browser === 'safari' && os === 'mac') {
    return [
      step('File', 'In the menu bar at the top of the screen.'),
      step('Add to Dock', 'Choose it from the File menu.'),
      step('Dock', 'Toolblip shows up there. Open it like any other app.'),
    ];
  }
  if (browser === 'edge') {
    return [
      step('install icon', 'Right end of the address bar. It looks like a screen with a plus.'),
      step(['Edge menu', 'Apps', 'Install this site as an app'], "Use this if the icon isn't there."),
      step('Install', 'Confirm. Toolblip then opens in its own window.'),
    ];
  }
  if (browser === 'chrome' || browser === 'opera') {
    const menu =
      browser === 'opera'
        ? ['Opera menu', 'Install Toolblip']
        : ['Chrome menu', 'Cast, save, and share', 'Install page as app'];
    return [
      step('install icon', 'Right end of the address bar. It looks like a small screen with a down arrow.'),
      step('Install', 'Click it in the box that opens.'),
      step(menu, "Use this if you don't see the icon."),
    ];
  }
  if (browser === 'firefox') {
    if (os === 'mac') {
      return [
        step('Not in Firefox', "Firefox can't add Toolblip to the Dock."),
        step(['Chrome', 'Edge'], 'Open this page in one of these and use the install icon in the address bar.'),
        step(['Safari', 'File', 'Add to Dock'], 'Or stay on this Mac and use Safari.'),
      ];
    }
    return [
      step('Not in Firefox', "Firefox can't install Toolblip as an app."),
      step(['Chrome', 'Edge'], 'Open this page in one of these.'),
      step('install icon', 'Right end of the address bar.'),
    ];
  }
  return [
    step('Browser menu', 'Open it.'),
    step(['Install app', 'Add to Home Screen', 'Add to Dock'], 'Look for one of these.'),
    step('Confirm', 'Toolblip keeps its own icon.'),
  ];
}

function phoneInstallSteps(os: InstallOs, browser: InstallBrowser): InstallStep[] {
  if (os === 'ios' && browser === 'safari') {
    return [
      step('Share', 'The square with an arrow pointing up, at the bottom of Safari.'),
      step('Add to Home Screen', 'Scroll the share sheet and tap it.'),
      step('Add', 'The Toolblip icon lands on your Home Screen.'),
    ];
  }
  if (os === 'ios') {
    return [
      step('Safari', 'iPhone and iPad only add a Home Screen icon from Safari.'),
      step('Share', 'Open toolblip.com in Safari, then tap Share.'),
      step(['Add to Home Screen', 'Add'], 'Tap those to finish.'),
    ];
  }
  if (browser === 'samsung') {
    return [
      step('Menu', 'Bottom right of the browser.'),
      step(['Add page to', 'Home screen'], 'Tap those in that order.'),
      step('Add', 'The icon shows up on your home screen.'),
    ];
  }
  if (browser === 'firefox') {
    return [
      step('Menu', 'Tap the menu button.'),
      step('Install', 'Tap it in that menu.'),
      step('Confirm', 'The Toolblip icon is added to your home screen.'),
    ];
  }
  if (browser === 'edge') {
    return [
      step('Menu', 'At the bottom of Edge.'),
      step('Add to phone', 'If you see Apps instead, choose Install this site as an app.'),
      step('Install', 'Confirm to finish.'),
    ];
  }
  if (browser === 'chrome' || browser === 'opera') {
    return [
      step('three-dot menu', 'Top right.'),
      step('Install app', "If that isn't listed, tap Add to Home screen."),
      step('Confirm', 'Toolblip gets its own icon.'),
    ];
  }
  return [
    step('Browser menu', 'Open it.'),
    step(['Install app', 'Add to Home Screen'], 'Look for one of these.'),
    step('Confirm', 'Toolblip keeps its own icon.'),
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
