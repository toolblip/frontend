import { describe, it, expect } from 'vitest';
import { sortLines, TEXT_SORTER_EXAMPLE } from '@/lib/text-sort';

const sample = ['cherry', 'apple', 'Banana', '10', '2'];

describe('sortLines', () => {
  it('sorts A to Z case-insensitively', () => {
    expect(sortLines(sample.join('\n'), 'az', false)).toEqual([
      '10',
      '2',
      'apple',
      'Banana',
      'cherry',
    ]);
  });

  it('sorts numbers by value in numeric mode', () => {
    expect(sortLines(['10', '2', '100'].join('\n'), 'numeric', false)).toEqual([
      '2',
      '10',
      '100',
    ]);
  });

  it('drops blank lines and keeps spacing on the rest', () => {
    expect(sortLines('b\n\n a \n', 'az', false)).toEqual([' a ', 'b']);
  });

  it('keeps the first casing when removing duplicates', () => {
    expect(sortLines('Apple\napple\nBanana', 'unique', false)).toEqual([
      'Apple',
      'Banana',
    ]);
  });

  it('sorts a single space-separated line into separate items', () => {
    expect(sortLines('apple Banana cherry Apple', 'az', false)).toEqual([
      'apple',
      'Apple',
      'Banana',
      'cherry',
    ]);
  });

  it('sorts a single comma-separated line', () => {
    expect(sortLines('cherry, apple, Banana', 'az', false)).toEqual([
      'apple',
      'Banana',
      'cherry',
    ]);
  });
});

describe('TEXT_SORTER_EXAMPLE', () => {
  it('is real multiline input, not a single placeholder line', () => {
    expect(TEXT_SORTER_EXAMPLE.includes('\n')).toBe(true);
    expect(sortLines(TEXT_SORTER_EXAMPLE, 'az', false).length).toBeGreaterThan(1);
  });
});
