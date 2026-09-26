import { describe, expect, it, vi } from 'vitest';
import { PDFDocument, PDFName } from 'pdf-lib';
import { assertPdfFileSize, loadPdfForTools, unlockPdfBytes } from './pdf';

describe('PDF group document guard', () => {
  it('rejects oversized files before allocating their contents', () => {
    expect(() => assertPdfFileSize({ size: 26 * 1024 * 1024 })).toThrow(/25 MB/);
  });
  it('rejects excessive page count and rendering dimensions', async () => {
    const many = await PDFDocument.create();
    for (let i = 0; i < 101; i++) many.addPage([100, 100]);
    await expect(loadPdfForTools(await many.save())).rejects.toThrow(/100 pages/);
    const huge = await PDFDocument.create(); huge.addPage([30000, 30000]);
    await expect(loadPdfForTools(await huge.save())).rejects.toThrow(/dimensions/);
  });
  it('preserves real page geometry and text', async () => {
    const doc = await PDFDocument.create(); doc.addPage([321, 456]).drawText('Independent fixture');
    expect((await loadPdfForTools(await doc.save())).getPage(0).getSize()).toEqual({ width: 321, height: 456 });
  });
  it('does not pass malformed input off as an encrypted success', async () => {
    const render = vi.fn();
    await expect(unlockPdfBytes(new TextEncoder().encode('%PDF-broken'), '', render)).rejects.toThrow();
    expect(render).not.toHaveBeenCalled();
  });
  it('routes encrypted input through real decryption, preserving password whitespace', async () => {
    const doc = await PDFDocument.create(); doc.addPage([321, 456]);
    // A structural Encrypt marker exercises dispatch, never claims cryptographic validity.
    doc.context.trailerInfo.Encrypt = doc.context.register(doc.context.obj({ Filter: PDFName.of('Standard') }));
    const encrypted = await doc.save();
    const plain = await PDFDocument.create(); plain.addPage([321, 456]);
    const render = vi.fn(async () => plain.save());
    const out = await unlockPdfBytes(encrypted, ' secret ', render);
    expect(render).toHaveBeenCalledWith(encrypted, ' secret ');
    expect((await PDFDocument.load(out.bytes)).isEncrypted).toBe(false);
    expect(out.flattened).toBe(true);
  });
  it('rejects renderer output that is still encrypted', async () => {
    const doc = await PDFDocument.create(); doc.addPage();
    doc.context.trailerInfo.Encrypt = doc.context.register(doc.context.obj({ Filter: PDFName.of('Standard') }));
    const encrypted = await doc.save();
    await expect(unlockPdfBytes(encrypted, 'bad', async () => encrypted)).rejects.toThrow();
  });
});

import { rgbaPixels } from './pixels';
describe('PDF image pixels', () => {
  it('preserves RGB and soft-mask transparency', () => {
    expect([...rgbaPixels(Uint8Array.of(255,0,0,0,255,0),2,1,'rgb',undefined,Uint8Array.of(255,128))]).toEqual([255,0,0,255,0,255,0,128]);
  });
  it('rejects truncated pixels and oversized dimensions instead of fabricating black', () => {
    expect(() => rgbaPixels(Uint8Array.of(255),2,2,'rgb')).toThrow();
    expect(() => rgbaPixels(new Uint8Array(),100000,100000,'gray')).toThrow();
  });
  it('converts gray and indexed palette colors independently', () => {
    expect([...rgbaPixels(Uint8Array.of(64),1,1,'gray')]).toEqual([64,64,64,255]);
    expect([...rgbaPixels(Uint8Array.of(1),1,1,'indexed',Uint8Array.of(0,0,0,10,20,30))]).toEqual([10,20,30,255]);
  });
});
