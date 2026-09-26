import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

const request = () => new Request('http://localhost/api/sponsors/click/12', { method: 'POST' });
const context = (id = '12') => ({ params: Promise.resolve({ id }) });
afterEach(() => vi.restoreAllMocks());

describe('paid click proxy', () => {
  it('preserves the paid 204 contract', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));
    const response = await POST(request(), context());
    expect(response.status).toBe(204);
    expect(await response.text()).toBe('');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/sponsors\/click\/12$/), expect.objectContaining({ method: 'POST' }));
  });
  it.each([404, 422, 429, 500, 503])('propagates upstream status %i', async (status) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ message: 'Rejected' }, { status }));
    expect((await POST(request(), context())).status).toBe(status);
  });
  it('returns 502 for an unreachable upstream', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    expect((await POST(request(), context())).status).toBe(502);
  });
  it.each(['-1', '0', 'NaN', '1.5', 'abc', '1/2', '9007199254740992'])('rejects invalid id %s before contacting upstream', async (id) => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unexpected request'));
    expect((await POST(request(), context(id))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
