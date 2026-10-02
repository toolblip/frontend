import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

const request = (body: unknown) => new Request('http://localhost/api/sponsors/views', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});
afterEach(() => vi.restoreAllMocks());

describe('sponsor view proxy', () => {
  it('forwards a batch and preserves an empty success', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));
    const response = await POST(request({ paid_ids: [12], placeholder_domains: ['cloudploy.com'], extra: true }));
    expect(response.status).toBe(204);
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(expect.stringMatching(/\/api\/sponsors\/views$/), expect.objectContaining({
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: '{"paid_ids":[12],"placeholder_domains":["cloudploy.com"]}',
    }));
  });

  it.each([null, [], {}, { paid_ids: ['12'] }, { paid_ids: [0] }, { paid_ids: [1.2] }, { placeholder_domains: ['https://example.com'] }, { paid_ids: [], placeholder_domains: [] }])('rejects malformed payload %j', async (body) => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unexpected request'));
    expect((await POST(request(body))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects invalid JSON before contacting upstream', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unexpected request'));
    expect((await POST(new Request('http://localhost', { method: 'POST', body: '{' }))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([422, 429, 500])('propagates upstream %i without claiming success', async (status) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ message: 'Rejected' }, { status }));
    expect((await POST(request({ paid_ids: [4] }))).status).toBe(status);
  });

  it('returns 502 for network errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    expect((await POST(request({ placeholder_domains: ['example.com'] }))).status).toBe(502);
  });
});
