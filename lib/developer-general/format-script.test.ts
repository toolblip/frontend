import { describe, expect, it } from 'vitest';
import vm from 'node:vm';
import * as ts from 'typescript';
import { formatScript } from './format-script';

describe('source-preserving script formatting', () => {
  it('retains TypeScript interfaces, annotations, and comments', async () => {
    const output = await formatScript(ts, '// API type\ninterface User{name:string}\nfunction greet(user:User):string{return user.name}', true, 4, false);
    expect(output).toContain('// API type');
    expect(output).toContain('interface User');
    expect(output).toContain('name: string');
    expect(output).toContain('user: User');
    expect(output).toContain('): string');
    expect(output).toMatch(/\n {4}return user.name/);
  });
  it('preserves JavaScript regexes, template literals, and execution', async () => {
    const output = await formatScript(ts, 'function run(){const re=/a{2}/;return `${re.test("aa")}:  keep`;}', false, 2, true);
    expect(vm.runInNewContext(output + ';run()')).toBe('true:  keep');
    expect(output).toMatch(/\n\tconst re/);
  });
  it('rejects invalid syntax instead of emitting formatted broken code', async () => {
    expect(() => formatScript(ts, 'function {', false, 2, false)).toThrow();
  });
});
