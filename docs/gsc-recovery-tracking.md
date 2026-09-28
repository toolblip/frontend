# Track the twelve recovery URLs

`data/gsc-recovery-cohort.json` freezes the twelve priority URLs as version
`2026-09-26`. Don't replace weak performers or edit this version's membership.
A future cohort needs a new version and a new baseline. Reports contain a SHA-256
hash of `JSON.stringify` of the parsed cohort, so formatting-only changes don't
break comparisons. The collector pins this hash and rejects changed cohort content.
Selection rationale, adoption timestamp, and source revision
are recorded in the cohort file.

Routes were checked at `5556e22` against `data/tools.ts` and
`lib/tool-path.ts`. Image Resizer uses `/tools/images/image-resizer`; the other
eleven URLs use `/tools/SLUG`.

## Run without credentials

Node 24, no packages or build required:

```sh
node --test scripts/gsc-recovery.test.mjs
node scripts/gsc-recovery.mjs --dry-run
```

Dry run validates the cohort and writes a plan-shaped report with no auth,
network requests, or collected metrics. It doesn't prove GSC access or recovery.
Reports default to ignored `test-results/gsc-recovery/report.json` and
`report.md`. `--output DIR` changes the destination; use an ignored directory
or a path outside the repository. Runs overwrite those two files in the chosen
directory, so use distinct directories to preserve local baselines.

## Collect the baseline and weekly reports

The credential was explicitly approved and securely configured as the GitHub
repository secret. Merge the workflow before its first Actions execution. The service account needs
access to the Search Console property and the Search Console API enabled in
its Google Cloud project. The local Node 26.8.2 baseline was verified on September 26, 2026: all 24
measurements completed in `/tmp/tb-gsc-recovery-baseline/report.json`. All twelve
URLs were not indexed: eleven were crawled but currently not indexed; Image
Resizer had an unknown Google canonical. September 17–23 had no reported
impressions. This is a measurement baseline, not evidence of recovery.

The only credential source is runtime `GSC_SERVICE_ACCOUNT`: service-account
JSON or base64 JSON, optionally wrapped in a JSON string. No credential files
are loaded. `GSC_SITE_URL` defaults to `sc-domain:toolblip.com`; a URL-prefix
property must be on the same origin, end in `/`, and contain every cohort URL.
In Actions, set `GSC_SERVICE_ACCOUNT` as a repository secret and `GSC_SITE_URL`
as an optional repository variable. Use `gh secret set GSC_SERVICE_ACCOUNT`
with the credential supplied securely through stdin, never in arguments
or a committed file.

With the credential already supplied securely in the runtime environment:

```sh
node scripts/gsc-recovery.mjs --output test-results/gsc-recovery/baseline
```

The workflow runs Monday at 03:00 UTC and supports `workflow_dispatch`. It has
`contents: read` permissions and no PR trigger. It uses Node 24, retains JSON
and Markdown artifacts for 90 days, and appends Markdown to the run summary,
even after a collection failure. Missing credentials produce a clear error,
a partial report, and a nonzero exit. It never commits generated reports.

Each collection makes one token exchange, twelve inspection calls, and twelve
analytics calls, sequentially. HTTP 429/5xx retries can add calls: at most three
attempts per request, each with a 15-second timeout including response parsing,
and 1/2-second backoff. Redirects are rejected. OAuth uses a fixed Google token
endpoint/audience, RS256, and only `webmasters.readonly`; a service account's
`token_uri` is ignored. Tokens, private keys, raw request/response error bodies,
and credential payloads are never written to reports or logs.

## Compare with a downloaded report

Automatic artifact selection is deliberately omitted. Choose a successful
baseline from this workflow, verify its run/branch, and download its artifact
from the Actions UI. Alternatively, with known run IDs and artifact names:

```sh
gh run download RUN_ID --name gsc-recovery-RUN_ID-ATTEMPT --dir test-results/gsc-recovery/previous
node scripts/gsc-recovery.mjs --previous test-results/gsc-recovery/previous/report.json --output test-results/gsc-recovery/current
```

Download baselines before the 90-day retention expires. Comparison requires the
same cohort version/hash and property, compatible report schema, and a prior
collection timestamp. A malformed previous file fails comparison while retaining
the newly collected results. Missing/failed measurements stay unavailable.

Per-URL comparison records a later stored crawl timestamp, changes to both
canonicals and indexing fields, and metric values/deltas with both date windows.
A missing previous crawl timestamp is unknown, not evidence of a recrawl.
Changes indicate observation, not causation; windows can overlap for nearby runs.

## Read the results

[URL Inspection](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect)
returns Google's stored index view. It is not a live page test or a request to
index the URL. The JSON records verdict, coverage/indexing/robots/fetch state,
last crawl, user canonical, and Google canonical. Missing fields remain null.

[Search Analytics](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
uses an exact page-equals filter, `type: web`, `dataState: final`, and no grouping
dimensions. The fixed seven-day window ends three Pacific calendar days before
the run date, inclusive. For a September 26 PT run, that is September 17–23.
Pacific dates use `America/Los_Angeles`, including DST. Queries don't use the
invalid `rowCount` parameter found in older scripts.

A valid empty analytics response records zero metrics with `noData: true`,
meaning no reported data. It is not proof of zero traffic. An API, timeout,
authentication, or validation failure records an error and null data, never
zero metrics. Inspection and analytics errors are independent; any error makes
the run exit nonzero after saving its partial report.

A successful collection means all 24 measurements were retrieved and validated.
Recovery signals are newer crawl timestamps, Google's choice of the intended
canonical, improved indexed status, and reported impressions over successive
windows. None guarantees indexing or rankings. The full Search Console Page
Indexing report can lag these observations. This tracker doesn't crawl tool
pages, change indexing gates, or call bulk indexing/submission APIs.
