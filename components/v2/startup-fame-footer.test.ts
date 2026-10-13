import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Startup Fame footer badge', () => {
  it('renders the official listing link with the supplied badge metadata', () => {
    const html = renderToStaticMarkup(createElement(Footer));

    const listingLinks = html.match(/href="https:\/\/startupfa\.me\/s\/toolblip\?utm_source=toolblip\.com"/g) ?? [];
    expect(listingLinks).toHaveLength(2); // footer track + aria-hidden marquee copy
    expect(html).toContain('src="https://startupfa.me/badges/featured-badge.webp"');
    expect(html).toContain('alt="Toolblip - Featured on Startup Fame"');
    expect(html).toContain('width="171"');
    expect(html).toContain('height="54"');
  });
});
