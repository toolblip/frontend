/** Extra review checks, deliberately NOT route cases (no duplicate slugs).
 * Parent, on its running app, calls:
 *   await reviewPdfPlacement({page, tool, slug, expect, check, artifactsDir});
 * for annotate-pdf/edit-pdf/sign-pdf, and reviewPdfImageDecode with the same
 * context on extract-images-from-pdf. workerSrc may override the public worker URL.
 * Each export is downloaded, opened and RENDERED with PDF.js in the real browser.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import UPNG from 'upng-js';
import { croppedReviewFixture, decodeReviewFixture } from './pdf-review-fixtures.mjs';

const require = createRequire(import.meta.url);
const upload = (buffer, name='review.pdf') => ({name,mimeType:'application/pdf',buffer});
let pdfjsBundle;
async function renderExport(page, bytes, samples, workerSrc) {
  pdfjsBundle ??= build({entryPoints:[require.resolve('pdfjs-dist/legacy/build/pdf.mjs')],bundle:true,platform:'browser',format:'iife',globalName:'__pdfReviewJS',write:false});
  if (!await page.evaluate(() => Boolean(window.__pdfReviewJS))) {
    await page.addScriptTag({content:(await pdfjsBundle).outputFiles[0].text});
  }
  return page.evaluate(async ({bytes,samples,workerSrc}) => {
    const pdfjs = window.__pdfReviewJS;
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc || new URL('/pdf-worker/pdf.worker.min.mjs',location.origin).href;
    const task = pdfjs.getDocument({data:Uint8Array.from(bytes),useSystemFonts:true});
    try {
      const doc = await task.promise, p = await doc.getPage(1), viewport = p.getViewport({scale:1});
      const canvas = document.createElement('canvas'); canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
      const context=canvas.getContext('2d');
      await p.render({canvas,canvasContext:context,viewport,background:'white'}).promise;
      const text=(await p.getTextContent()).items.filter(i=>'str' in i).map(i=>({str:i.str,transform:pdfjs.Util.transform(viewport.transform,i.transform)}));
      const pixels=samples.map(([x,y])=>Array.from(context.getImageData(x,y,1,1).data));
      const region=context.getImageData(18,28,160,30).data;
      let ink=0;for(let i=0;i<region.length;i+=4) if(region[i]<90&&region[i+1]<90&&region[i+2]<90) ink++;
      return {width:viewport.width,height:viewport.height,text,pixels,ink,png:canvas.toDataURL('image/png').split(',')[1]};
    } finally {await task.destroy();}
  },{bytes:Array.from(bytes),samples,workerSrc});
}
async function download(page,button,destination) {
  const [file] = await Promise.all([page.waitForEvent('download'), button.click()]);
  await file.saveAs(destination);return readFile(destination);
}
function prover({expect,check}) {return (value,description)=>{check?.(value,description);expect(value,description).toBe(true);};}
async function reset(tool) {
  const clear=tool.getByRole('button',{name:'Clear',exact:true}).first();
  if(await clear.isEnabled()) await clear.click();
}
async function surfacePoint(surface,x,y,width,height) {
  const box=await surface.boundingBox();if(!box) throw new Error('PDF preview surface missing');
  return {x:Math.round(box.x+x/width*box.width),y:Math.round(box.y+y/height*box.height)};
}
async function clickSurface(page,surface,x,y,width,height) {
  await surface.scrollIntoViewIfNeeded();
  const point=await surfacePoint(surface,x,y,width,height);
  await page.mouse.click(point.x,point.y);
}

export async function reviewPdfPlacement(context) {
  const {page,tool,slug,expect,artifactsDir,workerSrc}=context,prove=prover(context);
  if(!['annotate-pdf','edit-pdf','sign-pdf'].includes(slug)) throw new Error(`Not a placement tool: ${slug}`);
  await mkdir(artifactsDir,{recursive:true});
  const signature=Buffer.from(UPNG.encode([Uint8Array.from([255,0,0,255,0,255,0,255,0,0,255,255,250,160,30,255]).buffer],2,2,0));
  for(const rotation of [0,90,180,270]) for(const rectangular of [false,true]) {
    await reset(tool);
    const stem=`review-${slug}-${rotation}-${rectangular?'rect':'square'}`;
    await tool.getByLabel('PDF file',{exact:true}).first().setInputFiles(upload(await croppedReviewFixture(rotation,rectangular),`${stem}.pdf`));
    const width=rectangular&&rotation%180?300:400, height=rectangular&&!(rotation%180)?300:400;
    let exportButton;
    if(slug==='annotate-pdf') {
      const preview=tool.getByTestId('annotate-preview-image');await expect(preview).toBeVisible();
      await tool.getByRole('button',{name:'Text',exact:true}).click();
      await tool.getByLabel('Comment or label').fill('REVIEW');await tool.getByLabel('Text font size').fill('20');await tool.getByLabel('Markup color').fill('#000000');
      const surface=tool.locator('.tb-pdf-annotate-page');
      await clickSurface(page,surface,20,30,width,height);
      await expect(tool.getByLabel('Markup left')).toHaveValue('20');await expect(tool.getByLabel('Markup top')).toHaveValue('30');
      await tool.getByRole('button',{name:'Add Markup',exact:true}).click();
      await tool.getByRole('button',{name:'Rectangle',exact:true}).click();
      for(const [label,value] of [['Markup left','20'],['Markup top','110'],['Markup width','80'],['Markup height','30'],['Markup color','#ff0000']]) await tool.getByLabel(label,{exact:true}).fill(value);
      await tool.getByRole('button',{name:'Add Markup',exact:true}).click();
      exportButton=tool.getByRole('button',{name:'Export Annotated PDF',exact:true});
    } else if(slug==='edit-pdf') {
      const surface=tool.locator('.tb-pdf-edit-page');await expect(surface.locator(':scope > img')).toBeVisible();
      await tool.getByRole('button',{name:'Text',exact:true}).click();await tool.getByLabel('Text to add').fill('REVIEW');await tool.getByLabel('Text size').fill('20');
      await clickSurface(page,surface,20,30,width,height);
      await tool.locator('button.tb-pdf-edit-tool-button').filter({hasText:'Remove'}).click();
      await surface.scrollIntoViewIfNeeded();
      const start=await surfacePoint(surface,20,110,width,height),end=await surfacePoint(surface,100,140,width,height);
      await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(end.x,end.y,{steps:4});await page.mouse.up();
      await expect(tool.locator('button.tb-pdf-edit-tool-button').filter({hasText:'Remove'})).toHaveAttribute('aria-pressed','false');
      // Source text is rotated in the preview; its replacement must retain those axes.
      await tool.getByRole('button',{name:'Select PDF text: SOURCE',exact:true}).click();
      await tool.getByLabel('Selected PDF text').fill('REPLACED');await tool.getByRole('button',{name:'Save text',exact:true}).click();
      exportButton=tool.getByRole('button',{name:'Save and Download PDF',exact:true});
    } else {
      await expect(tool.getByAltText('Rendered preview of page 1')).toBeVisible();
      await tool.getByRole('tab',{name:'Upload',exact:true}).click();
      await tool.getByLabel('Image file',{exact:true}).setInputFiles({name:'signature.png',mimeType:'image/png',buffer:signature});
      for(const [label,value] of [['Position X (pt from left)','20'],['Position Y (pt from bottom)',String(height-90)],['Width (pt)','120'],['Height (pt)','60']]) await tool.getByLabel(label,{exact:true}).fill(value);
      const overlay=tool.getByAltText('Signature placement preview');await expect(overlay).toBeVisible();
      const rect=await overlay.boundingBox(),box=await tool.locator('.tb-sign-preview-page-surface').boundingBox();
      prove(Math.abs(rect.width/box.width*width-120)<0.5&&Math.abs(rect.height/box.height*height-60)<0.5,`${stem}: preview signature is 120x60 points`);
      await tool.getByRole('button',{name:/Sign PDF$/}).click();exportButton=tool.getByRole('button',{name:'Download signed PDF',exact:true});
    }
    await tool.screenshot({path:path.join(artifactsDir,`${stem}-preview.png`)});
    const bytes=await download(page,exportButton,path.join(artifactsDir,`${stem}-export.pdf`));
    // Sample outside the cover at x=10; x=110 can overlap the independent text-replacement cover.
    const rendered=await renderExport(page,bytes,[[50,45],[110,45],[50,75],[110,75],[20,120],[50,120],[10,120],[18,45],[142,45],[50,28],[50,92]],workerSrc);
    await writeFile(path.join(artifactsDir,`${stem}-render.png`),Buffer.from(rendered.png,'base64'));
    prove(rendered.width===width&&rendered.height===height,`${stem}: PDF.js renders the rotated CropBox dimensions`);
    if(slug==='sign-pdf') {
      const colors=[[255,0,0,255],[0,255,0,255],[0,0,255,255],[250,160,30,255]];
      prove(colors.every((color,i)=>color.every((v,c)=>Math.abs(rendered.pixels[i][c]-v)<=2)),`${stem}: rendered signature quadrants preserve position, orientation and size`);
      prove(rendered.pixels.slice(7).every(p=>p[0]===255&&Math.abs(p[1]-191)<=1&&Math.abs(p[2]-191)<=1),`${stem}: all four signature edges retain the requested 120x60 footprint`);
    } else {
      const item=rendered.text.find(i=>i.str==='REVIEW');
      prove(Boolean(item)&&[20,0,0,-20,20,50].every((v,i)=>Math.abs(item.transform[i]-v)<1.1),`${stem}: exported text baseline, axes and 20-point size match the clicked preview`);
      prove(rendered.ink>40,`${stem}: PDF.js actually renders text pixels in the upper-left region`);
      if(slug==='annotate-pdf') prove(rendered.pixels[4][0]>245&&rendered.pixels[4][1]<10,`${stem}: rectangle border renders at the expected visible position`);
      else {
        prove(rendered.pixels[5].slice(0,3).every(v=>v===255)&&rendered.pixels[6][1]<220,`${stem}: cover is white only inside its requested visible rectangle`);
        const source=rendered.text.find(i=>i.str==='SOURCE'), replacement=rendered.text.find(i=>i.str==='REPLACED');
        prove(Boolean(source&&replacement)&&source.transform.every((v,i)=>Math.abs(v-replacement.transform[i])<0.01),`${stem}: replacement text preserves the original baseline and rotation`);
      }
    }
  }
  await reset(tool);
}

export async function reviewPdfImageDecode(context) {
  const {page,tool,expect,artifactsDir}=context,prove=prover(context);
  await mkdir(artifactsDir,{recursive:true});
  for(const indirect of [false,true]) {
    await reset(tool);await tool.getByLabel('PDF file',{exact:true}).first().setInputFiles(upload(await decodeReviewFixture({indirect})));
    const bytes=await download(page,tool.getByRole('button',{name:'Download',exact:true}),path.join(artifactsDir,`review-identity-${indirect}.png`));
    const decoded=UPNG.decode(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
    const pixels=[...new Uint8Array(UPNG.toRGBA8(decoded)[0])];
    prove(decoded.width===2&&decoded.height===2&&JSON.stringify(pixels)===JSON.stringify([255,0,0,255,0,255,0,255,0,0,255,255,250,160,30,255]),`Identity Decode and Predictor 1 extract exact independent RGBA pixels (indirect=${indirect})`);
  }
  const jpeg=await readFile(new URL('../../../public/samples/image-resizer-mountain.jpg',import.meta.url));
  await reset(tool);await tool.getByLabel('PDF file',{exact:true}).first().setInputFiles(upload(await decodeReviewFixture({jpeg})));
  const bytes=await download(page,tool.getByRole('button',{name:'Download',exact:true}),path.join(artifactsDir,'review-identity.jpg'));
  prove(bytes.equals(jpeg),'Identity decode preserves the original JPEG bytes');
  for(const options of [{decode:[1,0,0,1,0,1]},{predictor:12}]) {
    await reset(tool);await tool.getByLabel('PDF file',{exact:true}).first().setInputFiles(upload(await decodeReviewFixture(options)));
    await expect(tool.getByText('Skipped (unsupported)',{exact:true})).toBeVisible();
    await expect(tool.getByRole('button',{name:'Download',exact:true})).toHaveCount(0);
    prove(true,`Nonidentity decode/predictor is clearly skipped: ${JSON.stringify(options)}`);
  }
  await reset(tool);
}
