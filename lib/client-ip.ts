// Cloudflare edge ranges from https://www.cloudflare.com/ips (2026-10-21).
// shortcut: hardcoded list, refresh it if Cloudflare announces new ranges.
const CLOUDFLARE_RANGES = [
  '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18',
  '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17',
  '162.158.0.0/15', '104.16.0.0/13', '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
  '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32', '2405:8100::/32',
  '2a06:98c0::/29', '2c0f:f248::/32',
].map((cidr) => {
  const [ip, bits] = cidr.split('/');
  return { ...parseIp(ip)!, bits: Number(bits) };
});

function parseIp(ip: string): { value: bigint; width: number } | null {
  if (ip.includes('.') && !ip.includes(':')) {
    const parts = ip.split('.');
    if (parts.length !== 4 || parts.some((p) => !/^\d{1,3}$/.test(p) || Number(p) > 255)) return null;
    return { value: parts.reduce((acc, p) => (acc << 8n) | BigInt(p), 0n), width: 32 };
  }
  const halves = ip.toLowerCase().split('::');
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(':') : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  const missing = 8 - head.length - tail.length;
  if (missing < 0 || (halves.length === 1 && missing !== 0)) return null;
  const groups = [...head, ...Array(missing).fill('0'), ...tail];
  if (groups.some((g) => !/^[0-9a-f]{1,4}$/.test(g))) return null;
  return { value: groups.reduce((acc, g) => (acc << 16n) | BigInt(parseInt(g, 16)), 0n), width: 128 };
}

export function isCloudflareIp(ip: string): boolean {
  const parsed = parseIp(ip);
  if (!parsed) return false;
  return CLOUDFLARE_RANGES.some(
    (range) =>
      range.width === parsed.width &&
      parsed.value >> BigInt(range.width - range.bits) === range.value >> BigInt(range.width - range.bits),
  );
}

/**
 * Railway sets X-Real-IP to the connecting IP (or to cf-connecting-ip when that peer is Cloudflare); clients can't override it.
 * X-Forwarded-For is never used: clients can forge its head and Railway's CDN hops land at its tail.
 * If X-Real-IP is still a Cloudflare edge, cf-connecting-ip is trusted; a direct hit on Railway can't pass that check.
 */
export function clientIp(headers: Headers): string | undefined {
  const peer = headers.get('x-real-ip')?.trim();
  const cf = headers.get('cf-connecting-ip')?.trim();
  if (peer && cf && isCloudflareIp(peer)) return cf;
  return peer || undefined;
}
