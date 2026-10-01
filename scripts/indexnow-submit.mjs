import { buildIndexNowBody, INDEXNOW_ENDPOINT } from '../lib/indexnow.mjs';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const requested = args.filter((arg) => arg !== '--dry-run');
const defaults = [
  'https://toolblip.com/',
  'https://toolblip.com/tools',
  'https://toolblip.com/directory',
  'https://toolblip.com/blog',
  'https://toolblip.com/pricing',
  'https://toolblip.com/llms.txt',
  'https://toolblip.com/sitemap.xml',
];

const body = buildIndexNowBody(requested.length > 0 ? requested : defaults);
if (dryRun) {
  process.stdout.write(`${JSON.stringify(body, null, 2)}\n`);
  process.exit(0);
}

const response = await fetch(INDEXNOW_ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});
const text = await response.text();
process.stdout.write(`${response.status} ${text}\n`);
if (response.status !== 200 && response.status !== 202) process.exit(1);
