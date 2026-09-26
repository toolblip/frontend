export type KeyType = 'rsa-2048' | 'rsa-4096' | 'ecdsa-256' | 'ecdsa-384' | 'ecdsa-521' | 'ed25519';

export interface KeyResult {
  publicKey: string;
  privateKeyPem: string;
  type: KeyType;
}

// ── base64 / bigint helpers ────────────────────────────────────────────────

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64.replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function concatBytes(...chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

/** SSH wire format: 4-byte big-endian length prefix + raw bytes. */
function sshString(bytes: Uint8Array): Uint8Array {
  const len = new Uint8Array(4);
  new DataView(len.buffer).setUint32(0, bytes.length, false);
  return concatBytes(len, bytes);
}

function sshStringFromText(text: string): Uint8Array {
  return sshString(new TextEncoder().encode(text));
}

/** SSH mpint: big-endian, minimal, with a leading 0x00 if the high bit would otherwise be set. */
function sshMpint(bytesIn: Uint8Array): Uint8Array {
  let bytes = bytesIn;
  let start = 0;
  while (start < bytes.length - 1 && bytes[start] === 0) start++;
  bytes = bytes.slice(start);
  if (bytes.length === 0) bytes = new Uint8Array([0]);
  if (bytes[0] & 0x80) {
    bytes = concatBytes(new Uint8Array([0]), bytes);
  }
  return sshString(bytes);
}

function pemWrap(base64: string, label: string): string {
  const lines: string[] = [];
  for (let i = 0; i < base64.length; i += 64) lines.push(base64.slice(i, i + 64));
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----\n`;
}

// ── OpenSSH public-key blob builders ───────────────────────────────────────

function buildRsaBlob(jwk: JsonWebKey): Uint8Array {
  if (!jwk.e || !jwk.n) throw new Error('RSA JWK missing e/n');
  const e = base64ToBytes(jwk.e);
  const n = base64ToBytes(jwk.n);
  return concatBytes(sshStringFromText('ssh-rsa'), sshMpint(e), sshMpint(n));
}

const EC_CURVE_NAMES: Record<string, string> = {
  'P-256': 'nistp256',
  'P-384': 'nistp384',
  'P-521': 'nistp521',
};

function buildEcdsaBlob(jwk: JsonWebKey): Uint8Array {
  if (!jwk.crv || !jwk.x || !jwk.y) throw new Error('EC JWK missing crv/x/y');
  const curveName = EC_CURVE_NAMES[jwk.crv];
  if (!curveName) throw new Error(`Unsupported curve ${jwk.crv}`);
  const x = base64ToBytes(jwk.x);
  const y = base64ToBytes(jwk.y);
  const point = concatBytes(new Uint8Array([0x04]), x, y);
  return concatBytes(
    sshStringFromText(`ecdsa-sha2-${curveName}`),
    sshStringFromText(curveName),
    sshString(point)
  );
}

function buildEd25519Blob(rawPublic: Uint8Array): Uint8Array {
  return concatBytes(sshStringFromText('ssh-ed25519'), sshString(rawPublic));
}

function opensshPublicKey(algName: string, blob: Uint8Array, comment: string): string {
  return `${algName} ${bytesToBase64(blob)}${comment ? ` ${comment}` : ''}`;
}

// ── key generation ──────────────────────────────────────────────────────────

export async function generateRsa(bits: number, comment: string): Promise<KeyResult> {
  const pair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: bits, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify']
  );
  const jwk = await crypto.subtle.exportKey('jwk', pair.publicKey);
  const blob = buildRsaBlob(jwk);
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', pair.privateKey);
  return {
    publicKey: opensshPublicKey('ssh-rsa', blob, comment),
    privateKeyPem: pemWrap(bytesToBase64(new Uint8Array(pkcs8)), 'PRIVATE KEY'),
    type: bits === 4096 ? 'rsa-4096' : 'rsa-2048',
  };
}

export async function generateEcdsa(namedCurve: 'P-256' | 'P-384' | 'P-521', comment: string): Promise<KeyResult> {
  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve }, true, ['sign', 'verify']);
  const jwk = await crypto.subtle.exportKey('jwk', pair.publicKey);
  const blob = buildEcdsaBlob(jwk);
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', pair.privateKey);
  const curveName = EC_CURVE_NAMES[namedCurve];
  return {
    publicKey: opensshPublicKey(`ecdsa-sha2-${curveName}`, blob, comment),
    privateKeyPem: pemWrap(bytesToBase64(new Uint8Array(pkcs8)), 'PRIVATE KEY'),
    type: namedCurve === 'P-256' ? 'ecdsa-256' : namedCurve === 'P-384' ? 'ecdsa-384' : 'ecdsa-521',
  };
}

export async function generateEd25519(comment: string): Promise<KeyResult> {
  // Ed25519 is only supported in recent browsers (Chrome 137+, Safari 17+). Feature-detect via try/catch.
  const pair = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']);
  const rawPublic = new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey));
  const blob = buildEd25519Blob(rawPublic);
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', pair.privateKey);
  return {
    publicKey: opensshPublicKey('ssh-ed25519', blob, comment),
    privateKeyPem: pemWrap(bytesToBase64(new Uint8Array(pkcs8)), 'PRIVATE KEY'),
    type: 'ed25519',
  };
}

