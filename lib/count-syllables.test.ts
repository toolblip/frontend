import { describe, expect, it } from 'vitest';
import { countPolysyllables, countSyllables, countSyllablesInText } from './count-syllables';

describe('countSyllables', () => {
  it('counts common words', () => {
    expect(countSyllables('hello')).toBe(2);
    expect(countSyllables('beautiful')).toBe(4); // beau-ti-ful (+ silent e rule)
    expect(countSyllables('syllable')).toBe(3);
    expect(countSyllables('world')).toBe(1);
    expect(countSyllables('important')).toBe(3);
    expect(countSyllables('extraordinary')).toBe(5);
  });

  it('counts phrase totals for reading stats example', () => {
    const text = `Clear writing helps readers finish your article. Short sentences and familiar words keep the score easy to read. Longer sentences with uncommon vocabulary make the text harder for a general audience.

This sample has two paragraphs so you can see word counts, reading time, and readability scores update together.`;
    expect(countSyllablesInText(text)).toBe(81);
  });

  it('counts polysyllables for SMOG', () => {
    expect(countPolysyllables('extraordinary vocabulary important')).toBe(3);
  });
});
