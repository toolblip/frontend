---
title: "Mix Two Colors for Palette Shades: A Developer Guide"
description: >-
  Learn how to mix two colors for palette shades using CSS color-mix and plain
  JS interpolation. See the math, the token output, and try the free tool now.
slug: 2026-08-04-mix-two-colors-for-palette-shades
date: "2026-08-04T00:00:00.000Z"
category: Developer Tools
tags:
  - Mix-two-colors-to-create-new-p
  - color-mixer
  - SEO
  - Developer Tools
author: Toolblip Team
readingTime: 7 min
featuredImage: https://api.radtx.com/gradient/6b7280-374151/1200/630
---

A typical run: enter `#2E7BD6` as the first color, enter `#E85D3D` as the second, set the blend to 50 percent, and copy the resulting hex.

# Mix Two Colors for Palette Shades: A Developer Guide

When you mix two colors for palette shades, you are asking for the colors that sit between them, usually so a design system gets intermediate steps instead of two endpoints and a gap. The operation is linear interpolation on each channel, weighted by a ratio you pick. Below is the math, the CSS `color-mix()` syntax that does it natively in the browser, a plain JavaScript version for build-time token generation, and the reason mixing in sRGB sometimes gives you a muddy middle that mixing in OKLab does not.

## Why Mix Two Colors for Palette Shades Instead of Stepping Lightness

The common way to build a ramp is to hold hue and saturation fixed and step the lightness channel. It works, and it is predictable. It also produces ramps that all feel like the same color at different brightnesses, because that is exactly what they are.

Mixing gives you something different. Blending your brand blue toward your warm accent produces midtones that carry a trace of both, which is how you get a ramp that feels designed rather than computed.

Mixing also solves problems a lightness ramp cannot touch:

- Building a neutral gray family that is tinted toward the brand color instead of pure `#808080`.
- Generating hover and pressed states by blending the base toward white or black by a fixed percentage.
- Creating a disabled state by mixing the component color toward the page background.
- Producing gradient stops that land on real token values you can name and reuse.

That last one matters more than it sounds. A gradient defined only in CSS gives you no intermediate values to reference elsewhere. Mixing gives you the stops as concrete hex codes.

## How to Mix Two Colors for Palette Shades Online

If you just need the values and do not want to write code for it, the fastest route is a browser tool. Paste both colors, set the ratio, read the output.

