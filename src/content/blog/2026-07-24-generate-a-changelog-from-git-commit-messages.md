---
title: "Generate a Changelog From Git Commit Messages"
description: >-
  Learn how to generate a changelog from git commit messages using git log,
  Conventional Commits, and automation. Practical examples and free tools.
slug: 2026-07-24-generate-a-changelog-from-git-commit-messages
date: 2026-07-24T00:00:00.000Z
category: Developer Tools
tags:
  - generate-a-changelog-from-git-
  - SEO
  - Developer Tools
author: Toolblip Team
readingTime: 7 min
featuredImage: https://api.radtx.com/gradient/6b7280-374151/1200/630
---

# Generate a Changelog From Git Commit Messages

If you want to generate a changelog from git commit messages, the goal is simple: turn your commit history into a readable list of what changed between two releases. No spreadsheet. No trying to remember what you shipped three weeks ago.

Your git log already holds the raw material. Every commit is a timestamped record of a change. The work is filtering, grouping, and formatting that history into something a human can scan in ten seconds.

You'll walk through generating a changelog from git commit messages with plain `git log`, see how Conventional Commits make the process cleaner, and find out where automation fits. Each section includes a command you can run today.

## What Is a Changelog Generator and Why Use One

A changelog is a curated list of notable changes per version. A changelog generator reads structured data (usually your commit history) and produces that list for you.

So what is a changelog generator doing under the hood? It runs a query against your git history, filters out noise like merge commits, buckets the rest into categories such as Features and Fixes, and writes Markdown.

The value is consistency. A hand-written changelog drifts. Someone forgets an entry, another person uses a different heading, and by release five the format is a mess. A generator applies the same rules every time.

The tradeoff shows up later in the changelog generator vs manual changelog decision. Automation is fast and consistent but only as good as your commit messages. Manual writing reads better but costs time and gets skipped under deadline pressure.

## How to Generate Changelog From Git Log Directly

The fastest way to generate a changelog from git commit messages needs no extra tools. Git already formats output however you want.

Here is a one-line command that lists every commit since your last tag, formatted as a Markdown bullet with the short hash:

```bash
git log $(git describe --tags --abbrev=0)..HEAD \
  --pretty=format:"- %s (%h)" \
  --no-merges
```

Run that in any repo and you get output like this:

```
- Add dark mode toggle to settings page (a1b2c3d)
- Fix timezone offset in date parser (e4f5g6h)
- Update README install steps (i7j8k9l)
```

The `--no-merges` flag drops merge commits, which are noise in a changelog. The `%s` token is the commit subject line, and `%h` is the abbreviated hash. The range `$(git describe --tags --abbrev=0)..HEAD` means "everything from the most recent tag up to now."

That is a working changelog in one command. It is rough, but it proves the point: when you generate changelog from git log, the history is the database and `--pretty=format` is your query language.

## Use Conventional Commits for a Cleaner Changelog Generator

Raw commit subjects are inconsistent. One says "fixed bug," another says "WIP," a third is a full paragraph. To get reliable grouping, you need structure at commit time.

That structure is Conventional Commits, and it is the foundation of any good conventional commits changelog generator. The format is a type prefix, an optional scope, and a description:

```
feat(auth): add password reset flow
fix(parser): handle empty input without crashing
docs(readme): clarify Node version requirement
chore(deps): bump eslint to 9.2.0
```

The prefix before the colon is the key. `feat` means a new feature, `fix` means a bug fix, and `docs`, `chore`, `refactor`, `test`, and `perf` cover the rest.

Once commits follow this pattern, grouping becomes trivial. The command below pulls only features since the last tag:

```bash
git log $(git describe --tags --abbrev=0)..HEAD \
  --pretty=format:"- %s" \
  --no-merges | grep "^- feat"
```

A conventional commits changelog generator does exactly this, once per type, then writes clean sections:

```markdown
### Features
- add password reset flow

### Bug Fixes
- handle empty input without crashing
```

