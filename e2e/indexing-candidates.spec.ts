import { expect, test, type Page, type Locator } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { isToolIndexable } from '../lib/indexable-tools';
import { waitForToolHandler } from './tools/react-readiness';

// Also runs unchanged against production via playwright.candidates.config.ts.
async function open(page: Page, slug: string) {
  await page.goto(`/tools/${slug}`);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://toolblip.com/tools/${slug}`);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S.{40}/);
  const publicPage = new URL(page.url()).hostname === 'toolblip.com';
  const indexed = publicPage ? (process.env.CANDIDATE_EXPECT_INDEXED ?? '').split(',').includes(slug) : isToolIndexable(slug);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', indexed ? /^index, follow$/ : /noindex/);
  await waitForToolHandler(page.getByRole('button', { name: /^Examples?$/ }), 'onClick');
  const cookies = page.getByRole('button', { name: /^Accept(?: analytics cookies)?$/ });
  if (await cookies.isVisible()) await cookies.click();
  // Capture the clipboard API payload on both engines without relying on OS permissions.
  await page.evaluate(() => Object.defineProperty(navigator.clipboard, 'writeText', {
    configurable: true, value: async (text: string) => { (window as any).__copied = text; },
  }));
}
async function copy(page: Page, expected: string, button?: Locator) {
  await (button ?? page.getByRole('button', { name: 'Copy', exact: true }).last()).click();
  await expect.poll(() => page.evaluate(() => (window as any).__copied)).toBe(expected);
}
async function fits(page: Page) {
  await page.screenshot({ path: test.info().outputPath('populated.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
}
async function clear(page: Page) { await page.getByRole('button', { name: 'Clear', exact: true }).click(); }
const notebook = {
  nbformat: 4, nbformat_minor: 5, metadata: { custom: { keep: true }, kernelspec: { name: 'python3', display_name: 'Python 3' } },
  cells: [{ id: 'code1', cell_type: 'code', metadata: { tags: ['keep'], custom: 42 }, source: ['print("hi")\n'], execution_count: 2, outputs: [{ output_type: 'stream', name: 'stdout', text: ['hi\n'] }] },
    { id: 'intro', cell_type: 'markdown', metadata: {}, source: ['# Title'] }],
};

for (const width of [1440, 375]) {
  test.describe(`indexing candidates ${width}px`, () => {
    test.use({ viewport: { width, height: 1000 } });
    test('json-to-typescript: identifiers, reserved keys, heterogeneous arrays and nested null', async ({ page }) => {
      await open(page, 'json-to-typescript');
      const input = page.getByLabel('JSON input');
      await input.fill('{"class":true,"not-valid":null,"items":[1,"x",null,{"nested":null}]}');
      const output = page.getByLabel('Output', { exact: true });
      await expect(output).toContainText('interface Root');
      const source = await output.innerText();
      expect(source).toContain('class: boolean');
      expect(source).toContain("'not-valid': null");
      expect(source).toMatch(/number \| string \| null \| \{/);
      expect(source).toContain('nested: null');
      expect(ts.transpileModule(source, { reportDiagnostics: true, compilerOptions: { target: ts.ScriptTarget.ES2020 } }).diagnostics).toEqual([]);
      await copy(page, source);
      await fits(page);
      await input.fill('[{"id":1},{"label":"two"}]');
      await expect(output).toContainText('type Root = Data[];');
      await expect(output).toContainText('label: string');
      await input.fill('{bad}');
      await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toBeVisible();
      await input.fill('{"ok":true}');
      await page.getByLabel('Root type name').fill('class');
      await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toContainText('non-reserved');
      await page.getByLabel('Root type name').fill('1Root');
      await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toContainText('identifiers');
      await clear(page);
      await expect(input).toHaveValue('');
      await expect(output).toBeEmpty();
    });
    test('time-zone-converter: summer conversion and both DST errors', async ({ page }) => {
      await open(page, 'time-zone-converter');
      await page.getByRole('button', { name: /^Examples?$/ }).click();
      await expect(page.getByText('2024-07-01 17:00', { exact: true })).toBeVisible();
      await expect(page.getByText('2024-07-02 01:00', { exact: true })).toBeVisible();
      const timeCopy = page.getByRole('button', { name: 'Copy', exact: true }).first();
      await copy(page, '2024-07-01 17:00', timeCopy);
      expect((await timeCopy.boundingBox())!.height, 'Copy label fits on one line').toBeLessThanOrEqual(32);
      await fits(page);
      await page.getByLabel('Input Date').fill('2024-11-03');
      await page.getByLabel('Input Time').fill('01:30');
      await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toContainText('occurs twice');
      await page.getByLabel('Input Date').fill('2024-03-10');
      await page.getByLabel('Input Time').fill('02:30');
      await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toContainText('does not exist');
      await clear(page);
      await expect(page.getByLabel('Input Date')).toHaveValue('');
      await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toHaveCount(0);
    });
    test('html-table-generator: quoted CSV and escaped markup', async ({ page }) => {
      await open(page, 'html-table-generator');
      await page.getByLabel('Table headers').fill('Name,Note');
      await page.getByLabel('CSV input').fill('"Ada, Lovelace","<script>& hi"');
      await page.getByRole('button', { name: 'Generate Table' }).click();
      const output = page.getByLabel('HTML output');
      await expect(output).toHaveValue(/<td>Ada, Lovelace<\/td>/);
      await expect(output).toHaveValue(/&lt;script&gt;&amp; hi/);
      await expect(page.locator('.tb-v2-tool-output-body td')).toHaveCount(2);
      await copy(page, await output.inputValue());
      await fits(page);
      await page.getByLabel('CSV input').fill('"unclosed');
      await page.getByRole('button', { name: 'Generate Table' }).click();
      await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toBeVisible();
      await expect(output).toHaveValue('');
      await clear(page);
      await expect(page.getByLabel('CSV input')).toHaveValue('');
    });
    test('ldap-filter-generator: literal special characters and invalid attributes', async ({ page }) => {
      await open(page, 'ldap-filter-generator');
      await page.getByRole('button', { name: /^Examples?$/ }).click();
      await page.getByLabel('Row value').fill('A(B)\0*\\');
      const output = page.locator('pre.tb-v2-tool-pre');
      await expect(output).toHaveText('(cn=A\\28B\\29\\00\\2a\\5c)');
      await copy(page, '(cn=A\\28B\\29\\00\\2a\\5c)');
      await fits(page);
      await page.getByLabel('Row attribute').fill('bad)(');
      await expect(page.getByText(/Invalid: Every row/)).toBeVisible();
      await expect(page.getByRole('button', { name: 'Copy', exact: true })).toBeDisabled();
      await clear(page);
      await expect(page.getByLabel('Row value')).toHaveCount(0);
    });
    test('json-to-python: Python literals preserve quoted keys and nested lists', async ({ page }) => {
      await open(page, 'json-to-python');
      const input = page.getByLabel('JSON input');
      await input.fill(JSON.stringify({'say "hi"': [true, null, [false, {class: 'Ada'}]]}));
      const output = page.getByLabel('Output', { exact: true });
      await expect(output).toContainText('data = {');
      const text = await output.innerText();
      expect(text).toContain('"say \\"hi\\""');
      expect(text).toContain('True,'); expect(text).toContain('None,'); expect(text).toContain('False,');
      expect(text).toContain('"class": "Ada"');
      await copy(page, text); await fits(page);
      await input.fill('{bad}');
      await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toBeVisible();
      await expect(output).toBeEmpty();
      await clear(page); await expect(input).toHaveValue('');
    });
    test('split-csv: downloaded bytes preserve quoted newline, comma and quotes', async ({ page }) => {
      await open(page, 'split-csv');
      const csv = 'name,note\n"Ada, L","line 1\nline ""2"""\nLin,ok\n';
      await page.getByLabel('Upload file', { exact: true }).setInputFiles({ name: 'quoted.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
      await expect(page.getByText(/2 data rows/)).toBeVisible();
      await page.getByLabel('Rows Per File').fill('1');
      const downloads: import('@playwright/test').Download[] = [];
      page.on('download', d => downloads.push(d));
      await page.getByRole('button', { name: 'Download 2 CSV Files' }).click();
      await expect.poll(() => downloads.length).toBe(2);
      expect(await readFile((await downloads[0].path())!, 'utf8')).toBe('name,note\n"Ada, L","line 1\nline ""2"""');
      expect(await readFile((await downloads[1].path())!, 'utf8')).toBe('name,note\nLin,ok');
      expect((await page.locator('.utility-design-layout .tb-v2-banner strong').boundingBox())!.height, 'CSV filename remains readable on one line').toBeLessThanOrEqual(24);
      await fits(page); await clear(page);
      await expect(page.getByText('Upload a .csv file to split it into smaller files.')).toBeVisible();
      await page.getByLabel('Upload file', { exact: true }).setInputFiles({ name: 'bad.csv', mimeType: 'text/csv', buffer: Buffer.from('a\n"unclosed') });
      await expect(page.getByText('Could not read this file or CSV is malformed.')).toBeVisible();
    });
    test('html-minifier: inline separators, script strings and pre whitespace', async ({ page }) => {
      await open(page, 'html-minifier');
      const html = '<span>Hello</span> <span>world</span><!-- remove --><script>const end = "<\\/script>";  const x = 1;</script><pre>  a\n b </pre>';
      await page.getByLabel('HTML input').fill(html);
      const output = page.locator('pre.tb-v2-tool-pre');
      await expect(output).toHaveText(html.replace('<!-- remove -->', ''), { useInnerText: true });
      await copy(page, html.replace('<!-- remove -->', '')); await fits(page);
      const rcdata = '<title>A<!--keep-->&amp;B</title><textarea>A<!--keep-->&amp;<b>B</b></textarea><!-- remove -->';
      await page.getByLabel('HTML input').fill(rcdata);
      await expect(output).toHaveText(rcdata.replace('<!-- remove -->', ''), { useInnerText: true });
      const minified = await output.innerText();
      const values = await page.evaluate(([before, after]) => {
        const textValues = (html: string) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          return { title: doc.title, textarea: doc.querySelector('textarea')!.value };
        };
        return [textValues(before), textValues(after)];
      }, [rcdata, minified]);
      expect(values[1]).toEqual(values[0]);
      await copy(page, minified);
      await page.getByLabel('HTML input').fill('<!-- unclosed');
      await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toContainText('Unclosed');
      await clear(page); await expect(page.getByLabel('HTML input')).toHaveValue('');
    });
    test('ipynb-formatter: valid notebook metadata, download and malformed input', async ({ page }) => {
      await open(page, 'ipynb-formatter');
      const input = page.getByLabel('Notebook JSON input');
      await input.fill(JSON.stringify(notebook));
      const output = page.getByLabel('Output', { exact: true });
      await expect(output).toContainText('nbformat');
      expect(JSON.parse(await output.innerText())).toEqual(notebook);
      await copy(page, await output.innerText());
      const download = page.waitForEvent('download');
      await page.getByRole('button', { name: /Download/ }).click();
      expect(JSON.parse(await readFile((await (await download).path())!, 'utf8'))).toEqual(notebook);
      await fits(page);
      await input.fill('{"nbformat":4,"cells":[{}]}');
      await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toBeVisible();
      await expect(output).toBeEmpty();
      await clear(page); await expect(input).toHaveValue('');
    });
  });
}

const candidates = ['json-to-typescript', 'time-zone-converter', 'html-table-generator', 'ldap-filter-generator', 'json-to-python', 'split-csv', 'html-minifier', 'ipynb-formatter'];
test('candidate SSR robots and sitemap agree with the reviewed policy', async ({ request, baseURL }) => {
  const sitemap = await request.get('/sitemap-tools.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const slug of candidates) {
    const indexed = new URL(baseURL!).hostname === 'toolblip.com'
      ? (process.env.CANDIDATE_EXPECT_INDEXED ?? '').split(',').includes(slug)
      : isToolIndexable(slug);
    const response = await request.get(`/tools/${slug}`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(`href="https://toolblip.com/tools/${slug}"`);
    expect(html).toMatch(indexed ? /name="robots" content="index, follow"/ : /name="robots" content="noindex[^"]*"/);
    expect(xml.includes(`<loc>https://toolblip.com/tools/${slug}</loc>`), slug).toBe(indexed);
  }
});
