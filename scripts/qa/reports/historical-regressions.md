# Historical route regressions — 2026-09-26

Local verification only. No historical approval flags were changed. No server/build was started, no delegation or commits occurred, and unrelated working-tree changes were preserved.

## Earlier nine-route scope and changes

- `ParagraphCounterClient.tsx`: the two fixed grid columns' minimum content widths overflowed after Examples. Use one narrow-screen column and retain two at `sm`, allow labels to wrap, and preserve numeric values. No overflow hiding.
- `ReadingTimeCalculatorClient.tsx`: the speed row combined a native range input's minimum width, a nonwrapping label and speed text. Allow the row to wrap and the slider to shrink; allow the result row to wrap. Add the slider's accessible name. Calculations and all speed settings are unchanged. Covers all four requested reading routes.
- `RandomColorGeneratorClient.tsx`: replace render-time random initialization with a deterministic example color and generate in a mount effect. Generation, Examples, Clear/regenerate, HEX/RGB/HSL and Copy remain available.
- `JsonToMarkdownTableClient.tsx` and `LoremIpsumGeneratorClient.tsx`: unchanged.
- New `scripts/qa/cases/historical-regressions.mjs`: nine distinct route cases; no central metadata or harness changes.

## Production baseline and reproduced failures

Original evidence directory:
`/private/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/automatic-catalog-chrome-baseline/tools/`

Each finding below comes from that route's `<slug>.json`:

| Route | Baseline finding |
| --- | --- |
| json-to-markdown-table | Browser/page/context closed during layout; no established conversion defect |
| lorem-ipsum-generator | Missing Examples/Clear; immediate generator already has output |
| lorem-ipsum-words | Same immediate-generator workflow |
| paragraph-counter | 320px: clientWidth 286, scrollWidth 309 after Examples |
| random-color-generator | React #418 hydration failure; random value generated during SSR and first client render |
| read-time-calculator | 320px: clientWidth 286, scrollWidth 318 |
| reading-pace-calculator | 320px: clientWidth 286, scrollWidth 318 |
| reading-time-calculator | 320px: clientWidth 286, scrollWidth 318 |
| reading-time-estimator | 320px: clientWidth 286, scrollWidth 318 |

The Chrome before run reproduced all five overflow failures and Random Color's hydration failure with the new cases before component changes. Lorem Generator passed. Lorem Words could not navigate (`route.fetch: read ECONNRESET`, then `net::ERR_FAILED`). JSON's conversion checks passed, then the required download check failed because no download action exists. Before-run exit code 3; shutdown also reported `Browser server close timeout after 5000ms`.

Before evidence: `/private/tmp/historical-regressions-chrome-before-20260926-01/aggregate.json` and `tools/<slug>.json`.

## Functional checks

- JSON (corrected case): exact example table; independent exact table containing zero/false/null and an escaped pipe; invalid JSON; empty array; Clear removes output and disables Copy; independent exact single-object conversion including its trailing newline. The real Copy button must become enabled, display Copied after clicking, and submit the independent single-object table to native `navigator.clipboard.writeText`, which must fulfill. A call-through observer records the argument and native completion, then restores the original method. It does not fabricate a successful clipboard result or read unrelated clipboard contents. Chrome receives origin-scoped `clipboard-write` permission in its fresh test context; WebKit uses the click's user activation. This verifies native write completion, not a separate paste/readback.
- No-download justification: this historically approved tool exposes output and Copy. Requiring a nonexistent download was a case error, not an approved product requirement or established component defect. The download assertion and file imports were removed; no download feature, mock download, or synthetic output file was added.
- Both Lorem routes: immediate three-paragraph output; exact seven-word output; start-option and regeneration text; two complete sentences; two nonempty three-sentence paragraphs; count bounds 1–100. `requiresExample:false` / `requiresClear:false` are documented exceptions: this approved immediate generator has no input document to load or clear. Count/unit/start controls and Regenerate are its workflow.
- Paragraphs: Examples at 320px; independent `One two. Three four!\n\nFive six?` gives 2 paragraphs, 3 sentences, 6 words, 31 characters, 25 nonspace characters, averages 2.0 and 3.0; Clear removes statistics.
- Random Color: initial/generated/Clear colors are six-digit HEX, RGB matches HEX, HSL stays in range. Example independently equals `#E11D48`, `225, 29, 72`, `347°, 77%, 50%`. Three generations must produce more than one distinct color. Runtime collection checks hydration errors separately.
- All four reading routes: 300 known words give 1m30s at 200wpm, 3m at 100wpm, 36s at 500wpm and 1200 nonspace characters. Real keyboard interaction changes the slider. Examples and known output are checked at 320px; Clear and whitespace remove results.
- Populated output is restored before the harness captures 1280/390/320px layouts; overflow checks are not passed by clearing output.

