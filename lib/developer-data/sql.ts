import { bounded } from './core';
const keywords = new Set('SELECT FROM WHERE AND OR JOIN LEFT RIGHT INNER OUTER FULL CROSS NATURAL ON AS ORDER BY GROUP HAVING LIMIT OFFSET INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE ALTER DROP INDEX VIEW DATABASE SCHEMA DISTINCT COUNT SUM AVG MAX MIN IN NOT NULL IS LIKE BETWEEN EXISTS CASE WHEN THEN ELSE END UNION ALL ASC DESC USING PRIMARY KEY FOREIGN REFERENCES CONSTRAINT DEFAULT CHECK UNIQUE CASCADE EXPLAIN WITH RECURSIVE OVER PARTITION WINDOW'.split(' '));
export function formatSql(input: string, uppercase = true, indent = 2): string {
    bounded(input);
    const tokens: {
        text: string;
        kind: string;
    }[] = [];
    let i = 0, depth = 0;
    while (i < input.length) {
        const rest = input.slice(i);
        let m: RegExpMatchArray | null;
        if ((m = rest.match(/^\s+/))) {
            i += m[0].length;
            continue;
        }
        if (rest.startsWith('--')) {
            const n = rest.indexOf('\n');
            const t = n < 0 ? rest : rest.slice(0, n);
            tokens.push({ text: t, kind: 'comment' });
            i += t.length;
            continue;
        }
        if (rest.startsWith('/*')) {
            let j = i + 2, nesting = 1;
            while (j < input.length && nesting) {
                if (input.startsWith('/*', j)) {
                    nesting++;
                    j += 2;
                }
                else if (input.startsWith('*/', j)) {
                    nesting--;
                    j += 2;
                }
                else
                    j++;
            }
            if (nesting)
                throw new Error('Unterminated SQL comment.');
            tokens.push({ text: input.slice(i, j), kind: 'comment' });
            i = j;
            continue;
        }
        if ((m = rest.match(/^\$(?:[A-Za-z_][\w]*)?\$/))) {
            const end = input.indexOf(m[0], i + m[0].length);
            if (end < 0)
                throw new Error('Unterminated dollar-quoted string.');
            const t = input.slice(i, end + m[0].length);
            tokens.push({ text: t, kind: 'literal' });
            i += t.length;
            continue;
        }
        if ("'\"`[".includes(input[i])) {
            const end = input[i] === '[' ? ']' : input[i];
            let j = i + 1, closed = false;
            while (j < input.length) {
                if (input[j] === end) {
                    if (input[j + 1] === end) {
                        j += 2;
                        continue;
                    }
                    j++;
                    closed = true;
                    break;
                }
                if (input[j] === '\\')
                    j++;
                j++;
            }
            if (!closed)
                throw new Error('Unterminated SQL quote.');
            tokens.push({ text: input.slice(i, j), kind: 'literal' });
            i = j;
            continue;
        }
        if ((m = rest.match(/^[A-Za-z_][\w$]*|^\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/))) {
            tokens.push({ text: m[0], kind: 'word' });
            i += m[0].length;
            continue;
        }
        if ((m = rest.match(/^(?:!=|<>|<=|>=|::|\|\||&&|->>|->|:=)/))) {
            tokens.push({ text: m[0], kind: 'punct' });
            i += m[0].length;
            continue;
        }
        const ch = input[i++];
        if (ch === '(')
            depth++;
        if (ch === ')' && --depth < 0)
            throw new Error('Unbalanced SQL parentheses.');
        tokens.push({ text: ch, kind: 'punct' });
    }
    if (depth)
        throw new Error('Unbalanced SQL parentheses.');
    let out = '', level = 0, cursor = 0;
    tokens.forEach((token, n) => {
        const raw = token.text, upper = raw.toUpperCase(), prev = tokens[n - 1]?.text ?? '';
        const start = input.indexOf(raw, cursor), gap = input.slice(cursor, start);
        cursor = start + raw.length;
        if (raw === ')')
            level--;
        const clause = token.kind === 'word' && /^(SELECT|FROM|WHERE|HAVING|LIMIT|OFFSET|VALUES|SET|UNION|ORDER|GROUP|LEFT|RIGHT|INNER|FULL|CROSS|JOIN)$/.test(upper) && !(upper === 'JOIN' && /^(LEFT|RIGHT|INNER|OUTER|FULL|CROSS|NATURAL)$/i.test(prev));
        const text = uppercase && token.kind === 'word' && keywords.has(upper) ? upper : raw;
        if (clause && out && !out.endsWith('\n'))
            out = out.trimEnd() + '\n' + ' '.repeat(level * indent);
        else if (out && !out.endsWith('\n') && gap.length)
            out += ' ';
        out += text;
        if (token.kind === 'comment' || raw === ';')
            out += '\n';
        if (raw === '(')
            level++;
    });
    return out.trim();
}
