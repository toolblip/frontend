import { describe, it, expect } from 'vitest';
import * as ts from 'typescript';
import { runInNewContext } from 'node:vm';
import { transform } from 'esbuild';
import { formatScript as prettyScript, compactTypeScript } from './format-script';
async function formatScript(input: string, typescript = false, compact = false) {
  return compact ? compactTypeScript(ts, input, typescript) : prettyScript(ts, input, typescript, 2, false);
}

describe('syntax-preserving JS/TS formatting', () => {
  it.each([false, true])('retains exported types and interfaces (compact=%s)', async compact => {
    const result = await formatScript('export type UserId = string; export interface User { id: UserId; }', true, compact);
    expect(result).toContain('export type UserId = string;');
    expect(result).toContain('export interface User');
    expect(result).toContain('id: UserId;');
  });
  it.each([false, true])('retains JS runtime semantics and literal whitespace (compact=%s)', async compact => {
    const source='const raw = String.raw`a\\q\n  b`; function result(){ const regex=/a\\/b/g; return [raw, regex.source, {a: 2}?.a ?? 3]; } result();';
    const result=await formatScript(source, false, compact);
    expect(JSON.stringify(runInNewContext(result))).toBe(JSON.stringify(runInNewContext(source)));
    expect(result).toContain('`a\\q\n  b`');
  });
  it('preserves type imports, generics, satisfies and runtime behavior after compacting', async () => {
    const source='export type Id<T> = T & { readonly key: string }; export interface User { id: Id<string>; } const value = { a: 2 } satisfies { a: number }; globalThis.result = value.a;';
    const formatted=await formatScript(source, true, true);
    expect(formatted).toContain('satisfies'); expect(formatted).toContain('export type Id<T>');
    const js=await transform(formatted,{loader:'ts',format:'cjs'});
    const context={module:{exports:{}}, result:0}; runInNewContext(js.code,context);
    expect(context.result).toBe(2);
  });
  it('keeps ASI-sensitive return behavior', async () => {
    const source='function f(){return\n{a: 2}} f();';
    for (const compact of [false,true]) expect(runInNewContext(await formatScript(source,false,compact))).toBeUndefined();
  });
  it('preserves executable shebangs during compaction', async () => {
    const result = await formatScript('#!/usr/bin/env ts-node\nconsole.log("hello");', true, true);
    expect(result).toBe('#!/usr/bin/env ts-node\nconsole.log("hello");');
  });
  it('rejects malformed syntax and oversized input', async () => {
    await expect(formatScript('export type = ;', true)).rejects.toThrow();
    await expect(formatScript(' '.repeat(100001), true)).rejects.toThrow('100,000');
  });
});
