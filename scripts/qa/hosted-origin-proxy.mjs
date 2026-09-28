// GitHub-hosted candidate only: serve the local Next build at its production origin.
import { createServer } from 'node:https';
import { request } from 'node:http';
import { readFileSync } from 'node:fs';

if (process.env.GITHUB_ACTIONS !== 'true' || process.env.RUNNER_ENVIRONMENT !== 'github-hosted')
  throw Error('The candidate origin proxy requires a GitHub-hosted runner.');
const [certificate, key] = process.argv.slice(2);
if (!certificate || !key) throw Error('Certificate and key are required.');

createServer({ cert: readFileSync(certificate), key: readFileSync(key) }, (incoming, outgoing) => {
  const upstream = request({
    hostname: '127.0.0.1', port: 3190, method: incoming.method, path: incoming.url,
    headers: { ...incoming.headers, host: 'toolblip.com', 'x-forwarded-host': 'toolblip.com', 'x-forwarded-proto': 'https' },
  }, response => {
    outgoing.writeHead(response.statusCode ?? 502, response.headers);
    response.pipe(outgoing);
  });
  upstream.on('error', error => {
    if (!outgoing.headersSent) outgoing.writeHead(502, { 'content-type': 'text/plain' });
    outgoing.end(`Candidate upstream unavailable: ${error.code ?? 'unknown'}`);
  });
  incoming.pipe(upstream);
}).listen(443, '127.0.0.1');
