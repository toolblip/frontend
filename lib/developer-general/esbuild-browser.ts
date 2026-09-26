let ready: Promise<typeof import('esbuild-wasm')> | undefined;
export async function transformJavaScript(input: string, minify: boolean, typescript = false) {
 if (input.length > 100000) throw new Error('Limit: 100,000 characters');
 ready ??= import('esbuild-wasm').then(async engine => {
  await engine.initialize({ wasmURL: new URL('../../node_modules/esbuild-wasm/esbuild.wasm', import.meta.url).href });
  return engine;
 }).catch(e => {ready=undefined;throw e;});
 const engine = await ready;
 return (await engine.transform(input,{loader:typescript?'ts':'js',minify,legalComments:'inline',target:'esnext'})).code;
}
