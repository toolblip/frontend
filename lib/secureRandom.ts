// Shared crypto.getRandomValues() helpers for the "secure"/"random"
// generator tools (SecureRandomGeneratorClient, RandomPinGeneratorClient,
// RandomIdGeneratorClient). Centralized so a fix here (or a security
// review) covers all three instead of three independently-hand-rolled
// copies drifting apart.

// Rejection sampling: draws are retried above the largest multiple of
// `range` that fits the sample space, so every valid output has exactly
// equal probability. A plain `% range` is measurably biased whenever range
// doesn't evenly divide the sample space (e.g. 2^32 % 62 = 4, so a 62-char
// alphabet's first 4 characters would be drawn slightly more often) - a
// real defect in a tool that specifically claims to be cryptographically
// secure.
function randomIndexBelow(range: number, sampleBits: 8 | 32): number {
  const sampleSpace = sampleBits === 8 ? 256 : 0x100000000;
  const limit = Math.floor(sampleSpace / range) * range;
  let x: number;
  do {
    x = sampleBits === 8 ? crypto.getRandomValues(new Uint8Array(1))[0] : crypto.getRandomValues(new Uint32Array(1))[0];
  } while (x >= limit);
  return x % range;
}

// Uint32Array sampling only covers a range up to 2^32; above that,
// rejection sampling against a fixed `limit` either never terminates (limit
// computes to 0) or silently loses uniformity. Both min > max and a range
// this large are real inputs a free-text number field will produce.
const MAX_RANDOM_INT_RANGE = 0x100000000;

export function randomInt(min: number, max: number): number {
  const lo = Math.floor(min);
  const hi = Math.floor(max);
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi < lo) return NaN;
  const range = hi - lo + 1;
  if (range > MAX_RANDOM_INT_RANGE) return NaN;
  return lo + randomIndexBelow(range, 32);
}

export function randomFromAlphabet(alphabet: string, length: number): string {
  const size = alphabet.length;
  const limit = Math.floor(0x100000000 / size) * size;
  const out: string[] = [];
  // Draw a full-size batch up front (one WebCrypto call covers the common
  // case) and only fall back to drawing more on the rare rejected sample,
  // rather than one crypto.getRandomValues call per character.
  let batch = crypto.getRandomValues(new Uint32Array(length));
  let i = 0;
  while (out.length < length) {
    if (i >= batch.length) {
      batch = crypto.getRandomValues(new Uint32Array(length - out.length));
      i = 0;
    }
    const x = batch[i++];
    if (x < limit) out.push(alphabet[x % size]);
  }
  return out.join('');
}

export function randomHexBytes(length: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function randomUuid(): string {
  return crypto.randomUUID();
}

export function supportsRandomUuid(): boolean {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';
}
