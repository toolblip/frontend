import { describe, expect, it } from 'vitest';
import { X_LIMITS, limitStatus } from './character-limits';

describe('character limit presets', () => {
  it('lists the four X limits', () => {
    expect(X_LIMITS.map(p => [p.id, p.limit])).toEqual([['post', 280], ['bio', 160], ['name', 50], ['username', 15]]);
  });

  it('reports remaining characters and flips to over only past the limit', () => {
    expect(limitStatus(0, 280)).toEqual({ remaining: 280, over: false });
    expect(limitStatus(280, 280)).toEqual({ remaining: 0, over: false });
    expect(limitStatus(281, 280)).toEqual({ remaining: -1, over: true });
  });
});
