# Run tool QA

Use Node with the project's installed Playwright dependencies. The runner connects to a fresh Playwright browser server, opens an isolated context per tool, and closes contexts and the browser when finished. It doesn't start the app. Chrome uses the installed `chrome` channel.

```sh
node scripts/qa/run.mjs \
  --inventory /absolute/path/to/qa/automatic/inventory.json \
  --base https://toolblip.com \
  --engine chrome \
  --concurrency 2 \
  --out "$TMPDIR/opencode/toolblip-qa-new-run"
```

`--base` defaults to `https://toolblip.com`. `--concurrency` accepts 1–4 and defaults to 2. Use `--group images` or `--slugs sharpen,json-formatter` to narrow inventory rows; combining them takes the intersection. Unknown slugs and empty selections are errors. Inventory URLs supply category paths, rebased onto `--base` (including a preview base path). `canonicalAlias` resolves through the full inventory, including the destination category and URL path, even when filters exclude the target row. Missing targets and alias cycles are errors. The destination supplies the expected final URL and fallback fixture slug. Canonical links must exactly match the absolute production URL on `https://toolblip.com`, even with a local or preview `--base`. Missing, malformed, relative, and wrong canonical links fail the audit.

Add `--pending-only` to select rows where `historicallyApproved` is false or absent. This can limit the first automatic pass to pending tools. Without it, the whole inventory remains selected unless another filter is supplied; use `--smoke-only` for catalog smoke discovery. Historical approval never grants a current functional pass.

`--smoke-only` skips functional fixtures and clicks an available Examples button inside the tool as discovery. It never grants a functional pass. The runner doesn't authenticate. It dismisses a visible Decline cookie button when available. Each context starts without saved credentials; service workers are allowed, with storage isolated to that tool's fresh context.

For WebKit, set the executable if the installed browser needs a wrapper:

```sh
QA_WEBKIT_EXECUTABLE=/absolute/path/to/pw_run.sh \
node scripts/qa/run.mjs --engine webkit \
  --inventory /absolute/path/to/inventory.json --out "$TMPDIR/opencode/toolblip-webkit-new-run"
```

On HTTP development origins only, `--strip-dev-upgrade-csp` removes the `upgrade-insecure-requests` directive from document CSP headers. Other directives stay intact. It is rejected for HTTPS and Toolblip production origins. This changes the development response and is recorded in metadata; don't treat that run as an unchanged production audit.

For Chrome on loopback origins, that option also grants the context's origin-scoped local-network permission. Chrome otherwise can block the real HMR WebSocket after document interception changes its network address classification. Runtime errors remain recorded and blocking.

# Add fixtures

Group owners supply `scripts/qa/cases/GROUP.mjs`, default-exporting an array of cases from `WORKER_CONTRACT.md`. The runner loads every `.mjs` in that directory and rejects duplicate slugs or invalid cases. Match cases by inventory slug, then `canonicalAlias`.

Fixtures that intentionally exercise an HTTP failure can declare exact same-origin pathname/status pairs. Each HTTP rule needs a reason. Console exceptions are optional and must give the complete browser resource-failure text, the same pathname/status, and a matching HTTP rule:

```js
expectedHttpErrors: [
  { pathname: '/api/example', status: 503, reason: 'Intentional service failure to verify the error UI' },
],
expectedConsoleErrors: [
  {
    pathname: '/api/example', status: 503,
    text: 'Failed to load resource: the server responded with a status of 503 (Service Unavailable)',
  },
],
```

These rules use exact pathnames, without query strings, fragments, or wildcards. They only apply to responses on the audit origin. Console text must match exactly and its source URL and status must link to an observed nonblocking HTTP response. An HTTP rule alone doesn't exempt its console error. Arbitrary application console messages and page exceptions cannot be exempted. Invalid rules fail fixture loading. All matched records keep their original fields, classification, reason, and `blocking: false`; linked console records include `httpEvidence`.