## Commands and artifacts

Inventory: `/Users/rayhan/.herdr/worktrees/toolblip-workspace/manually-check-all-tools/qa/automatic/inventory-current.json`.

The earlier nine-route runs used `node scripts/qa/run.mjs` with:

```text
--inventory /Users/rayhan/.herdr/worktrees/toolblip-workspace/manually-check-all-tools/qa/automatic/inventory-current.json
--base http://localhost:3190
--slugs json-to-markdown-table,lorem-ipsum-generator,lorem-ipsum-words,paragraph-counter,random-color-generator,read-time-calculator,reading-pace-calculator,reading-time-calculator,reading-time-estimator
--concurrency 1
--strip-dev-upgrade-csp
```

Chrome before: `--engine chrome --out /private/tmp/historical-regressions-chrome-before-20260926-01`.

Chrome after: `--engine chrome --out /private/tmp/historical-regressions-chrome-after-20260926-01`.

WebKit after: `--engine webkit --out /private/tmp/historical-regressions-webkit-after-20260926-01`, with `QA_WEBKIT_EXECUTABLE=/private/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/webkit-qa/pw_run.sh`.

Every directory contains `metadata.json` (revision and hashes), `aggregate.json`, `tools/<slug>.json`, and `artifacts/<slug>/{1280,390,320}.png` when reached. CSP stripping was used only locally; these runs do not certify unchanged production responses. Source revision: `7c3134eb1d5c189ea7c16c837abd46cbbf66b667`, with concurrent uncommitted changes recorded by the harness.

## Earlier nine-route results (retained historical evidence)

| Route | Chrome overall / functional | WebKit overall / functional | 320px scroll/client (both) |
| --- | --- | --- | --- |
| json-to-markdown-table | failed / failed | failed / failed | 286/286 ; 286/286 |
| lorem-ipsum-generator | passed / passed | passed / passed | 286/286 ; 286/286 |
| lorem-ipsum-words | passed / passed | passed / passed | 286/286 ; 286/286 |
| paragraph-counter | passed / passed | passed / passed | 286/286 ; 286/286 |
| random-color-generator | passed / passed | passed / passed | 286/286 ; 286/286 |
| read-time-calculator | passed / passed | passed / passed | 286/286 ; 286/286 |
| reading-pace-calculator | passed / passed | passed / passed | 286/286 ; 286/286 |
| reading-time-calculator | passed / passed | passed / passed | 286/286 ; 286/286 |
| reading-time-estimator | passed / passed | passed / passed | 286/286 ; 286/286 |

Both earlier after runs completed all nine routes: **8 passed, 1 failed, 0 missing fixtures, no incomplete slugs; exit code 1**. In those saved runs JSON conversion output checks passed, but its overall/functional status failed at the invalid missing-download requirement. These artifacts are retained unchanged and do not describe the corrected case. No routes were automatically reapproved.

All nine routes' 1280/390/320px layout checks pass in both after runs. The corrected paragraph and reading views measure scrollWidth/clientWidth **286/286 at 320px**, versus 309/286 and 318/286 before. Random Color has valid outputs and passing runtime checks in both engines after the change. Chrome 320px paragraph/reading screenshots were visually inspected.

Chrome after additionally reports a fatal **Browser server close timeout after 5000ms**, after all nine tool results were saved. WebKit has no fatal shutdown error. The shutdown failure was not hidden or retried, and the harness was not changed.

Both local after aggregates report `environmentObservations.count: 0` / `not-observed`; expected anonymous `/api/auth/me` 401 console/HTTP records are retained as nonblocking observations. The original production evidence contains the unresolved Cloudflare analytics script CSP observation; absence locally does not resolve that production issue.

Initial local HTTP readiness returned 500 and the before-run Lorem Words request reset; the after runs reached all nine routes. No shared loading/server/config changes were made here. Shared working-tree changes mean these are local integration results, not isolated production release evidence.

Verification also passed `node --check scripts/qa/cases/historical-regressions.mjs` and scoped `git diff --check`. No build or server startup was performed.

Remaining earlier-run blocker: Chrome browser-server shutdown remains a harness failure. The nonexistent JSON download is not a product blocker; the case now follows the approved output/Copy workflow. Production deployment and production revalidation are not performed. Historical approvals remain untouched.


## Targeted JSON correction and verification — 2026-09-26