The generator strips the prefixes, turns scopes into context, and gives breaking changes (marked with a `!` or a `BREAKING CHANGE` footer) their own callout. That structure is why teams that want to generate a changelog from git commit messages adopt Conventional Commits first.

## Automate Changelog Generation From Git History

Running commands by hand works for a solo project. For a team, you want to automate changelog generation from git history so it happens on every release without anyone thinking about it.

The common approach is a release script or a CI step. On each tagged release, the pipeline runs your changelog command, prepends the output to `CHANGELOG.md`, and commits the result.

Here is a minimal shell script that builds a versioned section:

```bash
#!/usr/bin/env bash
set -euo pipefail

VERSION="$1"
PREV_TAG=$(git describe --tags --abbrev=0)

{
  echo "## ${VERSION} - $(date +%Y-%m-%d)"
  echo
  git log "${PREV_TAG}..HEAD" \
    --pretty=format:"- %s (%h)" \
    --no-merges
  echo
  echo
  cat CHANGELOG.md
} > CHANGELOG.tmp && mv CHANGELOG.tmp CHANGELOG.md
```

Call it with `./changelog.sh v1.4.0` and it stamps a dated header, lists the commits, and keeps your old entries below.

When you automate changelog generation from git history, add two guardrails. First, fail the build if the commit range is empty, so you never ship a blank release note. Second, validate that the JSON your CI passes around is well formed. If you emit release metadata as JSON, run it through a validator like the [JSON formatter](https://toolblip.com/tools/json-formatter) before it hits the next step, since a trailing comma will break a release pipeline silently.

## Best Git Changelog Generator Tool Options and When to Build Your Own

You do not always need to write scripts. Several mature tools already parse Conventional Commits and produce changelogs.

The best git changelog generator tool for your stack depends on your ecosystem. `git-cliff` is a fast, language-agnostic option configured with a single TOML file. `standard-version` and `release-please` are popular in the JavaScript world and also bump your version number. `auto-changelog` works well when your commits are not strictly conventional.

Any decent git commit message to changelog converter follows the same three steps: read the range, parse each subject, and render Markdown. When you understand those steps, you can evaluate any tool quickly or build a small one that fits your exact format.

If your commit subjects are messy, a converter helps but cannot invent structure that was never there. That is the honest limit of every git commit message to changelog converter. Garbage in, grouped garbage out.

For light cleanup on inconsistent history, a good [regex tester](https://toolblip.com/tools/regex-tester) lets you draft and check the patterns that extract issue numbers or normalize prefixes before you bake them into a script. If your pipeline passes tokens or metadata as encoded strings, a quick [Base64 decoder](https://toolblip.com/tools/base64) helps you inspect what is actually inside them.

## Changelog Generator vs Manual Changelog: Which Fits Your Team

The changelog generator vs manual changelog choice is not all or nothing. Most strong teams use a hybrid.

The generator produces the first draft from history. It never misses a commit and never invents an inconsistent heading. That draft covers the boring 80 percent.

A human then edits the top of the file. They rewrite the two or three user-facing lines that deserve real prose, drop internal refactors that users do not care about, and add a migration note if something breaks.

That combination keeps the speed of automation and the readability of hand-written notes. You generate a changelog from git commit messages for coverage, then spend five minutes polishing what your users actually read.

## Conclusion

To generate a changelog from git commit messages, start with `git log --pretty=format` to prove the concept, adopt Conventional Commits so grouping is reliable, then automate the whole thing in CI once the format is stable.

The history is already there. You are just teaching a script to read it the way a person would. Whether you pick a ready-made tool or write twenty lines of shell, the pattern is the same: read the range, parse the subjects, render Markdown.

Once you can generate a changelog from git commit messages automatically, releases stop being a scramble and become a byproduct of committing well.

Working with the JSON metadata that release pipelines pass around? Keep it clean and valid with the free [JSON Formatter on Toolblip](https://toolblip.com/tools/json-formatter). It runs entirely in your browser, so nothing you paste ever leaves your machine.