The Toolblip [Color Mixer](https://toolblip.com/tools/color-mixer) takes two or more colors and produces the blend at whatever weighting you choose. A typical run: enter `#2E7BD6` as the first color, enter `#E85D3D` as the second, set the blend to 50 percent, and copy the resulting hex.

At an even 50/50 split those two produce `#8B6C8A` in sRGB. Change the ratio to 75/25 in favor of the blue and you get `#5D74B0`. Walking the ratio in fixed increments is how you generate a full ramp rather than a single midpoint.

For a five step ramp between two colors, use 0, 25, 50, 75, and 100 percent. For a nine step ramp closer to what most design systems ship, use increments of 12.5 percent.

## CSS color-mix Function Explained

Modern browsers do this natively. The `color-mix()` function takes an interpolation color space, two colors, and a percentage for at least one of them.

```css
:root {
  --brand: #2E7BD6;
  --accent: #E85D3D;

  /* Even blend of the two brand colors */
  --brand-blend-500: color-mix(in oklab, var(--brand) 50%, var(--accent));

  /* Hover and pressed states, blended toward white and black */
  --brand-hover:   color-mix(in oklab, var(--brand) 85%, white);
  --brand-pressed: color-mix(in oklab, var(--brand) 85%, black);

  /* Brand-tinted neutrals instead of pure gray */
  --gray-100: color-mix(in oklab, var(--brand) 8%,  white);
  --gray-800: color-mix(in oklab, var(--brand) 15%, black);

  /* Disabled state, mixed toward the page background */
  --brand-disabled: color-mix(in srgb, var(--brand) 35%, var(--surface, white));
}
```

Two details are worth pinning down.

The interpolation space is not optional, and it changes the result. `in srgb` interpolates raw channel values, which is fast and matches what most older tooling does. `in oklab` interpolates in a perceptually uniform space, which keeps the midpoint from going gray and muddy when the two inputs are far apart on the wheel. Blend blue and orange in sRGB and the middle collapses toward a dull brown. Do it in OKLab and the middle stays a recognizable color.

The percentage attaches to the color that precedes it. `color-mix(in oklab, var(--brand) 85%, white)` is 85 percent brand and 15 percent white, not the other way around. If you supply percentages for both and they do not sum to 100, the browser normalizes them.

Browser support is solid. Chrome, Edge, Safari, and Firefox have all shipped `color-mix()` since 2023, so it is safe in production unless you still support older Safari on locked-down devices.

## The Math Behind Mixing Two Colors for Palette Shades

If you need the values at build time, in a token pipeline, or in a Node script that writes your theme file, do the interpolation yourself. In sRGB it is one line per channel.

```js
function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex({ r, g, b }) {
  const h = (v) => Math.round(v).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

// weight is how much of colorA to keep, 0 to 1
function mix(colorA, colorB, weight) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  return rgbToHex({
    r: a.r * weight + b.r * (1 - weight),
    g: a.g * weight + b.g * (1 - weight),
    b: a.b * weight + b.b * (1 - weight),
  });
}

// Build a five step ramp between two brand colors
const steps = [1, 0.75, 0.5, 0.25, 0];
const ramp = steps.map((w) => mix('#2E7BD6', '#E85D3D', w));
// ['#2E7BD6', '#5D74B0', '#8B6C8A', '#BA6563', '#E85D3D']
```

That is straight sRGB interpolation, the same thing `color-mix(in srgb, ...)` does. It is correct, it is fast, and it is what most token generators use.

The perceptual caveat from earlier applies here too. Averaging raw sRGB bytes ignores the fact that the encoding is gamma corrected, so midpoints between distant hues come out darker and less saturated than your eye expects. For ramps between nearby colors the difference is small enough to ignore. For blue to orange it is visible.

If it matters for your palette, convert to linear RGB before averaging and convert back afterward, or use the browser's `color-mix(in oklab, ...)` and read the computed value out.

## Color Mixing vs Color Harmony

Worth separating two operations that get confused because both produce palettes.

Harmony generation starts from one color and rotates the hue by fixed angles to find companions: 180 degrees for a complement, 120 and 240 for a triad. You give it one input and get several unrelated hues out. Use it when you need to discover which colors go with the one you have.

Mixing starts from two colors you already committed to and fills the space between them. You give it two inputs and get intermediate steps. Use it when the hues are settled and you need the ramp.

The two chain naturally. Run your base color through the [Color Harmony Generator](https://toolblip.com/tools/color-harmony-generator) to find a complement or triad, pick the partner you like, then mix the pair to produce every shade between them. Harmony picks the endpoints, mixing fills the middle.

## Blend Two Hex Colors for Design Tokens

Once the ramp exists, it needs names. Blending two hex colors for design tokens means writing out both the values and the semantic layer that points at them.

```json
{
  "color": {
    "brand": {
      "100": { "value": "#2E7BD6" },
      "200": { "value": "#5D74B0" },
      "300": { "value": "#8B6C8A" },
      "400": { "value": "#BA6563" },
      "500": { "value": "#E85D3D" }
    },
    "action": {
      "default": { "value": "{color.brand.100}" },
      "hover":   { "value": "{color.brand.200}" }
    }
  }
}
```

Generate the numeric scale from the mix, then point semantic tokens at positions in that scale. Changing a brand color later means rerunning the mix and leaving every semantic reference alone.

One rule before shipping: a mixed ramp is not automatically accessible. Interpolation says nothing about contrast, and the middle of a ramp is exactly where text contrast tends to fail. Run every text and background pair through the [Contrast Checker](https://toolblip.com/tools/contrast-checker) and fix the steps that miss WCAG AA.

## Choosing the Best Color Mixer Tool for Developers

The best color mixer tool for developers is the one that hands back values in the format your pipeline already speaks, and does not send your unreleased brand colors to a server on the way.

Channel averaging is arithmetic on six numbers. There is no reason for it to touch a network. You can confirm whether a given tool respects that in about fifteen seconds.

Open the tool in Chrome or Firefox and press F12 to open DevTools. Select the Network tab and click the clear button to empty the request list. Paste both colors and generate the blend, then look at what appeared.

An empty list apart from analytics and font requests means the math ran locally and your colors never left the machine. A POST carrying your hex values in the payload means it did not. Toolblip's color tools compute in the browser, so that check comes back quiet.

Beyond privacy, the things actually worth checking: whether it accepts HEX, RGB, and HSL rather than one format, whether it exposes the interpolation space, whether it produces a full ramp or only a single midpoint, and whether you can copy CSS custom properties directly instead of retyping values.

If you need readable names for the shades you end up with, the [Color Name Finder](https://toolblip.com/tools/color-name-finder) maps any hex value to its nearest named color, which is useful when a design doc needs something more descriptive than `#8B6C8A`.

## Wrapping Up

To mix two colors for palette shades, interpolate each channel by a weight, either with `color-mix()` in the browser or a short function at build time. Pick your interpolation space deliberately, since sRGB is fine for nearby hues and OKLab keeps distant ones from going muddy in the middle.

Settle your endpoints first, generate the ramp, name the steps as tokens, then verify contrast before any of it reaches production.

Paste your two colors into the free [Color Mixer](https://toolblip.com/tools/color-mixer) on Toolblip to generate the blend and every shade between them, computed entirely in your browser.

