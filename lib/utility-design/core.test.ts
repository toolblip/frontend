import { describe, it, expect } from 'vitest';
import { ageBetween, dateOnly, zonedInstant, zoneParts, randomIntegers, ipv6, csvRows } from './core';
import { isIP } from 'node:net';
describe('utility-design correctness', () => {
  it('clamps month ends and leap birthdays without negative days', () => {
    expect(ageBetween('2024-01-31', '2024-03-01')).toMatchObject({ years: 0, months: 1, days: 1, totalDays: 30 });
    expect(ageBetween('2000-02-29', '2023-02-28')).toMatchObject({ years: 23, months: 0, days: 0, daysUntilBirthday: 0 });
    expect(() => dateOnly('2024-02-30')).toThrow();
  });
  it('uses DST, fractional offsets and actual calendar rollover', () => {
    expect(zoneParts(zonedInstant('2024-07-01', '12:00', 'America/New_York'), 'Europe/London')).toBe('2024-07-01T17:00');
    expect(zoneParts(zonedInstant('2024-01-01', '00:00', 'Asia/Kolkata'), 'UTC')).toBe('2023-12-31T18:30');
    expect(() => zonedInstant('2024-03-10', '02:30', 'America/New_York')).toThrow(/does not exist/);
    expect(() => zonedInstant('2024-11-03', '01:30', 'America/New_York')).toThrow(/twice/);
  });
  it('handles zero bounds and full unique ranges', () => {
    expect(randomIntegers(0, 0, 1, true)).toEqual([0]);
    expect(randomIntegers(-2, 2, 5, true).sort()).toEqual([-1, -2, 0, 1, 2]);
    expect(() => randomIntegers(2, 1, 1, false)).toThrow();
    expect(() => randomIntegers(0, 0, 2, true)).toThrow();
  });
  it('produces valid full, compressed and EUI-64 addresses', () => {
    const b = new Uint8Array(16); b[8] = 0x10; b[9] = 0x20; b[10] = 0x30; b[11] = 0x40; b[12] = 0x50; b[13] = 0x60;
    for (const f of ['full','compressed','eui64']) expect(isIP(ipv6(f,b))).toBe(6);
    expect(ipv6('eui64',b)).toBe('0000:0000:0000:0000:1220:30ff:fe40:5060');
    expect(ipv6('compressed',new Uint8Array(16))).toBe('::');
  });
  it('preserves multiline fields and rejects malformed CSV', () => {
    expect(csvRows('name,note\r\n"A,B","line1\nline2"\r\nC,"say ""hi"""\r\n')).toEqual(['name,note','"A,B","line1\nline2"','C,"say ""hi"""']);
    expect(() => csvRows('x\n"open')).toThrow(/Unclosed/);
    expect(() => csvRows('x\n"a"bad')).toThrow();
  });
});
