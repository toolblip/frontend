/** Supplemental regressions invoked by the corresponding registered cases.
 * These checks use the runner context and never start a browser or server.
 */
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { clickWhenSettled } from '../helpers/settled-click.mjs';
const click = (tool, name) => tool.getByRole('button', { name, exact: true }).click();
const clear = tool => tool.getByRole('button', { name: /^Clear(?: all)?$/i }).first().click();
async function downloaded({ page, artifactsDir, slug }, action) {
  await mkdir(artifactsDir, { recursive: true });
  // Attach handlers to both promises immediately, including synchronous action
  // failures, so a later download timeout cannot become an unhandled rejection.
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    Promise.resolve().then(action),
  ]);
  const name = download.suggestedFilename();
  const target = path.join(artifactsDir, `${slug ?? 'misc'}-regression-${path.basename(name).replace(/[^\w.-]/g, '_')}`);
  await download.saveAs(target);
  return { bytes: await readFile(target), name };
}

export async function stickyPersistence({page, tool, expect}) {
  const previous = await page.evaluate(() => localStorage.getItem('sticky-notes'));
  const notes = Array.from({length:101}, (_, i) => ({ id:String(i), content:`Review note ${i}`, color:'bg-yellow-200', createdAt:123, position:{x:0,y:0}, legacy:{pinned:true} }));
  try {
    await page.evaluate(notes => localStorage.setItem('sticky-notes', JSON.stringify(notes)), notes);
    await page.reload();
    await expect(tool.getByText('Review note 100', {exact:true})).toHaveCount(1);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sticky-notes')))).toEqual(notes);
    await expect(tool.getByRole('button', {name:'Add Note',exact:true})).toBeDisabled();
    await page.reload();
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sticky-notes')))).toEqual(notes);
    // Overlapping legacy positions are intentional; delete the last rendered card.
    await tool.getByRole('button', {name:'✕',exact:true}).last().click();
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('sticky-notes')))).toEqual(notes.slice(0,100));
  } finally {
    await page.evaluate(previous => previous === null ? localStorage.removeItem('sticky-notes') : localStorage.setItem('sticky-notes',previous), previous);
    await page.reload();
  }
}

export async function wwwSchemes({tool, expect}) {
  const reset = tool.getByRole('button', { name: /^Clear(?: all)?$/i }).first();
  if (await reset.isEnabled()) await reset.click();
  await tool.getByLabel('Base Domain', {exact:true}).fill('example.com');
  for (const mode of ['add','remove']) {
    await tool.getByLabel('WWW handling').selectOption(mode);
    const output=tool.locator('#htaccess-output');
    await expect(output).toHaveValue(/REQUEST_SCHEME/);
    const target=(await output.inputValue()).match(/RewriteRule \^ (\S+) \[L,R=301\]/)[1];
    for (const scheme of ['http','https']) expect(target.replace('%{REQUEST_SCHEME}',scheme).replace('%{REQUEST_URI}','/path')).toBe(`${scheme}://${mode==='add'?'www.':''}example.com/path`);
  }
}

export async function base64RoundTrips({tool, expect}) {
  await clear(tool);
  await clickWhenSettled(tool.getByRole('tab',{name:'Decode',exact:true}));
  await tool.getByLabel('Input',{exact:true}).fill('77u/QQ==');
  await expect.poll(() => tool.locator('pre').textContent()).toBe('\uFEFFA');
  await clickWhenSettled(tool.getByRole('button',{name:/Swap/}));
  await expect(tool.locator('pre')).toHaveText('77u/QQ==');
  for (const input of ['a'.repeat(80000),'漢'.repeat(40000),'é😀'.repeat(25000)]) {
    await clickWhenSettled(tool.getByRole('tab',{name:'Encode',exact:true}));
    await tool.getByLabel('Input',{exact:true}).fill(input);
    await expect.poll(() => tool.locator('pre').textContent()).toBe(Buffer.from(input).toString('base64'));
    await clickWhenSettled(tool.getByRole('button',{name:/Swap/}));
    await expect.poll(() => tool.locator('pre').textContent()).toBe(input);
  }
}
export async function binaryRoundTrips({tool, expect}) {
  for (const input of ['a'.repeat(12000),'漢'.repeat(12000),'é😀'.repeat(12000)]) {
    await clickWhenSettled(tool.getByRole('button',{name:'Text to Binary',exact:true}));
    await tool.getByLabel('Input',{exact:true}).fill(input);
    const output=tool.locator('.tb-v2-tool-output-body p');
    const expected=[...Buffer.from(input)].map(b=>b.toString(2).padStart(8,'0')).join(' ');
    await expect.poll(() => output.textContent()).toBe(expected);
    await clickWhenSettled(tool.getByRole('button',{name:'Swap',exact:true}));
    await expect(tool.getByLabel('Input', {exact:true})).toHaveValue(expected);
    await expect.poll(async () => (await output.textContent()) === input).toBe(true);
  }
}

