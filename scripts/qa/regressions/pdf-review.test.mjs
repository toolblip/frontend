import test from 'node:test';
import assert from 'node:assert/strict';
import { transform } from 'esbuild';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { PDFDocument, PDFName, PDFDict, PDFRawStream, StandardFonts, decodePDFRawStream } from 'pdf-lib';
import { croppedReviewFixture, decodeReviewFixture } from './pdf-review-fixtures.mjs';
import { readFile } from 'node:fs/promises';
import UPNG from 'upng-js';
import { reviewPdfPlacement, reviewPdfImageDecode } from './pdf-review.mjs';

// Compile the real helper, without starting the app or changing the harness.
const require = createRequire(import.meta.url);
const source = await readFile(new URL('../../../lib/pdf-qa/geometry.ts',import.meta.url),'utf8');
const compiled = await transform(source, {loader:'ts',format:'esm'});
const code = compiled.code.replace('"pdf-lib"', JSON.stringify(pathToFileURL(require.resolve('pdf-lib')).href));
const { drawInVisiblePage } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

for (const rotation of [0,90,180,270]) for (const rectangular of [false,true]) {
  test(`PDF.js independently reads exported text axes and size: rotate ${rotation}, rectangular ${rectangular}`, async () => {
    const doc = await PDFDocument.load(await croppedReviewFixture(rotation,rectangular));
    const page = doc.getPage(0); const font = await doc.embedFont(StandardFonts.Helvetica);
    const signature = await doc.embedPng(UPNG.encode([Uint8Array.from([255,0,0,255,0,255,0,255]).buffer],2,1,0));
    await drawInVisiblePage(page, ({height}) => {
      page.drawText('REVIEW', { x:20, y:height-50, size:20, font });
      page.drawRectangle({ x:20, y:height-140, width:80, height:30 });
      page.drawImage(signature, {x:20,y:height-90,width:120,height:60});
    });
    // Content after the helper must not inherit its transform.
    page.drawText('UNTOUCHED', { x:180, y:300, size:10, font });
    const task = pdfjs.getDocument({data:await doc.save(),useSystemFonts:true});
    try {
      const result = await task.promise; const p = await result.getPage(1);
      const view = p.getViewport({scale:1});
      assert.deepEqual([view.width,view.height], rectangular ? (rotation%180 ? [300,400] : [400,300]) : [400,400]);
      const items = (await p.getTextContent()).items;
      const added = items.find(item=>item.str==='REVIEW'); assert(added);
      const transform = pdfjs.Util.transform(view.transform, added.transform);
      [20,0,0,-20,20,50].forEach((value,i)=>assert(Math.abs(transform[i]-value)<0.001,`axis ${i}: ${transform[i]} != ${value}`));
      assert.equal(items.find(item=>item.str==='UNTOUCHED').transform[4],180);
      assert.equal(items.find(item=>item.str==='UNTOUCHED').transform[5],300);
      assert.deepEqual(page.getCropBox(), {x:100,y:200,width:400,height:rectangular?300:400});
      assert.equal(page.getRotation().angle,rotation);
      const operators = await p.getOperatorList();
      let ctm = [1,0,0,1,0,0]; const stack = [], imageMatrices = [];
      operators.fnArray.forEach((fn,i) => {
        if (fn===pdfjs.OPS.save) stack.push(ctm.slice());
        else if (fn===pdfjs.OPS.restore) ctm=stack.pop();
        else if (fn===pdfjs.OPS.transform) ctm=pdfjs.Util.transform(ctm,operators.argsArray[i]);
        else if (fn===pdfjs.OPS.paintImageXObject) imageMatrices.push(pdfjs.Util.transform(view.transform,ctm));
      });
      assert.equal(imageMatrices.length,1);
      [120,0,0,-60,20,90].forEach((value,i)=>assert(Math.abs(imageMatrices[0][i]-value)<0.001));
    } finally { await task.destroy(); }
  });
}

test('JPEG fixture retains actual original JPEG bytes under explicit defaults', async () => {
  const jpeg = await readFile(new URL('../../../public/samples/image-resizer-mountain.jpg',import.meta.url));
  const doc = await PDFDocument.load(await decodeReviewFixture({jpeg}));
  const objects = doc.getPage(0).node.Resources().lookup(PDFName.of('XObject'),PDFDict);
  const image = doc.context.lookup(objects.entries()[0][1],PDFRawStream);
  assert.deepEqual(Buffer.from(image.contents),jpeg);
});

test('independent fixture is a real Flate image, including explicit default dictionaries', async () => {
  const doc = await PDFDocument.load(await decodeReviewFixture({indirect:true}));
  const objects = doc.getPage(0).node.Resources().lookup(PDFName.of('XObject'),PDFDict);
  const image = doc.context.lookup(objects.entries()[0][1],PDFRawStream);
  assert.equal(image.dict.lookup(PDFName.of('Filter')),PDFName.of('FlateDecode'));
  assert.equal(image.dict.lookup(PDFName.of('Decode')).size(),6);
  assert.equal(image.dict.lookup(PDFName.of('DecodeParms'),PDFDict).lookup(PDFName.of('Predictor')).asNumber(),1);
  assert.deepEqual([...decodePDFRawStream(image).decode()],[255,0,0,0,255,0,0,0,255,250,160,30]);
});


test('review checks are reusable named functions, not duplicate route cases', () => {
  assert.equal(typeof reviewPdfPlacement,'function');
  assert.equal(typeof reviewPdfImageDecode,'function');
});
