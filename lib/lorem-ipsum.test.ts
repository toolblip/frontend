import { describe, it, expect } from 'vitest';
import { generateLorem } from '@/lib/lorem-ipsum';

describe('generateLorem', () => {
  it('returns the requested number of words', () => {
    expect(generateLorem(5, 'words', true).split(/\s+/)).toEqual([
      'Lorem',
      'ipsum',
      'dolor',
      'sit',
      'amet',
    ]);
  });

  it('returns the requested number of real sentences', () => {
    const text = generateLorem(5, 'sentences', true);
    const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
    expect(sentences).toHaveLength(5);
    expect(text.startsWith('Lorem ipsum')).toBe(true);
    expect(text.startsWith('Lorem. ipsum.')).toBe(false);
  });

  it('returns the requested number of paragraphs without a period after every word', () => {
    const text = generateLorem(3, 'paragraphs', true);
    const paragraphs = text.split(/\n\n/).filter(Boolean);
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0].startsWith('Lorem ipsum')).toBe(true);
    expect(paragraphs[0].startsWith('Lorem. ipsum.')).toBe(false);
    expect((paragraphs[0].match(/\./g) ?? []).length).toBeLessThan(
      paragraphs[0].split(/\s+/).length / 2,
    );
  });
});