Each case receives exactly `{page, tool, check, expect, baseURL, artifactsDir}`. `tool` is the first `.tb-v2-tool-card`; `expect` is Playwright's assertion API. Use scoped selectors and independent expected answers. Call `check(boolean, message)` at least once. It records evidence and throws on anything other than `true`. A caught failure still fails the fixture; Playwright assertions alone don't replace `check`. Save downloads with `download.saveAs()` into `artifactsDir`, since the browser runs through a server connection.

Examples and Clear are required by default. An empty form may have a disabled Clear button. Reference tools can set `requiresExample: false` or `requiresClear: false`; document why in the case, preferably with `exceptionReason` so it also appears in the report. Fixtures should test Clear behavior after input, invalid input, and relevant modes. The baseline checks presence, not those functional behaviors.

Actions have an 8-second timeout, navigation and development CSP document fetches 30 seconds, hydration detection 45 seconds, and each fixture 60 seconds. Hydration requires React properties on tool descendants. It isn't proof that a tool works; fixtures must wait for their own usable actions and outputs.

# Read results

`--out` must be a new directory. Without it, a timestamped directory is created under `test-results/qa`. No report is reused and resume isn't supported.

`metadata.json` records the Git revision, working diff hash, harness and fixture hashes, inventory hash, base URL, engine, and options. Each finished tool immediately writes `tools/SLUG.json`; `aggregate.json` contains the final summary, results, missing fixtures, `environmentObservations`, and any incomplete tools or fatal error.

HTTP, route/final URL/canonical, hydration, UI actions, functional assertions, runtime errors, and layout results are separate fields. Historical approval is history only. Missing cases stay `functional.status: needs-fixture`, including historically approved tools and smoke runs. A fixture skipped by `--smoke-only` stays `not-run`. An overall pass requires a passing fixture and no detected failures.

Each tool captures desktop 1280px and mobile 390px/320px screenshots and tool overflow measurements. Snapshots retain control labels, input lengths, file sizes/types, and output dimensions, not raw field values. Use synthetic fixture data: screenshots, assertion messages, dialogs, URLs, and error traces can still contain what the fixture supplies.

Runtime evidence includes the phase, page URL, and available source location. Unclassified console errors, page exceptions, and HTTP errors fail the baseline. Failed requests and dialogs remain discovery evidence. Two narrowly matched observations are nonblocking:

- A same-origin `GET /api/auth/me` returning 401 is the normal anonymous probe in a fresh context. Its browser console resource failure is nonblocking only when the exact source URL and status link to that captured HTTP response. Other paths, methods, statuses, and unlinked console failures still block.
- A script CSP refusal referencing `https://static.cloudflareinsights.com/beacon.min.js` (including its version suffix) is recorded as `shared-environment`. This is the Cloudflare edge-injected analytics beacon blocked by the existing CSP. It remains unresolved; no CSP, auth, or service configuration is changed.

`aggregate.environmentObservations` reports the count, affected tools, unresolved status, and links back to each raw console record. Reports must mention these observations even when there are no blocking functional errors; don't describe such a run as having “zero errors” or as fixing the environment. Chrome and WebKit keep the same `source: {url, lineNumber, columnNumber}` shape, including empty URLs when the browser supplies none. No console exception is inferred from timing alone. Sources can be third-party resources, so inspect them before assigning a component bug. Listeners stop recording before context teardown. A loaded page, changed text, or a long body never counts as a functional assertion.

Exit codes are bit flags: `0` all selected tools passed, `1` failures/incomplete execution, `2` missing fixtures or deliberately skipped functional checks, `3` both. Check `missingFixtures` as well as failures; one tool can have both. Browser startup failures still produce an aggregate with the unvisited slugs.

# Check the harness

```sh
node --test scripts/qa/core.test.mjs scripts/qa/runtime.test.mjs
node --test scripts/qa/browser.test.mjs
QA_TEST_ENGINE=webkit QA_WEBKIT_EXECUTABLE=/absolute/path/to/pw_run.sh \
  node --test scripts/qa/browser.test.mjs
npx vitest run lib/tool-path.test.ts
npx tsc --noEmit
```

Browser tests use controlled synthetic pages to test the harness. They don't provide catalog fixtures or claim production functionality.
