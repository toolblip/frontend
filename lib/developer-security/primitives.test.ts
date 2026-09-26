import { describe, it, expect } from 'vitest';
import { createHash, createHmac } from 'node:crypto';
import { digest, uuidV1, uuidV7, ulid, normalizeUuid, encodeBase64, decodeBase64, textToBinary, binaryToText, decodeJwt, password, validateEmail, luhn, escapeJson, unescapeJson } from './primitives';

describe('independent security vectors', () => {
  it('hashes empty, ASCII, Unicode and multi-block messages', async () => {
    for (const a of ['MD5','SHA-1','SHA-256','SHA-384','SHA-512']) for (const s of ['', 'abc', 'বাংলা 😀', 'a'.repeat(1000)])
      expect(await digest(a, s)).toBe(createHash(a.replace('-','').toLowerCase()).update(s).digest('hex'));
    expect(await digest('MD5','abc')).toBe('900150983cd24fb0d6963f7d28e17f72');
  });
  it('preserves UTF-8 bytes', () => {
    expect(encodeBase64('é😀')).toBe('w6nwn5iA');
    expect(decodeBase64('w6nwn5iA')).toBe('é😀');
    expect(decodeBase64('Zg')).toBe('f');
    expect(textToBinary('é')).toBe('11000011 10101001');
    expect(binaryToText('11000011 10101001')).toBe('é');
    for (const bad of ['1','0000000','11111111','xyz']) expect(()=>binaryToText(bad)).toThrow();
    for (const bad of ['a','====','Zm9v!','/w==','Zh==']) expect(()=>decodeBase64(bad)).toThrow();
  });
  it('emits valid v1 timestamps and multicast random nodes', () => {
    const u = uuidV1(0); const h = u.replaceAll('-','');
    expect(u).toMatch(/^[a-f\d]{8}-[a-f\d]{4}-1[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/);
    const t = BigInt('0x'+h.slice(13,16)+h.slice(8,12)+h.slice(0,8));
    expect(t).toBe(122192928000000000n);
    expect(parseInt(h.slice(20,22),16)&1).toBe(1);
  });
  it('emits RFC v7 version, variant and 48-bit milliseconds', () => {
    const u = uuidV7(0x017f22e279b0);
    expect(u).toMatch(/^017f22e2-79b0-7[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/);
    expect(new Set(Array.from({length:100},()=>uuidV7(1))).size).toBe(100);
  });
  it('normalizes only accepted UUID spellings', () => {
    expect(normalizeUuid('{550E8400-E29B-41D4-A716-446655440000}')).toBe('550e8400e29b41d4a716446655440000');
    for (const s of ['{550e8400-e29b-41d4-a716-446655440000]', '550e8400e29b--41d4a716446655440000','garbage']) expect(()=>normalizeUuid(s)).toThrow();
  });
  it('ULID has canonical timestamp encoding and random alphabet', () => {
    expect(ulid(0)).toMatch(/^0000000000[0-9A-HJKMNP-TV-Z]{16}$/);
    expect(ulid(1469918176385).slice(0,10)).toBe('01ARYZ6S41');
  });
  it('passwords honor every selected group and exclusion', () => {
    for(let i=0;i<100;i++) {
      const p=password(16,['ABC','abc','234','!@']);
      expect(p).toHaveLength(16); for(const re of [/[ABC]/,/[abc]/,/[234]/,/[!@]/]) expect(p).toMatch(re);
      expect(p).not.toMatch(/[O0Il1]/);
    }
    expect(()=>password(3,['A','a','2','!'])).toThrow();
    expect(()=>password(10,[])).toThrow();
  });
  it('rejects malformed JWT objects and decodes Unicode without trusting signature', () => {
    const h=Buffer.from('{"alg":"HS256"}').toString('base64url');
    const p=Buffer.from('{"name":"বাংলা"}').toString('base64url');
    const s=createHmac('sha256','secret').update(h+'.'+p).digest('base64url');
    expect(decodeJwt(h+'.'+p+'.'+s).payload.name).toBe('বাংলা');
    for(const t of ['null.e30.','e30.W10.','e30.e30.!','a.b.c']) expect(()=>decodeJwt(t)).toThrow();
  });
  it('validates syntax and checksum without claiming deliverability or issued cards', () => {
    expect(validateEmail('a+b@example.com').valid).toBe(true);
    for(const e of ['.a@example.com','a..b@example.com','a.@example.com','a@@example.com','a@-example.com']) expect(validateEmail(e).valid).toBe(false);
    expect(luhn('4111 1111 1111 1111')).toBe(true);
    for(const s of ['4111111111111112','0000000000000000','x4111111111111111']) expect(luhn(s)).toBe(false);
  });
  it('JSON escaping handles controls and literal backslash-n independently', () => {
    expect(escapeJson('\u0000\b\n')).toBe('\\u0000\\b\\n');
    expect(unescapeJson('\\\\n')).toBe('\\n');
    expect(unescapeJson('\\u00e9')).toBe('é');
    expect(()=>unescapeJson('\\q')).toThrow();
  });
});

// Apache htpasswd -bnBC 4 test password; independent bcrypt implementation.
import bcrypt from 'bcryptjs';
it('bcrypt matches the independent Apache htpasswd vector', async () => {
  const vector='$2y$04$hPN.cMyPJj0PvEoHzNEcJegNZwFu3mCHG65qxDp5TtWdk.aj6FqzK';
  expect(await bcrypt.compare('password',vector)).toBe(true);
  expect(await bcrypt.compare('wrong',vector)).toBe(false);
  expect((await bcrypt.hash('password',vector.slice(0,29))).slice(7)).toBe(vector.slice(7));
});
