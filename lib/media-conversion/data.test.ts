import { describe, it, expect } from 'vitest';
import { parseBase, finiteNumber, temperature, parseCsv, csvString, rowsToXml, markdownTable, sqlToJson } from './data';
import { units } from './units';
describe('exact integer and unit conversions', () => {
  it('preserves integers above Number precision and negative signs', () => {
    expect(parseBase('9007199254740993', 10).toString(16)).toBe('20000000000001');
    expect(parseBase('-0xFF', 16)).toBe(-255n); expect(parseBase('0b1010', 2)).toBe(10n); expect(parseBase('zz', 36)).toBe(1295n);
  });
  it.each(['12junk', '12.5', '', '0x10', 'Infinity'])('rejects the complete invalid decimal %s', value => expect(() => parseBase(value, 10)).toThrow());
  it('enforces digits, bases and length limits', () => {
    expect(() => parseBase('102', 2)).toThrow(); expect(() => parseBase('1', 1)).toThrow(); expect(() => parseBase('1'.repeat(4097), 10)).toThrow();
  });
  it('handles temperatures, absolute zero and invalid numeric input', () => {
    expect(temperature(100, 'c', 'f')).toBe(212); expect(temperature(-40, 'f', 'c')).toBe(-40); expect(temperature(0, 'k', 'c')).toBe(-273.15);
    expect(() => temperature(-1, 'k', 'c')).toThrow(); expect(() => finiteNumber('')).toThrow(); expect(() => finiteNumber('12x')).toThrow(); expect(() => finiteNumber('1e999')).toThrow();
  });
  it('uses exact SI factors for common conversions', () => {
    expect(units.length.find(u => u.value === 'mi')!.factor).toBe(1609.344);
    expect(units.weight.find(u => u.value === 'lb')!.factor).toBe(0.45359237);
    expect(units.speed.find(u => u.value === 'kmh')!.factor * 36).toBe(10);
    expect(units.volume.find(u => u.value === 'gal')!.factor).toBe(3.785411784);
  });
});
describe('CSV/XML', () => {
  it('preserves quoted CRLF, commas, empty fields and quotes', () => {
    const input = 'name,note,last\r\nAda,"Hello,\r\n""world""",\r\n';
    const rows = [['name', 'note', 'last'], ['Ada', 'Hello,\r\n"world"', '']];
    expect(parseCsv(input)).toEqual(rows); expect(parseCsv(csvString(rows))).toEqual(rows);
  });
  it.each(['a,b\n1', 'a,"open', 'a,b\n"a"x,b', 'ab"c,d'])('rejects malformed CSV %s', s => expect(() => parseCsv(s)).toThrow());
  it('preserves duplicate and invalid tag names in attributes', () => {
    expect(rowsToXml([['1 bad', '1 bad'], ['<a>', 'A & B']])).toContain('<field name="1 bad">&lt;a&gt;</field>');
    expect(rowsToXml([['1 bad', '1 bad'], ['<a>', 'A & B']])).toContain('<field name="1 bad">A &amp; B</field>');
    expect(() => rowsToXml([['x'], ['\0']])).toThrow();
  });
});
describe('SQL literal parser', () => {
  it('handles empty strings, doubled quotes, comments and literal punctuation', () => {
    const input = "-- comment\nINSERT INTO users (id, name, note, active) VALUES (1,'O''Brien','a,); -- b',TRUE), (2,'',' ',NULL);";
    expect(JSON.parse(sqlToJson(input))).toEqual([{ id: 1, name: "O'Brien", note: 'a,); -- b', active: true }, { id: 2, name: '', note: ' ', active: null }]);
  });
  it('does not mutate prototypes for table or column names', () => expect(JSON.parse(sqlToJson('INSERT INTO __proto__ (__proto__) VALUES (1);'))).toEqual(JSON.parse('[{"__proto__":1}]')));
  it('merges multiple tables without losing rows', () => expect(JSON.parse(sqlToJson('INSERT INTO a VALUES (1); INSERT INTO b VALUES (2); INSERT INTO a VALUES (3);'))).toEqual({ a: [{ col1: 1 }, { col1: 3 }], b: [{ col1: 2 }] }));
  it.each(["INSERT INTO x (a,b) VALUES (1);", 'INSERT INTO x VALUES (NOW());', "INSERT INTO x VALUES ('broken);", 'INSERT INTO x VALUES (9007199254740993);', 'garbage INSERT INTO x VALUES (1);', 'INSERT INTO x VALUES (1),;', '/* unterminated'])('rejects incomplete/unsupported SQL %s', s => expect(() => sqlToJson(s)).toThrow());
});
describe('Markdown replacement regression coverage', () => {
  it('keeps approved simple-example behavior', () => expect(markdownTable('[{"name":"Ada","role":"Engineer"},{"name":"Alan","role":"Scientist"}]')).toBe('| name | role |\n| --- | --- |\n| Ada | Engineer |\n| Alan | Scientist |'));
  it('unions headers and escapes pipes/newlines/HTML/nested values', () => {
    const result = markdownTable('[{"a|b":"<x>\\nnext"},{"other":{"x":1}}]');
    expect(result).toContain('a\\|b'); expect(result).toContain('&lt;x&gt;<br>next'); expect(result).toContain('{"x":1}');
  });
  it.each(['[{},null]', '[{},1]', '[]', '{}'])('rejects invalid row shapes %s', s => expect(() => markdownTable(s)).toThrow());
});