/** Hold a real native image load notification, never synthesize image pixels. */
export async function dpiUploadSettings(ctx) {
  const { page, tool, expect } = ctx;
  const png={name:'held-source.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==','base64')};
  await page.evaluate(() => {
    window.__reviewNativeImage=window.Image;
    window.__reviewImageLoads=[];
    window.Image=class extends window.__reviewNativeImage {
      set onload(callback) { super.onload=event=>window.__reviewImageLoads.push(()=>callback.call(this,event)); }
    };
  });
  const release=()=>page.evaluate(()=>window.__reviewImageLoads.splice(0).forEach(fn=>fn()));
  try {
    await tool.getByLabel('Upload image').setInputFiles(png);
    await page.waitForFunction(()=>window.__reviewImageLoads.length>0);
    await tool.getByLabel('Current DPI').fill('100');
    await tool.getByLabel('Target DPI').fill('200');
    await expect(tool.getByRole('status')).toHaveText('Processing…');
    await release();
    await expect(tool.getByRole('status')).toHaveText('2 × 2 pixels · 200 DPI');
    const {bytes,name}=await downloaded(ctx,()=>click(tool,'Download PNG'));
    expect(name).toBe('dpi-200-2x2.png');
    expect(bytes.readUInt32BE(16)).toBe(2); expect(bytes.readUInt32BE(20)).toBe(2);
    const phys=bytes.indexOf(Buffer.from('pHYs'));
    expect(phys).toBeGreaterThan(0); expect(bytes.readUInt32BE(phys+4)).toBe(7874);
    await tool.getByLabel('Upload image').setInputFiles(png);
    await page.waitForFunction(()=>window.__reviewImageLoads.length>0);
    await clear(tool); await release();
    await expect(tool.getByRole('button',{name:'Download PNG'})).toHaveCount(0);
    await expect(tool.getByRole('status')).toHaveCount(0);
  } finally {
    await release();
    await page.evaluate(()=>{window.Image=window.__reviewNativeImage;delete window.__reviewNativeImage;delete window.__reviewImageLoads;});
  }
}

/** Call on crop, meme-maker and batch-image-resizer. The parent supplies each
 * tool's generate/download actions so this stays independent of the case registry.
 * Unsupported decoding fails explicitly; it never becomes a functional pass.
 */
export async function avifUploadExport(ctx, exportAction) {
  const { page, tool, expect } = ctx;
  const fixture=await readFile(new URL('./fixtures/red-2x2.avif',import.meta.url));
  await tool.locator('input[type=file]').first().setInputFiles({name:'red-2x2.avif',mimeType:'image/avif',buffer:fixture});
  const {bytes}=await downloaded(ctx,exportAction);
  expect([...bytes.subarray(0,8)]).toEqual([137,80,78,71,13,10,26,10]);
  const pixels=await page.evaluate(async b64=>{
    const img=new Image(); img.src='data:image/png;base64,'+b64; await img.decode();
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
    const x=c.getContext('2d');x.drawImage(img,0,0);
    return {width:c.width,height:c.height,pixel:[...x.getImageData(Math.floor(c.width/2),Math.floor(c.height/2),1,1).data]};
  },bytes.toString('base64'));
  expect(pixels.width).toBeGreaterThan(0);expect(pixels.height).toBeGreaterThan(0);
  expect(pixels.pixel[0]).toBeGreaterThan(240);expect(pixels.pixel[1]).toBeLessThan(15);expect(pixels.pixel[2]).toBeLessThan(15);expect(pixels.pixel[3]).toBe(255);
}

export async function typescriptDownload(ctx) {
  const { page, tool, expect } = ctx;
  await tool.getByLabel('Language',{exact:true}).selectOption('typescript');
  await tool.getByLabel('Code',{exact:true}).fill('export type UserId = string; export interface User { id: UserId; }');
  await click(tool,'Beautify');
  const output=tool.getByLabel('Beautified Code',{exact:true});
  await expect(output).toHaveValue(/export type UserId = string;/);
  await expect(output).toHaveValue(/export interface User/);
  const {bytes,name}=await downloaded(ctx,()=>click(tool,'Download'));
  expect(name).toBe('beautified.ts');expect(bytes.toString()).toBe(await output.inputValue());
  await click(tool,'Minify');
  await expect(output).toHaveValue(/export type UserId = string;/);
  await expect(output).toHaveValue(/export interface User/);
}
