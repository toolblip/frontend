export const PWA_INSTALL_DISMISS_KEY = 'tb_pwa_install_dismissed';
export const PWA_INSTALL_OPEN_DELAY_MS = 60_000;
export const INSTALLED_DISPLAY_QUERY =
  '(display-mode: standalone), (display-mode: minimal-ui), (display-mode: fullscreen)';

export type InstallPromptPhase = 'hidden' | 'open' | 'button';
export type InstallOs = 'ios' | 'android' | 'mac' | 'windows' | 'chromeos' | 'linux' | 'other';
export type InstallBrowser = 'safari' | 'chrome' | 'edge' | 'firefox' | 'opera' | 'samsung' | 'other';
export type InstallTarget = { os: InstallOs; browser: InstallBrowser };
export type InstallPromptOutcome = 'accepted' | 'dismissed';
export type InstallStepPart = { text: string; hot?: boolean };
export type InstallStep = { parts: InstallStepPart[] };
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

function say(...parts: Array<string | { hot: string }>): InstallStep {
  return {
    parts: parts.map((part) => (typeof part === 'string' ? { text: part } : { text: part.hot, hot: true })),
  };
}

function desktopInstallSteps(browser: InstallBrowser, os: InstallOs): InstallStep[] {
  if (browser === 'safari' && os === 'mac') {
    return [
      say(
        'Click ',
        { hot: 'File' },
        ' in the menu bar at the top of the screen, next to the Apple logo. That menu belongs to the Mac, not the page.',
      ),
      say('In the menu that opens, click ', { hot: 'Add to Dock' }, '.'),
      say(
        'A Toolblip icon appears in the ',
        { hot: 'Dock' },
        ', the row of app icons at the bottom of the screen. Click that icon to open Toolblip.',
      ),
    ];
  }
  if (browser === 'edge') {
    return [
      say(
        'At the right end of the address bar, click the ',
        { hot: 'install icon' },
        '. It looks like a screen with a plus.',
      ),
      say(
        'If that icon isn’t there, open the ',
        { hot: 'Edge menu' },
        ' (the three dots), then ',
        { hot: 'Apps' },
        ', then ',
        { hot: 'Install this site as an app' },
        '.',
      ),
      say('Click ', { hot: 'Install' }, '. Toolblip then opens in its own window.'),
    ];
  }
  if (browser === 'chrome' || browser === 'opera') {
    const fallback =
      browser === 'opera'
        ? [
            say(
              'If that icon isn’t there, open the ',
              { hot: 'Opera menu' },
              ' and choose ',
              { hot: 'Install Toolblip' },
              '.',
            ),
          ]
        : [
            say(
              'If that icon isn’t there, open the ',
              { hot: 'Chrome menu' },
              ' (the three dots at the top right), then ',
              { hot: 'Cast, save, and share' },
              ', then ',
              { hot: 'Install page as app' },
              '.',
            ),
          ];
    return [
      say(
        'At the right end of the address bar, click the ',
        { hot: 'install icon' },
        '. It looks like a small screen with a down arrow.',
      ),
      say('In the box that opens, click ', { hot: 'Install' }, '.'),
      ...fallback,
    ];
  }
  if (browser === 'firefox') {
    if (os === 'mac') {
      return [
        say('Firefox can’t put Toolblip in the Dock.'),
        say(
          'Open this page in ',
          { hot: 'Chrome' },
          ' or ',
          { hot: 'Edge' },
          ', then click the install icon at the right end of the address bar.',
        ),
        say(
          'Or open it in ',
          { hot: 'Safari' },
          ', click ',
          { hot: 'File' },
          ' in the menu bar at the top of the screen, then ',
          { hot: 'Add to Dock' },
          '.',
        ),
      ];
    }
    return [
      say('Firefox can’t install Toolblip as an app.'),
      say('Open this page in ', { hot: 'Chrome' }, ' or ', { hot: 'Edge' }, '.'),
      say('Click the ', { hot: 'install icon' }, ' at the right end of the address bar.'),
    ];
  }
  return [
    say('Open the browser menu.'),
    say('Look for ', { hot: 'Install app' }, ', ', { hot: 'Add to Home Screen' }, ', or ', { hot: 'Add to Dock' }, '.'),
    say('Confirm. Toolblip keeps its own icon.'),
  ];
}

function phoneInstallSteps(os: InstallOs, browser: InstallBrowser): InstallStep[] {
  if (os === 'ios' && browser === 'safari') {
    return [
      say(
        'Tap ',
        { hot: 'Share' },
        '. On an iPhone it is in the bar at the bottom. On an iPad it is at the top, in the address bar. The icon is a square with an arrow pointing up.',
      ),
      say('A panel opens. Scroll the list of actions and tap ', { hot: 'Add to Home Screen' }, '.'),
      say('Tap ', { hot: 'Add' }, ' in the corner. A Toolblip icon appears on your Home Screen.'),
    ];
  }
  if (os === 'ios') {
    return [
      say(
        'This browser can’t add the icon. Open ',
        { hot: 'Safari' },
        ' and go to toolblip.com.',
      ),
      say(
        'In Safari, tap ',
        { hot: 'Share' },
        '. On an iPhone it is at the bottom. On an iPad it is at the top. It is a square with an arrow pointing up.',
      ),
      say('Tap ', { hot: 'Add to Home Screen' }, ', then tap ', { hot: 'Add' }, '.'),
    ];
  }
  if (browser === 'samsung') {
    return [
      say('Tap the ', { hot: 'menu' }, ' button at the bottom right.'),
      say('Tap ', { hot: 'Add page to' }, ', then ', { hot: 'Home screen' }, '.'),
      say('Tap ', { hot: 'Add' }, '. The icon shows up on your home screen.'),
    ];
  }
  if (browser === 'firefox') {
    return [
      say('Tap the ', { hot: 'menu' }, ' button.'),
      say('Tap ', { hot: 'Install' }, '.'),
      say('Confirm. The Toolblip icon is added to your home screen.'),
    ];
  }
  if (browser === 'edge') {
    return [
      say('Tap the ', { hot: 'menu' }, ' button at the bottom.'),
      say(
        'Tap ',
        { hot: 'Add to phone' },
        '. If you see Apps instead, tap ',
        { hot: 'Install this site as an app' },
        '.',
      ),
      say('Confirm to finish.'),
    ];
  }
  if (browser === 'chrome' || browser === 'opera') {
    return [
      say('Tap the ', { hot: 'three-dot menu' }, ' at the top right.'),
      say('Tap ', { hot: 'Install app' }, '. If you don’t see that, tap ', { hot: 'Add to Home screen' }, '.'),
      say('Confirm. Toolblip gets its own icon.'),
    ];
  }
  return [
    say('Open the browser menu.'),
    say('Look for ', { hot: 'Install app' }, ' or ', { hot: 'Add to Home Screen' }, '.'),
    say('Confirm. Toolblip keeps its own icon.'),
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
