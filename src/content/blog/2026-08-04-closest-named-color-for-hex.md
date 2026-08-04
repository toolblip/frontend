---
title: "Closest Named Color for Hex Codes: A Developer Guide"
description: >-
  Find the closest named color for hex or RGB values using Delta E matching. See
  the math, the JavaScript, and try the free Color Name Finder tool today.
slug: 2026-08-04-closest-named-color-for-hex
date: 2026-08-04T00:00:00.000Z
category: Developer Tools
tags:
  - Find-the-closest-named-color-f
  - SEO
  - Developer Tools
author: Toolblip Team
readingTime: 7 min
featuredImage: https://api.radtx.com/gradient/6b7280-374151/1200/630
---

# Closest Named Color for Hex Codes: A Developer Guide

Looking up the closest named color for hex values usually means you have `#2E7BD6` sitting in a design file and you need to call it something in a commit message, a Storybook label, a bug report, or a token name. The answer is a distance calculation: convert your hex to a perceptual color space, measure how far it sits from every entry in a named color list, and return the nearest one. Below is the math, a working JavaScript implementation, why naive RGB distance gives you the wrong answer, and how to check that a browser tool is doing the work locally instead of shipping your palette to a server.

## Why the Closest Named Color for Hex Is Not a Simple Lookup

There are 148 CSS named colors. There are 16,777,216 possible hex values. Every name you get back is an approximation, and the quality of that approximation depends entirely on how you measure distance.

The obvious approach treats RGB as a 3D coordinate space and takes the Euclidean distance between two points. It runs fast and it is wrong often enough to matter.

Take `#2E7BD6`, a standard mid blue. Naive RGB distance picks `royalblue` at a distance of 28.4, with `cornflowerblue` a distant fourth at 64.2. Convert both to CIELAB first and the ranking inverts: `cornflowerblue` wins at a Delta E of 11.3 and `royalblue` drops to 21.6.

Look at the three colors side by side and the Lab answer is the one that matches what your eye reports. RGB distance weights all three channels equally, but human vision does not. We resolve green far more finely than blue, so a 30 point shift in the blue channel reads as a much smaller change than a 30 point shift in green.

That mismatch is the entire reason a good hex to color name converter converts to a perceptual space before measuring anything.

## How to Find Color Name From a Hex Code in the Browser

If you need the name and not the theory, paste the value into a tool and read the result.

