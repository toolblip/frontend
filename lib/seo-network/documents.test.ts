import { expect, it } from 'vitest';
import { validDate } from './documents';
it('rejects calendar rollover and accepts complete W3C dates', () => {
  expect(validDate('2024-02-29')).toBe(true);
  expect(validDate('2023-02-29')).toBe(false);
  expect(validDate('2024-02-30T12:30:00Z')).toBe(false);
  expect(validDate('2024-02-29T12:30:00+06:00')).toBe(true);
  expect(validDate('yesterday')).toBe(false);
});
