import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY, captureSignupSource, sendSignupSource } from './signup-source';

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() { return data.size; },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => { data.delete(k); },
    setItem: (k, v) => { data.set(k, String(v)); },
  };
}

const CONSENT = 'toolblip_cookie_consent';
let storage: Storage;
const stored = () => {
  const raw = storage.getItem(STORAGE_KEY);
  return raw === null ? null : JSON.parse(raw);
};

beforeEach(() => {
  storage = memoryStorage();
});

describe('captureSignupSource', () => {
  it('does nothing without consent', () => {
    captureSignupSource({ search: '?utm_source=reddit', pathname: '/' }, '', storage);
    expect(stored()).toBeNull();
  });

  it('does nothing when consent declined', () => {
    storage.setItem(CONSENT, 'declined');
    captureSignupSource({ search: '?utm_source=reddit', pathname: '/' }, '', storage);
    expect(stored()).toBeNull();
  });

  it('stores utm and path with consent', () => {
    storage.setItem(CONSENT, 'accepted');
    captureSignupSource({ search: '?utm_source=reddit&utm_campaign=launch', pathname: '/tools/json-formatter' }, '', storage);
    expect(stored()).toEqual({ utm_source: 'reddit', utm_campaign: 'launch', landing_path: '/tools/json-formatter' });
  });

  it('stores external referrer host only', () => {
    storage.setItem(CONSENT, 'accepted');
    captureSignupSource({ search: '', pathname: '/' }, 'https://news.ycombinator.com/item?id=1', storage);
    expect(stored()).toEqual({ referrer_host: 'news.ycombinator.com', landing_path: '/' });
  });

  it('ignores internal referrer without utm', () => {
    storage.setItem(CONSENT, 'accepted');
    captureSignupSource({ search: '', pathname: '/tools' }, 'https://toolblip.com/tools', storage);
    captureSignupSource({ search: '', pathname: '/tools' }, 'https://www.toolblip.com/', storage);
    captureSignupSource({ search: '', pathname: '/tools' }, '', storage);
    expect(stored()).toBeNull();
  });

  it('keeps first touch', () => {
    storage.setItem(CONSENT, 'accepted');
    captureSignupSource({ search: '?utm_source=hn', pathname: '/' }, '', storage);
    captureSignupSource({ search: '?utm_source=reddit', pathname: '/' }, '', storage);
    expect(stored().utm_source).toBe('hn');
  });

  it('truncates to 100 chars', () => {
    storage.setItem(CONSENT, 'accepted');
    captureSignupSource({ search: `?utm_source=${'a'.repeat(300)}`, pathname: '/' }, '', storage);
    expect(stored().utm_source).toHaveLength(100);
  });
});

describe('sendSignupSource', () => {
  it('send posts once and clears', async () => {
    storage.setItem(STORAGE_KEY, JSON.stringify({ utm_source: 'reddit' }));
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{}'));
    await sendSignupSource(fetchImpl, storage);
    await sendSignupSource(fetchImpl, storage);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('/api/auth/signup-source');
    expect(JSON.parse(init.body)).toEqual({ utm_source: 'reddit' });
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('send clears even when fetch rejects', async () => {
    storage.setItem(STORAGE_KEY, JSON.stringify({ utm_source: 'reddit' }));
    await sendSignupSource(vi.fn().mockRejectedValue(new Error('offline')), storage);
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });
});
