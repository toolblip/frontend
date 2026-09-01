export type CidrResult = { network: string; firstHost: string; lastHost: string; broadcast: string; totalAddresses: number; usableHosts: number; subnetMask: string; wildcard: string; prefix: number };
export type RangeResult = { startIp: string; endIp: string; count: number; network: string; broadcast: string; netmask: string; prefix: number; firstIp: string; lastIp: string };

export function parseIPv4(value: string): number | null {
  const parts = value.trim().split('.');
  if (parts.length !== 4 || parts.some(part => !/^\d{1,3}$/.test(part) || (part.length > 1 && part[0] === '0'))) return null;
  const octets = parts.map(Number);
  if (octets.some(n => n > 255)) return null;
  return (((octets[0] * 256 + octets[1]) * 256 + octets[2]) * 256 + octets[3]) >>> 0;
}

export function formatIPv4(value: number): string {
  return [(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255].join('.');
}

function maskForPrefix(prefix: number): number { return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0; }

export function calculateCidr(value: string): CidrResult | null {
  const match = value.trim().match(/^([^/]+)\/(\d{1,2})$/);
  if (!match) return null;
  const ip = parseIPv4(match[1]);
  const prefix = Number(match[2]);
  if (ip === null || prefix > 32) return null;
  const mask = maskForPrefix(prefix);
  const network = (ip & mask) >>> 0;
  const wildcard = (~mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const totalAddresses = 2 ** (32 - prefix);
  const usableHosts = prefix === 31 ? 2 : prefix === 32 ? 1 : Math.max(0, totalAddresses - 2);
  return { network: formatIPv4(network), firstHost: prefix === 32 ? formatIPv4(network) : prefix === 31 ? formatIPv4(network) : formatIPv4((network + 1) >>> 0), lastHost: prefix === 32 ? formatIPv4(network) : prefix === 31 ? formatIPv4(broadcast) : formatIPv4((broadcast - 1) >>> 0), broadcast: formatIPv4(broadcast), totalAddresses, usableHosts, subnetMask: formatIPv4(mask), wildcard: formatIPv4(wildcard), prefix };
}

export function calculateIpRange(startValue: string, endValue: string): RangeResult | null {
  const start = parseIPv4(startValue); const end = parseIPv4(endValue);
  if (start === null || end === null || end < start) return null;
  const xor = (start ^ end) >>> 0;
  let prefix = 32;
  if (xor) prefix = Math.clz32(xor);
  const mask = maskForPrefix(prefix);
  const network = (start & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  return { startIp: formatIPv4(start), endIp: formatIPv4(end), count: end - start + 1, network: formatIPv4(network), broadcast: formatIPv4(broadcast), netmask: formatIPv4(mask), prefix, firstIp: formatIPv4(start), lastIp: formatIPv4(end) };
}

export function validatePort(value: string): boolean { return /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 65535; }
export function validateServiceName(value: string): boolean { return /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,62}$/.test(value); }
export function quoteYaml(value: string): string { return JSON.stringify(value.replace(/[\u0000-\u001f\u007f]/g, ch => ch === '\n' ? ch : '')); }
export function encodeDatabaseCredential(value: string): string { return encodeURIComponent(value); }
