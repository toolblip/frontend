import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

const request = (body: unknown) => new Request('http://localhost/api/sponsors/placeholder-click', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});
afterEach(() => vi.restoreAllMocks());

describe('placeholder click proxy', () => {
  it('forwards only the domain and returns the persistent upstream count', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ clicks: 42 }));
    const response = await POST(request({ domain: 'skaleagents.com', id: -2 }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ clicks: 42 });
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(expect.stringMatching(/\/api\/sponsors\/placeholder-click$/), expect.objectContaining({
      method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: '{"domain":"skaleagents.com"}',
    }));
  });
  it.each([null, [], {}, { domain: 12 }, { domain: '' }, { domain: '  ' }, { domain: 'https://example.com' }, { domain: 'example.com/path' }, { domain: 'a'.repeat(254) }])('rejects malformed domain payload %j', async (body) => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unexpected request'));
    expect((await POST(request(body))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('rejects invalid JSON before contacting upstream', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unexpected request'));
    expect((await POST(new Request('http://localhost', { method: 'POST', body: '{' }))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each([422, 429, 500, 503])('propagates upstream %i without claiming success', async (status) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ message: 'Not configured' }, { status }));
    expect((await POST(request({ domain: 'unknown.com' }))).status).toBe(status);
  });
  it('returns 502 for network errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    expect((await POST(request({ domain: 'example.com' }))).status).toBe(502);
  });
  it.each([{ clicks: -1 }, { clicks: 1.2 }, { clicks: '2' }, {}])('rejects malformed success response %j', async (body) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(body));
    expect((await POST(request({ domain: 'example.com' }))).status).toBe(502);
  });
});
