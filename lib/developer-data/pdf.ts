export type PdfBlock = { text: string; heading?: boolean; code?: boolean };
/** Text-only PDF export. Browser print is retained for Unicode and rich content. */
export async function textPdf(blocks: PdfBlock[]): Promise<ArrayBuffer> {
  const text = blocks.map(b => b.text).join('\n');
  if (text.length > 100000) throw new Error('PDF text exceeds 100,000 characters.');
  if (/[^\x09\x0a\x0d\x20-\x7e]/.test(text)) throw new Error('Direct PDF supports ASCII text. Use Print / Save PDF for Unicode.');
  if (!text.trim()) throw new Error('No text to export.');
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  let y = 20;
  for (const block of blocks) {
    doc.setFont(block.code ? 'courier' : 'helvetica', block.heading ? 'bold' : 'normal');
    doc.setFontSize(block.heading ? 18 : 11);
    const lines = doc.splitTextToSize(block.text.replace(/\t/g, '    '), 170) as string[];
    for (const line of lines) {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(line, 20, y); y += 7;
    }
    y += 4;
  }
  return doc.output('arraybuffer');
}
