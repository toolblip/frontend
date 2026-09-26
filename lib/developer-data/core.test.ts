import { describe, it, expect } from 'vitest';
import { parseJson, toPython, toTypescript, buildCsv, diffLines } from './core';
import { jsonPath } from './jsonpath';
import { validateSchema } from './schema';
import { formatSql } from './sql';
import { cleanNotebook, formatNotebook, notebook, notebookExample } from './notebook';
import ts from 'typescript';
import {textPdf} from './pdf';
import {PDFDocument} from 'pdf-lib';
import { buildGraph } from './graph';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
describe('developer data bounds', () => {
    it.each(['{"x":}', 'NaN', 'undefined', '{"n":1e400}', '9007199254740993'])('rejects invalid or unsupported JSON %s', s => expect(() => parseJson(s)).toThrow());
    it('bounds bytes and depth before tree rendering', () => { expect(() => parseJson(' '.repeat(100001))).toThrow(/100,000/); expect(() => parseJson('['.repeat(66) + '0' + ']'.repeat(66))).toThrow(/nesting/); });
});
describe('Python syntax and values', () => {
    it('has one assignment, quoted dictionary keys and literal nested values', () => {
        const result = toPython('{"a-b":[true,null,{"q\\\"":"\\n"}],"empty":{}}');
        expect(result).toBe('data = {\n    "a-b": [\n        True,\n        None,\n        {\n            "q\\\"": "\\n"\n        }\n    ],\n    "empty": {}\n}');
        const check = spawnSync('python3', ['-c', 'import ast,sys\ntree=ast.parse(sys.stdin.read())\nassert len(tree.body)==1 and isinstance(tree.body[0],ast.Assign)'], { input: result, encoding: 'utf8' });
        expect(check.status, check.stderr).toBe(0);
    });
    it.each([['null', 'data = None'], ['false', 'data = False'], ['[]', 'data = []'], ['42', 'data = 42']])('converts %s', (s, want) => expect(toPython(s)).toBe(want));
});
describe('TypeScript generation', () => {
    it('retains arrays and parenthesizes unions', () => expect(toTypescript('{"a":[1,"x",null]}')).toBe('interface Root {\n  a: (number | string | null)[];\n}\n'));
    it('retains all array object shapes', () => { const out = toTypescript('[{"a":1},{"b":true}]'); expect(out).toContain('type Root = Data[];'); expect(out).toContain('b: boolean;'); });
    it('compiles generated nested, heterogeneous, empty and quoted-key types', () => {
        const dir = mkdtempSync(join(tmpdir(), 'developer-data-types-'));
        try {
            const samples = ['{}', '[]', 'null', '{"a-b":{"nested":[1,true]},"quote\\\"":null}', '[[1],[true]]', '[{"a":1},{"b":true}]'];
            const files = samples.map((s, i) => { const file = join(dir, `sample${i}.ts`); writeFileSync(file, toTypescript(s, `Root${i}`, `Data${i}`)); return file; });
            const program = ts.createProgram(files, { strict: true, noEmit: true, skipLibCheck: true, types: [], target: ts.ScriptTarget.ES2020 });
            expect(ts.getPreEmitDiagnostics(program).map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n'))).toEqual([]);
        }
        finally {
            rmSync(dir, { recursive: true, force: true });
        }
    });
    it.each(['x-y', 'class', '1Root', 'string'])('rejects invalid type name %s', name => expect(() => toTypescript('{}', name)).toThrow(/identifiers/));
});
describe('JSONPath bounded grammar', () => {
    const data = '{"store":{"book":[{"title":"One","price":5},{"title":"Two","price":25}]},"a.b":null,"__proto__":42}';
    it.each([['$.store.book[*].title', ['One', 'Two']], ['$..price', [5, 25]], ['$.store.book[-1].title', ['Two']], ['$["a.b"]', [null]], ['$.missing', []], ['$.__proto__', [42]], ['$.constructor', []], ['$..book[?(@.price > 20)].title', ['Two']]])('%s', (path, want) => expect(jsonPath(data, path)).toEqual(want));
    it('root array remains a single match', () => expect(jsonPath('[1,2]', '$')).toEqual([[1, 2]]));
    it.each(['$.store.book[?(@.price = 2)]', '$.store[0:3]', '$..', '$foo', '$.store.book[?(@.x == alert(1))]'])('rejects unsupported syntax %s', p => expect(() => jsonPath(data, p)).toThrow());
});
describe('JSON schema correctness', () => {
    const validate = (v: any, s: any) => validateSchema(JSON.stringify(v), JSON.stringify(s));
    it.each([[{}, { type: 'string' }], [null, { type: 'object' }], [2.5, { type: 'integer' }], [1, { const: 0 }], [true, { const: false }], [{}, { required: ['toString'] }], [[], false]])('rejects %j against %j', (v, s) => expect(validate(v, s).length).toBeGreaterThan(0));
    it('supports boolean false nested schemas and not false', () => { expect(validate({ x: 1 }, { properties: { x: false } })).toHaveLength(1); expect(validate(1, { not: false })).toEqual([]); });
    it('deep enum and uniqueItems ignore object key order', () => { expect(validate({ b: 2, a: 1 }, { enum: [{ a: 1, b: 2 }] })).toEqual([]); expect(validate([{ a: 1, b: 2 }, { b: 2, a: 1 }], { uniqueItems: true })).toHaveLength(1); });
    it('counts unicode codepoints', () => expect(validate('😀', { maxLength: 1 })).toEqual([]));
    it.each([{ $ref: '#' }, { pattern: '[' }, { format: 'unknown' }, { type: 'banana' }, { items: [] }, { minimum: '0' }])('rejects unsupported or malformed schema %j', s => expect(() => validate(1, s)).toThrow());
    it('validates anyOf, oneOf and additionalProperties schema', () => { expect(validate(1, { anyOf: [{ type: 'string' }, { type: 'number' }] })).toEqual([]); expect(validate(1, { oneOf: [true, true] })).toHaveLength(1); expect(validate({ x: 'bad' }, { additionalProperties: { type: 'number' } })).toHaveLength(1); });
});
describe('SQL lexical integrity', () => {
    it('formats independent known answer', () => expect(formatSql("select id, 'from  here' as label from users where active = 1;")).toBe("SELECT id, 'from  here' AS label\nFROM users\nWHERE active = 1;"));
    it('preserves quotes, comments, dollar quotes and multi-character operators', () => { const out = formatSql("select 'it''s where', $$from  x$$, \"select\" from x -- where x\nwhere a != 2 and b >= 1"); expect(out).toContain("'it''s where'"); expect(out).toContain('$$from  x$$'); expect(out).toContain('"select"'); expect(out).toContain('-- where x\n'); expect(out).toContain('a != 2'); expect(out).toContain('b >= 1'); });
    it.each(["select 'oops", 'select /* oops', 'select (1', 'select 1)'])('rejects %s', s => expect(() => formatSql(s)).toThrow());
    it('preserves adjacent literal prefixes and bind variables', () => expect(formatSql("select E'hi', @user, :name from t")).toBe("SELECT E'hi', @user, :name\nFROM t"));
    it('preserves case when requested', () => expect(formatSql('select x from y', false)).toBe('select x\nfrom y'));
});
describe('CSV and diff', () => {
    it('quotes CR, LF, comma and double quote exactly', () => expect(buildCsv(['A', 'B'], [['x\ry', 'a"b'], ['x,y', 'z\nw']])).toBe('A,B\r\n"x\ry","a""b"\r\n"x,y","z\nw"'));
    it('insertion does not shift unrelated lines', () => expect(diffLines('a\nc', 'a\nb\nc')).toBe('  a\n+ b\n  c'));
    it('empty input does not manufacture blank lines', () => { expect(diffLines('', 'a')).toBe('+ a'); expect(diffLines('', '')).toBe(''); });
    it('bounds quadratic diff work', () => expect(() => diffLines('a\n'.repeat(1100), 'b\n'.repeat(1100))).toThrow(/limited/));
});
describe('notebooks', () => {
    it('preserves source, cell id, attachments and metadata during cleanup', () => { const n = JSON.parse(notebookExample); n.cells[0].attachments = { 'a.png': { 'image/png': 'AA==' } }; const clean = cleanNotebook(JSON.stringify(n)); expect(clean.cells[0]).toEqual(n.cells[0]); expect(clean.cells[1].id).toBe('code'); expect(clean.cells[1].source).toEqual(['print(42)']); expect(clean.cells[1].outputs).toEqual([]); expect(clean.cells[1].execution_count).toBeNull(); expect(clean.metadata).toEqual(n.metadata); });
    it('format preserves default document order', () => expect(JSON.parse(formatNotebook(notebookExample)).cells.map((c: any) => c.id)).toEqual(['intro', 'code']));
    it('sorting is explicit and null executions follow code', () => expect(JSON.parse(formatNotebook(notebookExample, true)).cells.map((c: any) => c.id)).toEqual(['code', 'intro']));
    it.each(['null', '{"cells":[]}', JSON.stringify({ nbformat: 4, nbformat_minor: 5, metadata: {}, cells: [null] })])('rejects malformed notebook', s => expect(() => notebook(s)).toThrow());
});
describe('graph regression', () => {
    it('adds one edge per child including primitives', () => { const g = buildGraph('{"a":1,"b":null}'); expect(g.nodes).toHaveLength(3); expect(g.edges).toEqual([{ from: 'n0', to: 'n1', key: 'a' }, { from: 'n0', to: 'n2', key: 'b' }]); });
    it('rejects graphs above the rendering limit', () => expect(buildGraph(JSON.stringify(Array.from({ length: 201 }, (_, i) => i))).error).toContain('200'));
});

describe('real PDF text export', () => {
  it('emits parseable nonempty PDF bytes with known text', async () => {
    const bytes = await textPdf([{text:'Hello',heading:true},{text:'Answer 42.'}]);
    expect(Buffer.from(bytes).subarray(0,5).toString()).toBe('%PDF-');
    const doc=await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
    expect(Buffer.from(bytes).toString('latin1')).toContain('(Answer 42.)');
  });
  it('paginates long content rather than clipping it', async () => {
    const doc=await PDFDocument.load(await textPdf([{text:'A line.\n'.repeat(90)}]));
    expect(doc.getPageCount()).toBeGreaterThan(1);
  });
  it('rejects Unicode instead of corrupting output', async () => {
    await expect(textPdf([{text:'বাংলা'}])).rejects.toThrow(/Unicode/);
  });
});
