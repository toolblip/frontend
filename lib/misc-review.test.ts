import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { decodeBase64, encodeBase64, binaryToText, textToBinary } from './developer-security/primitives';
import { parseCron, computeNextRuns } from './developer-general/cron';
import { parseCurl, shellWords } from './developer-general/curl';
import { imageSignature } from './images-qa';

describe('misc independent review regressions', () => {
  it('preserves the UTF-8 BOM as text in both decoders', () => {
    expect(decodeBase64('77u/QQ==')).toBe('\uFEFFA');
    expect(encodeBase64(decodeBase64('77u/QQ=='))).toBe('77u/QQ==');
    expect(binaryToText('11101111 10111011 10111111 01000001')).toBe('\uFEFFA');
  });
  it.each(['a'.repeat(80000), '漢'.repeat(100000), 'é😀'.repeat(25000)])('accepts expanded Base64 within the decoded text budget (%#. case)', text => {
    const encoded = Buffer.from(text).toString('base64');
    expect(encodeBase64(text)).toBe(encoded);
    expect(decodeBase64(encoded)).toBe(text);
  });
  it.each(['a'.repeat(12000), '漢'.repeat(100000), 'é😀'.repeat(25000)])('accepts expanded binary within the decoded text budget (%#. case)', text => {
    expect(binaryToText(textToBinary(text))).toBe(text);
  });
  it('retains decoded and encoded memory limits', () => {
    expect(() => decodeBase64(Buffer.from('a'.repeat(100001)).toString('base64'))).toThrow();
    expect(() => binaryToText('01100001 '.repeat(100001))).toThrow();
    expect(() => decodeBase64(' '.repeat(800001))).toThrow();
    expect(() => binaryToText(' '.repeat(2700001))).toThrow();
    expect(() => encodeBase64('a'.repeat(100001))).toThrow();
  });
  const next = (expr: string, date: Date, count = 1) => computeNextRuns(parseCron(expr).parsed!, count, date).map(d => [d.getMonth()+1,d.getDate(),d.getHours()]);
  it('honors stepped days and weekdays', () => {
    expect(next('0 0 */2 * *', new Date(2026,8,1,12))).toEqual([[9,3,0]]);
    expect(next('0 0 * * */2', new Date(2026,8,6,12))).toEqual([[9,8,0]]);
  });
  it('uses cron wildcard AND and restricted DOM/DOW OR semantics', () => {
    expect(next('0 0 */2 * 1', new Date(2026,8,1,12))).toEqual([[9,7,0]]);
    expect(next('0 0 2 * 1', new Date(2026,8,1,12), 2)).toEqual([[9,2,0],[9,7,0]]);
    expect(next('0 0 2 * */2', new Date(2026,8,1,12))).toEqual([[1,2,0]]);
    expect(next('0 0 7 * */2', new Date(2026,8,6,12))).toEqual([[11,7,0]]);
  });
  it('retains POSIX literal backslashes inside double quotes', () => {
    expect(parseCurl('curl https://example.com -d "a\\qb"').body).toBe('a\\qb');
    expect(shellWords('"a\\qb" "a\\\"b" "a\\$b" "a\\`b" "a\\\\b"')).toEqual(['a\\qb','a"b','a$b','a`b','a\\b']);
    expect(shellWords('"a\\\nb" \'\' "" x\\ y')).toEqual(['ab','','','x y']);
    expect(shellWords('curl \\\n https://example.com')).toEqual(['curl','https://example.com']);
    expect(parseCurl('curl https://example.com -d ""').body).toBe('');
  });
  // Independent ISO-BMFF ftyp boxes: size, type, major brand, minor version, compatible brands.
  const ftyp = (major: string, compatible: string[] = []) => {
    const bytes = new Uint8Array(16 + 4*compatible.length);
    new DataView(bytes.buffer).setUint32(0, bytes.length);
    bytes.set(new TextEncoder().encode('ftyp'+major), 4);
    bytes.set(new TextEncoder().encode(compatible.join('')), 16);
    return bytes;
  };
  it('recognizes AVIF brands only inside a bounded ftyp box', () => {
    expect(imageSignature(ftyp('avif'))).toBe('image/avif');
    expect(imageSignature(ftyp('mif1', ['miaf','avif']))).toBe('image/avif');
    expect(imageSignature(ftyp('avis', ['avif']))).toBe('image/avif');
    expect(imageSignature(ftyp('heic'))).toBeNull();
    expect(imageSignature(new Uint8Array(readFileSync(new URL('../scripts/qa/regressions/fixtures/red-2x2.avif', import.meta.url))))).toBe('image/avif');
    const extended = new Uint8Array(24);
    new DataView(extended.buffer).setUint32(0, 1);
    extended.set(new TextEncoder().encode('ftyp'), 4);
    new DataView(extended.buffer).setUint32(12, 24);
    extended.set(new TextEncoder().encode('avif'), 16);
    expect(imageSignature(extended)).toBe('image/avif');
    new DataView(extended.buffer).setUint32(8, 1);
    expect(imageSignature(extended)).toBeNull();
    const unaligned = new Uint8Array(17); unaligned.set(ftyp('avif')); new DataView(unaligned.buffer).setUint32(0, 17);
    expect(imageSignature(unaligned)).toBeNull();
    const truncated = ftyp('avif'); new DataView(truncated.buffer).setUint32(0, 32);
    expect(imageSignature(truncated)).toBeNull();
    const tooShort = ftyp('avif'); new DataView(tooShort.buffer).setUint32(0, 12);
    expect(imageSignature(tooShort)).toBeNull();
    const outside = new Uint8Array(20); outside.set(ftyp('mif1')); outside.set(new TextEncoder().encode('avif'), 16);
    expect(imageSignature(outside)).toBeNull();
    expect(imageSignature(ftyp('mif1').slice(0, 11))).toBeNull();
  });
});
