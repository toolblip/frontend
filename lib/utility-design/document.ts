import { PDFDocument, StandardFonts } from 'pdf-lib';
/** Preserve text exactly or report unsupported encoding; never silently drop characters. */
export async function documentPdf(text: string) {
  if (!text.trim()) throw new Error('Complete the document fields first.');
  if (text.length > 100000) throw new Error('Limit the document to 100000 characters.');
  const pdf = await PDFDocument.create(), font = await pdf.embedFont(StandardFonts.Helvetica);
  try { font.encodeText(text.replace(/\n/g, '')); }
  catch { throw new Error('PDF export supports Latin characters only. Download TXT to preserve this document’s characters.'); }
  let page = pdf.addPage([612, 792]), y = 736;
  const draw = (line: string) => { if(y < 56) {page=pdf.addPage([612,792]); y=736;} page.drawText(line,{x:56,y,size:10.5,font}); y-=14; };
  for(const paragraph of text.split('\n')) {
    let line='';
    for(const character of paragraph) {
      if(font.widthOfTextAtSize(line+character,10.5)>500) {draw(line); line='';}
      line+=character;
    }
    draw(line);
  }
  return pdf.save();
}
