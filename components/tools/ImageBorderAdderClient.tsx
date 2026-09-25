'use client';

import ImageGeometryTool from './ImageGeometryTool';

export default function ImageBorderAdderClient({ live = false }: { live?: boolean }) {
  return <ImageGeometryTool kind="border" live={live} />;
}
