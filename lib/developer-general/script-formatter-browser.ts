type Compiler = typeof import('typescript');
let ready: Promise<Compiler> | undefined;

/** Load the installed compiler as its browser UMD asset, avoiding Node loader bundling. */
export function loadScriptFormatter(): Promise<Compiler> {
  const compilerWindow = window as unknown as { ts?: Compiler };
  if (compilerWindow.ts?.createLanguageService) return Promise.resolve(compilerWindow.ts);
  ready ??= new Promise<Compiler>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/qa/typescript-5.5.4.js';
    script.async = true;
    const fail = () => {
      clearTimeout(timer);
      script.onload = script.onerror = null;
      script.remove();
      reject(new Error('Could not load the script formatter. Try again.'));
    };
    const timer = setTimeout(fail, 15000);
    script.onerror = fail;
    script.onload = () => {
      clearTimeout(timer);
      if (!compilerWindow.ts?.createLanguageService) { fail(); return; }
      script.onload = script.onerror = null;
      resolve(compilerWindow.ts);
    };
    document.head.appendChild(script);
  }).catch(error => { ready = undefined; throw error; });
  return ready;
}
