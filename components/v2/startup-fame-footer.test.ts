import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Startup Fame footer badge', () => {
  it('renders the official listing link once with the supplied badge metadata', () => {
    const html = renderToStaticMarkup(createElement(Footer));

    const listingLinks = html.match(/href="https:\/\/startupfa\.me\/s\/toolblip\?utm_source=toolblip\.com"/g) ?? [];
    expect(listingLinks).toHaveLength(1);
    expect(html).toContain('src="/directory-badges/startup-fame.webp"');
    expect(html).toContain('alt="Toolblip - Featured on Startup Fame"');
    expect(html).toContain('width="171"');
    expect(html).toContain('height="54"');
  });

  it('records the official Startup Fame image source once', () => {
    const provenance = JSON.parse(
      readFileSync('public/directory-badges/sources.json', 'utf8'),
    ) as { assets: Array<{ name: string; source: string; file?: string }> };
    const startupFameAssets = provenance.assets.filter((asset) => asset.name === 'Startup Fame');

    expect(startupFameAssets).toHaveLength(1);
    expect(startupFameAssets[0]).toMatchObject({
      name: 'Startup Fame',
      source: 'https://startupfa.me/badges/featured-badge.webp',
      file: 'startup-fame.webp',
    });
  });
});
