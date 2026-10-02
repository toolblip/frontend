export type SearchModifier = 'meta' | 'ctrl';

export type SearchShortcut = {
  label: string;
  spoken: string;
  modifier: SearchModifier;
};

export type ShortcutNavigator = {
  userAgent?: string;
  platform?: string;
  maxTouchPoints?: number;
  userAgentData?: { platform?: string };
};

export type ShortcutKeyEvent = {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  repeat?: boolean;
};

function isAppleHint(value: string): boolean {
  return /Mac|iPhone|iPad|iPod/i.test(value);
}

function isOtherDesktopHint(value: string): boolean {
  return /Win|Windows|Linux|Android|CrOS|Chrome OS|Cros/i.test(value);
}

export function searchShortcutFromNavigator(nav: ShortcutNavigator): SearchShortcut {
  const hintedPlatform = nav.userAgentData?.platform ?? '';
  const platform = nav.platform ?? '';
  const userAgent = nav.userAgent ?? '';

  let apple = false;
  if (hintedPlatform) {
    apple = isAppleHint(hintedPlatform);
  } else if (isAppleHint(platform) || (platform === 'MacIntel' && (nav.maxTouchPoints ?? 0) > 1)) {
    apple = true;
  } else if (isOtherDesktopHint(platform) || isOtherDesktopHint(userAgent)) {
    apple = false;
  } else {
    apple = isAppleHint(userAgent);
  }

  if (apple) {
    return { label: '⌘K', spoken: 'Command K', modifier: 'meta' };
  }
  return { label: 'Ctrl+K', spoken: 'Control K', modifier: 'ctrl' };
}

export function currentSearchShortcut(): SearchShortcut {
  if (typeof navigator === 'undefined') {
    return { label: 'Ctrl+K', spoken: 'Control K', modifier: 'ctrl' };
  }
  return searchShortcutFromNavigator(navigator);
}

export function isSearchShortcutEvent(
  event: ShortcutKeyEvent,
  shortcut: SearchShortcut = currentSearchShortcut(),
): boolean {
  if (event.repeat || event.altKey || event.shiftKey) return false;
  if (event.key.toLowerCase() !== 'k') return false;
  if (shortcut.modifier === 'meta') return event.metaKey && !event.ctrlKey;
  return event.ctrlKey && !event.metaKey;
}
