import { describe, expect, it } from 'vitest';
import { dynamic, metadata } from './page';

describe('/tools metadata', () => {
  it('is static with one canonical title', () => {
    expect(dynamic).toBe('force-static');
    expect(metadata.title).toBe('Free Online Developer Tools | Toolblip');
    expect(metadata.alternates?.canonical).toBe('https://toolblip.com/tools');
  });
});
