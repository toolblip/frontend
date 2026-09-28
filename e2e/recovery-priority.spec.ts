import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { reviewedToolSlugs, publishedTutorialTools } from '../data/reviewed-tools';
import { getToolPathBySlug } from '../lib/tool-path';
import { isToolIndexable } from '../lib/indexable-tools';
import { tools } from '../data/tools';
import { consolidatedAliases, categoricalAliases } from './content-aliases';

async function openTool(page: Page, slug: string) {
  await page.goto(getToolPathBySlug(slug));
  const tool = page.locator('.tb-v2-tool-card').first();
  await expect(tool).toBeVisible();
  await expect.poll(() => tool.locator('button').first().evaluate(button =>
    Object.keys(button).some(key => key.startsWith('__reactProps$')))).toBe(true);
  return tool;
}
test('case converter produces title case and reports clipboard failure', async ({page}) => {
  const tool = await openTool(page, 'case-converter');
  await tool.getByLabel('Text input').fill('hello WORLD from toolblip');
  await expect(tool.getByText('Title', {exact:true}).locator('..').locator('.tb-v2-case-val')).toHaveText('Hello World From Toolblip');
  await page.evaluate(() => { Object.defineProperty(navigator.clipboard, 'writeText', {value: () => Promise.reject(new Error('denied'))}); });
  await tool.getByRole('button',{name:'Copy Title',exact:true}).click();
  await expect(tool.getByRole('alert')).toBeVisible();
  await expect(tool.getByRole('button',{name:'Copy Title',exact:true})).toHaveText('Copy');
});

test('word counter counts known text and reports clipboard failure', async ({page}) => {
  const tool = await openTool(page, 'word-counter');
  await tool.locator('textarea').fill('One two three.\nFour five.');
  await expect(tool.getByText('Words',{exact:true}).locator('..')).toHaveText('5Words');
  await page.evaluate(() => { Object.defineProperty(navigator.clipboard, 'writeText', {value: () => Promise.reject(new Error('denied'))}); });
  await tool.getByRole('button',{name:'Copy',exact:true}).click();
  await expect(tool.getByRole('alert')).toBeVisible();
  await expect(tool.getByRole('button',{name:'Copy',exact:true})).toHaveText('Copy');
});

test('reading time carries rounded seconds into minutes', async ({page}) => {
  const tool = await openTool(page, 'reading-time-calculator');
  await tool.locator('textarea').fill(Array(399).fill('word').join(' '));
  await tool.getByLabel('Reading speed').fill('200');
  await expect(tool.getByText('2m 0s',{exact:true})).toBeVisible();
  await expect(tool).not.toContainText('1m 60s');
});

