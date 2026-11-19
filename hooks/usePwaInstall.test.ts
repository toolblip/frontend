import { afterEach, describe, expect, it, vi } from 'vitest';

const ANDROID_CHROME =
  'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36';

type FakePrompt = Event & { prompt: ReturnType<typeof vi.fn>; userChoice: Promise<{ outcome: string }> };

function promptEvent(outcome: 'accepted' | 'dismissed' = 'dismissed'): FakePrompt {
  const event = new Event('beforeinstallprompt', { cancelable: true }) as FakePrompt;
  event.prompt = vi.fn(async () => {});
  event.userChoice = Promise.resolve({ outcome });
  return event;
}

/** A fresh copy of the module-level store over a fake browser. */
async function loadStore(options: { standalone?: boolean; early?: FakePrompt } = {}) {
  const win = new EventTarget() as EventTarget & Record<string, unknown>;
  win.matchMedia = () => ({ matches: options.standalone ?? false });
  if (options.early) win.__tbBip = options.early;
  vi.stubGlobal('window', win);
  vi.stubGlobal('navigator', { userAgent: ANDROID_CHROME, platform: 'Linux armv81', maxTouchPoints: 5 });
  vi.resetModules();
  const { pwaInstallStore } = await import('./usePwaInstall');
  return { win, store: pwaInstallStore };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('pwa install store', () => {
  it('starts not installed and without a prompt in a normal tab', async () => {
    const { store } = await loadStore();
    expect(store.getSnapshot()).toEqual({
      installed: false,
      canPrompt: false,
      target: { os: 'android', browser: 'chrome' },
    });
  });

  it('picks up an install event the head script caught before React loaded', async () => {
    const { store } = await loadStore({ early: promptEvent() });
    expect(store.getSnapshot().canPrompt).toBe(true);
  });

  it('offers the prompt to a caller that subscribes long after the event fired', async () => {
    const { win, store } = await loadStore();
    store.getSnapshot();
    const event = promptEvent();
    win.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);

    const late = vi.fn();
    store.subscribe(late);
    expect(store.getSnapshot().canPrompt).toBe(true);
  });

  it('notifies every subscriber, and stops after unsubscribe', async () => {
    const { win, store } = await loadStore();
    store.getSnapshot();
    const first = vi.fn();
    const second = vi.fn();
    const stop = store.subscribe(first);
    store.subscribe(second);
    win.dispatchEvent(promptEvent());
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);

    stop();
    win.dispatchEvent(promptEvent());
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(2);
  });

  it('shows the native prompt once, even when two buttons call install', async () => {
    const event = promptEvent('dismissed');
    const { store } = await loadStore({ early: event });
    store.getSnapshot();
    await Promise.all([store.install(), store.install()]);
    expect(event.prompt).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toMatchObject({ installed: false, canPrompt: false });
  });

  it('can prompt again when the browser fires a new event after a dismissal', async () => {
    const { win, store } = await loadStore({ early: promptEvent('dismissed') });
    store.getSnapshot();
    await store.install();
    const next = promptEvent('accepted');
    win.dispatchEvent(next);
    expect(store.getSnapshot().canPrompt).toBe(true);
    await store.install();
    expect(next.prompt).toHaveBeenCalledTimes(1);
  });

  it('marks the app installed when the user accepts', async () => {
    const { store } = await loadStore({ early: promptEvent('accepted') });
    store.getSnapshot();
    await store.install();
    expect(store.getSnapshot()).toMatchObject({ installed: true, canPrompt: false });
  });

  it('survives a prompt() that throws', async () => {
    const event = promptEvent();
    event.prompt.mockRejectedValue(new Error('already used'));
    const { store } = await loadStore({ early: event });
    store.getSnapshot();
    await expect(store.install()).resolves.toBeUndefined();
    expect(store.getSnapshot()).toMatchObject({ installed: false, canPrompt: false });
  });

  it('marks the app installed on appinstalled (install from the address bar)', async () => {
    const { win, store } = await loadStore({ early: promptEvent() });
    store.getSnapshot();
    win.dispatchEvent(new Event('appinstalled'));
    expect(store.getSnapshot()).toMatchObject({ installed: true, canPrompt: false });
  });

  it('is installed, with no prompt, inside the installed app window', async () => {
    const { win, store } = await loadStore({ standalone: true, early: promptEvent() });
    expect(store.getSnapshot()).toMatchObject({ installed: true, canPrompt: false });
    win.dispatchEvent(promptEvent());
    expect(store.getSnapshot().canPrompt).toBe(false);
  });

  it('install() without an event does nothing', async () => {
    const { store } = await loadStore();
    store.getSnapshot();
    await store.install();
    expect(store.getSnapshot()).toMatchObject({ installed: false, canPrompt: false });
  });
});
