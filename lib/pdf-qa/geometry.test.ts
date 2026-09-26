import { describe, expect, it } from 'vitest';
import { PDFDocument, degrees, PDFName } from 'pdf-lib';
import { visiblePageGeometry, viewportToPage, drawInVisiblePage } from './geometry';

describe('visible CropBox geometry (independent expected coordinates)', () => {
  const expected = [
    [0, [120, 570], [1, 0, 0, 1, 100, 200]],
    [90, [130, 220], [0, 1, -1, 0, 500, 200]],
    [180, [480, 230], [-1, 0, 0, -1, 500, 600]],
    [270, [470, 580], [0, -1, 1, 0, 100, 600]],
  ] as const;
  for (const [rotation, point, matrix] of expected) it(`maps upper-left and preserves drawing axes at ${rotation} degrees`, async () => {
    const doc = await PDFDocument.create(); const page = doc.addPage([600, 800]);
    page.setCropBox(100, 200, 400, 400); page.setRotation(degrees(rotation));
    const geometry = visiblePageGeometry(page);
    expect([geometry.width, geometry.height]).toEqual([400, 400]);
    expect(viewportToPage(geometry, 20, 30)).toEqual({ x: point[0], y: point[1] });
    expect(geometry.matrix).toEqual(matrix);
    await drawInVisiblePage(page, size => { expect(size.width).toBe(400); page.drawText('UP', { x: 20, y: 350, size: 20 }); });
    expect((await doc.save()).length).toBeGreaterThan(100);
  });
  it('intersects CropBox with MediaBox, swaps rectangular dimensions, and respects UserUnit', async () => {
    const doc = await PDFDocument.create(); const page = doc.addPage([600, 800]);
    page.setCropBox(-100, 200, 600, 300); page.setRotation(degrees(90));
    page.node.set(PDFName.of('UserUnit'), doc.context.obj(2));
    const g = visiblePageGeometry(page);
    expect([g.width, g.height]).toEqual([600, 1000]);
    expect(viewportToPage(g, 40, 60)).toEqual({ x: 30, y: 220 });
    expect(g.matrix).toEqual([0, 0.5, -0.5, 0, 500, 200]);
  });
});

import { visibleTextGeometry } from './geometry';
it.each([
  [[20,0,0,-20,80,220], [80,204,100,20], 0],
  [[0,20,20,0,180,80], [176,80,20,100], 90],
  [[-20,0,0,20,320,180], [220,176,100,20], 180],
  [[0,-20,-20,0,220,320], [204,220,20,100], -90],
])('covers the transformed source text without losing its baseline axes', (transform, box, angle) => {
  const g = visibleTextGeometry(transform as number[], 100, 0.8, -0.2);
  expect([g.x,g.y,g.width,g.height]).toEqual(box);
  expect(g.angle).toBe(angle);
});
