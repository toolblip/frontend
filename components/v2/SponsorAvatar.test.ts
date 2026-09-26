import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sponsorFaviconSrc } from './SponsorAvatar';

describe('sponsorFaviconSrc', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each(['skaleagents.com', 'SkaleAgents.COM', 'www.skaleagents.com', 'WWW.SkaleAgents.COM'])(
    'uses the bundled official logo for %s instead of the cached favicon',
    (domain) => {
      expect(sponsorFaviconSrc(domain)).toBe('/sponsor-logos/skaleagents.svg');
    },
  );

  it.each([64, 128, 256])('uses the bundled logo at size %i', (size) => {
    expect(sponsorFaviconSrc('skaleagents.com', size)).toBe('/sponsor-logos/skaleagents.svg');
  });

  it('prefixes the bundled logo with the configured app base path', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/preview/toolblip');
    expect(sponsorFaviconSrc('WWW.SkaleAgents.COM')).toBe(
      '/preview/toolblip/sponsor-logos/skaleagents.svg',
    );
  });

  it.each([
    ['example.com', 32, '/api/favicon?domain=example.com&sz=64'],
    ['example.com', 64, '/api/favicon?domain=example.com&sz=64'],
    ['WWW.Example.COM', 65, '/api/favicon?domain=WWW.Example.COM&sz=128'],
    ['example.com', 128, '/api/favicon?domain=example.com&sz=128'],
    ['example.com', 141, '/api/favicon?domain=example.com&sz=256'],
    ['x.com/example', 256, '/api/favicon?domain=x.com%2Fexample&sz=256'],
    ['app.skaleagents.com', 128, '/api/favicon?domain=app.skaleagents.com&sz=128'],
    ['skaleagents.com.example.com', 128, '/api/favicon?domain=skaleagents.com.example.com&sz=128'],
  ])('preserves favicon proxy behavior for %s at size %i', (domain, size, expected) => {
    expect(sponsorFaviconSrc(domain, size)).toBe(expected);
  });

  it('preserves the default proxy size for other domains', () => {
    expect(sponsorFaviconSrc('example.com')).toBe('/api/favicon?domain=example.com&sz=128');
  });
});
