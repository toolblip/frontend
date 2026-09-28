// GitHub-hosted candidate only: serve the local Next build at its production origin.
import { createServer } from 'node:https';
import { request } from 'node:http';
import { readFileSync } from 'node:fs';

if (process.env.GITHUB_ACTIONS !== 'true' || process.env.RUNNER_ENVIRONMENT !== 'github-hosted')
  throw Error('The candidate origin proxy requires a GitHub-hosted runner.');
const [certificate, key] = process.argv.slice(2);
if (!certificate || !key) throw Error('Certificate and key are required.');
const certificateBytes = readFileSync(certificate);
const keyBytes = readFileSync(key);
if (!certificateBytes.toString('ascii', 0, 27).startsWith('-----BEGIN CERTIFICATE-----'))
  throw Error(`Candidate certificate is not PEM (bytes=${certificateBytes.length})`);
if (!keyBytes.toString('ascii', 0, 27).startsWith('-----BEGIN PRIVATE KEY-----'))
  throw Error(`Candidate key is not PEM (bytes=${keyBytes.length})`);

createServer({ cert: certificateBytes, key: keyBytes }, (incoming, outgoing) => {
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
