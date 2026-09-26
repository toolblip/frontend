// Reusable checks for existing developer-data cases. No slug registrations here.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
const output = tool => tool.getByLabel('Output', { exact: true });
const nbInput = tool => tool.getByLabel('Notebook JSON input', { exact: true });
const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
async function download(ctx, name, filename) {
    const pending = ctx.page.waitForEvent('download');
    await ctx.tool.getByRole('button', { name, exact: true }).click();
    const file = await pending;
    const path = join(ctx.artifactsDir, filename);
    await file.saveAs(path);
    return readFile(path, 'utf8');
}
export async function schemaReview(ctx) {
    const { tool, expect } = ctx;
    const input = tool.getByLabel('JSON input', { exact: true });
    const schema = tool.getByLabel('JSON schema', { exact: true });
    for (const [rule, good, bad] of [
        [{ type: 'string', pattern: '^[A-Z]+$' }, 'ABC', 'abc'],
        [{ type: 'string', format: 'email' }, 'a@example.com', 'not-email'],
    ]) {
        await schema.fill(JSON.stringify(rule));
        await input.fill(JSON.stringify(good));
        await expect(output(tool)).toHaveText('Valid against the supported schema.');
        await input.fill(JSON.stringify(bad));
        await expect(tool.getByRole('alert')).toBeVisible();
        await expect(output(tool)).toHaveText('');
    }
    await schema.fill('{"pattern":"(a+)+$"}');
    await input.fill(JSON.stringify('a'.repeat(5000) + '!'));
    await expect(tool.getByRole('alert')).toContainText('time limit', { timeout: 5000 });
    await schema.fill('{"pattern":"^OK$"}');
    await input.fill('"OK"');
    await expect(output(tool)).toHaveText('Valid against the supported schema.');
    // Clear while a pathological request is in flight; no stale error may reappear.
    await schema.fill('{"pattern":"(a+)+$"}');
    await input.fill(JSON.stringify('a'.repeat(5000) + '!'));
    await tool.locator('button.tb-v2-tool-text-action').filter({ hasText: /^Clear$/ }).click();
    await expect(input).toHaveValue('');
    await expect(output(tool)).toHaveText('');
    await expect(tool.getByRole('alert')).toHaveCount(0);
    ctx.check(true, 'Patterns/formats validate, pathological regex times out, and validation recovers.');
}
export async function notebookCleanerReview(ctx) {
    const { tool, expect } = ctx;
    const n = { nbformat: 4, nbformat_minor: 5,
        metadata: { kernelspec: { name: 'python3', display_name: 'Python 3' }, language_info: { name: 'python', version: '3.12', private_note: 'secret' }, private_note: 'secret', widgets: { state: 'secret' } },
        cells: [{ id: 'code', cell_type: 'code', source: ['print(42)'], metadata: { tags: ['keep'] }, execution_count: 2, outputs: [{ output_type: 'stream', name: 'stdout', text: ['x'.repeat(150000)] }] }] };
    for (const via of ['paste', 'file']) {
        const text = JSON.stringify(n);
        if (via === 'paste') await nbInput(tool).fill(text);
        else await tool.getByLabel('Upload notebook', { exact: true }).setInputFiles({ name: 'large.ipynb', mimeType: 'application/x-ipynb+json', buffer: Buffer.from(text) });
        await expect(output(tool)).toContainText('print(42)');
        await expect(tool.getByRole('alert')).toHaveCount(0);
        const cleaned = JSON.parse(await download(ctx, 'Download .ipynb', `review-cleaned-${via}.ipynb`));
        expect(cleaned.metadata).toEqual({ kernelspec: n.metadata.kernelspec, language_info: { name: 'python', version: '3.12' } });
        expect(cleaned.cells[0]).toEqual({ ...n.cells[0], execution_count: null, outputs: [] });
    }
    ctx.check(true, '150 KB notebooks clean through paste and upload; downloads retain source and remove private metadata/output.');
}
export async function notebookImageReview(ctx) {
    const { tool, expect } = ctx;
    const n = { nbformat: 4, nbformat_minor: 4, metadata: {}, cells: [{ cell_type: 'markdown', metadata: {}, source: `![plot](${png})\n\n<img src="data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=" onerror="alert(1)">` }] };
    await nbInput(tool).fill(JSON.stringify(n));
    const plot = tool.frameLocator('iframe[title="Notebook preview"]').getByRole('img', { name: 'plot', exact: true });
    await expect(plot).toHaveAttribute('src', png);
    await expect.poll(() => plot.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    const html = await download(ctx, 'Download HTML', 'review-notebook-image.html');
    expect(html).toContain(png);
    expect(html).not.toContain('image/svg+xml');
    expect(html).not.toContain('onerror');
    // Verify the actual downloaded document also decodes the retained raster.
    const frame = await ctx.page.evaluateHandle(html => {
        const frame = document.createElement('iframe'); frame.setAttribute('sandbox', 'allow-same-origin'); frame.srcdoc = html; document.body.append(frame); return frame;
    }, html);
    try {
        await expect.poll(() => frame.evaluate(f => { const img = f.contentDocument?.querySelector('img'); return !!img?.complete && img.naturalWidth > 0; })).toBe(true);
    } finally { await frame.evaluate(f => f.remove()); await frame.dispose(); }
    ctx.check(true, 'Preview and downloaded HTML decode embedded PNG; SVG and event handlers are stripped.');
}
export async function sqlReview(ctx) {
    const { tool, expect } = ctx;
    const input = tool.getByLabel('SQL input', { exact: true });
    await input.fill('SELECT caféfrom FROM t;');
    await expect(output(tool)).toHaveText('SELECT caféfrom\nFROM t;');
    await input.fill("SELECT '\\';");
    await expect(output(tool)).toHaveText("SELECT '\\';");
    await tool.getByLabel('SQL string mode', { exact: true }).selectOption('mysql');
    await input.fill("SELECT 'it\\'s' FROM t;");
    await expect(output(tool)).toHaveText("SELECT 'it\\'s'\nFROM t;");
    await tool.getByLabel('SQL string mode', { exact: true }).selectOption('postgresql');
    await input.fill("SELECT E'it\\'s' FROM t;");
    await expect(output(tool)).toHaveText("SELECT E'it\\'s'\nFROM t;");
    ctx.check(true, 'Unicode identifiers and literal backslashes survive; escape modes are explicit.');
}
