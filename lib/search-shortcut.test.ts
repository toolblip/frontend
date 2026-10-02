import { describe, expect, it } from 'vitest';
import { isSearchShortcutEvent, searchShortcutFromNavigator } from './search-shortcut';

const mac = searchShortcutFromNavigator({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  platform: 'MacIntel',
  userAgentData: { platform: 'macOS' },
});

const windows = searchShortcutFromNavigator({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  platform: 'Win32',
  userAgentData: { platform: 'Windows' },
});

const linux = searchShortcutFromNavigator({
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
  platform: 'Linux x86_64',
});

describe('searchShortcutFromNavigator', () => {
  it('shows Command K on Apple platforms', () => {
    expect(mac).toMatchObject({ label: '⌘K', spoken: 'Command K', modifier: 'meta' });
    expect(searchShortcutFromNavigator({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      platform: 'iPhone',
    }).modifier).toBe('meta');
  });

  it('shows Control K on Windows, Linux, and ChromeOS', () => {
    expect(windows).toMatchObject({ label: 'Ctrl+K', spoken: 'Control K', modifier: 'ctrl' });
    expect(linux.modifier).toBe('ctrl');
    expect(searchShortcutFromNavigator({
      userAgent: 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0)',
      platform: 'CrOS',
      userAgentData: { platform: 'Chrome OS' },
    }).label).toBe('Ctrl+K');
  });
});

describe('isSearchShortcutEvent', () => {
  const press = (shortcut: typeof mac, extra: Partial<Parameters<typeof isSearchShortcutEvent>[0]> = {}) =>
    isSearchShortcutEvent({
      key: 'k',
      metaKey: false,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      ...extra,
    }, shortcut);

  it('listens for Command K on Mac and ignores Control K', () => {
    expect(press(mac, { metaKey: true })).toBe(true);
    expect(press(mac, { metaKey: true, key: 'K' })).toBe(true);
    expect(press(mac, { ctrlKey: true })).toBe(false);
    expect(press(mac, { metaKey: true, shiftKey: true })).toBe(false);
  });

  it('listens for Control K on other systems and ignores Command K', () => {
    expect(press(windows, { ctrlKey: true })).toBe(true);
    expect(press(linux, { ctrlKey: true })).toBe(true);
    expect(press(windows, { metaKey: true })).toBe(false);
    expect(press(windows, { ctrlKey: true, altKey: true })).toBe(false);
    expect(press(windows, { ctrlKey: true, repeat: true })).toBe(false);
  });
});
