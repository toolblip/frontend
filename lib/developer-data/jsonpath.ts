import { parseJson } from './core';
type Step = {
    recursive: boolean;
    key?: string;
    index?: number;
    wildcard?: boolean;
    filter?: {
        key: string;
        op: string;
        value: any;
    };
};
// Deliberately bounded grammar: no JavaScript evaluation or silently ignored tokens.
export function jsonPath(text: string, path: string): unknown[] {
    const data = parseJson(text);
    if (path.length > 2000 || !path.startsWith('$'))
        throw new Error('JSONPath must start with $ and be at most 2,000 characters.');
    const steps: Step[] = [];
    let i = 1;
    while (i < path.length) {
        let recursive = false;
        if (path.startsWith('..', i)) {
            recursive = true;
            i += 2;
        }
        else if (path[i] === '.')
            i++;
        else if (path[i] !== '[')
            throw new Error('Unsupported JSONPath syntax at ' + i);
        let match: RegExpMatchArray | null;
        if (path[i] === '[') {
            const rest = path.slice(i);
            if ((match = rest.match(/^\[(-?\d+|\*)\]/)))
                steps.push({ recursive, ...(match[1] === '*' ? { wildcard: true } : { index: Number(match[1]) }) });
            else if ((match = rest.match(/^\["((?:[^"\\]|\\.)*)"\]/)))
                steps.push({ recursive, key: JSON.parse('"' + match[1] + '"') });
            else if ((match = rest.match(/^\['((?:[^'\\]|\\['\\])*)'\]/)))
                steps.push({ recursive, key: match[1].replace(/\\(['\\])/g, '$1') });
            else if ((match = rest.match(/^\[\?\(@\.([\w$]+)\s*(==|!=|>=|<=|>|<)\s*("(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?|true|false|null)\)\]/)))
                steps.push({ recursive, filter: { key: match[1], op: match[2], value: JSON.parse(match[3]) } });
            else
                throw new Error('Unsupported bracket expression. Use an index, quoted key, wildcard, or simple comparison filter.');
            i += match[0].length;
        }
        else if ((match = path.slice(i).match(/^(\*|[A-Za-z_$][\w$]*)/))) {
            steps.push({ recursive, ...(match[1] === '*' ? { wildcard: true } : { key: match[1] }) });
            i += match[0].length;
        }
        else
            throw new Error('Expected a property or wildcard at ' + i);
    }
    let current: any[] = [data];
    let work = 0;
    const own = (v: any, k: string) => v !== null && typeof v === 'object' && Object.hasOwn(v, k);
    for (const step of steps) {
        const next: any[] = [];
        function apply(v: any) {
            if (++work > 50000)
                throw new Error('JSONPath exceeds the 50,000-visit limit.');
            if (step.key !== undefined && own(v, step.key))
                next.push(v[step.key]);
            else if (step.index !== undefined && Array.isArray(v)) {
                const n = step.index < 0 ? v.length + step.index : step.index;
                if (n >= 0 && n < v.length)
                    next.push(v[n]);
            }
            else if (step.wildcard && v !== null && typeof v === 'object')
                next.push(...Object.values(v));
            else if (step.filter && v !== null && typeof v === 'object') {
                const { key, op, value } = step.filter;
                for (const x of Object.values(v) as any[])
                    if (own(x, key)) {
                        const a = x[key];
                        const ordered = typeof a === typeof value && (typeof a === 'number' || typeof a === 'string');
                        if (op === '==' ? a === value : op === '!=' ? a !== value : ordered && (op === '>' ? a > value : op === '<' ? a < value : op === '>=' ? a >= value : a <= value))
                            next.push(x);
                    }
            }
            if (next.length > 10000)
                throw new Error('Too many JSONPath matches.');
        }
        function walk(v: any) { apply(v); if (v !== null && typeof v === 'object')
            Object.values(v).forEach(walk); }
        current.forEach(step.recursive ? walk : apply);
        current = next;
    }
    return current;
}
