import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const assets = [
  ['public/icons/icon-192.png', 192],
  ['public/icons/icon-512.png', 512],
  ['public/icons/maskable-512.png', 512],
  ['public/icons/apple-touch-icon.png', 180],
];

for (const [relativePath, expectedSize] of assets) {
  const file = await readFile(resolve(relativePath));
  if (file.length < 3000) {
    throw new Error(`${relativePath} is suspiciously small (${file.length} bytes)`);
  }
  if (file.toString('ascii', 1, 4) !== 'PNG') {
    throw new Error(`${relativePath} is not a PNG`);
  }
  const width = file.readUInt32BE(16);
  const height = file.readUInt32BE(20);
  if (width !== expectedSize || height !== expectedSize) {
    throw new Error(`${relativePath} is ${width}x${height}; expected ${expectedSize}x${expectedSize}`);
  }
}

console.log(`PWA assets OK (${assets.length} icons)`);
