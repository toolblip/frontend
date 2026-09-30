// Execute only these vetted examples, extracted from the guide sources themselves.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';
import { marked } from 'marked';

function section(path, heading) {
  const source = readFileSync(path, 'utf8');
  const start = source.indexOf(heading);
  assert(start >= 0, `${path}: missing ${heading}`);
  return source.slice(start, source.indexOf('\n## ', start + heading.length) < 0 ? undefined : source.indexOf('\n## ', start + heading.length));
}
function fence(path, heading, language, index = 0) {
  const blocks = [...section(path, heading).matchAll(/```(javascript|js|python)\n([\s\S]*?)\n```/g)]
    .filter(([, kind]) => kind === language);
  assert(blocks[index], `${path}: missing ${language} fence ${index} under ${heading}`);
  return blocks[index][2];
}
function js(path, heading, index, expression, expected) {
  const code = fence(path, heading, 'js', index);
  const actual = vm.runInNewContext(`${code}\n${expression}`, { TextEncoder, TextDecoder, atob, btoa, console }, { timeout: 1000 });
  assert.deepEqual(JSON.parse(JSON.stringify(actual)), expected, `${path}: ${heading}`);
}
function javascript(path, heading, index, expression, expected) {
  const code = fence(path, heading, 'javascript', index);
  const actual = vm.runInNewContext(`${code}\n${expression}`, { TextEncoder, TextDecoder, atob, btoa, console, encodeURIComponent, encodeURI }, { timeout: 1000 });
  assert.deepEqual(JSON.parse(JSON.stringify(actual)), expected, `${path}: ${heading}`);
}
function python(path, heading, index, expected) {
  const code = fence(path, heading, 'python', index);
  const result = spawnSync('python3', ['-c', code], { encoding: 'utf8', timeout: 3000 });
  assert.equal(result.status, 0, `${path}: ${result.stderr}`);
  assert.equal(result.stdout.trim(), expected);
}
function jsonFences(path, heading) {
  return [...section(path, heading).matchAll(/```json\n([\s\S]*?)\n```/g)].map(match => JSON.parse(match[1]));
}
function decodeSegment(segment) {
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - segment.length % 4) % 4);
  return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
}
function checkDebugJwt() {
  const path = 'content/blog/2026-04-23-debug-jwt-tokens-base64-json-browser.md';
  const source = readFileSync(path, 'utf8');
  const token = source.match(/`(eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)`/)?.[1];
  assert(token, `${path}: missing complete sample token`);
  const [header, payload] = token.split('.');
  const shownHeader = jsonFences(path, '## What a JWT Actually Looks Like')[0];
  const shownPayload = jsonFences(path, '## What a JWT Actually Looks Like')[1];
  assert.deepEqual(decodeSegment(header), shownHeader, `${path}: displayed header`);
  assert.deepEqual(decodeSegment(payload), shownPayload, `${path}: displayed payload`);
  const shownSegment = section(path, '### Step 1: Copy the Token').match(/```\n([A-Za-z0-9_-]+)\n```/)?.[1];
  assert.equal(shownSegment, payload, `${path}: separately printed payload segment`);
  const raw = section(path, '### Step 2: Decode Base64 URL').match(/```json\n([\s\S]*?)\n```/)?.[1];
  assert.equal(raw, Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - payload.length % 4) % 4), 'base64').toString('utf8'), `${path}: raw decoded JSON`);
  assert.deepEqual(jsonFences(path, '### Step 3: Format the JSON')[0], shownPayload, `${path}: formatted payload`);
}
function checkStandaloneJwt() {
  const path = 'content/blog/2026-04-17-jwt-decoder-guide.md';
  const code = fence(path, '## Reading a JWT in JavaScript', 'javascript');
  const output = [];
  vm.runInNewContext(code, { atob, TextDecoder, Uint8Array, console: { log: value => output.push(String(value)) } }, { timeout: 1000 });
  const comments = [...code.matchAll(/console\.log\(payload\.(?:sub|exp)\);\s*\/\/\s*([^\n]+)/g)].map(match => match[1].replace(/^"|"$/g, ''));
  assert.deepEqual(output, comments, `${path}: logged values versus printed comments`);
}
function checkFlesch() {
  const path = 'content/blog/2026-05-01-text-utilities-cheatsheet-developers.md';
  const code = fence(path, '## Readability Score', 'javascript');
  const claimed = Number(code.match(/\/\/ → ([\d.]+) with this rough syllable helper/)?.[1]);
  assert(Number.isFinite(claimed), `${path}: missing documented Flesch output`);
  const actual = vm.runInNewContext(`${code}\nfleschReadingEase("The quick brown fox jumps over the lazy dog.")`, {}, { timeout: 1000 });
  assert.equal(Math.round(actual * 10) / 10, claimed, `${path}: Flesch output`);
}
const regex = 'content/blog/2026-05-05-regex-lookahead-lookbehind-explained.md';
js(regex, '## Negative Lookahead:', 0, 'text.match(regex)', ['$49.99', '$29.99']);
js(regex, '## Positive Lookbehind:', 0, 'text.match(regex)', ['49.99', '12.00']);
js(regex, '## Negative Lookbehind:', 0, 'text.match(regex)', ['5', '10']);
js(regex, '## Lookahead and Lookbehind Together', 0, 'text.match(regex)', ['john', 'admin', 'sara']);
const text = 'content/blog/2026-05-01-text-utilities-cheatsheet-developers.md';
javascript(text, '## Word Counter', 0, '[wordCount, cleanWordCount]', [9, 9]);
javascript(text, '## Character Counter', 0, '[tweet.length, [...tweet].length]', [30, 29]);
const base = 'content/blog/2026-04-28-base64-encoding-decoding-complete-developer-guide.md';
javascript(base, '## Text → Base64', 2, 'decoded', 'café 🚀');
javascript(base, '### `InvalidCharacterError`', 0, 'decoded', 'café 🚀');
javascript(base, '### URL-Safe Base64', 0, 'urlSafe', 'aGVsbG8_d29ybGQ');
javascript(base, '## JWT Payload Inspection', 0, 'decoded.name', 'John Doe');
python(base, '## JWT Payload Inspection', 0, 'John Doe');
python(base, '### Wrong Padding', 0, 'Hi');
const concept = 'content/blog/2026-04-13-base64-encoder-guide.md';
python(concept, '### 1. Forgetting to Specify the Encoding', 0, 'Y2Fmw6k=\ncafé');
const url = 'src/content/blog/2026-05-21-url-encode-decode-strings-api-testing.md';
js(url, '## Encode values, not whole URLs by default', 0, 'url', 'https://api.example.test/search?q=status%3Aopen%20owner%3Aapi%20team');
const markdown = readFileSync('content/blog/2026-04-17-markdown-to-html-guide.md', 'utf8');
const blocks = marked.lexer(markdown);
assert(blocks.some(token => token.type === 'code' && token.text.includes('```code block```')));
assert(blocks.some(token => token.type === 'heading' && token.text === 'Why Convert Markdown to HTML?'));
checkDebugJwt();
checkStandaloneJwt();
checkFlesch();
console.log('Focused guide example checks passed');
