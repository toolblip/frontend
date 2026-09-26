import { expect, it } from 'vitest';
import { validateSchema } from './schema';
import { cleanNotebook, notebookExample, notebook } from './notebook';
import { formatSql } from './sql';
const validate = (value: unknown, schema: unknown) => validateSchema(JSON.stringify(value), JSON.stringify(schema));
it('restores schema patterns, including nested alternatives', () => {
    expect(validate('ABC', { type: 'string', pattern: '^[A-Z]+$' })).toEqual([]);
    expect(validate('abc', { pattern: '^[A-Z]+$' })).toHaveLength(1);
    expect(validate({ name: 'abc' }, { properties: { name: { anyOf: [{ pattern: '^[A-Z]+$' }, { pattern: '^abc$' }] } } })).toEqual([]);
});
it.each([
    ['email', 'a@example.com', 'invalid'],
    ['uri', 'https://example.com/path', 'not a uri'],
    ['date-time', '2024-02-29T12:30:00Z', '2023-02-29T12:30:00Z'],
    ['ipv4', '192.168.0.1', '999.1.2.3'],
])('restores supported format %s', (format, good, bad) => {
    expect(validate(good, { format })).toEqual([]);
    expect(validate(bad, { format })).toHaveLength(1);
});
it('removes private notebook metadata while preserving kernel/language and cell content', () => {
    const n = JSON.parse(notebookExample);
    n.metadata = { ...n.metadata, language_info: { name: 'python' }, private_note: 'secret', widgets: { state: 'private' }, custom: 42 };
    const cleaned = cleanNotebook(JSON.stringify(n));
    expect(cleaned.metadata).toEqual({ kernelspec: n.metadata.kernelspec, language_info: n.metadata.language_info });
    expect(cleaned.cells[0]).toEqual(n.cells[0]);
});
it('cleans substantial saved notebook outputs', () => {
    const n = JSON.parse(notebookExample);
    n.cells[1].outputs[0].text = ['x'.repeat(150_000)];
    const text = JSON.stringify(n);
    expect(notebook(text).cells[1].outputs[0].text[0]).toHaveLength(150_000);
    expect(cleanNotebook(text).cells[1].outputs).toEqual([]);
});
it.each(['caféfrom', 'cafe\u0301from', 'বাংলাfrom', '表from', '𐐀from'])('preserves Unicode identifier %s', name => {
    expect(formatSql(`SELECT ${name} FROM t;`)).toBe(`SELECT ${name}\nFROM t;`);
});
it('treats backslash literally in standard SQL', () => {
    expect(formatSql("SELECT '\\';")).toBe("SELECT '\\';");
    expect(formatSql("SELECT 'it''s';")).toBe("SELECT 'it''s';");
});

it('uses explicit SQL escape modes without changing quoted identifiers', () => {
    expect(formatSql("SELECT 'it\\'s';", true, 2, 'mysql')).toBe("SELECT 'it\\'s';");
    expect(formatSql("SELECT E'it\\'s';", true, 2, 'postgresql')).toBe("SELECT E'it\\'s';");
    expect(formatSql("SELECT '\\';", true, 2, 'postgresql')).toBe("SELECT '\\';");
    expect(formatSql('SELECT "path\\" FROM t;', true, 2, 'postgresql')).toBe('SELECT "path\\"\nFROM t;');
    expect(() => formatSql("SELECT 'it\\'s';")).toThrow(/quote/);
});

import { rasterDataUrl } from './browser';
const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
it('retains a real bounded PNG data URL', () => expect(rasterDataUrl(png)).toBe(true));
it.each([
    'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=',
    'data:image/png;base64,PHN2Zz48L3N2Zz4=',
    'data:image/png;base64,!!!!',
    'data:text/html;base64,PHNjcmlwdD4=',
    'data:image/png;base64,' + 'A'.repeat(8_000_000),
])('rejects unsafe or malformed raster URL', url => expect(rasterDataUrl(url)).toBe(false));
it('retains notebook depth/node/UTF-8 byte budgets', () => {
    const n = JSON.parse(notebookExample);
    n.metadata.deep = JSON.parse('['.repeat(65) + '0' + ']'.repeat(65));
    expect(() => notebook(JSON.stringify(n))).toThrow(/nesting/);
    n.metadata = { many: Array(100001).fill(0) };
    expect(() => notebook(JSON.stringify(n))).toThrow(/100,000 values/);
    n.metadata = { text: '表'.repeat(3_500_000) };
    expect(() => notebook(JSON.stringify(n))).toThrow(/bytes/);
});
it.each([
    ['jpeg', '/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKpAB//Z'],
    ['gif', 'R0lGODlhAQABAIAAAExpcf///yH5BAUAAAAALAAAAAABAAEAAAICTAEAOw=='],
    ['webp', 'UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAUAmJaQAA3AA/vz0AAA='],
])('accepts a real %s raster and rejects MIME spoofing', (format, base64) => {
    expect(rasterDataUrl(`data:image/${format};base64,${base64}`)).toBe(true);
    expect(rasterDataUrl(`data:image/png;base64,${base64}`)).toBe(false);
});
it('bounds and checks pattern syntax, and does not apply string keywords to other types', () => {
    expect(() => validate('ABC', { pattern: 'a'.repeat(2049) })).toThrow(/2,048/);
    expect(() => validate('ABC', { pattern: '[' })).toThrow(/Invalid schema pattern/);
    expect(validate(123, { pattern: '^abc$', format: 'email' })).toEqual([]);
});
it('removes custom language metadata but preserves version and kernel details', () => {
    const n = JSON.parse(notebookExample);
    n.metadata.language_info = { name: 'python', version: '3.12', private_note: 'secret' };
    expect(cleanNotebook(JSON.stringify(n)).metadata).toEqual({ kernelspec: n.metadata.kernelspec, language_info: { name: 'python', version: '3.12' } });
});
