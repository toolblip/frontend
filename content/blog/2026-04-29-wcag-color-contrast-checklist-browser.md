---
title: "WCAG Color Contrast Checklist: Test Every Color Pair in Under 30 Seconds"
description: "Use this developer checklist to catch WCAG AA and AAA contrast failures before they ship. Free browser tool, no upload required."
date: 2026-04-29
category: Developer Tools
---

Accessibility isn't a one-time audit — it's a daily discipline. One of the fastest ways your UI breaks accessibility is also one of the easiest to miss: **color contrast**.

Text that's slightly too light against its background. A muted gray button label on a white surface. A placeholder that almost disappears. These things fail WCAG without being obviously wrong.

This post gives you a practical **WCAG color contrast checklist** you can run against any design or code. Plus the fastest way to test any color pair in your browser — no screenshot upload, no sign-up, no plugins.

## The WCAG Contrast Checklist (Run This Before Every PR)

Before reaching for a tool, run through this mental checklist on every UI you touch:

### 1. Normal Text (< 18pt / < 14pt bold)

| WCAG Level | Minimum Ratio | Common Use Cases |
|---|---|---|
| AA | 4.5:1 | Body text, labels, form inputs |
| AAA | 7:1 | Legal text, high-importance labels |

**Why it matters:** This is the most common failure point. Even a well-designed UI with `#999999` text on `#FFFFFF` backgrounds fails AA (ratio: 2.87:1).

### 2. Large Text (≥ 18pt regular / ≥ 14pt bold)

| WCAG Level | Minimum Ratio | Common Use Cases |
|---|---|---|
| AA | 3:1 | Section headings, callouts |
| AAA | 4.5:1 | High-priority headings |

**Why it matters:** Large text is more forgiving, but the bar is still real. Don't assume "it's big so it's fine."

### 3. UI Components and Graphical Objects

| WCAG Level | Minimum Ratio | Examples |
|---|---|---|
| AA | 3:1 | Button borders, input borders, focus indicators, icons |

**Why it matters:** Text isn't the only thing that needs contrast. Graphical elements used to convey meaning must also meet the 3:1 threshold.

### 4. Active vs Inactive States

Your button looks great in its default state — but what about `:disabled`? Does the muted version still pass?

| State | What to Check |
|---|---|
| Default | Does primary text/background meet AA? |
| Hover | Does hover contrast still meet AA? |
| Focus | Does focus indicator (usually an outline) meet 3:1 against adjacent colors? |
| Disabled | Does muted text still meet 4.5:1? |
| Error | Does error color meet AA for text AND isn't color-alone as the only indicator? |

### 5. Overlapping Content

If you have text over images, gradients, or complex backgrounds:

- [ ] Is the text legible at every breakpoint?
- [ ] Does a semi-transparent overlay still maintain the required ratio?
- [ ] Are there any regions where contrast dips below AA?

## The Fastest Way to Test Any Color Pair

The checklist above tells you what to check. Now here's how to check it in under 30 seconds:

**Toolblip's [Contrast Checker](/tools/contrast-checker)** — enter any foreground and background color, get an instant WCAG pass/fail for AA and AAA across normal text, large text, and UI components.

```text
Foreground: #6B7280 (cool gray)
Background: #FFFFFF (white)

Result:
✗ Normal text (4.5:1 required) — 3.01:1 — FAILS AA
✗ Large text (3:1 required) — 3.01:1 — PASSES AA
✗ UI components (3:1 required) — 3.01:1 — PASSES AA
✗ AAA normal text (7:1 required) — 3.01:1 — FAILS AAA
```

In this case, `#6B7280` on white looks "close enough" but actually **fails AA for normal body text**. You'd need `#4B5563` (5.89:1) or darker to pass.

## Real-World Contrast Failure Examples

Here are the most common patterns that fail in production UIs:

### 1. Placeholder Text

```css
/* FAILS — gray placeholder on white */
input::placeholder {
  color: #AAAAAA; /* Ratio: 2.71:1 — below AA */
}

/* PASSES */
input::placeholder {
  color: #767676; /* Ratio: 4.54:1 — passes AA */
}
```

Placeholder text counts as text under WCAG. If it's too low-contrast to read, it fails.

### 2. Muted Button Labels

```css
/* FAILS — light gray button text */
button {
  background: #3B82F6;
  color: #D1D5DB; /* Ratio: 2.71:1 — fails AA */
}

/* PASSES */
button {
  background: #3B82F6;
  color: #FFFFFF; /* Ratio: 4.99:1 — passes AA */
}
```

### 3. Secondary Text in Cards

