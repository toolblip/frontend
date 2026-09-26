import * as XLSX from 'xlsx';
import { PDFDocument, StandardFonts } from 'pdf-lib';
export type Sheet = { name: string; rows: string[][] };
/** Bound ZIP expansion before handing the archive to SheetJS. XLSX only. */
export function validateWorkbookZip(bytes: Uint8Array) {
  if (bytes.length > 5 * 1024 * 1024 || bytes.length < 22) throw new Error('Use an XLSX file between 22 bytes and 5 MB.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let end = bytes.length - 22;
  while (end >= Math.max(0, bytes.length - 65557) && view.getUint32(end, true) !== 0x06054b50) end--;
  if (end < Math.max(0, bytes.length - 65557)) throw new Error('Invalid XLSX ZIP directory.');
  const count = view.getUint16(end + 10, true);
  let offset = view.getUint32(end + 16, true), total = 0;
  if (count > 1000 || count === 0) throw new Error('Workbook contains too many ZIP entries.');
  for (let i = 0; i < count; i++) {
    if (offset + 46 > bytes.length || view.getUint32(offset, true) !== 0x02014b50) throw new Error('Invalid XLSX ZIP entry.');
    if (view.getUint16(offset + 8, true) & 1) throw new Error('Encrypted workbooks are unsupported.');
    total += view.getUint32(offset + 24, true);
    if (total > 30 * 1024 * 1024) throw new Error('Expanded workbook exceeds 30 MB.');
    offset += 46 + view.getUint16(offset + 28, true) + view.getUint16(offset + 30, true) + view.getUint16(offset + 32, true);
  }
}
export function readSheets(bytes: Uint8Array): Sheet[] {
  validateWorkbookZip(bytes);
  const book = XLSX.read(bytes, { type: 'array', cellFormula: false, cellHTML: false, cellStyles: false });
  if (!book.SheetNames.length || book.SheetNames.length > 50) throw new Error('Use a workbook with 1–50 sheets.');
  return book.SheetNames.map(name => {
    const sheet = book.Sheets[name];
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
    if (range.e.r >= 10000 || range.e.c >= 200 || (range.e.r + 1) * (range.e.c + 1) > 100000) throw new Error('Maximum 10,000 rows, 200 columns and 100,000 cells per sheet.');
    return { name, rows: XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, raw: false, defval: '', blankrows: true }) };
  });
}
export function exampleWorkbook(): Uint8Array {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([['name', 'note'], ['Ada', 'Hello, world'], ['Grace', 'A & B']]), 'People');
  XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([['amount'], [42]]), 'Numbers');
  return new Uint8Array(XLSX.write(book, { type: 'array', bookType: 'xlsx' }));
}
/** Plain cell values, wrapped and paginated. No spreadsheet layout/formula engine claims. */
export async function sheetPdf(sheet: Sheet): Promise<Uint8Array> {
  if (!sheet.rows.length) throw new Error('Selected sheet is empty.');
  if (sheet.rows.reduce((n, r) => n + r.join('').length, 0) > 100000) throw new Error('PDF export is limited to 100,000 characters.');
  const pdf = await PDFDocument.create(); const font = await pdf.embedFont(StandardFonts.Helvetica);
  let page = pdf.addPage([842, 595]), y = 560;
  const write = (line: string) => {
    if (y < 35) { page = pdf.addPage([842, 595]); y = 560; }
    if (pdf.getPageCount() > 200) throw new Error('PDF export exceeds 200 pages.');
    page.drawText(line, { x: 30, y, size: 10, font }); y -= 14;
  };
  try {
    for (const row of [[`Sheet: ${sheet.name}`], ...sheet.rows]) {
      for (const raw of row.join(' | ').replace(/\t/g, '    ').split(/\r\n?|\n/)) {
        let line = '';
        for (const char of raw) {
          if (font.widthOfTextAtSize(line + char, 10) > 780) { write(line); line = ''; }
          line += char;
        }
        write(line);
      }
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('encode')) throw new Error('PDF font cannot represent this text. Export CSV/XML for Unicode content.');
    throw e;
  }
  return pdf.save();
}
