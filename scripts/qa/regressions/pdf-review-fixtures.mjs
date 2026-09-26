import { PDFDocument, PDFName, degrees, rgb } from 'pdf-lib';

// No production geometry or decode helpers are used to construct these PDFs.
export async function croppedReviewFixture(rotation = 0, rectangular = false) {
  const doc = await PDFDocument.create(); const page = doc.addPage([600, 800]);
  page.setCropBox(100, 200, 400, rectangular ? 300 : 400);
  page.setRotation(degrees(rotation));
  page.drawRectangle({x:100,y:200,width:400,height:rectangular ? 300 : 400,color:rgb(1,0.75,0.75)});
  page.drawText('SOURCE', { x: 180, y: 380, size: 20 });
  return Buffer.from(await doc.save());
}
export const reviewSamples = [255, 0, 0, 0, 255, 0, 0, 0, 255, 250, 160, 30];
/** @param {{decode?: number[] | null, predictor?: number | null, indirect?: boolean, jpeg?: Uint8Array}} options */
export async function decodeReviewFixture({ decode = [0, 1, 0, 1, 0, 1], predictor = 1, indirect = false, jpeg = undefined } = {}) {
  const doc = await PDFDocument.create(); const page = doc.addPage([200, 200]);
  const embedded = jpeg ? await doc.embedJpg(jpeg) : null;
  const stream = jpeg ? doc.context.stream(jpeg, { Filter: 'DCTDecode' }) : doc.context.flateStream(Uint8Array.from(reviewSamples));
  for (const [key, value] of Object.entries({ Type: 'XObject', Subtype: 'Image', Width: embedded?.width ?? 2, Height: embedded?.height ?? 2, ColorSpace: 'DeviceRGB', BitsPerComponent: 8 })) stream.dict.set(PDFName.of(key), doc.context.obj(value));
  for (const [key, value] of Object.entries({ Decode: decode, DecodeParms: predictor === null ? null : { Predictor: predictor } })) {
    const obj = doc.context.obj(value); stream.dict.set(PDFName.of(key), indirect ? doc.context.register(obj) : obj);
  }
  page.node.set(PDFName.of('Resources'), doc.context.obj({ XObject: { Im: doc.context.register(stream) } }));
  page.node.set(PDFName.of('Contents'), doc.context.register(doc.context.stream('q 100 0 0 100 20 20 cm /Im Do Q')));
  return Buffer.from(await doc.save());
}
