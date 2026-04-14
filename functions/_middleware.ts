/**
 * Cloudflare Pages middleware.
 * Proxies /api/* and /sanctum/* to the Laravel API at api.toolblip.com.
 * This is a CF Pages Function  -  it runs at the edge, not in Astro.
 */

const API_BASE = 'https://api.toolblip.com';
const PROXY_PREFIXES = ['/api/', '/sanctum/'];

export async function onRequest(context: EventContext<unknown, string, unknown>): Promise<Response> {
  const { request, next } = context;
  const url = new URL(request.url);

  const shouldProxy = PROXY_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));
  if (!shouldProxy) return next();

  const apiUrl = new URL(url.pathname + url.search, API_BASE);
  const proxyRequest = new Request(apiUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow',
  });

  return fetch(proxyRequest);
}
