export const PWA_INSTALL_DISMISS_KEY = 'tb_pwa_install_dismissed';
export const PWA_INSTALL_OPEN_DELAY_MS = 60_000;
export const INSTALLED_DISPLAY_QUERY =
  '(display-mode: standalone), (display-mode: minimal-ui), (display-mode: fullscreen)';

export type InstallPromptPhase = 'hidden' | 'open' | 'button';
export type InstallPlatform = 'chromium' | 'ios-safari' | 'ios-other' | 'mac-safari' | 'other';
export type InstallPromptOutcome = 'accepted' | 'dismissed';

export function installPromptPhase(input: {
  installed: boolean;
  dismissed: boolean;
  elapsedMs: number;
  manuallyOpen?: boolean;
}): InstallPromptPhase {
  if (input.installed) return 'hidden';
  if (input.manuallyOpen) return 'open';
  if (input.dismissed) return 'button';
  if (input.elapsedMs >= PWA_INSTALL_OPEN_DELAY_MS) return 'open';
  return 'hidden';
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

export function detectInstallPlatform(input: {
  userAgent: string;
  platform?: string;
  maxTouchPoints?: number;
}): InstallPlatform {
  const ua = input.userAgent;
  const iosDevice =
    /iPad|iPhone|iPod/.test(ua) ||
    (input.platform === 'MacIntel' && (input.maxTouchPoints ?? 0) > 1);

  if (iosDevice) {
    return /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua) ? 'ios-other' : 'ios-safari';
  }
  if (/Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua)) {
    return 'mac-safari';
  }
  if (/Chrome|Chromium|Edg|OPR|Opera/.test(ua)) return 'chromium';
  return 'other';
}

export function installInstructions(
  platform: InstallPlatform,
  canPrompt: boolean,
): { body: string; showNativeInstall: boolean } {
  if (platform === 'chromium' && canPrompt) {
    return {
      body: 'Install Toolblip for quick access, even when you are offline.',
      showNativeInstall: true,
    };
  }
  if (platform === 'chromium') {
    return {
      body: 'Use the install icon in the address bar, or open the browser menu and choose Install Toolblip.',
      showNativeInstall: false,
    };
  }
  if (platform === 'ios-safari') {
    return { body: 'Tap Share, then Add to Home Screen.', showNativeInstall: false };
  }
  if (platform === 'ios-other') {
    return {
      body: 'Open this page in Safari, tap Share, then Add to Home Screen.',
      showNativeInstall: false,
    };
  }
  if (platform === 'mac-safari') {
    return { body: 'Choose File, then Add to Dock.', showNativeInstall: false };
  }
  return {
    body: 'Open the browser menu and choose Install app or Add to Home Screen.',
    showNativeInstall: false,
  };
}