```css
/* FAILS — muted meta info */
.meta {
  color: #9CA3AF;
  background: #F9FAFB;
  /* Ratio: 2.26:1 — severe failure */
}

/* PASSES */
.meta {
  color: #6B7280;
  background: #F9FAFB;
  /* Ratio: 3.05:1 — passes AA */
}
```

### 4. Focus Indicators

Focus rings are a WCAG 2.4.7 requirement (Focus Visible). If your custom focus ring is too thin or too low-contrast, it fails:

```css
/* FAILS — thin, low-contrast focus ring */
:focus-visible {
  outline: 1px solid #CCCCCC; /* Barely visible */
}

/* PASSES — clear contrast */
:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}
```

## How to Audit an Existing Page

Here's a systematic process for auditing a live page or design:

### Step 1: List All Your Color Pairs

Most UIs use a finite palette. Extract all foreground/background combinations:

- Primary text on primary background
- Secondary/muted text on primary background
- Text on secondary backgrounds
- Button text on button backgrounds
- Input text on input backgrounds
- Placeholder text on input backgrounds

### Step 2: Test Each Pair

Run every combination through the [Contrast Checker](/tools/contrast-checker). Document failures.

Pro tip: if you have dark mode and light mode, test both palettes separately.

### Step 3: Check Non-Text Elements

- Focus indicators
- Border colors on inputs
- Icon colors (especially if icons carry meaning)
- Disabled state colors

### Step 4: Test Real Content

Contrast requirements apply to **real text**, not just design mockups. Test with actual content at the sizes you'll use — not "representative" text.

### Step 5: Check for Color-Alone Indicators

WCAG 1.4.1 states: "Color is not used as the only visual means of conveying information."

Does your UI ever indicate status, errors, or categories through color *only*? Add icons, labels, or patterns alongside.

## Color Blindness: Contrast Is Only Part of the Story

Passing contrast ratios doesn't mean your UI is fully accessible to color-blind users. A red/green scheme might have perfect contrast ratios but be completely indistinguishable.

**Test your palette** with Toolblip's [Color Blindness Simulator](/tools/color-blindness-simulator) — see how your UI looks through deuteranopia, protanopia, and tritanopia filters.

## The Privacy Advantage of Browser-Based Contrast Checking

Most contrast checking tools require you to upload a screenshot or install a browser extension. That means your UI — potentially pre-launch, confidential, or client work — goes to a third-party server.

Toolblip's [Contrast Checker](/tools/contrast-checker) runs entirely in your browser. You enter color values directly. No image upload. No server. No tracking. Your design stays yours.

This matters especially for:

- **Pre-launch products** you don't want indexed
- **Client work** under NDA
- **Internal tools** with no public URL yet

## Related Tools for Accessible Design

Contrast is one piece of a full accessibility toolkit:

- [Contrast Checker](/tools/contrast-checker) — WCAG AA/AAA ratio testing
- [Color Blindness Simulator](/tools/color-blindness-simulator) — test your palette across vision types
- [Color Picker](/tools/color-picker) — find accessible color pairs with live preview
- [HEX to RGB](/tools/hex-to-rgb) — convert colors for CSS use
- [Color Palette Generator](/tools/color-palette-generator) — generate palettes that are accessible by design

## Quick Reference: Common Accessible Color Pairs

These combinations are reliable starting points for accessible UI:

| Foreground | Background | Ratio | Passes |
|---|---|---|---|
| `#000000` | `#FFFFFF` | 21:1 | AAA |
| `#1F2937` | `#FFFFFF` | 13.5:1 | AAA |
| `#374151` | `#FFFFFF` | 9:1 | AAA |
| `#4B5563` | `#FFFFFF` | 5.9:1 | AA |
| `#6B7280` | `#FFFFFF` | 3.0:1 | FAIL (normal text) |
| `#3B82F6` | `#FFFFFF` | 4.9:1 | AA |
| `#FFFFFF` | `#1F2937` | 13.5:1 | AAA |
| `#D1D5DB` | `#1F2937` | 7.0:1 | AAA |

If you're building a design system, start from accessible pairs and adjust from there. It's easier than auditing failures later.

## The Minimum Viable Contrast Workflow

If you only do three things:

1. **Before shipping any new UI** — run every text/background combination through the [Contrast Checker](/tools/contrast-checker)
2. **Before every design review** — check that your color palette still passes AA at all required sizes
3. **Every time you use gray for "muted" text** — verify the ratio. Gray is the #1 contrast failure in production UIs

That's it. The checklist isn't long. The tool isn't complicated. It's just a habit.

---

Stop guessing whether your grays pass. Run them through the [Contrast Checker](/tools/contrast-checker) right now — takes 10 seconds, and you'll catch failures you'd have shipped otherwise.
