/** Parse a deliberately bounded subset of POSIX curl, without executing a shell. */
export function shellWords(command: string): string[] {
  const words: string[] = []; let word = '', quote = '', active = false;
  for (let i = 0; i < command.length; i++) {
    const c = command[i];
    if (c === '\\' && quote !== "'") {
      const next = command[++i];
      if (next === undefined) throw new Error('Trailing escape');
      // Inside double quotes only these five characters consume the backslash.
      if (next === '\n') continue;
      if (quote === '"' && !['"', '$', '`', '\\'].includes(next)) word += '\\';
      word += next;
      active = true;
    }
    else if (quote) { if (c === quote) quote = ''; else word += c; }
    else if (c === '"' || c === "'") { quote = c; active = true; }
    else if (/\s/.test(c)) { if (active) words.push(word); word = ''; active = false; }
    else { if (/[|;&`]/.test(c) || (c === '$' && command[i+1] === '(')) throw new Error('Shell operators and substitutions are unsupported'); word += c; active = true; }
  }
  if (quote) throw new Error('Unclosed quote');
  if (active) words.push(word);
  return words;
}
export function parseCurl(command: string) {
  if (command.length > 100000) throw new Error('Limit: 100,000 characters');
  const words = shellWords(command); if (words.shift() !== 'curl') throw new Error('Start with curl');
  let url = '', method = '', body: string | undefined;
  const headers: Record<string, string> = {};
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const take = () => { if (i + 1 >= words.length) throw new Error(`Missing value for ${w}`); return words[++i]; };
    if (w === '-X' || w === '--request') method = take().toUpperCase();
    else if (w === '-H' || w === '--header') { const h = take(), colon = h.indexOf(':'); if (colon < 1 || /[\r\n]/.test(h)) throw new Error('Invalid header'); headers[h.slice(0, colon).trim()] = h.slice(colon+1).trim(); }
    else if (['-d','--data','--data-raw','--data-binary'].includes(w)) { const data = take(); if (data.startsWith('@') && w !== '--data-raw') throw new Error('File bodies are unsupported; paste the body with --data-raw'); body = body === undefined ? data : body + '&' + data; }
    else if (w === '--url') url = take();
    else if (w === '-I' || w === '--head') method = 'HEAD';
    else if (w === '-s' || w === '--silent' || w === '-S' || w === '--show-error') continue;
    else if (w.startsWith('-')) throw new Error(`Unsupported option: ${w}`);
    else if (!url) url = w;
    else throw new Error('Only one URL is supported');
  }
  const parsed = new URL(url); if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Use an HTTP or HTTPS URL');
  method ||= body === undefined ? 'GET' : 'POST';
  if (!/^[A-Z]+$/.test(method)) throw new Error('Invalid method');
  return { url, method, headers, body };
}
export function convertCurl(input: string, language: 'python' | 'javascript') {
  if (!input.trim()) return '';
  const r = parseCurl(input);
  if (language === 'python') {
    const py = (s: string) => JSON.stringify(s).replace(/\\u([0-9a-f]{4})/gi, '\\u$1');
    return `import requests\n\nresponse = requests.request(${py(r.method)}, ${py(r.url)},\n    headers={${Object.entries(r.headers).map(([k,v]) => `${py(k)}: ${py(v)}`).join(', ')}}${r.body === undefined ? '' : `,\n    data=${py(r.body)}`}\n)\nprint(response.status_code)\nprint(response.text)`;
  }
  if (r.body !== undefined && ['GET','HEAD'].includes(r.method)) throw new Error('Browser fetch does not support a body with GET or HEAD');
  return `const response = await fetch(${JSON.stringify(r.url)}, ${JSON.stringify({method:r.method, headers:r.headers, ...(r.body === undefined ? {} : {body:r.body})}, null, 2)});\nconsole.log(response.status, await response.text());`;
}
export const shellQuote = (value: string) => "'" + value.replace(/'/g, "'\\''") + "'";