The Toolblip [Color Name Finder](https://toolblip.com/tools/color-name-finder) accepts HEX, RGB, or HSL and returns the nearest named color along with the exact value of that name, so you can see how far off the match actually is.

Paste `#2E7BD6` and you get `cornflowerblue` at `#6495ED`. The gap is visible but small, which tells you the name is a reasonable label and a poor substitute. Paste `#4682B4` and you get `steelblue` at a distance of zero, because that hex is the named color.

Distance matters more than the name. A match at Delta E under 2 is effectively the same color to most viewers. Between 2 and 10 you are looking at a usable label. Past 10 the name describes a neighborhood, not a color, and you should keep the hex as your source of truth.

## The CSS Named Colors List and Where It Came From

The CSS named colors list is not a designed palette. It grew out of the X11 window system color database from the 1980s, which the early web adopted wholesale, and CSS has carried it forward ever since for backward compatibility.

That history explains the oddities. `darkgray` (`#A9A9A9`) is lighter than `gray` (`#808080`), which surprises everyone who meets it for the first time. Both `gray` and `grey` spellings resolve to the same value, as do `aqua` and `cyan`, and `fuchsia` and `magenta`.

The list also skews heavily toward certain regions of color space. Blues, greens, and reds are well covered. Browns, muted purples, and desaturated midtones are thin, which is why a matcher returns `slategray` for a wide swath of muddy inputs that are not really gray at all.

CSS Color Level 4 added exactly one name to the set in decades: `rebeccapurple` (`#663399`), named in 2014 for Rebecca Meyer, daughter of CSS author Eric Meyer.

## The Math Behind Finding the Closest Named Color for Hex

Getting a trustworthy match takes three conversions and one comparison.

Start by converting sRGB to linear RGB, which undoes the gamma encoding baked into every hex value. Feed that into the XYZ color space using the standard sRGB matrix, then convert XYZ to CIELAB, where distances line up much more closely with perceived difference. Compare your input against every candidate and keep the smallest.

The comparison itself is Delta E. The 1976 formula is plain Euclidean distance in Lab, which is what the code below implements. CIEDE2000 refines it with corrections for lightness, chroma, and hue, and it is more accurate in the blue and near neutral ranges, at the cost of a much longer formula. For picking a name out of 148 candidates, Delta E 76 is almost always enough.

## Nearest Named Color From RGB Values in JavaScript

Here is a complete implementation. Getting the nearest named color from RGB values takes about forty lines, no dependencies, and it runs anywhere.

```js
const NAMED = {
  royalblue: '#4169E1',
  cornflowerblue: '#6495ED',
  dodgerblue: '#1E90FF',
  steelblue: '#4682B4',
  // ...the full CSS list goes here
};

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToLab([r, g, b]) {
  const lin = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const [R, G, B] = [lin(r), lin(g), lin(b)];

  const x = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const y = (R * 0.2126 + G * 0.7152 + B * 0.0722) / 1.0;
  const z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;

  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const [fx, fy, fz] = [f(x), f(y), f(z)];

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function deltaE(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function closestNamedColor(hex) {
  const target = rgbToLab(hexToRgb(hex));
  let best = null;

  for (const [name, value] of Object.entries(NAMED)) {
    const distance = deltaE(target, rgbToLab(hexToRgb(value)));
    if (!best || distance < best.distance) best = { name, value, distance };
  }
  return best;
}

closestNamedColor('#2E7BD6');
// { name: 'cornflowerblue', value: '#6495ED', distance: 11.32 }
```

Run the same input against each candidate and the spread is easy to read: `cornflowerblue` 11.32, `dodgerblue` 12.90, `royalblue` 21.56, `steelblue` 24.72. The top two are close enough that either is defensible as a label. The bottom two are not.

Swap `deltaE` for a plain RGB distance function and the ordering flips to `royalblue` 28.39, `steelblue` 42.20, `dodgerblue` 48.76, `cornflowerblue` 64.20. Same inputs, different answer, and the perceptually correct match lands dead last.

For a production matcher, precompute the Lab values for your name list once at module load instead of converting all 148 on every call.

## CSS Color Keywords vs Hex Codes in Real Stylesheets

Weighing CSS color keywords vs hex codes is a question about intent, not about output. Both compile to the same pixels.

Keywords earn their place in throwaway contexts. Debug outlines, quick prototypes, and one off demos read better as `outline: 2px solid red` than as `#FF0000`.

```css
/* Fine, temporary, obvious at a glance */
.debug { outline: 2px solid magenta; }

/* Not fine, this is a brand value pretending to be a name */
.button-primary { background: cornflowerblue; }

/* Correct, the token carries the real value */
:root { --brand-500: #2E7BD6; }
.button-primary { background: var(--brand-500); }
```

Two rules keep this from going wrong in a real codebase. Never ship a named keyword as a brand or theme color, because it locks you to a fixed value chosen for an X11 terminal decades ago. A matcher's answer is not a substitute for that value either: treating a Delta E of 11 as close enough is a visible mistake once the color covers a large surface.

The name is documentation. The hex is the value.

## Choosing the Best Color Name Finder Tool

The best color name finder tool for a given job comes down to three things: which database it searches, whether it reports match distance, and whether your color values leave the machine.

Database size changes the answer completely. The 148 CSS names are the safe default. Larger sets like the xkcd survey list (954 names) or a Pantone approximation table return more specific labels at the cost of names nobody recognizes without looking them up. A tool that searches only CSS names will never tell you something is `puce`.

Match distance is the feature most tools skip. Without it you cannot tell a perfect hit from a wild guess, and both come back looking equally confident.

The privacy question is worth thirty seconds of your time when the input is an unreleased brand color. A color name API for hex values means every lookup is an HTTP request carrying your palette to someone else's logs, and the math genuinely does not require a server.

Verify it yourself. Open the tool in Chrome or Firefox, press F12 for DevTools, select the Network tab, and click the clear button to empty the request list. Paste your hex and run the lookup.

An empty list apart from analytics and font requests means the matching ran in your browser and your color never left the machine. A POST carrying your hex value in the payload means it did not. Toolblip's color tools compute in the browser, so that check stays quiet.

Once you have a name, the neighboring tools pick up where the matcher stops. The [Color Harmony Generator](https://toolblip.com/tools/color-harmony-generator) rotates your base hue into complementary and triadic partners, the [Color Mixer](https://toolblip.com/tools/color-mixer) blends two values into intermediate shades, and the [Contrast Checker](https://toolblip.com/tools/contrast-checker) confirms your text pairs clear WCAG AA before any of it ships.

## Wrapping Up

Finding the closest named color for hex input is a nearest neighbor search, and the color space you search in decides whether the answer is useful. Convert to CIELAB, compare with Delta E, and read the distance alongside the name so you know whether you got a match or a rough neighborhood.

Keep the hex as your source of truth. Use the name for the commit message, the design doc, and the conversation where nobody wants to say "two E seven B D six" out loud.

Paste any HEX, RGB, or HSL value into the free [Color Name Finder](https://toolblip.com/tools/color-name-finder) on Toolblip to get the nearest named color, computed entirely in your browser.

