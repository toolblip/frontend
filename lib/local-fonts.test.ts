import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import manifest from '../app/fonts/manifest.json';

const root = path.resolve(import.meta.dirname, '..');
const layout = readFileSync(path.join(root, 'app/layout.tsx'), 'utf8');
const ast = ts.createSourceFile('layout.tsx', layout, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function literal(node: ts.Node): unknown {
  if (ts.isStringLiteral(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property => {
    if (!ts.isPropertyAssignment(property)) throw new Error('Expected a literal font option');
    return [property.name.getText(ast).replaceAll('"', ''), literal(property.initializer)];
  }));
  throw new Error(`Non-literal font option: ${node.getText(ast)}`);
}
const calls: Record<string, unknown>[] = [];
function visit(node: ts.Node) {
  if (ts.isCallExpression(node) && node.expression.getText(ast) === 'localFont') {
    calls.push(literal(node.arguments[0]) as Record<string, unknown>);
  }
  ts.forEachChild(node, visit);
}
visit(ast);
const expected = [
  ['Inter Latin', '--tb-font-inter', ['100 900'], true],
  ['Inter', '--tb-font-inter-extended', ['100 900'], false],
  ['Fraunces', '--tb-font-fraunces', ['500', '600', '700'], false],
  ['Nunito', '--tb-font-nunito', ['600', '700', '800'], false],
  ['JetBrains Mono', '--tb-font-mono', ['500', '700'], false],
  ['Noto Sans Bengali', '--tb-font-bengali', ['400', '600'], false],
];

describe('self-hosted root fonts', () => {
  it('uses only the local loader and preloads only the small Inter Latin file', () => {
    expect(layout).toContain('import localFont from "next/font/local"');
    expect(calls).toHaveLength(6);
    expect(manifest.fonts.map(f => [f.family, f.variable, f.weights, f.preload])).toEqual(expected);
    expect(manifest.fonts.filter(f => f.preload).map(f => f.file)).toEqual(['inter/inter-latin.woff2']);
    expect(manifest.fonts.find(f => f.preload)?.bytes).toBeLessThan(80 * 1024);
    expect(calls.find(call => call.variable === '--tb-font-inter-extended')).toHaveProperty('declarations');
    expect(layout).toContain('${inter.variable} ${interExtended.variable}');
    const css = readFileSync(path.join(root, 'app/globals.css'), 'utf8');
    expect(css.match(/var\(--tb-font-inter, "Inter"\), var\(--tb-font-inter-extended, "Inter"\)/g)).toHaveLength(3);
    function checkImports(dir: string) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) checkImports(file);
        else if (/\.[cm]?[jt]sx?$/.test(file)) expect(readFileSync(file, 'utf8')).not.toContain('next/font/google');
      }
    }
    checkImports(path.join(root, 'app'));
    checkImports(path.join(root, 'components'));
  });
  it.each(manifest.fonts)('$family has licensed, checksummed WOFF2 and unchanged loading settings', font => {
    const file = path.join(root, 'app/fonts', font.file);
    const bytes = readFileSync(file);
    expect(bytes.toString('ascii', 0, 4)).toBe('wOF2');
    expect(bytes.readUInt32BE(8)).toBe(bytes.length);
    expect(bytes.length).toBe(font.bytes);
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(font.sha256);
    expect(readFileSync(path.join(path.dirname(file), 'OFL.txt'), 'utf8')).toContain('SIL OPEN FONT LICENSE');
    expect(readFileSync(path.join(path.dirname(file), 'METADATA.pb'), 'utf8')).toContain(`name: "${font.family === 'Inter Latin' ? 'Inter' : font.family}"`);
    expect(manifest.commit).toMatch(/^[a-f0-9]{40}$/);
    expect(font.sourceSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(calls.find(call => call.variable === font.variable)).toEqual({
      src: font.weights.map(weight => ({ path: `./fonts/${font.file}`, weight, style: 'normal' })),
      display: 'swap', variable: font.variable, preload: font.preload,
      adjustFontFallback: false, ...(font.family === 'Inter Latin' ? {} : { fallback: [`${font.family} Fallback`] }),
      ...('unicodeRange' in font ? { declarations: [{ prop: 'unicode-range', value: font.unicodeRange }] } : {}),
    });
    if (font.fallbackFace) expect(readFileSync(path.join(root, 'app/fonts/fallbacks.css'), 'utf8')).toContain(font.fallbackFace);
    for (const weight of font.weights.flatMap(w => w.split(' ').map(Number))) {
      expect(weight).toBeGreaterThanOrEqual(font.weightAxis.min);
      expect(weight).toBeLessThanOrEqual(font.weightAxis.max);
    }
  });
});
