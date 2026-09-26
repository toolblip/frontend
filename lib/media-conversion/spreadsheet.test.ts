import { describe, it, expect } from 'vitest';
import * as XLSX from 'xlsx';
import { PDFDocument } from 'pdf-lib';
import { exampleWorkbook, readSheets, sheetPdf, validateWorkbookZip } from './spreadsheet';
describe('real XLSX and PDF export', () => {
  it('reads cells from both sheets of an actual OOXML ZIP', () => {
    const bytes = exampleWorkbook(); expect([...bytes.slice(0, 4)]).toEqual([80, 75, 3, 4]);
    expect(readSheets(bytes)).toEqual([{ name: 'People', rows: [['name', 'note'], ['Ada', 'Hello, world'], ['Grace', 'A & B']] }, { name: 'Numbers', rows: [['amount'], ['42']] }]);
  });
  it('does not turn strings into formulas or lose leading zeroes', () => {
    const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([['code', 'text'], ['001', '=1+1']]), 'Test');
    const bytes = new Uint8Array(XLSX.write(book, { type: 'array', bookType: 'xlsx' }));
    expect(readSheets(bytes)[0].rows[1]).toEqual(['001', '=1+1']); expect(XLSX.read(bytes).Sheets.Test.B2.f).toBeUndefined();
  });
  it('rejects fake Excel HTML and oversized archive expansion', () => {
    expect(() => readSheets(new TextEncoder().encode('<html>fake spreadsheet</html>'))).toThrow();
    const bytes = exampleWorkbook(); const v = new DataView(bytes.buffer); const end = bytes.length - 22; const directory = v.getUint32(end + 16, true); v.setUint32(directory + 24, 100000000, true);
    expect(() => validateWorkbookZip(bytes)).toThrow('30 MB');
  });
  it('paginates real PDF text and rejects unsupported glyphs without fake success', async () => {
    const bytes = await sheetPdf({ name: 'Example', rows: Array.from({ length: 120 }, (_, n) => [String(n), 'A'.repeat(200)]) });
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe('%PDF-'); const pdf = await PDFDocument.load(bytes); expect(pdf.getPageCount()).toBeGreaterThan(3);
    await expect(sheetPdf({ name: 'Example', rows: [['বাংলা']] })).rejects.toThrow('font');
  });
});
