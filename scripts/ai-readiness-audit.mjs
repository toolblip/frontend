const base = (process.argv[2] || 'https://toolblip.com').replace(/\/$/, '');

async function load(path) {
  const response = await fetch(`${base}${path}`, {
    headers: { 'User-Agent': 'ToolblipAiReadinessAudit/1.0' },
    redirect: 'follow',
  });
  return { response, body: await response.text() };
}

const checks = [];
function record(name, ok, detail) {
  checks.push({ name, ok, detail });
}

const robots = await load('/robots.txt');
record('robots.txt responds', robots.response.status === 200, String(robots.response.status));
record('robots allows GPTBot', robots.body.includes('User-agent: GPTBot'), 'named training crawler');
record('robots allows ClaudeBot', robots.body.includes('User-agent: ClaudeBot'), 'named training crawler');
record('robots allows Bingbot', robots.body.includes('User-agent: Bingbot'), 'Bing discovery');
record('robots closes dashboard', robots.body.includes('Disallow: /dashboard'), 'private route');
record('robots announces training', robots.body.includes('ai-train=yes'), 'Content-Signal');
record('robots points at sitemap', robots.body.includes('Sitemap: https://toolblip.com/sitemap.xml'), 'sitemap');
record('robots points at llms.txt', robots.body.includes('https://toolblip.com/llms.txt'), 'guide');

const llms = await load('/llms.txt');
record('llms.txt responds', llms.response.status === 200, String(llms.response.status));
record('llms.txt lists JSON Formatter', llms.body.includes('/tools/json-formatter'), 'popular tool');
record('llms.txt links the full catalog', llms.body.includes('/llms-full.txt'), 'catalog');

const full = await load('/llms-full.txt');
const toolLinks = (full.body.match(/https:\/\/toolblip\.com\/tools\//g) || []).length;
record('llms-full.txt responds', full.response.status === 200, String(full.response.status));
record('llms-full.txt lists tools', toolLinks >= 50, `${toolLinks} tool links`);

const key = await load('/toolblip-indexnow-key-2024.txt');
record('IndexNow key file', key.response.status === 200 && key.body === 'toolblip-indexnow-key-2024', JSON.stringify(key.body));

const home = await load('/');
record('homepage JSON-LD', home.body.includes('application/ld+json') && home.body.includes('WebSite'), 'site schema');
record('homepage llms link', home.body.includes('/llms.txt'), 'alternate link');
record(
  'Bing site verification',
  home.body.includes('msvalidate.01'),
  'Set NEXT_PUBLIC_BING_VERIFICATION_CODE after adding the site in Bing Webmaster Tools',
);

const tool = await load('/tools/json-formatter');
record('tool page WebApplication schema', tool.body.includes('WebApplication'), 'tool schema');

const passed = checks.filter((check) => check.ok).length;
for (const check of checks) {
  process.stdout.write(`${check.ok ? 'PASS' : 'FAIL'}  ${check.name}  ${check.detail}\n`);
}
process.stdout.write(`\n${passed}/${checks.length} checks passed against ${base}\n`);
process.exit(passed === checks.length ? 0 : 1);
