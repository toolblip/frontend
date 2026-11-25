import { describe, expect, it } from 'vitest';
import { fixSpacing } from './punctuation-spacing';

describe('fixSpacing', () => {
  it('removes the space before punctuation and collapses repeated spaces', () => {
    expect(fixSpacing('This  is  messy . She waited here ! Then she left .')).toBe('This is messy. She waited here! Then she left.');
  });

  it('keeps line breaks and blank lines between paragraphs', () => {
    expect(fixSpacing('First  line .\nSecond   line\n\nNew paragraph  !')).toBe('First line.\nSecond line\n\nNew paragraph!');
  });

  it('trims spaces at the start and end of each line, and tabs become one space', () => {
    expect(fixSpacing('  a\tb  \n   c  ')).toBe('a b\nc');
  });

  it('also removes the space after a closing quote, bracket or accented letter', () => {
    expect(fixSpacing('He said \u201Chi\u201D !')).toBe('He said \u201Chi\u201D!');
    expect(fixSpacing('See (this) , and [that] .')).toBe('See (this), and [that].');
    expect(fixSpacing('Très bien !')).toBe('Très bien!');
  });

  it('leaves numbers and opening quotes alone', () => {
    expect(fixSpacing('Ratio 3 : 1 and \u201C . x')).toBe('Ratio 3 : 1 and \u201C . x');
  });

  it('does not pull punctuation on the next line up to the previous word', () => {
    expect(fixSpacing('word\n. next')).toBe('word\n. next');
  });
});
