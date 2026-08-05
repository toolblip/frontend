---
title: "How to Resize Image for Social Media Dimensions Right"
description: >-
  Learn how to resize image for social media dimensions with the exact Open Graph, Instagram, and LinkedIn sizes plus code. Try the free Image Resizer now.
slug: 2026-08-04-resize-image-for-social-media-dimensions
date: 2026-08-04T00:00:00.000Z
category: Developer Tools
tags:
  - Resize-images-to-exact-social-
  - SEO
  - Developer Tools
author: Toolblip Team
readingTime: 7 min
featuredImage: https://api.radtx.com/gradient/6b7280-374151/1200/630
---

# How to Resize Image for Social Media Dimensions Right

If you need to resize image for social media dimensions, you are probably staring at a photo that looks wrong somewhere. Maybe it is cropped strangely on Facebook, blurry on LinkedIn, or missing entirely from a shared link preview. Every platform expects a specific pixel size, and getting it wrong costs you a clean thumbnail right when it matters most.

This guide covers the exact dimensions each platform expects, how to resize an image without losing quality, and how to hit the open graph image size that link previews actually read from.

## Why Image Dimensions Break Your Social Previews

Social platforms do not just display whatever image you upload. They crop it to a fixed aspect ratio first.

If your source image is the wrong shape, the platform's cropper decides what gets cut off, not you. A portrait photo dropped into a 1.91:1 Open Graph slot often loses the top of someone's head or the bottom of a product shot.

Link-preview crawlers are even less forgiving. Facebook, LinkedIn, and Slack all read the `og:image` meta tag and expect something close to the og image dimensions 1200x630 standard. Submit a tiny or oddly-shaped image and some crawlers skip the preview image altogether.

Resizing ahead of time, to the exact pixel dimensions each surface expects, is the only way to control the crop yourself.

## Resize Image for Social Media Dimensions: The Cheat Sheet

Here are the sizes worth memorizing. These cover the vast majority of sharing surfaces developers deal with.

- **Open Graph link preview**: 1200 x 630 px (1.91:1). This is the open graph image size used by Facebook, LinkedIn, and most link-preview crawlers, including Slack and Discord unfurls.
- **Instagram feed post**: 1080 x 1080 px square, or 1080 x 1350 px portrait if you want the tallest possible feed card. Either counts as the standard instagram post image size today.
- **Instagram Stories**: 1080 x 1920 px, full-screen vertical.
- **Facebook cover photo dimensions**: 820 x 312 px on desktop, cropped down to roughly 640 x 360 px on mobile. Keep key content centered so both crops survive.
- **LinkedIn banner image size**: 1584 x 396 px for a personal profile background, 1128 x 191 px for a Company Page cover.
- **Twitter/X summary card**: 1200 x 675 px.
- **YouTube thumbnail**: 1280 x 720 px, under 2MB.

None of these numbers are arbitrary. They match the aspect ratios each platform's mobile and desktop layouts actually render, so an image resized to spec shows up uncropped almost everywhere it appears.

## How to Resize Image for Social Media Dimensions in the Browser

For a single image, a small canvas function does the whole job client-side, with no upload and no server round trip.

```js
function resizeImageToFit(img, targetWidth, targetHeight) {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;
  const offsetX = (targetWidth - scaledWidth) / 2;
  const offsetY = (targetHeight - scaledHeight) / 2;

  ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
  return canvas.toDataURL('image/jpeg', 0.9);
}
```

This is a cover-fit resize, the same behavior as CSS `object-fit: cover`. It scales the image up until it fully fills the target box, then centers and crops the overflow, instead of squashing the image into the wrong aspect ratio.

Because the whole operation runs in `<canvas>`, you can open your browser's DevTools Network tab while resizing and confirm nothing is uploaded. The original file bytes never leave the page.

## Resizing Images in Bulk with ImageMagick

Blogs, product catalogs, and CI pipelines usually need to resize dozens or hundreds of images at once. ImageMagick handles that from the command line.

```bash
magick input.jpg -resize 1200x630^ -gravity center -extent 1200x630 output-og.jpg
```

The caret after `-resize` tells ImageMagick to fill the target box completely, even if that means the image overflows one dimension. `-gravity center` then anchors the crop, and `-extent` trims the overflow down to the exact 1200x630 canvas.

Wrap that single command in a shell loop, or a CI step, and every image in a directory gets the same og image dimensions 1200x630 output automatically. That is the pattern worth using if you are generating social cards for a whole blog archive in one pass.

## How to Resize an Image Without Losing Quality

Getting the pixel dimensions right is only half the job. The other half is making sure the resize itself does not visibly degrade the image.

A few habits matter more than any specific tool:

- **Always resize from the original master file**, not from a copy that has already been resized once. Each resize-and-recompress cycle throws away detail that the next cycle cannot recover.
- **Use a quality setting around 80 to 90** for JPEG output. Anything higher barely reduces visible artifacts but adds file size fast; anything lower starts showing blocky compression.
- **Scale down, not up.** Enlarging a small source image just stretches existing pixels and looks soft no matter what tool you use.
- **Keep PNG for logos, screenshots, and anything with transparency or sharp text.** JPEG compression blurs hard edges that PNG preserves losslessly.

Following those rules is how you resize image without losing quality even when you are batch-processing a large image library.

There is also a practical size trade-off worth knowing. A 1200 x 630 JPEG at quality 85 typically lands between 80KB and 200KB, depending on how much detail is in the photo. That is small enough for fast link-preview crawlers and small enough to avoid bloating a page's load time when the same image doubles as a hero image. If your export is coming out well above that, the source resolution is probably far larger than 1200 x 630 and worth downscaling before you compress, not after.

## Resize Image for Social Media Dimensions Instantly with Image Resizer

For most day-to-day work, running the numbers above through code is more setup than a single social post needs. Toolblip's [Image Resizer](https://toolblip.com/tools/image-resizer) does the same cover-fit resize as the code above, with presets for every size in the cheat sheet.

The flow is simple:

1. Upload the source image. It is processed in your browser, so nothing is sent to a server.
2. Pick a preset, such as Open Graph 1200x630, Instagram Square, or LinkedIn Banner, or enter custom dimensions.
3. Download the resized file, ready to drop into your CMS, meta tags, or social scheduler.

Once you have the resized image, pair it with the [Meta Tag Generator](https://toolblip.com/tools/meta-tag-generator) to build the matching `og:image` tag, then check the result with [Open Graph Preview](https://toolblip.com/tools/open-graph-preview) before you publish. That last step catches crawler caching issues and wrong aspect ratios before a broken card ships to a live page.

## Quick Checklist Before You Publish

Before you push a new image live, run through this list:

- Is the Open Graph image exactly 1200 x 630, or close to that 1.91:1 ratio?
- Does the Instagram version match 1080 x 1080 or 1080 x 1350, depending on the layout you want?
- Did you resize down from the original master file, not a previously compressed copy?
- Did you preview the crop somewhere other than your own editor, since platforms crop differently than a design tool?

Get this right once, using the Image Resizer to resize image for social media dimensions correctly across every platform, and you stop re-uploading fixes after a post already went out.