test('image resizer exports actual requested pixel dimensions', async ({page}) => {
  const tool = await openTool(page, 'image-resizer');
  const data = await page.evaluate(() => { const c=document.createElement('canvas'); c.width=80;c.height=40;const x=c.getContext('2d')!;x.fillStyle='red';x.fillRect(0,0,80,40);return c.toDataURL('image/png').split(',')[1]; });
  await tool.getByLabel('Select image to resize').setInputFiles({name:'fixture.png',mimeType:'image/png',buffer:Buffer.from(data,'base64')});
  await tool.getByLabel('Width (px)').fill('20');
  await expect(tool.getByLabel('Height (px)')).toHaveValue('10');
  await tool.getByRole('button',{name:'Resize image',exact:true}).click();
  const [download] = await Promise.all([page.waitForEvent('download'),tool.getByRole('link',{name:'Download resized image'}).click()]);
  const bytes = await readFile((await download.path())!);
  expect(bytes.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(bytes.readUInt32BE(16)).toBe(20);expect(bytes.readUInt32BE(20)).toBe(10);
});

test('Base64 Examples from Decode selects the matching mode and round-trips Unicode', async ({page}) => {
  const tool = await openTool(page,'base64-encoder-decoder');
  await tool.getByRole('tab',{name:'Decode',exact:true}).click();
  await tool.getByRole('button',{name:'Examples',exact:true}).click();
  await expect(tool.getByRole('tab',{name:'Encode',exact:true})).toHaveAttribute('aria-selected','true');
  await expect(tool.locator('.tb-v2-tool-output-body pre').last()).toHaveText('w6nwn5iA');
  await tool.getByRole('tab',{name:'Decode',exact:true}).click();
  await tool.getByLabel('Input',{exact:true}).fill('w6nwn5iA');
  await expect(tool.locator('.tb-v2-tool-output-body pre').last()).toHaveText('é😀');
  await expect(tool.getByRole('alert')).toHaveCount(0);
});

test('URL Unicode encodes and decodes the same text', async ({page}) => {
  const tool = await openTool(page,'url-encode');const text='বাংলা 😀 + café';
  await tool.getByLabel('Input',{exact:true}).fill(text);
  await expect(tool.locator('.tb-v2-tool-output-body pre').last()).toHaveText(encodeURIComponent(text));
  await tool.getByRole('tab',{name:'Decode',exact:true}).click();
  await tool.getByLabel('Input',{exact:true}).fill(encodeURIComponent(text));
  await expect(tool.locator('.tb-v2-tool-output-body pre').last()).toHaveText(text);
});

test('priority discovery SSR, HTTP metadata, sitemap counts and unknown blog', async ({request}) => {
  expect(Object.keys(consolidatedAliases)).toHaveLength(46);
  expect(Object.keys(categoricalAliases)).toHaveLength(9);
  for (const path of ['/', '/all-tools']) {
    const response=await request.get(path);expect(response.status()).toBe(200);const html=await response.text();
    for(const slug of reviewedToolSlugs) expect(html).toContain(`href="${getToolPathBySlug(slug)}"`);
  }
  for (const [slug, tools] of Object.entries(publishedTutorialTools)) {
    const response=await request.get(`/blog/${slug}`);expect(response.status()).toBe(200);const html=await response.text();
    for(const tool of tools) expect(html).toContain(`href="${getToolPathBySlug(tool)}"`);
  }
  for(const slug of reviewedToolSlugs) {
    const response=await request.get(getToolPathBySlug(slug));expect(response.status()).toBe(200);const html=await response.text();
    expect(html).toContain(`<link rel="canonical" href="https://toolblip.com${getToolPathBySlug(slug)}"`);
    expect(html).toContain(`<meta name="robots" content="${isToolIndexable(slug)?'index, follow':'noindex, follow'}"`);
  }
  const sitemap=await request.get('/sitemap-tools.xml');expect(sitemap.status()).toBe(200);const xml=await sitemap.text();
  expect((xml.match(/<loc>/g)||[]).length).toBe(tools.filter(t => isToolIndexable(t.slug)).length);
  for(const slug of Object.keys(consolidatedAliases)) expect(xml).not.toContain(`<loc>https://toolblip.com/tools/${slug}</loc>`);
  for(const path of Object.keys(categoricalAliases)) expect(xml).not.toContain(`<loc>https://toolblip.com${path}</loc>`);
  expect((await request.get('/blog/recovery-test-unknown-blog')).status()).toBe(404);
});

for(const width of [1440,375]) test(`priority tool layout at ${width}px`,async ({page}) => {
  await page.setViewportSize({width,height:1000});
  for(const slug of reviewedToolSlugs) {
    const tool=await openTool(page,slug);
    await tool.getByRole('button',{name:/^Examples?$/}).first().click();
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    const bounds=await tool.evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,viewport:document.documentElement.clientWidth}));
    expect(bounds.scroll,slug).toBeLessThanOrEqual(bounds.width+1);expect(bounds.left,slug).toBeGreaterThanOrEqual(-1);expect(bounds.right,slug).toBeLessThanOrEqual(bounds.viewport+1);
  }
});
