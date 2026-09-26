import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

// Browser coordinator executes these cases; this worker does not start browsers.
async function fixture(page, jpeg = false) {
  const data = await page.evaluate((jpeg) => {
    const c = document.createElement('canvas'); c.width = 80; c.height = 40;
    const x = c.getContext('2d'); x.fillStyle = '#00ff00'; x.fillRect(0, 0, 80, 40);
    x.fillStyle = '#ff0000'; x.fillRect(20, 10, 40, 20);
    if (!jpeg) x.clearRect(0, 0, 4, 4);
    return c.toDataURL(jpeg ? 'image/jpeg' : 'image/png');
  }, jpeg);
  return { name: jpeg ? 'fixture.jpg' : 'fixture.png', mimeType: jpeg ? 'image/jpeg' : 'image/png', buffer: Buffer.from(data.split(',')[1], 'base64') };
}
async function upload(ctx, jpeg = false) {
  await ctx.tool.locator('input[type=file]').first().setInputFiles(await fixture(ctx.page, jpeg));
}
async function download(ctx, locator, name) {
  const event = ctx.page.waitForEvent('download'); await locator.click(); const item = await event;
  await mkdir(ctx.artifactsDir, { recursive: true });
  const file = path.join(ctx.artifactsDir, `${name}-${item.suggestedFilename()}`);
  await item.saveAs(file); const bytes = await readFile(file);
  ctx.check(bytes.length > 30, `${name}: saved ${bytes.length} actual file bytes`);
  return bytes;
}
async function pixels(ctx, bytes) {
  return ctx.page.evaluate(async (base64) => {
    const b = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const img = await createImageBitmap(new Blob([b]));
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0);
    const corner = [...x.getImageData(0, 0, 1, 1).data];
    const center = [...x.getImageData(Math.floor(c.width / 2), Math.floor(c.height / 2), 1, 1).data];
    img.close(); return { width: c.width, height: c.height, corner, center };
  }, bytes.toString('base64'));
}
function png(ctx, bytes) { ctx.check(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), 'PNG signature matches exported bytes'); }
async function clear(ctx) {
  await ctx.tool.getByRole('button', { name: 'Clear', exact: true }).click();
  await ctx.expect(ctx.tool.locator('a[download]')).toHaveCount(0);
  ctx.check(await ctx.tool.locator('a[download]').count() === 0, 'Clear removes downloadable output');
}
async function example(ctx) { await ctx.tool.getByRole('button', { name: /^Examples?$/ }).click(); }
async function invalidUpload(ctx) {
  await ctx.tool.locator('input[type=file]').first().setInputFiles({ name: 'fake.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
  await ctx.expect(ctx.tool.getByRole('alert')).toBeVisible();
  ctx.check(true, 'Corrupt image bytes produce an explicit error');
}
const cases = [];
const add = (slugs, test) => slugs.forEach(slug => cases.push({ slug, test }));
add(['detect', 'image-dimension-checker'], async ctx => {
  await upload(ctx); await ctx.expect(ctx.tool.getByText('80 × 40', { exact: true })).toBeVisible();
  ctx.check(await ctx.tool.getByText('PNG', { exact: true }).count() === 1, 'PNG signature and independently known 80 × 40 dimensions');
  await invalidUpload(ctx); await example(ctx); await ctx.expect(ctx.tool.getByText('320 × 200', { exact: true })).toBeVisible();
  await clear(ctx); await ctx.expect(ctx.tool.getByText('320 × 200', { exact: true })).toHaveCount(0);
});
add(['dpi-ppi-calculator'], async ctx => {
  await example(ctx); await ctx.tool.getByLabel('Print Width', { exact: true }).fill('20');
  await ctx.expect(ctx.tool.locator('.tb-v2-stat-pill-val').first()).toHaveText('150');
  ctx.check(true, '3000 pixels / 20 inches = 150 DPI');
  await ctx.tool.getByRole('button', { name: 'Screen PPI', exact: true }).click();
  await ctx.tool.getByLabel('Horizontal Resolution (px)').fill('1920'); await ctx.tool.getByLabel('Vertical Resolution (px)').fill('1080'); await ctx.tool.getByLabel('Diagonal Screen Size (in)').fill('15.6');
  await ctx.expect(ctx.tool.locator('.tb-v2-stat-pill-val')).toHaveText('141'); ctx.check(true, '1920 × 1080 at 15.6 inches rounds to 141 PPI');
  await clear(ctx); await ctx.expect(ctx.tool.locator('.tb-v2-stat-pill-val')).toHaveCount(0);
});
add(['pixel-density-calculator'], async ctx => {
  await example(ctx); await ctx.tool.getByLabel('Image Width (px)').fill('2540'); await ctx.tool.getByLabel('Image Height (px)').fill('2540');
  await ctx.tool.getByLabel('Print Width', { exact: true }).fill('25.4'); await ctx.tool.getByLabel('Print Height', { exact: true }).fill('25.4');
  await ctx.tool.getByRole('button', { name: 'Centimeters', exact: true }).click();
  await ctx.expect(ctx.tool.getByText('254', { exact: true })).toHaveCount(3); ctx.check(true, '2540 pixels / 25.4 cm = 254 PPI on both axes and diagonal');
  await ctx.tool.getByLabel('Print Width', { exact: true }).fill('0'); await ctx.expect(ctx.tool.getByText('254', { exact: true })).toHaveCount(0); await clear(ctx);
});
add(['image-scale-calculator'], async ctx => {
  await example(ctx); await ctx.expect(ctx.tool.getByText('960px', { exact: true })).toBeVisible(); await ctx.expect(ctx.tool.getByText('540px', { exact: true })).toBeVisible();
  await ctx.tool.getByLabel('Target Width (px)').fill('480'); await ctx.expect(ctx.tool.getByLabel('Target Height (px)')).toHaveValue('270'); ctx.check(true, '1920 × 1080 scaled to width 480 gives height 270');
  await ctx.tool.getByLabel('Scale (%)').fill('0'); await ctx.expect(ctx.tool.getByText('480px', { exact: true })).toHaveCount(0); await clear(ctx);
});
add(['resize', 'image-size-resizer', 'browser-image-resizer'], async ctx => {
  await upload(ctx); await ctx.tool.getByLabel('Width (px)', { exact: true }).fill('40');
  await ctx.expect(ctx.tool.getByLabel('Height (px)', { exact: true })).toHaveValue('20');
  await ctx.tool.getByRole('button', { name: 'Resize image', exact: true }).click();
  const bytes = await download(ctx, ctx.tool.getByRole('link', { name: 'Download resized image' }), 'resize-png'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width === 40 && p.height === 20 && p.corner[3] === 0, '80 × 40 becomes 40 × 20 with transparent corner');
  await upload(ctx, true); await ctx.tool.getByLabel('Width (px)', { exact: true }).fill('40'); await ctx.tool.getByRole('button', { name: 'Resize image', exact: true }).click();
  const jpg = await download(ctx, ctx.tool.getByRole('link', { name: 'Download resized image' }), 'resize-jpeg'); ctx.check(jpg[0] === 255 && jpg[1] === 216, 'JPEG source stays JPEG');
  await clear(ctx);
});
add(['rotate'], async ctx => {
  await upload(ctx); await ctx.tool.getByRole('button', { name: 'Rotate 90 degrees clockwise' }).click();
  const bytes = await download(ctx, ctx.tool.getByRole('button', { name: 'Download PNG' }), 'rotate'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width === 40 && p.height === 80, 'Quarter turn swaps 80 × 40 to 40 × 80'); await clear(ctx);
});
add(['crop'], async ctx => {
  await upload(ctx); const bytes = await download(ctx, ctx.tool.getByRole('button', { name: /Download/ }), 'crop'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width === 80 && p.height === 40 && p.corner[3] === 0, 'Initial freeform selection preserves the full source and alpha');
  const box=await ctx.tool.getByAltText('Crop preview', {exact:true}).boundingBox();
  await ctx.page.mouse.move(box.x+box.width*0.25,box.y+box.height*0.25);await ctx.page.mouse.down();await ctx.page.mouse.move(box.x+box.width*0.75,box.y+box.height*0.75,{steps:5});await ctx.page.mouse.up();
  const cropped=await pixels(ctx,await download(ctx,ctx.tool.getByRole('button',{name:'Download',exact:true}),'crop-selection'));
  ctx.check(cropped.width===40&&cropped.height===20,'Freeform central half selects exactly 40 × 20 source pixels');
  await clear(ctx); await invalidUpload(ctx);
});
add(['crop-circle'], async ctx => {
  await upload(ctx); await ctx.tool.getByLabel('Size', { exact: true }).fill('100'); await ctx.tool.getByLabel('Border Width', { exact: true }).fill('10');
  const bytes = await download(ctx, ctx.tool.getByRole('button', { name: 'Download Circle Image' }), 'circle'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width === 120 && p.height === 120 && p.corner[3] === 0 && p.center[0] === 255, '100px crop + 10px border per side; transparent outer corners and red center'); await clear(ctx);
});
add(['profile-photo'], async ctx => {
  await upload(ctx); const bytes = await download(ctx, ctx.tool.getByRole('button', { name: 'Download PNG' }), 'profile'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width === 512 && p.height === 512 && p.corner[3] === 0, 'Circle profile is 512px PNG with transparent corners');
  await ctx.tool.getByRole('button', { name: 'Square', exact: true }).click(); const square = await pixels(ctx, await download(ctx, ctx.tool.getByRole('button', { name: 'Download PNG' }), 'profile-square'));
  ctx.check(square.corner[3] === 255, 'Square mode restores opaque crop corner'); await clear(ctx);
});
add(['meme-maker'], async ctx => {
  await upload(ctx); await ctx.tool.getByLabel('Top Text', { exact: true }).fill('HELLO');
  const bytes = await download(ctx, ctx.tool.getByRole('button', { name: 'Download Meme' }), 'meme'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width === 80 && p.height === 40, 'Meme export retains source dimensions');
  await ctx.tool.getByLabel('Top Text', { exact: true }).fill('CHANGED');
  const changed = await download(ctx, ctx.tool.getByRole('button', { name: 'Download Meme' }), 'meme-changed'); ctx.check(!bytes.equals(changed), 'Text edits change actual downloadable pixels'); await clear(ctx);
});
add(['font-to-png'], async ctx => {
  await example(ctx); await ctx.tool.getByLabel('Transparent background', { exact: false }).check();
  const bytes = await download(ctx, ctx.tool.getByRole('button', { name: 'Download PNG' }), 'font'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width > 100 && p.height > 10 && p.corner[3] === 0, 'Rendered glyph PNG has bounds and transparent padding'); await clear(ctx);
});
add(['favicon-from-emoji'], async ctx => {
  await example(ctx); await ctx.tool.getByLabel('Transparent', { exact: true }).check();
  const bytes = await download(ctx, ctx.tool.getByRole('button', { name: /512×512/ }), 'emoji'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width === 512 && p.height === 512 && p.corner[3] === 0, '512px emoji favicon preserves transparent background'); await clear(ctx);
});
add(['favicon-png-maker', 'favicon-icon-generator'], async ctx => {
  await example(ctx); await ctx.tool.getByLabel('Choose a standard favicon size').selectOption('64');
  const bytes = await download(ctx, ctx.tool.getByRole('button', { name: 'PNG', exact: true }), 'favicon'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width === 64 && p.height === 64, 'Canonical favicon exports requested 64 × 64 PNG');
  const ico = await download(ctx, ctx.tool.getByRole('button', { name: 'ICO', exact: true }), 'favicon-ico'); ctx.check(ico.readUInt16LE(2) === 1 && ico.readUInt16LE(4) >= 1, 'ICO header contains a real icon directory'); await clear(ctx);
});
add(['image-dpi-resizer'], async ctx => {
  await example(ctx); await ctx.expect(ctx.tool.getByRole('button', { name: 'Download PNG' })).toBeEnabled();
  const bytes = await download(ctx, ctx.tool.getByRole('button', { name: 'Download PNG' }), 'dpi'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); const offset = bytes.indexOf(Buffer.from('pHYs'));
  ctx.check(p.width === 640 && p.height === 400, '320 × 200 at 100 DPI becomes 640 × 400 at 200 DPI');
  ctx.check(offset > 0 && bytes.readUInt32BE(offset + 4) === 7874 && bytes[offset + 12] === 1, 'PNG density is 7874 pixels/meter (200 DPI)');
  await ctx.tool.getByLabel('Target DPI').fill('100000'); await ctx.expect(ctx.tool.getByRole('alert')).toBeVisible(); await ctx.expect(ctx.tool.getByRole('button', { name: 'Download PNG' })).toHaveCount(0); await clear(ctx);
});
add(['batch-image-resizer'], async ctx => {
  await ctx.tool.getByLabel('Select images to resize').setInputFiles([await fixture(ctx.page), await fixture(ctx.page, true)]);
  await ctx.tool.getByLabel('Lock target aspect ratio').uncheck(); await ctx.tool.getByLabel('Width', { exact: true }).fill('40'); await ctx.tool.getByLabel('Height', { exact: true }).fill('40');
  await ctx.tool.getByRole('button', { name: 'Resize Images' }).click();
  const bytes = await download(ctx, ctx.tool.getByRole('link', { name: 'Download 1', exact: true }), 'batch-png'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width === 40 && p.height === 40 && p.corner[3] === 0, 'Batch fits 2:1 source within square with transparent padding');
  const jpg = await download(ctx, ctx.tool.getByRole('link', { name: 'Download 2', exact: true }), 'batch-jpeg'); ctx.check(jpg[0] === 255 && jpg[1] === 216, 'Batch JPEG remains JPEG');
  await ctx.tool.getByLabel('Width', { exact: true }).fill('0'); await ctx.expect(ctx.tool.getByRole('link', { name: 'Download 1', exact: true })).toHaveCount(0); await ctx.tool.getByRole('button', { name: 'Resize Images' }).click(); await ctx.expect(ctx.tool.getByRole('alert')).toBeVisible(); await clear(ctx);
});
add(['base64-image-viewer'], async ctx => {
  const f = await fixture(ctx.page); await ctx.tool.getByLabel('Base64 image data URL').fill('data:image/png;base64,' + f.buffer.toString('base64'));
  await ctx.expect(ctx.tool.getByText('80 × 40', { exact: true })).toBeVisible(); ctx.check(true, 'Real PNG decoded to independently known dimensions');
  await ctx.tool.getByLabel('Base64 image data URL').fill('data:image/png;base64,bm90YW5pbWFnZQ=='); await ctx.expect(ctx.tool.getByRole('alert')).toBeVisible(); await clear(ctx);
});
add(['photo-metadata-remover'], async ctx => {
  const f=await fixture(ctx.page);const payload=Buffer.from('Comment\0private-camera-note');const chunk=Buffer.alloc(payload.length+12);chunk.writeUInt32BE(payload.length);chunk.write('tEXt',4);payload.copy(chunk,8);
  let crc=0xffffffff;for(const b of chunk.subarray(4,-4)){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}chunk.writeUInt32BE((crc^0xffffffff)>>>0,chunk.length-4);
  f.buffer=Buffer.concat([f.buffer.subarray(0,33),chunk,f.buffer.subarray(33)]);await ctx.tool.locator('input[type=file]').first().setInputFiles(f); const bytes = await download(ctx, ctx.tool.getByRole('button', { name: 'Download Metadata-Free Photo' }), 'metadata'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width === 80 && p.height === 40 && p.corner[3] === 0, 'Metadata re-encode preserves dimensions and alpha');
  ctx.check(!bytes.includes(Buffer.from('private-camera-note'))&&!bytes.includes(Buffer.from('eXIf')) && !bytes.includes(Buffer.from('iTXt')), 'PNG has no EXIF or international-text metadata chunks'); await clear(ctx);
});
add(['image-background-remover'], async ctx => {
  await upload(ctx); await ctx.tool.getByLabel('Color Key', { exact: true }).check(); await ctx.tool.getByRole('button', { name: 'Remove Background', exact: true }).click();
  const bytes = await download(ctx, ctx.tool.getByRole('button', { name: 'Download PNG' }), 'background'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width === 80 && p.height === 40 && p.center[0] === 255 && p.center[3] === 255, 'Color key retains opaque red foreground');
  const removed = await ctx.page.evaluate(async b64 => {const img=await createImageBitmap(new Blob([Uint8Array.from(atob(b64),c=>c.charCodeAt(0))]));const c=document.createElement('canvas');c.width=80;c.height=40;const x=c.getContext('2d');x.drawImage(img,0,0);return x.getImageData(10,10,1,1).data[3];},bytes.toString('base64'));
  ctx.check(removed === 0, 'Previously opaque green background is actually transparent'); await clear(ctx);
  // AI acceptance is explicitly separate: real model fetch/inference must run on integrated host.
});
add(['banner-generator'], async ctx => {
  await example(ctx); const bytes = await download(ctx, ctx.tool.getByRole('link', { name: 'Download PNG', exact: true }).last(), 'banner'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width === 1200 && p.height === 630, 'Banner default export is 1200 × 630 PNG'); await clear(ctx);
});
add(['tweet-to-image-converter'], async ctx => {
  await example(ctx); const bytes = await download(ctx, ctx.tool.getByRole('link', { name: 'Download as PNG', exact: true }).last(), 'tweet'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width === 1280 && p.height > 200, '560px card + 40px padding each side exports at 2× (1280px)'); await clear(ctx);
});
add(['unblur'], async ctx => {
  await upload(ctx); const bytes = await download(ctx, ctx.tool.getByRole('button', { name: 'Download current image' }), 'unblur-sharpen'); png(ctx, bytes);
  const p = await pixels(ctx, bytes); ctx.check(p.width === 80 && p.height === 40, 'Sharpen/unblur legacy route exports real image at original dimensions'); await clear(ctx);
});
export default cases;
