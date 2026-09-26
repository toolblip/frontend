import { PDFDocument } from 'pdf-lib';

// These limits apply only to the PDF worker's tools, before previews or exports.
export function assertPdfFileSize(file: { size: number }) {
  if (file.size > 25 * 1024 * 1024) throw new Error('Choose a file of 25 MB or less.');
}

export function assertPdfDocument(doc: PDFDocument) {
  const pages = doc.getPages();
  if (!pages.length || pages.length > 100) throw new Error('Choose a PDF with 1 to 100 pages.');
  for (const page of pages) {
    const { width, height } = page.getSize();
    if (![width, height].every(n => Number.isFinite(n) && n > 0 && n <= 2000)) {
      throw new Error('PDF page dimensions must be between 1 and 2000 points.');
    }
  }
  return doc;
}

export async function loadPdfForTools(bytes: Uint8Array | ArrayBuffer) {
  assertPdfFileSize({ size: bytes.byteLength });
  return assertPdfDocument(await PDFDocument.load(bytes));
}

export async function unlockPdfBytes(
  source: Uint8Array,
  password: string,
  renderEncrypted: (bytes: Uint8Array, password: string) => Promise<Uint8Array>,
) {
  assertPdfFileSize({ size: source.byteLength });
  // Inspect encryption metadata only. Never save or copy an encrypted document.
  const doc = assertPdfDocument(await PDFDocument.load(source, { ignoreEncryption: true }));
  if (!doc.isEncrypted) return { bytes: await doc.save(), flattened: false };
  const bytes = await renderEncrypted(source, password);
  await loadPdfForTools(bytes); // Never advertise encrypted/corrupt output as unlocked.
  return { bytes, flattened: true };
}

export async function readPdfToolFile(file: File) {
  assertPdfFileSize(file);
  return file.arrayBuffer();
}
