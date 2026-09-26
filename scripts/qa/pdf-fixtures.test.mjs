import test from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument, PDFName, decodePDFRawStream } from 'pdf-lib';
import { fixture, encryptedFixture, pageOperators, hasText, imageObjects } from './helpers/pdf-fixtures.mjs';
import cases from './cases/pdf.mjs';

test('all eleven assigned routes have independent browser cases', () => {
  assert.equal(cases.length,11); assert.equal(new Set(cases.map(c=>c.slug)).size,11);
  for (const c of cases) assert.equal(typeof c.test,'function');
});
test('geometry, text and image fixtures carry known real PDF objects', async () => {
  const doc=await PDFDocument.load(await fixture({image:true}));
  assert.deepEqual(doc.getPages().map(p=>[p.getWidth(),p.getHeight()]),[[321,456],[420,300],[240,360]]);
  assert(hasText(pageOperators(doc,1),'FIXTURE_2'));
  const image=imageObjects(doc,0)[0]; assert(image);
  assert.equal(image.dict.get(PDFName.of('Width')).asNumber(),2);
  assert.deepEqual([...decodePDFRawStream(image).decode()].slice(0,6),[255,0,0,0,255,0]);
  const mask=doc.context.lookup(image.dict.get(PDFName.of('SMask')));
  assert.deepEqual(mask.dict.lookup(PDFName.of('Decode')).asArray().map(value => value.asNumber()), [0,1]);
  assert.deepEqual([...decodePDFRawStream(mask).decode()],[255,128,255,0]);
});
test('encrypted fixture rejects missing/wrong passwords and decrypts exact password with PDF.js', async () => {
  const bytes=encryptedFixture();
  await assert.rejects(()=>PDFDocument.load(bytes),/encrypted/i);
  const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs');
  for (const password of ['', 'incorrect', 'secret']) {
    const task=pdfjs.getDocument({data:new Uint8Array(bytes),password,useSystemFonts:true});
    try { await assert.rejects(()=>task.promise,/password/i); } finally { await task.destroy(); }
  }
  const task=pdfjs.getDocument({data:new Uint8Array(bytes),password:' secret ',useSystemFonts:true});
  try {
    const doc=await task.promise; assert.equal(doc.numPages,1);
    const page=await doc.getPage(1); assert.deepEqual(page.view,[0,0,321,456]);
    assert.equal((await page.getTextContent()).items.map(item=>item.str).join(''),'SECRET_FIXTURE');
  } finally { await task.destroy(); }
});

test('nested Form fixture contains resolved image and mask streams', async () => {
  const doc=await PDFDocument.load(await fixture({image:true,nested:true}));
  const formRef=doc.getPage(0).node.Resources().lookup(PDFName.of('XObject')).entries()[0][1];
  const form=doc.context.lookup(formRef);
  const imageRef=form.dict.lookup(PDFName.of('Resources')).lookup(PDFName.of('XObject')).entries()[0][1];
  const image=doc.context.lookup(imageRef);
  assert.equal(image.dict.get(PDFName.of('Subtype')),PDFName.of('Image'));
  const mask=doc.context.lookup(image.dict.get(PDFName.of('SMask')));
  assert.deepEqual(mask.dict.lookup(PDFName.of('Decode')).asArray().map(value => value.asNumber()), [0,1]);
  assert.deepEqual([...decodePDFRawStream(mask).decode()],[255,128,255,0]);
});
