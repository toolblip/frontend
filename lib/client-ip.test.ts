import { describe, expect, it } from 'vitest';
import { clientIp, isCloudflareIp } from './client-ip';

const h = (init: Record<string, string>) => new Headers(init);

describe('clientIp', () => {
  it('trusts cf-connecting-ip only when the peer is Cloudflare', () => {
    expect(clientIp(h({ 'x-forwarded-for': '172.70.1.2', 'cf-connecting-ip': '8.8.8.8' }))).toBe('8.8.8.8');
    expect(clientIp(h({ 'x-forwarded-for': '2a06:98c3::1', 'cf-connecting-ip': '8.8.4.4' }))).toBe('8.8.4.4');
  });

  it('ignores a spoofed cf-connecting-ip from a direct hit', () => {
    expect(clientIp(h({ 'x-forwarded-for': '203.0.113.9', 'cf-connecting-ip': '10.0.0.1' }))).toBe('203.0.113.9');
    expect(clientIp(h({ 'cf-connecting-ip': '10.0.0.1' }))).toBeUndefined();
    expect(clientIp(h({ 'x-forwarded-for': '172.70.1.2, 203.0.113.9', 'cf-connecting-ip': '10.0.0.1' }))).toBe('203.0.113.9');
  });

  it('matches Cloudflare ranges', () => {
    expect(isCloudflareIp('104.16.0.1')).toBe(true);
    expect(isCloudflareIp('104.32.0.1')).toBe(false);
    expect(isCloudflareIp('2606:4700:10::6816:1')).toBe(true);
    expect(isCloudflareIp('2a06:98c8::1')).toBe(false);
    expect(isCloudflareIp('not-an-ip')).toBe(false);
  });
});
