---
name: pr-reviewer
description: Review GitHub pull requests for code quality, security, and correctness. Use when asked to review, audit, or check a PR — including phrases like "review this PR", "check this pull request", "audit the PR", "review all PRs", "security review", "code review". Runs both code review and security review checklists against the PR diff.
---

# PR Reviewer

Reviews pull requests using a structured code + security checklist. Always runs both dimensions — never skip one for the other.

## Quick Start

```bash
# Get PR number from user or find open PRs
gh pr list --repo <owner/repo> --state open

# Review a specific PR
scripts/review_pr.sh <owner/repo> <pr_number>
```

## Review Process

### Step 1 — Gather Context

```bash
# Get PR metadata
gh pr view <pr> --repo <owner/repo> --json title,body,state,mergeable,additions,deletions,changedFiles,author,headRefName --template '{{json .}}'

# Get full diff
gh pr diff <pr> --repo <owner/repo>

# Get CI status
gh pr checks <pr> --repo <owner/repo> --watch

# Check if branch is up-to-date with target
gh pr view <pr> --repo <owner/repo> --json isDraft,mergeable,statusCheckRollup --template '{{json .}}'
```

### Step 2 — Build Check

Run these checks in parallel where possible:

```bash
# TypeScript check
cd /path/to/repo && npx tsc --noEmit 2>&1

# Lint check
cd /path/to/repo && npm run lint 2>&1  # or relevant linter

# Build check
cd /path/to/repo && npm run build 2>&1

# Security audit
cd /path/to/repo && npm audit --audit-level=high 2>&1 || true
```

### Step 3 — Code Review

Load and follow the checklist in `references/code-review.md`. Apply every item in the **Diff Review** section. Flag anything that needs human judgment as `⚠️ Note:`.

### Step 4 — Security Review

Load and follow the checklist in `references/security.md`. Every item maps to a category. Flag vulnerabilities by severity: `🔴 Critical`, `🟠 High`, `🟡 Medium`, `🟢 Low`.

### Step 5 — Output

Structure the review as:

```
## PR #<number>: <title>
**Author:** @<author> | **Branch:** <branch-name> | **Files:** <changedFiles> | **+<additions> / -<deletions>**
**CI Status:** ✅ green / ❌ failing / ⏳ pending
**Branch up-to-date:** ✅ / ❌

---

## 🔐 Security Review
[per vulnerability with severity]

## 📝 Code Review
[per category with verdict]

## ✅ Build & Type Check
[results]

## ⚠️ Notes (non-blocking)
[items requiring human judgment]

## 🎯 Verdict
[Approve / Request Changes / Needs Discussion]
```

## Output Standards

- Always distinguish between **blocking** (must fix before merge) and **non-blocking** (nice-to-have) findings
- Never block on style preferences — only on correctness, security, or maintainability
- If CI is failing, always mention it in the verdict regardless of code quality
- Use severity labels: 🔴 🟠 🟡 🟢 consistently
