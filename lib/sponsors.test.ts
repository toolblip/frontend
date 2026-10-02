import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applySponsorClick, applySponsorViews, fetchSponsorsArchive, fetchSponsorsLeaderboard, fetchSponsorsTop, formatCompactCount, pingSponsorClick, pingSponsorViews, readSponsorsTopCache, resetSponsorViewDedupe, shouldRecordSponsorViews, writeSponsorsTopCache, type SponsorSlot } from './sponsors';

const slot: SponsorSlot = {
  id: 12, rank: 1, domain: 'example.com', url: 'https://example.com', name: 'Example',
  tagline: null, clicks: 4, views: 7, balance_cents: 100, last_bid_at: null,
};

describe('confirmed sponsor clicks', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '');
    const storage = new Map<string, string>();
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('sends exactly one paid POST with keepalive, even when sendBeacon is available', async () => {
    const beacon = vi.fn(() => true);
    vi.stubGlobal('navigator', { sendBeacon: beacon });
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));
    const result = await pingSponsorClick(12);
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/api/sponsors/click/12', {
      method: 'POST', keepalive: true, headers: { Accept: 'application/json' },
    });
    expect(beacon).not.toHaveBeenCalled();
    expect(applySponsorClick([slot], slot, result)[0].clicks).toBe(5);
  });

  it.each([0, -1, NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1])('skips invalid paid id %s', async (id) => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unexpected request'));
    expect(await pingSponsorClick(id)).toBeNull();
    expect(await pingSponsorClick({ ...slot, id })).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('tracks a placeholder by domain across negative id and rank changes', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/preview/toolblip');
    const placeholder = { ...slot, id: -1, placeholder: true };
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ clicks: 19 }));
    const result = await pingSponsorClick(placeholder);
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/preview/toolblip/api/sponsors/placeholder-click', {
      method: 'POST', keepalive: true,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: 'example.com' }),
    });
    const shifted = { ...placeholder, id: -3, rank: 3 };
    const other = { ...placeholder, domain: 'other.com' };
    expect(applySponsorClick([shifted, other, slot], placeholder, result).map(s => s.clicks)).toEqual([19, 4, 4]);
    expect(applySponsorClick([{ ...shifted, clicks: 20 }], placeholder, result)[0].clicks).toBe(20);
  });

  it('does not update while pending; invalidates cached counts only after success', async () => {
    writeSponsorsTopCache({ period: '2026-09', period_ends_at: '', min_bid_cents: 100, slots: [slot] });
    let finish!: (res: Response) => void;
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(resolve => { finish = resolve; }));
    let current = [slot];
    const pending = pingSponsorClick(slot).then(result => { current = applySponsorClick(current, slot, result); });
    expect(current[0].clicks).toBe(4);
    expect(readSponsorsTopCache()).not.toBeNull();
    finish(new Response(null, { status: 204 }));
    await pending;
    expect(current[0].clicks).toBe(5);
    expect(readSponsorsTopCache()).toBeNull();
  });

  it.each(['http', 'network', 'malformed'] as const)('keeps counts and cache unchanged on %s failure', async (failure) => {
    const placeholder = { ...slot, id: -1, placeholder: true };
    writeSponsorsTopCache({ period: '2026-09', period_ends_at: '', min_bid_cents: 100, slots: [placeholder] });
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    if (failure === 'network') fetchMock.mockRejectedValue(new Error('offline'));
    else fetchMock.mockResolvedValue(failure === 'http' ? Response.json({ message: 'Rejected' }, { status: 422 }) : Response.json({ clicks: '5' }));
    const result = await pingSponsorClick(placeholder);
    expect(result).toBeNull();
    expect(applySponsorClick([placeholder], placeholder, result)[0].clicks).toBe(4);
    expect(readSponsorsTopCache()?.slots[0].clicks).toBe(4);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each(['http', 'network'] as const)('does not increment a paid count on %s failure', async failure => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    if (failure === 'network') fetchMock.mockRejectedValue(new Error('offline'));
    else fetchMock.mockResolvedValue(Response.json({ message: 'Rejected' }, { status: 500 }));
    const result = await pingSponsorClick(slot);
    expect(result).toBeNull();
    expect(applySponsorClick([slot], slot, result)[0].clicks).toBe(4);
  });

  it('loads fresh server counts on both surfaces instead of reusing an HTTP cache', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => Response.json({ slots: [], data: [] }));
    await fetchSponsorsTop();
    await fetchSponsorsLeaderboard();
    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/sponsors/top', expect.objectContaining({ cache: 'no-store' }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/sponsors/leaderboard?page=1', expect.objectContaining({ cache: 'no-store' }));
  });
});

describe('fetchSponsorsArchive', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads the archive from the same-origin endpoint', async () => {
    const archive = {
      data: [{ period: '2026-08', closed_at: null, slots: [] }],
    };
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(archive), { status: 200 }),
    );

    await expect(fetchSponsorsArchive()).resolves.toEqual(archive);
    expect(fetchMock).toHaveBeenCalledWith('/api/sponsors/archive', {
      headers: { Accept: 'application/json' },
    });
  });
});

describe('sponsor views', () => {
  beforeEach(() => {
    resetSponsorViewDedupe();
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '');
    const storage = new Map<string, string>();
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it.each([
    [0, '0'],
    [999, '999'],
    [1000, '1k'],
    [1200, '1.2k'],
    [999950, '1m'],
    [1_200_000, '1.2m'],
  ] as const)('compacts %i as %s', (value, expected) => {
    expect(formatCompactCount(value)).toBe(expected);
  });

  it('batches paid and placeholder targets and keeps the session cache', async () => {
    const placeholder = { ...slot, id: -1, placeholder: true, domain: 'cloudploy.com', views: 3 };
    writeSponsorsTopCache({ period: '2026-10', period_ends_at: '', min_bid_cents: 100, slots: [slot, placeholder] });
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));
    const ok = await pingSponsorViews([slot, placeholder]);
    expect(ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/api/sponsors/views', {
      method: 'POST',
      keepalive: true,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ paid_ids: [12], placeholder_domains: ['cloudploy.com'] }),
    });
    expect(applySponsorViews([slot, placeholder], [slot, placeholder]).map((item) => item.views)).toEqual([8, 4]);
    expect(readSponsorsTopCache()?.slots.map((item) => item.views)).toEqual([8, 4]);
  });

  it('does not change counts or cache when the view ping fails', async () => {
    writeSponsorsTopCache({ period: '2026-10', period_ends_at: '', min_bid_cents: 100, slots: [slot] });
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ message: 'nope' }, { status: 422 }));
    expect(await pingSponsorViews([slot])).toBe(false);
    expect(readSponsorsTopCache()?.slots[0].views).toBe(7);
  });

  it('records a route once, then again after the visitor leaves and returns', () => {
    expect(shouldRecordSponsorViews('strip', '/tools/json-formatter', [slot])).toBe(true);
    expect(shouldRecordSponsorViews('strip', '/tools/json-formatter', [slot])).toBe(false);
    expect(shouldRecordSponsorViews('strip', '/tools/base64', [slot])).toBe(true);
    expect(shouldRecordSponsorViews('strip', '/tools/json-formatter', [slot])).toBe(true);
    expect(shouldRecordSponsorViews('leaderboard', '/sponsors?page=1', [slot])).toBe(true);
  });
});
