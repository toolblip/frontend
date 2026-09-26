/** Parent-run integrated browser cases. This worker does not start a server/browser. */
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { inflateSync } from 'node:zlib';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const UPNG = require('upng-js');
const { PDFDocument, PDFArray, PDFRawStream } = require('pdf-lib');
async function downloadBytes({ page, tool, artifactsDir, slug }, pattern = /^Download/) {
  await mkdir(artifactsDir, { recursive: true });
  const event = page.waitForEvent('download');
  await tool.getByRole('link', { name: pattern }).click();
  const download = await event;
  const filename = `${slug}-${download.suggestedFilename().replace(/[^\w.-]/g, '_')}`;
  const saved = path.join(artifactsDir, filename);
  await download.saveAs(saved);
  return { bytes: await readFile(saved), filename: download.suggestedFilename() };
}
async function clear({ tool, expect, check }) {
  await tool.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(tool.getByRole('link', { name: /^Download/ })).toHaveCount(0);
  await expect(tool.getByRole('alert')).toHaveCount(0);
  check(true, 'Clear removes the downloadable result and errors.');
}
async function example({ tool }) { await tool.getByRole('button', { name: /^Examples?$/ }).click(); }
async function rasterEvidence(page, bytes, mime) {
  return page.evaluate(async ({ base64, mime }) => {
    const blob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], { type: mime });
    const url = URL.createObjectURL(blob);
    try {
      const image = new Image(); const loaded = new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; }); image.src = url; await loaded;
      const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
      return { width: canvas.width, height: canvas.height, first: [...ctx.getImageData(2, 2, 1, 1).data], last: [...ctx.getImageData(canvas.width - 2, 2, 1, 1).data] };
    } finally { URL.revokeObjectURL(url); }
  }, { base64: bytes.toString('base64'), mime });
}
function assertImageFormat(bytes, format, check) {
  const good = format === 'jpeg' ? bytes[0] === 255 && bytes[1] === 216 && bytes.at(-2) === 255 && bytes.at(-1) === 217
    : format === 'webp' ? bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
      : format === 'svg' ? /<svg\b/.test(bytes.toString()) && /<path\b/.test(bytes.toString()) && !/<image\b/.test(bytes.toString())
        : bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  check(good, `Downloaded bytes are actual ${format.toUpperCase()}, not a renamed input.`);
  if (!good) throw new Error('Invalid download format');
}
function imageCase(slug, format) {
  return { slug, async test(ctx) {
    const { tool, page, check, expect } = ctx;
    await example(ctx); await expect(tool.getByRole('button', { name: 'Convert', exact: true })).toBeEnabled();
    await tool.getByRole('button', { name: 'Convert', exact: true }).click();
    await expect(tool.getByRole('link', { name: /^Download/ })).toBeVisible({ timeout: 45000 });
    const { bytes, filename } = await downloadBytes({ ...ctx, slug });
    assertImageFormat(bytes, format, check);
    const sizeText = await page.evaluate(size => size.toLocaleString(), bytes.length);
    await expect(tool.getByRole('status')).toContainText(`${sizeText} bytes`);
    check(true, 'Displayed output byte count equals the actual downloaded file size.');
    check(filename.endsWith(format === 'jpeg' ? '.jpg' : `.${format}`), 'Download extension matches encoded format.');
    const decoded = await rasterEvidence(page, bytes, format === 'svg' ? 'image/svg+xml' : `image/${format}`);
    check(decoded.width === 16 && decoded.height === 12, `Decoded download dimensions are 16 × 12 (got ${decoded.width} × ${decoded.height}).`);
    if (!slug.startsWith('gif') && slug !== 'trace') {
      check(decoded.first[0] > 200 && decoded.first[1] < 50 && decoded.first[2] < 50 && decoded.first[3] === 255, 'Converted pixels preserve the red fixture region.');
      if (/^(svg|png|webp)-to-(png|webp)$/.test(slug)) check(decoded.last[3] === 0, 'Transparent source pixels remain transparent.');
      if (/^(svg|webp)-to-jpg$/.test(slug)) check(decoded.last.slice(0, 3).every(n => n > 230) && decoded.last[3] === 255, 'JPEG composites transparent pixels on white.');
    }
    if (slug === 'gif-to-apng') {
      const png = UPNG.decode(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
      check(png.frames.length === 2 && png.frames.every(f => f.delay === 500), 'APNG carries two timed animation frames with 500 ms delays.');
      const frames = UPNG.toRGBA8(png); check(!Buffer.from(frames[0]).equals(Buffer.from(frames[1])), 'Animation frames contain different rendered pixels.');
    }
    const quality = tool.getByRole('slider', { name: 'Quality', exact: true });
    if (await quality.count()) {
      await quality.press('Home'); await expect(tool.getByRole('link', { name: /^Download/ })).toHaveCount(0);
      check(true, 'Changing quality invalidates the old download.');
      await tool.getByRole('button', { name: 'Convert', exact: true }).click();
      await expect(tool.getByRole('link', { name: /^Download/ })).toBeVisible();
      const updated = await downloadBytes({ ...ctx, slug: `${slug}-quality1` }); assertImageFormat(updated.bytes, format, check);
    }
    await tool.getByLabel('Image file', { exact: true }).setInputFiles({ name: 'fake.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
    await tool.getByRole('button', { name: 'Convert', exact: true }).click();
    await expect(tool.getByRole('alert')).toContainText(/invalid|unsupported|requires/i);
    await expect(tool.getByRole('link', { name: /^Download/ })).toHaveCount(0);
    check(true, 'Corrupt input produces a visible error and cannot export a stale result.');
    await clear(ctx);
  } };
}
const imageCases = [
  ['gif-to-apng', 'png'], ['gif-to-jpg', 'jpeg'], ['gif-to-png', 'png'], ['heic-to-jpg', 'jpeg'], ['heic-to-png', 'png'],
  ['jpg-to-png', 'png'], ['jpg-to-webp', 'webp'], ['png-to-webp', 'webp'], ['svg-to-png', 'png'], ['svg-to-jpg', 'jpeg'],
  ['svg-to-webp', 'webp'], ['webp-to-jpg', 'jpeg'], ['webp-to-png', 'png'], ['trace', 'svg'],
].map(([slug, format]) => imageCase(slug, format));
function textCase(slug, mode) {
  return { slug, async test(ctx) {
    const { tool, check, expect } = ctx;
    await example(ctx);
    await tool.getByRole('button', { name: 'Prepare download', exact: true }).click();
    await expect(tool.getByRole('link', { name: /^Download/ })).toBeVisible();
    const { bytes, filename } = await downloadBytes({ ...ctx, slug });
    if (mode === 'sql') {
      expect(JSON.parse(bytes.toString())).toEqual([{ id: 1, name: 'Ada', active: true }, { id: 2, name: "O'Brien", active: false }]);
      check(true, 'Downloaded JSON preserves SQL strings, booleans and both rows.');
    } else if (mode === 'markdown') {
      expect(bytes.toString()).toBe('| name | role |\n| --- | --- |\n| Ada | Engineer |\n| Alan | Scientist |');
      check(filename.endsWith('.md'), 'Downloaded Markdown matches the independently expected table.');
    } else if (mode === 'xlsx') {
      check(bytes.subarray(0, 4).equals(Buffer.from([80,75,3,4])), 'Excel output is an OOXML ZIP, not HTML with an XLS extension.');
      const book = XLSX.read(bytes); expect(XLSX.utils.sheet_to_json(book.Sheets.Sheet1, { header: 1 })).toEqual([['name', 'note'], ['Ada', 'Hello, world'], ['Grace', 'A & B']]);
      check(filename.endsWith('.xlsx'), 'XLSX round-trip preserves quoted commas and ampersands.');
    } else {
      const fields = await ctx.page.evaluate(xml => { const d = new DOMParser().parseFromString(xml, 'application/xml'); return { invalid: !!d.querySelector('parsererror'), values: [...d.querySelectorAll('row field')].map(e => [e.getAttribute('name'), e.textContent]) }; }, bytes.toString());
      expect(fields).toEqual({ invalid: false, values: [['name', 'Ada'], ['note', 'Hello, world'], ['name', 'Grace'], ['note', 'A & B']] });
      check(true, 'Downloaded XML parses and preserves field names and escaped values.');
    }
    await tool.getByLabel('Input', { exact: true }).fill(mode === 'sql' ? 'INSERT INTO t (a,b) VALUES (1);' : mode === 'markdown' ? '[{},null]' : 'a,b\n"unclosed');
    await expect(tool.getByRole('alert')).toBeVisible(); await expect(tool.getByRole('link', { name: /^Download/ })).toHaveCount(0);
    check(true, 'Invalid current input rejects partial parsing and removes the previous download.');
    await clear(ctx); await expect(tool.getByLabel('Input', { exact: true })).toHaveValue('');
  } };
}
function numberCase(slug, all) {
  return { slug, async test(ctx) {
    const { tool, check, expect } = ctx;
    await example(ctx);
    await tool.getByLabel('Source base', { exact: true }).selectOption('10');
    if (!all) await tool.getByLabel('Target base', { exact: true }).selectOption('16');
    await tool.getByLabel('Number input', { exact: true }).fill('9007199254740993');
    if (all) await expect(tool.getByLabel('Result', { exact: true })).toHaveText('Binary: 100000000000000000000000000000000000000000000000000001\nDecimal: 9007199254740993\nHexadecimal: 20000000000001');
    else await expect(tool.getByLabel('Result', { exact: true })).toHaveText('20000000000001');
    check(true, 'Integer conversion preserves 9007199254740993 exactly beyond Number safe precision.');
    await tool.getByLabel('Source base', { exact: true }).selectOption('2'); await tool.getByLabel('Number input', { exact: true }).fill('102');
    await expect(tool.getByRole('alert')).toContainText('Invalid digit'); await expect(tool.getByLabel('Result', { exact: true })).toBeEmpty();
    check(true, 'Invalid base digit is rejected instead of partial parseInt conversion.');
    await clear(ctx); await expect(tool.getByLabel('Number input', { exact: true })).toHaveValue('');
  } };
}
function unitCase(slug, temperatureOnly = false) {
  return { slug, async test(ctx) {
    const { tool, check, expect } = ctx; await example(ctx);
    await expect(tool.getByLabel('Result', { exact: true })).toHaveText(temperatureOnly ? '212' : '1');
    check(true, temperatureOnly ? '100 Celsius converts to 212 Fahrenheit.' : '1000 meters converts to 1 kilometer.');
    if (!temperatureOnly) {
      await tool.getByLabel('Category', { exact: true }).selectOption('speed'); await tool.getByLabel('From unit', { exact: true }).selectOption('kmh'); await tool.getByLabel('To unit', { exact: true }).selectOption('ms'); await tool.getByLabel('Value', { exact: true }).fill('36'); await expect(tool.getByLabel('Result', { exact: true })).toHaveText('10');
      check(true, '36 km/h equals exactly 10 m/s at displayed precision.');
      await tool.getByLabel('Category', { exact: true }).selectOption('temperature');
    }
    await tool.getByLabel('From unit', { exact: true }).selectOption('k'); await tool.getByLabel('Value', { exact: true }).fill('-1');
    await expect(tool.getByRole('alert')).toContainText('absolute zero'); await expect(tool.getByLabel('Result', { exact: true })).toBeEmpty(); check(true, 'Below absolute zero is rejected.');
    await clear(ctx); await expect(tool.getByLabel('Result', { exact: true })).toBeEmpty();
  } };
}
function spreadsheetCase(slug, format) {
  return { slug, async test(ctx) {
    const { tool, check, expect } = ctx; await example(ctx);
    await expect(tool.getByLabel('Sheet', { exact: true })).toBeVisible();
    await tool.getByRole('button', { name: 'Convert', exact: true }).click(); await expect(tool.getByRole('link', { name: /^Download/ })).toBeVisible();
    const { bytes, filename } = await downloadBytes({ ...ctx, slug }); check(filename.endsWith(`.${format}`), 'Extension matches selected export.');
    if (format === 'csv') { expect(bytes.toString()).toBe('name,note\r\nAda,"Hello, world"\r\nGrace,A & B'); check(true, 'CSV bytes preserve escaped comma and all cell values.'); }
    else if (format === 'xml') {
      const cells = await ctx.page.evaluate(xml => { const d = new DOMParser().parseFromString(xml, 'application/xml'); if (d.querySelector('parsererror')) throw new Error('Invalid XML'); return [...d.querySelectorAll('field')].map(f => f.textContent); }, bytes.toString());
      expect(cells).toEqual(['Ada', 'Hello, world', 'Grace', 'A & B']); check(true, 'XML download round-trips the selected worksheet values.');
    } else {
      check(bytes.subarray(0, 5).toString() === '%PDF-', 'PDF has a real PDF header.');
      const pdf = await PDFDocument.load(bytes); expect(pdf.getPageCount()).toBe(1);
      const content = pdf.getPage(0).node.Contents(); const streams = content instanceof PDFArray ? content.asArray() : [content];
      let text = '';
      for (const ref of streams) { const stream = pdf.context.lookup(ref); if (stream instanceof PDFRawStream) { const decoded = inflateSync(stream.getContents()).toString(); for (const match of decoded.matchAll(/<([0-9A-F]+)>\s*Tj/gi)) text += Buffer.from(match[1], 'hex').toString('latin1'); } }
      check(text.includes('Ada | Hello, world') && text.includes('Grace | A & B'), 'PDF content streams contain the actual worksheet cell text.');
    }
    await tool.getByLabel('Sheet', { exact: true }).selectOption('1'); await expect(tool.getByRole('link', { name: /^Download/ })).toHaveCount(0); check(true, 'Changing sheets invalidates old output.');
    await tool.getByLabel('Workbook file', { exact: true }).setInputFiles({ name: 'fake.xlsx', mimeType: 'application/octet-stream', buffer: Buffer.from('<html>not Excel</html>') });
    await expect(tool.getByRole('alert')).toBeVisible(); await expect(tool.getByRole('link', { name: /^Download/ })).toHaveCount(0); check(true, 'Renamed HTML is rejected as invalid XLSX.'); await clear(ctx);
  } };
}
function audioCase(slug, mp3 = false) {
  return { slug, async test(ctx) {
    const { tool, check, expect } = ctx; await example(ctx); await expect(tool.getByRole('button', { name: 'Convert', exact: true })).toBeEnabled();
    if (mp3) {
      await tool.getByRole('button', { name: 'Convert', exact: true }).click(); await expect(tool.getByRole('alert')).toContainText('MP3 encoding is unavailable'); await expect(tool.getByRole('link', { name: /^Download/ })).toHaveCount(0);
      check(true, 'Known MP3 dependency blocker is reported; WAV is never labeled MP3. This does not establish MP3 conversion acceptance.');
      await tool.getByLabel('Output format', { exact: true }).selectOption('wav');
    }
    await tool.getByRole('button', { name: 'Convert', exact: true }).click();
    // Unsupported browser codecs are a real failure/blocker, never an automatic passing branch.
    await expect(tool.getByRole('link', { name: /^Download WAV/ })).toBeVisible({ timeout: 45000 });
    const { bytes, filename } = await downloadBytes({ ...ctx, slug });
    check(filename.endsWith('.wav') && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WAVE', 'Download is actual RIFF/WAVE with a WAV extension.');
    const channels = bytes.readUInt16LE(22), rate = bytes.readUInt32LE(24), size = bytes.readUInt32LE(40);
    check(bytes.readUInt16LE(20) === 1 && bytes.readUInt16LE(34) === 16 && size + 44 === bytes.length && bytes.readUInt32LE(4) + 8 === bytes.length, 'WAV is 16-bit PCM with exact container/data sizes.');
    const duration = size / (rate * channels * 2); check(channels === 1 && Math.abs(duration - 2) < 0.15, `Decoded audio retains the two-second mono signal (${duration.toFixed(3)} seconds).`);
    let crossings = 0, peak = 0, previous = 0;
    for (let p = 44; p < bytes.length; p += channels * 2) { const s = bytes.readInt16LE(p); peak = Math.max(peak, Math.abs(s)); if (s >= 0 && previous < 0) crossings++; previous = s; }
    check(peak > 1000 && Math.abs(crossings / duration - 440) < 25, 'Downloaded PCM contains the actual approximately 440 Hz tone, not silence.');
    await tool.getByLabel('Media file', { exact: true }).setInputFiles({ name: 'broken.mp4', mimeType: 'video/mp4', buffer: Buffer.from('not media') });
    await tool.getByRole('button', { name: 'Convert', exact: true }).click(); await expect(tool.getByRole('alert')).toContainText('Invalid input container'); await expect(tool.getByRole('link', { name: /^Download/ })).toHaveCount(0); check(true, 'Bad container bytes reject conversion and stale output.'); await clear(ctx);
    if (mp3) check(false, 'BLOCKED: MP3 encoding is not implemented without an encoder dependency. The verified WAV fallback is not acceptance of this MP3 route.');
  } };
}
function videoCase(slug, subtitles = false) {
  return { slug, async test(ctx) {
    const { tool, page, check, expect } = ctx; await example(ctx); await expect(tool.getByRole('button', { name: 'Convert', exact: true })).toBeEnabled();
    await tool.getByLabel('Start seconds', { exact: true }).fill('0.5'); await tool.getByLabel('End seconds', { exact: true }).fill('1.5');
    await tool.getByRole('button', { name: 'Convert', exact: true }).click(); await expect(tool.getByRole('link', { name: /^Download WEBM/ })).toBeVisible({ timeout: 30000 });
    const { bytes } = await downloadBytes({ ...ctx, slug }); check(bytes.subarray(0, 4).equals(Buffer.from([0x1a,0x45,0xdf,0xa3])), 'Download has a WebM/EBML signature.');
    const evidence = await page.evaluate(async base64 => {
      const blob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], { type: 'video/webm' }); const url = URL.createObjectURL(blob); const video = document.createElement('video'); video.muted = true;
      try {
        const loaded = new Promise((resolve, reject) => { video.onloadeddata = resolve; video.onerror = reject; }); video.src = url; await loaded;
        // MediaRecorder WebM often omits duration. Scan to the end before reading it.
        if (!Number.isFinite(video.duration)) { const seek = new Promise(resolve => { video.onseeked = resolve; }); video.currentTime = 1e9; await seek; }
        const duration = video.duration; const seek = new Promise(resolve => { video.onseeked = resolve; }); video.currentTime = 0.5; await seek;
        const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight; const c = canvas.getContext('2d'); c.drawImage(video, 0, 0);
        const pixels = c.getImageData(0, 0, canvas.width, canvas.height).data; let white = 0, dark = 0;
        for (let y = Math.floor(canvas.height / 2); y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) { const i = (y * canvas.width + x) * 4; if (pixels[i] > 150 && pixels[i + 1] > 150 && pixels[i + 2] > 150) white++; if (pixels[i] < 30 && pixels[i + 1] < 30 && pixels[i + 2] < 30) dark++; }
        return { duration, width: canvas.width, height: canvas.height, first: [...c.getImageData(2, 2, 1, 1).data], white, dark };
      } finally { video.pause(); video.removeAttribute('src'); video.load(); URL.revokeObjectURL(url); }
    }, bytes.toString('base64'));
    check(evidence.width === 64 && evidence.height === 48 && evidence.first[0] > 180 && evidence.first[1] < 60, 'Downloaded video decodes with original dimensions and red scene pixels.');
    check(Math.abs(evidence.duration - 1) < 0.3, `Export duration matches the selected 1-second range within recording tolerance (${evidence.duration}).`);
    if (subtitles) check(evidence.white > 5 && evidence.dark > 50, 'Caption glyphs and dark caption background are present in the downloaded video pixels.');
    await tool.getByLabel('End seconds', { exact: true }).fill('0.2'); await expect(tool.getByRole('link', { name: /^Download/ })).toHaveCount(0);
    await tool.getByRole('button', { name: 'Convert', exact: true }).click(); await expect(tool.getByRole('alert')).toContainText(/range|overlap/i); check(true, 'Invalid range rejects export instead of silently clamping.');
    await clear(ctx);
    await example(ctx); await expect(tool.getByRole('button', { name: 'Convert', exact: true })).toBeEnabled();
    await tool.getByRole('button', { name: 'Convert', exact: true }).click(); await tool.getByRole('button', { name: 'Cancel', exact: true }).click(); await expect(tool.getByRole('link', { name: /^Download/ })).toHaveCount(0); await clear(ctx);
    check(true, 'Cancellation stops recording and does not expose a partial success download.');
  } };
}
const base64Case = { slug: 'base64-image-decoder', async test(ctx) {
  const { tool, check, expect, page } = ctx;
  // A real JPEG verifies that this decoder doesn't hard-code .png downloads.
  const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 16; c.height = 12; const x = c.getContext('2d'); x.fillStyle = 'red'; x.fillRect(0, 0, 16, 12); return c.toDataURL('image/jpeg'); });
  await tool.getByLabel('Base64 input', { exact: true }).fill(b64); await tool.getByRole('button', { name: 'Decode', exact: true }).click(); await expect(tool.getByRole('link', { name: /^Download JPG/ })).toBeVisible();
  const { bytes, filename } = await downloadBytes({ ...ctx, slug: 'base64-image-decoder' }); assertImageFormat(bytes, 'jpeg', check); check(filename.endsWith('.jpg'), 'JPEG Base64 downloads as JPEG.');
  const pixels = await rasterEvidence(page, bytes, 'image/jpeg'); check(pixels.width === 16 && pixels.height === 12 && pixels.first[0] > 200, 'Decoded JPEG retains dimensions and real red pixels.');
  await tool.getByLabel('Base64 input', { exact: true }).fill(b64.replace('image/jpeg', 'image/png')); await tool.getByRole('button', { name: 'Decode', exact: true }).click(); await expect(tool.getByRole('alert')).toContainText('MIME type'); await expect(tool.getByRole('link', { name: /^Download/ })).toHaveCount(0); check(true, 'MIME/signature mismatch is rejected.'); await clear(ctx);
} };
export default [
  textCase('sql-to-json', 'sql'), numberCase('binary-decimal-hex-converter', true), unitCase('temperature-unit-converter', true), numberCase('base-number-converter', false),
  audioCase('aac-to-wav'), videoCase('add-subtitles', true), textCase('csv-to-excel', 'xlsx'), textCase('csv-to-xml', 'xml'), videoCase('cutter'),
  spreadsheetCase('excel-to-csv', 'csv'), spreadsheetCase('excel-to-pdf', 'pdf'), spreadsheetCase('excel-to-xml', 'xml'), audioCase('extract-audio'),
  ...imageCases, audioCase('m4a-to-wav'), audioCase('mkv-to-mp3', true), audioCase('mp4-to-mp3', true), audioCase('mp4-to-wav'), base64Case,
  unitCase('all-in-one-unit-converter'), textCase('markdown-table-from-json', 'markdown'), unitCase('general-unit-converter'), numberCase('bin-hex-dec-converter', true),
];
