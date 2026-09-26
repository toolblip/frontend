import { describe, it, expect } from 'vitest';
import { PDFDocument, PDFName, PDFDict, PDFRawStream, decodePDFRawStream } from 'pdf-lib';
import { hasSupportedImageDecode } from './image-decode';
import { rgbaPixels } from './pixels';
import { readFile } from 'node:fs/promises';
import { decodeReviewFixture } from '../../scripts/qa/regressions/pdf-review-fixtures.mjs';

async function image(options: Parameters<typeof decodeReviewFixture>[0] = {}) {
  const doc = await PDFDocument.load(await decodeReviewFixture(options));
  const objects = doc.getPage(0).node.Resources()!.lookup(PDFName.of('XObject'), PDFDict);
  const stream = doc.context.lookup(objects.entries()[0][1]);
  if (!(stream instanceof PDFRawStream)) throw new Error('Fixture image stream missing');
  return stream;
}
describe('explicit no-op image transforms', () => {
  for (const indirect of [false, true]) it(`accepts identity RGB and Predictor 1 (${indirect ? 'indirect' : 'direct'}) without changing samples`, async () => {
    const stream = await image({ indirect });
    expect(hasSupportedImageDecode(stream.dict)).toBe(true);
    const raw = decodePDFRawStream(stream).decode();
    expect([...raw]).toEqual([255,0,0,0,255,0,0,0,255,250,160,30]);
    expect([...rgbaPixels(raw,2,2,'rgb')]).toEqual([255,0,0,255,0,255,0,255,0,0,255,255,250,160,30,255]);
  });
  it('accepts each explicit default independently', async () => {
    for (const options of [{ decode: null }, { predictor: null }]) {
      expect(hasSupportedImageDecode((await image(options)).dict)).toBe(true);
    }
  });
  it('accepts a real JPEG with defaults without modifying its compressed bytes', async () => {
    const jpeg = await readFile(new URL('../../public/samples/image-resizer-mountain.jpg', import.meta.url));
    const stream = await image({ jpeg });
    expect(hasSupportedImageDecode(stream.dict)).toBe(true);
    expect(Buffer.from(stream.contents)).toEqual(jpeg);
  });
  it('rejects inversions, wrong channel counts and real predictors', async () => {
    for (const options of [{decode:[1,0,0,1,0,1]}, {decode:[0,1]}, {predictor:12}]) {
      expect(hasSupportedImageDecode((await image(options)).dict)).toBe(false);
    }
  });
});
