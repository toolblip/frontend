import { describe, expect, it } from 'vitest';
import { toSmartQuotes, toStraightQuotes } from './smart-quotes';

describe('toSmartQuotes', () => {
  it('opens and closes double quotes', () => {
    expect(toSmartQuotes('She said "hello" to him.')).toBe('She said “hello” to him.');
    expect(toSmartQuotes('"Start" and (\"bracket\")')).toBe('“Start” and (“bracket”)');
  });

  it('uses an apostrophe inside words and for possessive plurals', () => {
    expect(toSmartQuotes("don't and dogs' bowls")).toBe('don’t and dogs’ bowls');
  });

  it('opens single quotes after a space and closes them after a word', () => {
    expect(toSmartQuotes("He said 'go' twice")).toBe('He said ‘go’ twice');
    expect(toSmartQuotes("'Quoted' at start")).toBe('‘Quoted’ at start');
  });

  it("keeps an apostrophe for elided decades like '90s", () => {
    expect(toSmartQuotes("the '90s")).toBe('the ’90s');
  });

  it('nests double and single quotes', () => {
    expect(toSmartQuotes('"She said \'hi\'"')).toBe('“She said ‘hi’”');
  });

  it('round-trips with straight quotes', () => {
    const smart = toSmartQuotes('"It\'s fine," she said.');
    expect(toStraightQuotes(smart)).toBe('"It\'s fine," she said.');
  });
});
