import { describe, expect, it } from 'vitest';
import { generateMetadata } from './page';

const meta = (category?: string) =>
  generateMetadata({ searchParams: Promise.resolve({ category }) });

describe('/tools metadata', () => {
  it('uses the base title without a category', async () => {
    expect((await meta()).title).toBe('Free Online Developer Tools | Toolblip');
  });

  it('does not double "Tools" for categories already ending in Tools', async () => {
    const m = await meta('pdf tools');
    expect(m.title).toBe('PDF Tools — Free Online | Toolblip');
    expect(String(m.description)).toContain('Browse free PDF tools on Toolblip.');
    expect(String(m.description)).not.toMatch(/Tools tools/i);
  });

  it('appends Tools to plain category labels', async () => {
    const m = await meta('Text');
    expect(m.title).toBe('Text Tools — Free Online | Toolblip');
    expect(String(m.description)).toContain('Browse free Text tools on Toolblip.');
  });
});
