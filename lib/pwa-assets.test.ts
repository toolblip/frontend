import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import manifest from '../app/manifest';
import { PWA_SPLASH_SCREENS } from './pwa-splash-screens.mjs';

function png(src: string) {
  const file = readFileSync(resolve('public', src.replace(/^\//, '')));
  return {
    file,
    isPng: file.toString('ascii', 1, 4) === 'PNG',
    width: file.readUInt32BE(16),
    height: file.readUInt32BE(20),
    // PNG colour type: 4 and 6 carry an alpha channel; tRNS adds transparency to the others.
    hasAlpha: [4, 6].includes(file.readUInt8(25)) || file.includes('tRNS'),
  };
}

describe('web app manifest', () => {
  const data = manifest();
  const icons = data.icons ?? [];

  it('is installable: name, standalone display, root scope and start URL', () => {
    expect(data.name).toBe('Toolblip');
    expect(data.short_name).toBe('Toolblip');
    expect(data.display).toBe('standalone');
    expect(data.start_url).toBe('/');
    expect(data.scope).toBe('/');
    expect(data.id).toBe('/');
  });

  it('has the 192 and 512 icons Chrome requires, plus a maskable one', () => {
    const any = icons.filter((icon) => icon.purpose === 'any').map((icon) => icon.sizes);
    expect(any).toContain('192x192');
    expect(any).toContain('512x512');
    expect(icons.some((icon) => icon.purpose === 'maskable')).toBe(true);
  });

  it('points every icon at a real PNG of the declared size', () => {
    for (const icon of icons) {
      const image = png(icon.src);
      expect(image.isPng, icon.src).toBe(true);
      expect(`${image.width}x${image.height}`, icon.src).toBe(icon.sizes);
    }
  });

  it('ships a maskable icon that is opaque and not a copy of the normal icon', () => {
    const maskable = icons.find((icon) => icon.purpose === 'maskable')!;
    const normal = icons.find((icon) => icon.purpose === 'any' && icon.sizes === maskable.sizes)!;
    const image = png(maskable.src);
    // Android crops this to a circle: transparent corners or a reused icon lose the artwork.
    expect(image.hasAlpha).toBe(false);
    expect(image.file.equals(png(normal.src).file)).toBe(false);
  });

  it('ships an opaque 180px Apple touch icon (iOS paints transparency black)', () => {
    const image = png('/icons/apple-touch-icon.png');
    expect(image.width).toBe(180);
    expect(image.height).toBe(180);
    expect(image.hasAlpha).toBe(false);
  });
});

describe('iOS launch images', () => {
  it('has a portrait and a landscape image for every device', () => {
    expect(PWA_SPLASH_SCREENS.length).toBeGreaterThanOrEqual(40);
    expect(PWA_SPLASH_SCREENS.filter((screen) => screen.media.includes('portrait')).length).toBe(
      PWA_SPLASH_SCREENS.length / 2,
    );
  });

  it('gives each image its own media query, or iOS would pick the wrong one', () => {
    const queries = PWA_SPLASH_SCREENS.map((screen) => screen.media);
    expect(new Set(queries).size).toBe(queries.length);
  });

  it('ships every file at exactly the pixel size its media query promises', () => {
    for (const screen of PWA_SPLASH_SCREENS) {
      const image = png(screen.url);
      expect(image.isPng, screen.url).toBe(true);
      expect(`${image.width}x${image.height}`, screen.url).toBe(`${screen.width}x${screen.height}`);
      const [, w, h, ratio] = /device-width: (\d+)px\) and \(device-height: (\d+)px\) and \(-webkit-device-pixel-ratio: (\d)/.exec(screen.media)!;
      const portrait = screen.media.includes('portrait');
      expect(screen.width, screen.url).toBe(Number(portrait ? w : h) * Number(ratio));
      expect(screen.height, screen.url).toBe(Number(portrait ? h : w) * Number(ratio));
    }
  });
});

describe('manifest screenshots', () => {
  const screenshots = manifest().screenshots ?? [];
  const sized = screenshots.map((shot) => ({ ...shot, image: png(shot.src) }));

  it('has a desktop and a phone screenshot, which Chrome needs for the richer install dialog', () => {
    expect(screenshots.some((shot) => shot.form_factor === 'wide')).toBe(true);
    expect(screenshots.some((shot) => shot.form_factor !== 'wide')).toBe(true);
    expect(manifest().description).toBeTruthy();
  });

  it('points every screenshot at a real PNG of the declared size, with a label', () => {
    for (const shot of sized) {
      expect(shot.image.isPng, shot.src).toBe(true);
      expect(`${shot.image.width}x${shot.image.height}`, shot.src).toBe(shot.sizes);
      expect(shot.label, shot.src).toBeTruthy();
    }
  });

  it('stays inside Chrome limits: 320 to 3840px a side, longest side at most 2.3 times the shortest', () => {
    for (const { image, src } of sized) {
      const [short, long] = [image.width, image.height].sort((a, b) => a - b);
      expect(short, src).toBeGreaterThanOrEqual(320);
      expect(long, src).toBeLessThanOrEqual(3840);
      expect(long / short, src).toBeLessThanOrEqual(2.3);
    }
  });

  it('uses one aspect ratio per form factor (Chrome drops the odd ones out)', () => {
    for (const factor of ['wide', 'narrow']) {
      const ratios = sized
        .filter((shot) => shot.form_factor === factor)
        .map((shot) => (shot.image.width / shot.image.height).toFixed(4));
      expect(new Set(ratios).size, factor).toBe(1);
    }
  });
});
