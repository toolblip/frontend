import { createHash } from 'node:crypto';
import { PDFDocument, PDFName, PDFRawStream, PDFArray, decodePDFRawStream } from 'pdf-lib';
import UPNG from 'upng-js';

export const pngPixels = Uint8Array.from([255,0,0,255, 0,255,0,128, 0,0,255,255, 255,255,0,0]);
export const png = Buffer.from(UPNG.encode([pngPixels.buffer], 2, 2, 0));
export async function fixture({ pages = [[321,456],[420,300],[240,360]], image = false, jpeg, nested = false } = {}) {
  const doc = await PDFDocument.create();
  for (const [i, size] of pages.entries()) {
    const p = doc.addPage(size);
    p.drawText(`FIXTURE_${i + 1}`, { x: 24, y: 120, size: 18 });
    if (jpeg && i === 0) p.drawImage(await doc.embedJpg(jpeg), { x: 60, y: 20, width: 40, height: 40 });
    if (image && i === 0) p.drawImage(await doc.embedPng(png), { x: 20, y: 20, width: 40, height: 40 });
  }
  if (nested) {
    const output = await PDFDocument.create();
    const source = await PDFDocument.load(await doc.save());
    const embedded = await output.embedPage(source.getPage(0));
    output.addPage([321,456]).drawPage(embedded);
    return Buffer.from(await output.save());
  }
  return Buffer.from(await doc.save());
}
export function pageOperators(doc, index) {
  const contents = doc.getPage(index).node.Contents();
  const streams = contents instanceof PDFArray ? contents.asArray().map(ref => doc.context.lookup(ref)) : [contents];
  return streams.filter(s => s instanceof PDFRawStream).map(s => Buffer.from(decodePDFRawStream(s).decode()).toString('latin1')).join('\n');
}
export function hasText(operators, text) {
  return operators.toLowerCase().includes(Buffer.from(text).toString('hex').toLowerCase()) || operators.includes(`(${text})`);
}
export function imageObjects(doc, index) {
  const objects = doc.getPage(index).node.Resources()?.lookup(PDFName.of('XObject'));
  return objects?.entries().map(([, ref]) => doc.context.lookup(ref)).filter(o => o instanceof PDFRawStream && o.dict.get(PDFName.of('Subtype')) === PDFName.of('Image')) ?? [];
}

// Independent, real Standard Security R2/RC4 PDF. Not a mock or an Encrypt-only marker.
const padding = Buffer.from('28bf4e5e4e758a4164004e56fffa01082e2e00b6d0683e802f0ca9fe6453697a','hex');
const md5 = bytes => createHash('md5').update(bytes).digest();
const pad = value => Buffer.concat([Buffer.from(value, 'latin1').subarray(0,32), padding]).subarray(0,32);
function rc4(key, bytes) {
  const s = Array.from({length:256}, (_,i) => i); let j=0;
  for (let i=0;i<256;i++) { j=(j+s[i]+key[i%key.length])&255; [s[i],s[j]]=[s[j],s[i]]; }
  let i=0;j=0; return Buffer.from(bytes.map(byte => { i=(i+1)&255;j=(j+s[i])&255;[s[i],s[j]]=[s[j],s[i]];return byte^s[(s[i]+s[j])&255]; }));
}
export function encryptedFixture(password = ' secret ') {
  const id = md5(Buffer.from('toolblip-pdf-independent-fixture'));
  const owner = rc4(md5(pad('owner-fixture')).subarray(0,5), pad(password));
  const permissions = Buffer.alloc(4); permissions.writeInt32LE(-4);
  const key = md5(Buffer.concat([pad(password),owner,permissions,id])).subarray(0,5);
  const user = rc4(key,padding);
  const objectKey = md5(Buffer.concat([key,Buffer.from([4,0,0,0,0])])).subarray(0,10);
  const content = rc4(objectKey, Buffer.from('1 0 0 rg 20 20 120 60 re f\nBT /F1 20 Tf 30 200 Td (SECRET_FIXTURE) Tj ET\n'));
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 321 456] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    Buffer.concat([Buffer.from(`<< /Length ${content.length} >>\nstream\n`),content,Buffer.from('endstream')]),
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Filter /Standard /V 1 /R 2 /Length 40 /O <${owner.toString('hex')}> /U <${user.toString('hex')}> /P -4 >>`,
  ];
  const chunks=[Buffer.from('%PDF-1.4\n')];const offsets=[0];let size=chunks[0].length;
  for (let i=0;i<objects.length;i++) { offsets.push(size); const object=Buffer.concat([Buffer.from(`${i+1} 0 obj\n`),Buffer.from(objects[i]),Buffer.from('\nendobj\n')]);chunks.push(object);size+=object.length; }
  chunks.push(Buffer.from(`xref\n0 7\n0000000000 65535 f \n${offsets.slice(1).map(o=>`${String(o).padStart(10,'0')} 00000 n \n`).join('')}trailer\n<< /Size 7 /Root 1 0 R /Encrypt 6 0 R /ID [<${id.toString('hex')}> <${id.toString('hex')}>] >>\nstartxref\n${size}\n%%EOF\n`));
  return Buffer.concat(chunks);
}
