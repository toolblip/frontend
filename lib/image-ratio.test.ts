import { describe, it, expect } from 'vitest';
import { gcd, nearestCommonRatio, simplifyRatio } from '@/lib/image-ratio';

describe('gcd', () => {
  it('finds the greatest common divisor', () => {
    expect(gcd(1920, 1080)).toBe(120);
    expect(gcd(800, 600)).toBe(200);
  });
});

describe('simplifyRatio', () => {
  it('reduces 1920×1080 to 16:9', () => {
    expect(simplifyRatio(1920, 1080)).toEqual({ w: 16, h: 9, decimal: 1920 / 1080 });
  });

  it('returns zeros for invalid input', () => {
    expect(simplifyRatio(0, 1080)).toEqual({ w: 0, h: 0, decimal: 0 });
  });
});

describe('nearestCommonRatio', () => {
  it('matches 16:9 within 2%', () => {
    expect(nearestCommonRatio(16 / 9)?.label).toBe('16:9 Widescreen');
  });

  it('returns null when far from a named preset', () => {
    expect(nearestCommonRatio(1.41)).toBeNull();
  });
});