This follow-up changed only `scripts/qa/cases/historical-regressions.mjs` and this report (`scripts/qa/reports/historical-regressions.md`). No component, harness, inventory, approval, server, build, commit, or delegation changes were made. Only `json-to-markdown-table` was run against the existing `http://localhost:3190` server. The earlier eight passing routes were not rerun.

Final commands:

```sh
node scripts/qa/run.mjs --inventory /Users/rayhan/.herdr/worktrees/toolblip-workspace/manually-check-all-tools/qa/automatic/inventory-current.json --base http://localhost:3190 --slugs json-to-markdown-table --concurrency 1 --strip-dev-upgrade-csp --engine chrome --out /private/tmp/historical-json-copy-chrome-20260926-06

QA_WEBKIT_EXECUTABLE=/private/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/webkit-qa/pw_run.sh node scripts/qa/run.mjs --inventory /Users/rayhan/.herdr/worktrees/toolblip-workspace/manually-check-all-tools/qa/automatic/inventory-current.json --base http://localhost:3190 --slugs json-to-markdown-table --concurrency 1 --strip-dev-upgrade-csp --engine webkit --out /private/tmp/historical-json-copy-webkit-20260926-03
```

Both final metadata files match the current case SHA-256: `40817532a3a8f01b93669381fb723a82d03edd1759d48e3302fd6811a64c15b0`. Each directory contains `metadata.json`, `aggregate.json`, `tools/json-to-markdown-table.json`, and screenshots in `artifacts/json-to-markdown-table/`.

| Final targeted run | Tool overall / functional | Runtime | Layouts 1280/390/320 | Process exit / teardown |
| --- | --- | --- | --- | --- |
| Chrome `chrome-20260926-06` | passed / passed | passed | all passed | **1** — fatal browser-server close timeout after 5000ms |
| WebKit `webkit-20260926-03` | passed / passed | passed | all passed | **0** — no fatal shutdown error |

Both completed the exact table assertions, malformed/empty input and Clear checks, disabled/enabled Copy checks, Copied feedback, and a native clipboard write with the independently specified table. Both have one completed result, no missing fixtures, and no incomplete slugs. At 320px both measured scroll/client **286/286**, with populated output. Chrome's teardown timeout occurred after the functional assertions and saved passing tool result; it remains a blocking harness/process failure and is not a functional conversion or Copy failure.

### Retained attempts and limits

All attempt directories are unique and retained under `/private/tmp/`, with prefix `historical-json-copy-`. No failed artifact was overwritten:

| Directory suffix | Outcome |
| --- | --- |
| `chrome-20260926-01` | Sandbox browser launch aborted; no tool result, JSON incomplete, exit 1. Subsequent browser runs used approved execution outside the sandbox. |
| `chrome-20260926-02` | Document fetch aborted / `net::ERR_FAILED`; functional not-run, exit 3; separate browser-server close timeout. |
| `chrome-20260926-03` | Exact output/error/Clear assertions completed; Copy stage failed, with missing observer cleanup state masking the original error; exit 1 and separate close timeout. Cleanup now tolerates absent state without masking an assertion error. |
| `chrome-20260926-04` | Exact output/error/Clear assertions completed; native Copy rejected with `NotAllowedError: Write permission denied`; exit 1 and separate close timeout. The final case grants Chrome clipboard-write permission rather than mocking success. |
| `chrome-20260926-05` | Final case revision: hydration timed out after 45000ms; functional not-run, runtime failed, exit 3; separate close timeout. |
| `webkit-20260926-01` | Earlier case revision passed functional/runtime/layout checks, exit 0. |
| `webkit-20260926-02` | Functional and layouts passed, but runtime failed on `Unexpected EOF` in `app/layout.js` and a React state-update-before-mount warning; exit 1, no fatal teardown error. These observations remain retained; the final successful rerun does not establish their root cause or resolution. |

The final runs above supersede those attempts only for the final case's targeted result. The shared local server showed intermittent navigation/hydration/runtime failures; no server or harness modifications were made to suppress them.

### Evidence combination and remaining status

The earlier Chrome and WebKit aggregates at `/private/tmp/historical-regressions-{chrome,webkit}-after-20260926-01/aggregate.json` were reread: each records eight passing non-JSON routes and the old JSON download-assertion failure. Combining those exact eight-route results with the final targeted JSON results provides passing functional evidence for all nine routes in each engine **across separate runs and case revisions**. It is not a fresh nine-route batch pass. The original nine-route aggregates remain 8/9, and Chrome's latest targeted process still exits 1 because shutdown is blocked. No clean all-nine acceptance or production release claim is made.

Final syntax and scoped whitespace checks passed. No production validation or historical reapproval was performed.
