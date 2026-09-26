import test from 'node:test';
import assert from 'node:assert/strict';
import { stripDevUpgradeCSP } from './browser.mjs';

test('local CSP override uses a bounded document timeout and preserves other directives', async () => {
  const response = {headers: () => ({'content-security-policy': "default-src 'self'; upgrade-insecure-requests; object-src 'none'"})};
  let fulfilled;
  await stripDevUpgradeCSP({
    request: () => ({resourceType: () => 'document'}),
    fetch: async options => {
      assert.deepEqual(options, {maxRedirects:0,timeout:30_000});
      return response;
    },
    fulfill: async options => { fulfilled = options; },
  });
  assert.equal(fulfilled.response, response);
  assert.equal(fulfilled.headers['content-security-policy'], "default-src 'self'; object-src 'none'");
});

test('local CSP fetch failure aborts navigation instead of rejecting an unobserved route handler', async () => {
  let aborted = false;
  let observed;
  await stripDevUpgradeCSP({
    request: () => ({resourceType: () => 'document'}),
    fetch: async options => {
      assert.deepEqual(options, {maxRedirects:0,timeout:30_000});
      throw new Error('controlled connection failure');
    },
    abort: async () => { aborted = true; },
  }, error => { observed = error; });
  assert.equal(observed.message, "controlled connection failure");
  assert.equal(aborted, true);
});
