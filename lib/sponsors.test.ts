import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchSponsorsArchive } from './sponsors';

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
