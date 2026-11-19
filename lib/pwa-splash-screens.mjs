/**
 * iOS launch images for the installed app. iOS shows one only when the media
 * query matches the device exactly, so every screen size needs its own file.
 * Plain ESM so scripts/generate-pwa-splash.mjs can import it.
 * [CSS width, CSS height, pixel ratio] in portrait.
 */
export const PWA_SPLASH_DEVICES = [
  // iPhone
  [320, 568, 2], // SE (1st gen)
  [375, 667, 2], // SE (2nd, 3rd gen), 8
  [414, 736, 3], // 8 Plus
  [375, 812, 3], // X, XS, 11 Pro, 12 mini, 13 mini
  [414, 896, 2], // XR, 11
  [414, 896, 3], // XS Max, 11 Pro Max
  [390, 844, 3], // 12, 13, 14
  [428, 926, 3], // 12 Pro Max, 13 Pro Max, 14 Plus
  [393, 852, 3], // 14 Pro, 15, 16
  [430, 932, 3], // 14 Pro Max, 15 Plus, 16 Plus
  [402, 874, 3], // 16 Pro, 17
  [420, 912, 3], // Air
  [440, 956, 3], // 16 Pro Max, 17 Pro Max
  // iPad
  [744, 1133, 2], // mini (6th gen)
  [768, 1024, 2], // 9.7"
  [810, 1080, 2], // 10.2"
  [820, 1180, 2], // 10.9", Air
  [834, 1112, 2], // Pro 10.5"
  [834, 1194, 2], // Pro 11"
  [834, 1210, 2], // Pro 11" (M4)
  [1024, 1366, 2], // Pro 12.9"
  [1032, 1376, 2], // Pro 13" (M4)
];

/** One entry per device and orientation: file, pixel size and the media query iOS matches. */
export const PWA_SPLASH_SCREENS = PWA_SPLASH_DEVICES.flatMap(([w, h, ratio]) =>
  ['portrait', 'landscape'].map((orientation) => {
    const width = (orientation === 'portrait' ? w : h) * ratio;
    const height = (orientation === 'portrait' ? h : w) * ratio;
    return {
      url: `/splash/${width}x${height}.png`,
      width,
      height,
      // device-width and device-height keep their portrait values when the device rotates.
      media: `(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: ${orientation})`,
    };
  }),
);
