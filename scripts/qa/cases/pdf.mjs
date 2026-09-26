import { reviewPdfPlacement, reviewPdfImageDecode } from '../regressions/pdf-review.mjs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, PDFName, decodePDFRawStream } from 'pdf-lib';
import UPNG from 'upng-js';
import { fixture, encryptedFixture, png, pageOperators, hasText, imageObjects } from '../helpers/pdf-fixtures.mjs';

const slugs = ['pdf-password-remover','add-pages-to-pdf','annotate-pdf','edit-pdf','extract-images-from-pdf','merge-pdfs','pdf-rearrange','delete-pages-from-pdf','sign-pdf','unlock-pdf','add-watermark-to-pdf'];
const dimensions = [[321,456],[420,300],[240,360]];
const upload = (buffer, name = 'fixture.pdf') => ({ name, mimeType: 'application/pdf', buffer });
const clearButton = tool => tool.getByRole('button', { name: 'Clear', exact: true }).first();
const input = (tool, slug) => slug === 'add-pages-to-pdf' ? tool.getByLabel('Base PDF', { exact: true }) : tool.getByLabel('PDF file', { exact: true }).first();
const errors = tool => tool.locator('[role="alert"], .tb-v2-banner-err, .tb-pdf-add-result.error');

export default slugs.map(slug => ({ slug, async test({ page, tool, check, expect, artifactsDir }) {
  let number = 0;
  const prove = (value, description) => { check(value, description); expect(value, description).toBe(true); };
  const bytes = await fixture();
  async function clear() {
    if (await clearButton(tool).isEnabled()) await clearButton(tool).click();
    await expect(tool.getByRole('button', { name: /^Download/ })).toHaveCount(0);
  }
  async function load(buffer = bytes, name = 'fixture.pdf') {
    if (buffer.length > 25 * 1024 * 1024) {
      await mkdir(artifactsDir, { recursive: true });
      const source = path.join(artifactsDir, name);
      await writeFile(source, buffer);
      await input(tool, slug).setInputFiles(source);
    } else await input(tool, slug).setInputFiles(upload(buffer, name));
  }
  async function download(button) {
    const [file] = await Promise.all([page.waitForEvent('download'), button.click()]); await mkdir(artifactsDir, { recursive: true });
    const destination = path.join(artifactsDir, `${slug}-${++number}-${file.suggestedFilename()}`);
    await file.saveAs(destination); // Required: do not use download.path().
    return readFile(destination);
  }
  async function pdf(button, expected = dimensions, order = expected.map((_,i)=>i+1)) {
    const result = await download(button); const doc = await PDFDocument.load(result);
    prove(!doc.isEncrypted && doc.getPageCount() === expected.length, `Download is a readable, unencrypted ${expected.length}-page PDF`);
    expected.forEach(([width,height], i) => {
      const size = doc.getPage(i).getSize();
      prove(size.width === width && size.height === height, `Page ${i+1} geometry is ${width} by ${height} points`);
      if (order[i]) prove(hasText(pageOperators(doc,i), `FIXTURE_${order[i]}`), `Page ${i+1} retains independent source text FIXTURE_${order[i]}`);
    });
    return doc;
  }
  await clear();
  // All routes: real malformed, excessive-page, oversized and excessive-geometry inputs.
  const tooMany = await fixture({ pages: Array.from({length:101},()=>[100,100]) });
  const tooLarge = await fixture({ pages: [[30000,30000]] });
  for (const [data, name, reason] of [
    [Buffer.from('%PDF-1.7\nthis is not a document'), 'malformed.pdf', 'malformed bytes'],
    [tooMany, 'too-many.pdf', '101 pages'],
    [tooLarge, 'huge-page.pdf', '30000-point page geometry'],
    [Buffer.alloc(26*1024*1024), 'oversize.pdf', '26 MB file'],
  ]) {
    await load(data,name); await expect(errors(tool).first()).toBeVisible();
    prove(await tool.getByRole('button',{name:/^Download/}).count() === 0, `Rejects ${reason} without a downloadable result`); await clear();
  }
  const unlock = slug === 'unlock-pdf' || slug === 'pdf-password-remover';
  if (!unlock) {
    await load(encryptedFixture(),'encrypted.pdf'); await expect(errors(tool).first()).toBeVisible();
    prove(await tool.getByRole('button',{name:/^Download/}).count() === 0, 'Encrypted input is rejected without fabricated output'); await clear();
  }
  // Controlled read failure, then retry. Only the failure path is mocked.
  await page.evaluate(() => {
    const original = File.prototype.arrayBuffer;
    window.__pdfOriginalRead = original;
    File.prototype.arrayBuffer = function() {
      if (this.name === 'read-error.pdf') return Promise.reject(new Error('Controlled QA read failure'));
      if (this.name === 'cancel.pdf') return new Promise(resolve => { window.__pdfReleaseRead = async () => { resolve(await original.call(this)); }; });
      return original.call(this);
    };
  });
  try {
    await load(bytes,'read-error.pdf'); await expect(errors(tool).first()).toBeVisible(); await clear();
    await load(bytes,'cancel.pdf'); await expect(clearButton(tool)).toBeEnabled(); await clearButton(tool).click();
    await page.evaluate(async () => { await window.__pdfReleaseRead(); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
    await expect(tool.getByRole('button',{name:/^Download/})).toHaveCount(0);
    await expect(clearButton(tool)).toBeDisabled();
    prove(true,'Clear invalidates a pending file read; late bytes cannot repopulate the tool');
  } finally { await page.evaluate(() => { File.prototype.arrayBuffer = window.__pdfOriginalRead; }); }
  // Examples are generated by the app, separately from the independent output fixture.
  await tool.getByRole('button',{name:/^Examples?$/}).click();
  await expect(clearButton(tool)).toBeEnabled();
  const ready = {
    'add-pages-to-pdf': tool.getByRole('button',{name:/Select insert page 2/}),
    'annotate-pdf': tool.getByRole('button',{name:'Add Markup',exact:true}),
    'edit-pdf': tool.getByRole('button',{name:'Text',exact:true}),
    'extract-images-from-pdf': tool.getByRole('button',{name:'Download',exact:true}),
    'merge-pdfs': tool.getByRole('button',{name:'Merge PDF',exact:true}),
    'pdf-rearrange': tool.getByRole('button',{name:'Move page 3 up',exact:true}),
    'delete-pages-from-pdf': tool.getByRole('button',{name:'Page 4, kept',exact:true}),
    'sign-pdf': tool.getByLabel('Signature name'),
    'add-watermark-to-pdf': tool.getByLabel('Watermark text'),
  }[slug] ?? tool.getByLabel(/Password \(only needed/);
  await expect(ready).toBeVisible(); prove(true,'Example loads usable sample controls after error recovery'); await clear();

  if (unlock) {
    const secret = encryptedFixture(); await load(secret,'encrypted.pdf');
    const password = tool.getByLabel(/Password \(only needed/);
    await expect(password).toBeVisible();
    await tool.getByRole('checkbox').check();
    await password.fill('incorrect'); await tool.getByRole('button',{name:'Unlock PDF',exact:true}).click();
    await expect(errors(tool).first()).toBeVisible();
    await expect(tool.getByRole('button',{name:'Download PDF',exact:true})).toHaveCount(0);
    // Hold a real canvas callback to deterministically cancel rendering, without faking bytes.
    await page.evaluate(() => {
      window.__pdfOriginalToBlob = HTMLCanvasElement.prototype.toBlob;
      HTMLCanvasElement.prototype.toBlob = function(callback, ...args) {
        return window.__pdfOriginalToBlob.call(this, blob => { window.__pdfReleaseCanvas = () => callback(blob); }, ...args);
      };
    });
    await password.fill(' secret '); await tool.getByRole('button',{name:'Unlock PDF',exact:true}).click();
    try {
      await page.waitForFunction(() => typeof window.__pdfReleaseCanvas === 'function');
      await clearButton(tool).click();
      await page.evaluate(() => window.__pdfReleaseCanvas());
      await expect(tool.getByRole('button',{name:'Download PDF',exact:true})).toHaveCount(0);
      prove(true,'Clear cancels real encrypted-page rendering before a late canvas callback returns');
    } finally { await page.evaluate(() => { HTMLCanvasElement.prototype.toBlob = window.__pdfOriginalToBlob; }); }
    await load(secret,'encrypted.pdf'); await tool.getByRole('checkbox').check();
    await password.fill(' secret '); await tool.getByRole('button',{name:'Unlock PDF',exact:true}).click();
    const output = await download(tool.getByRole('button',{name:'Download PDF',exact:true}));
    prove(!output.equals(secret),'Unlock produced new bytes, not an unchanged encrypted copy');
    const doc = await PDFDocument.load(output);
    prove(!doc.isEncrypted && doc.getPageCount() === 1,'Real RC4 encrypted fixture opens without password after correct-password retry');
    prove(doc.getPage(0).getWidth() === 321 && doc.getPage(0).getHeight() === 456,'Flattening preserves page dimensions');
    const images = imageObjects(doc,0); prove(images.length === 1,'Flattened page contains a real rendered image');
    const samples = decodePDFRawStream(images[0]).decode(); let red = 0;
    for (let i=0;i<samples.length;i+=3) if(samples[i]>220 && samples[i+1]<40 && samples[i+2]<40) red++;
    prove(red > 1000,'Decrypted source red rectangle survives in rendered pixel data');
    await password.fill('new input'); await expect(tool.getByRole('button',{name:'Download PDF',exact:true})).toHaveCount(0);
    await clear(); await load(); await tool.getByRole('checkbox').check(); await tool.getByRole('button',{name:'Unlock PDF',exact:true}).click();
    await pdf(tool.getByRole('button',{name:'Download PDF',exact:true}));
  } else if (slug === 'merge-pdfs') {
    await input(tool,slug).setInputFiles([upload(await fixture({pages:[[321,456]]}),'a.pdf'),upload(await fixture({pages:[[420,300],[240,360]]}),'b.pdf')]);
    await tool.getByRole('button',{name:'Move b.pdf up',exact:true}).click();
    await tool.getByRole('button',{name:'Merge PDF',exact:true}).click();
    await pdf(tool.getByRole('button',{name:'Download merged PDF',exact:true}),[[420,300],[240,360],[321,456]],[1,2,1]);
    await tool.getByRole('button',{name:'Move b.pdf down',exact:true}).click();
    await expect(tool.getByRole('button',{name:/Download merged/})).toHaveCount(0);
  } else if (slug === 'pdf-rearrange') {
    await load(); await tool.getByRole('button',{name:'Move page 3 up',exact:true}).click();
    await tool.getByRole('button',{name:'Move page 3 up',exact:true}).click();
    await tool.getByRole('button',{name:/Rotate/}).first().click();
    await tool.getByRole('button',{name:'Save reordered PDF',exact:true}).click();
    const doc = await pdf(tool.getByRole('button',{name:'Download reordered PDF',exact:true}),[dimensions[2],dimensions[0],dimensions[1]],[3,1,2]);
    prove(doc.getPage(0).getRotation().angle === 90,'Rotation is persisted as 90 degrees on moved page');
  } else if (slug === 'delete-pages-from-pdf') {
    await load(); await tool.getByRole('button',{name:'Select all',exact:true}).click();
    await expect(tool.getByRole('button',{name:'Delete 3 pages',exact:true})).toBeDisabled();
    prove(true,'Deleting every page is prevented'); await tool.getByRole('button',{name:'Deselect all',exact:true}).click();
    await tool.getByRole('button',{name:'Page 2, kept',exact:true}).click(); await tool.getByRole('button',{name:'Delete 1 page',exact:true}).click();
    await pdf(tool.getByRole('button',{name:'Download edited PDF',exact:true}),[dimensions[0],dimensions[2]],[1,3]);
  } else if (slug === 'add-pages-to-pdf') {
    await load(); await expect(tool.getByRole('button',{name:'Select page 3',exact:true})).toBeVisible();
    await tool.getByLabel('Insert PDFs',{exact:true}).setInputFiles(upload(await fixture({pages:[[200,250]]}),'insert.pdf'));
    await tool.getByRole('button',{name:'Select insert page 1 from insert.pdf',exact:true}).click();
    await tool.getByRole('button',{name:'Beginning',exact:true}).click(); await tool.getByRole('button',{name:'Insert selected pages',exact:true}).click();
    await tool.getByRole('tab',{name:'Blank pages',exact:true}).click(); await tool.getByRole('button',{name:'End',exact:true}).click();
    await tool.getByLabel('Number of blank pages').fill('1'); await tool.getByRole('button',{name:'Insert selected pages',exact:true}).click();
    await tool.getByRole('button',{name:'Save Edited PDF',exact:true}).click();
    const doc = await pdf(tool.getByRole('button',{name:'Download Edited PDF',exact:true}),[[200,250],...dimensions,dimensions[0]],[1,1,2,3,0]);
    prove(pageOperators(doc,4).trim() === '', 'Inserted blank page has no content stream and uses base dimensions');
    await tool.getByRole('button',{name:'Move page 2 up',exact:true}).click(); await expect(tool.getByRole('button',{name:'Download Edited PDF',exact:true})).toHaveCount(0);
  } else if (slug === 'annotate-pdf') {
    await load(); await tool.getByRole('button',{name:'Text',exact:true}).click();
    await tool.getByLabel('Comment or label').fill('QA_COMMENT'); await tool.getByLabel('Markup left').fill('30'); await tool.getByLabel('Markup top').fill('40'); await tool.getByLabel('Text font size').fill('24');
    await tool.getByRole('button',{name:'Add Markup',exact:true}).click();
    await tool.getByRole('button',{name:'Rectangle',exact:true}).click(); await tool.getByLabel('Markup width').fill('80'); await tool.getByLabel('Markup height').fill('30');
    await tool.getByRole('button',{name:'Add Markup',exact:true}).click();
    await tool.getByRole('button',{name:'Highlight',exact:true}).click(); await tool.getByRole('button',{name:'Add Markup',exact:true}).click();
    const doc = await pdf(tool.getByRole('button',{name:'Export Annotated PDF',exact:true})); const ops=pageOperators(doc,0);
    prove(hasText(ops,'QA_COMMENT') && /1 0 0 1 30 392 Tm/.test(ops),'Text annotation stores known label at x=30, baseline=456-40-24');
    prove(/80 0 l/.test(ops) && /80 30 l/.test(ops),'Rectangle geometry is 80 by 30 points');
    const states=doc.getPage(0).node.Resources().lookup(PDFName.of('ExtGState'));
    prove(states.entries().some(([,ref])=>doc.context.lookup(ref).get(PDFName.of('ca'))?.asNumber()===0.28),'Highlight uses actual 0.28 fill opacity');
  } else if (slug === 'edit-pdf') {
    await load(); await tool.getByRole('button',{name:'Text',exact:true}).click(); await tool.getByLabel('Text to add').fill('QA_EDIT');
    await tool.getByLabel('Text size').fill('20');
    const surface=tool.getByRole('button',{name:'Click the PDF page to place text',exact:true});
    await surface.click({position:{x:40,y:60}});
    const doc = await pdf(tool.getByRole('button',{name:'Save and Download PDF',exact:true}));
    prove(hasText(pageOperators(doc,0),'QA_EDIT'),'Text edit produces a real PDF text operator');
    await tool.getByRole('button',{name:'Image',exact:true}).click(); await tool.getByLabel('Image file',{exact:true}).setInputFiles({name:'patch.png',mimeType:'image/png',buffer:png});
    await tool.getByRole('button',{name:'Click the PDF page to place image',exact:true}).click({position:{x:60,y:100}});
    const imageDoc=await pdf(tool.getByRole('button',{name:'Save and Download PDF',exact:true}));
    prove(imageObjects(imageDoc,0).length===1,'Image mode embeds image XObject');
    await tool.getByRole('button',{name:'Select PDF text: FIXTURE_1',exact:true}).click();
    await tool.getByLabel('Selected PDF text').fill('QA_REPLACEMENT'); await tool.getByRole('button',{name:'Save text',exact:true}).click();
    const replaced=await pdf(tool.getByRole('button',{name:'Save and Download PDF',exact:true}));
    prove(hasText(pageOperators(replaced,0),'QA_REPLACEMENT') && pageOperators(replaced,0).includes('1 1 1 rg'),'Replacement overlays new text and an opaque white rectangle');
    await expect(tool.getByText(/this is not secure redaction/)).toBeVisible();
  } else if (slug === 'sign-pdf') {
    await load(); await tool.getByRole('tab',{name:'Type',exact:true}).click(); await tool.getByLabel('Signature name').fill('');
    await tool.getByRole('button',{name:/Sign PDF$/}).click(); await expect(errors(tool).first()).toBeVisible();
    await tool.getByLabel('Signature name').fill('Ada Fixture'); await tool.getByLabel('Position X (pt from left)',{exact:true}).fill('25'); await tool.getByLabel('Position Y (pt from bottom)',{exact:true}).fill('35');
    await tool.getByRole('button',{name:/Sign PDF$/}).click(); const doc=await pdf(tool.getByRole('button',{name:'Download signed PDF',exact:true}));
    prove(imageObjects(doc,0).length===1 && imageObjects(doc,1).length===0,'Signature image is added only to selected page');
    prove(pageOperators(doc,0).includes('1 0 0 1 25 35 cm'),'Signature placement is 25,35 PDF points');
    await tool.getByRole('tab',{name:'Draw',exact:true}).click();
    const canvas=tool.locator('canvas').first(); const box=await canvas.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box.x+20,box.y+30); await page.mouse.down(); await page.mouse.move(box.x+100,box.y+60,{steps:8}); await page.mouse.up();
    await tool.getByLabel('Page to sign',{exact:true}).selectOption('1');
    await tool.getByRole('button',{name:/Sign PDF$/}).click(); const drawn=await pdf(tool.getByRole('button',{name:'Download signed PDF',exact:true}));
    prove(imageObjects(drawn,0).length===0 && imageObjects(drawn,1).length===1,'Draw mode signs page two without changing page one');
    await tool.getByLabel('Page to sign',{exact:true}).selectOption('0');
    await tool.getByRole('tab',{name:'Upload',exact:true}).click(); await tool.getByLabel('Image file',{exact:true}).setInputFiles({name:'signature.png',mimeType:'image/png',buffer:png});
    await expect(tool.getByAltText('Uploaded signature')).toBeVisible(); await tool.getByRole('button',{name:/Sign PDF$/}).click();
    const uploaded=await pdf(tool.getByRole('button',{name:'Download signed PDF',exact:true})); prove(imageObjects(uploaded,0)[0].dict.get(PDFName.of('Width')).asNumber()===2,'Uploaded signature retains source image pixels');
  } else if (slug === 'add-watermark-to-pdf') {
    await load(); await tool.getByLabel('Watermark text').fill(''); await tool.getByRole('button',{name:'Add Watermark',exact:true}).click(); await expect(errors(tool).first()).toBeVisible();
    await tool.getByLabel('Watermark text').fill('QA_WATERMARK'); await tool.getByLabel('Rotation (degrees)').fill('0'); await tool.getByRole('button',{name:'Add Watermark',exact:true}).click();
    const doc=await pdf(tool.getByRole('button',{name:'Download PDF',exact:true}));
    prove(doc.getPages().every((_,i)=>hasText(pageOperators(doc,i),'QA_WATERMARK')),'Text watermark is embedded on every page');
    await tool.getByRole('button',{name:'Image',exact:true}).click(); await tool.getByLabel('Image file',{exact:true}).setInputFiles({name:'watermark.png',mimeType:'image/png',buffer:png});
    await tool.getByRole('button',{name:'Add Watermark',exact:true}).click(); const imageDoc=await pdf(tool.getByRole('button',{name:'Download PDF',exact:true}));
    prove(imageDoc.getPages().every((_,i)=>imageObjects(imageDoc,i).length===1),'Image watermark is embedded on every page');
  } else if (slug === 'extract-images-from-pdf') {
    await load(await fixture({image:true}));
    const result=await download(tool.getByRole('button',{name:'Download',exact:true})); const decoded=UPNG.decode(result.buffer.slice(result.byteOffset,result.byteOffset+result.byteLength));
    const rgba=new Uint8Array(UPNG.toRGBA8(decoded)[0]);
    prove(decoded.width===2 && decoded.height===2 && rgba[0]===255 && rgba[3]===255 && rgba[5]===255 && rgba[7]===128 && rgba[15]===0,'Extracted PNG retains 2x2 RGB pixels and soft-mask transparency');
    const zip=await download(tool.getByRole('button',{name:'Download All as ZIP',exact:true}));
    const nameLength=zip.readUInt16LE(26), extraLength=zip.readUInt16LE(28), size=zip.readUInt32LE(18);
    prove(zip.readUInt32LE(0)===0x04034b50 && zip.subarray(30+nameLength+extraLength,30+nameLength+extraLength+size).equals(result),'ZIP contains exactly the independently validated extracted PNG bytes');
    await clear(); await load(await fixture({image:true,nested:true}));
    const nested=await download(tool.getByRole('button',{name:'Download',exact:true}));
    const nestedPng=UPNG.decode(nested.buffer.slice(nested.byteOffset,nested.byteOffset+nested.byteLength));
    prove(nestedPng.width===2 && new Uint8Array(UPNG.toRGBA8(nestedPng)[0])[7]===128,'Images nested in Form XObjects preserve transparency');
    const jpg=await readFile(new URL('../../../public/samples/image-resizer-mountain.jpg',import.meta.url));
    await clear(); await load(await fixture({jpeg:jpg}));
    const extractedJpeg=await download(tool.getByRole('button',{name:'Download',exact:true}));
    prove(extractedJpeg.equals(jpg),'DCT JPEG extraction preserves original bytes and format');
    await clear(); await load(); await expect(tool.getByText('No embedded images were found in this PDF.',{exact:true})).toBeVisible(); prove(true,'Text-only PDF reports zero images without fake exports');
  }
  const reviewContext = { page, tool, slug, check, expect, artifactsDir };
  if (['annotate-pdf','edit-pdf','sign-pdf'].includes(slug)) await reviewPdfPlacement(reviewContext);
  if (slug === 'extract-images-from-pdf') await reviewPdfImageDecode(reviewContext);
  const oldViewport=page.viewportSize(); await page.setViewportSize({width:320,height:800});
  prove(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth+1),'Loaded tool does not cause horizontal overflow at 320px');
  if(oldViewport) await page.setViewportSize(oldViewport);
  await clear(); prove(true,'Clear removes current download and result state');
} }));
