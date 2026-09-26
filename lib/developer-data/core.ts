export const MAX_INPUT = 100000;
export function bounded(text: string) {
    if (text.length > MAX_INPUT)
        throw new Error('Input exceeds 100,000 characters.');
    return text;
}
export interface JsonBudget { maxBytes: number; maxDepth: number; maxNodes: number }
export function parseJson(text: string, budget?: JsonBudget): any {
    if (budget) {
        if (text.length > budget.maxBytes || new TextEncoder().encode(text).byteLength > budget.maxBytes)
            throw new Error(`JSON exceeds ${budget.maxBytes.toLocaleString('en-US')} bytes.`);
    } else bounded(text);
    const value = JSON.parse(text);
    let count = 0;
    function visit(v: unknown, depth: number) {
        if (++count > (budget?.maxNodes ?? 10000) || depth > (budget?.maxDepth ?? 64))
            throw new Error(`JSON exceeds ${(budget?.maxNodes ?? 10000).toLocaleString('en-US')} values or ${budget?.maxDepth ?? 64} nesting levels.`);
        if (typeof v === 'number' && (!Number.isFinite(v) || Number.isInteger(v) && !Number.isSafeInteger(v)))
            throw new Error('Number exceeds the supported safe range.');
        if (v && typeof v === 'object')
            Object.values(v).forEach(x => visit(x, depth + 1));
    }
    visit(value, 0);
    return value;
}
export function pythonValue(v: any, depth = 0): string {
    if (v === null)
        return 'None';
    if (typeof v === 'boolean')
        return v ? 'True' : 'False';
    if (typeof v !== 'object')
        return JSON.stringify(v);
    const pad = '    '.repeat(depth), inner = pad + '    ';
    const array = Array.isArray(v);
    const entries = array ? v.map(x => pythonValue(x, depth + 1)) : Object.entries(v).map(([k, x]) => `${JSON.stringify(k)}: ${pythonValue(x, depth + 1)}`);
    return entries.length ? `${array ? '[' : '{'}\n${inner}${entries.join(',\n' + inner)}\n${pad}${array ? ']' : '}'}` : array ? '[]' : '{}';
}
export function toPython(text: string) { return 'data = ' + pythonValue(parseJson(text)); }
const reserved = new Set('break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with let static yield interface implements package private protected public await type string number boolean unknown never any object'.split(' '));
export function toTypescript(text: string, root = 'Root', item = 'Data', single = true, semi = true): string {
    for (const name of [root, item])
        if (!/^[A-Za-z_$][\w$]*$/.test(name) || reserved.has(name))
            throw new Error('Type names must be non-reserved TypeScript identifiers.');
    const end = semi ? ';' : '';
    function key(k: string) { return /^[A-Za-z_$][\w$]*$/.test(k) ? k : single ? "'" + JSON.stringify(k).slice(1, -1).replace(/'/g, "\\'") + "'" : JSON.stringify(k); }
    function type(v: any, depth = 0): string {
        if (v === null)
            return 'null';
        if (Array.isArray(v))
            return v.length ? `(${[...new Set(v.map(x => type(x, depth)))].join(' | ')})[]` : 'unknown[]';
        if (typeof v !== 'object')
            return typeof v;
        if (!Object.keys(v).length)
            return 'Record<string, never>';
        return '{\n' + Object.entries(v).map(([k, x]) => '  '.repeat(depth + 1) + key(k) + ': ' + type(x, depth + 1) + end).join('\n') + '\n' + '  '.repeat(depth) + '}';
    }
    const value = parseJson(text);
    if (Array.isArray(value) && value.length && value.every(x => x && typeof x === 'object' && !Array.isArray(x))) {
        if (root === item)
            throw new Error('Root and array item type names must differ.');
        return `type ${root} = ${item}[]${end}\n\ntype ${item} = ${[...new Set(value.map(x => type(x)))].join(' | ')}${end}\n`;
    }
    if (value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length)
        return `interface ${root} ${type(value)}\n`;
    return `type ${root} = ${type(value)}${end}\n`;
}
export function csvCell(value: string) { return /[",\r\n]/.test(value) ? '"' + value.replace(/"/g, '""') + '"' : value; }
export function buildCsv(columns: string[], rows: string[][]) { return [columns, ...rows].map(row => columns.map((_, i) => csvCell(row[i] ?? '')).join(',')).join('\r\n'); }
export function diffLines(before: string, after: string) {
    bounded(before);
    bounded(after);
    const a = before ? before.split('\n') : [], b = after ? after.split('\n') : [];
    if (a.length * b.length > 1000000 || a.length + b.length > 4000)
        throw new Error('Diff is limited to 4,000 total lines and 1,000,000 line comparisons.');
    const dp = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1));
    for (let i = a.length - 1; i >= 0; i--)
        for (let j = b.length - 1; j >= 0; j--)
            dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const out: string[] = [];
    let i = 0, j = 0;
    while (i < a.length || j < b.length) {
        if (i < a.length && j < b.length && a[i] === b[j]) {
            out.push('  ' + a[i++]);
            j++;
        }
        else if (i < a.length && (j === b.length || dp[i + 1][j] >= dp[i][j + 1]))
            out.push('- ' + a[i++]);
        else
            out.push('+ ' + b[j++]);
    }
    return out.join('\n');
}
