export const MAX_IMAGE_LAYOUT_FILE_BYTES = 20 * 1024 * 1024;
export const MAX_IMAGE_LAYOUT_TOTAL_BYTES = 60 * 1024 * 1024;
export const MAX_IMAGE_LAYOUT_SOURCE_SIDE = 8192;
export const MAX_IMAGE_LAYOUT_SOURCE_PIXELS = 32_000_000;
export const MAX_IMAGE_LAYOUT_AGGREGATE_PIXELS = 64_000_000;
export const MAX_IMAGE_LAYOUT_OUTPUT_SIDE = 8192;
export const MAX_IMAGE_LAYOUT_OUTPUT_PIXELS = 32_000_000;
export const MAX_COMBINE_IMAGES = 12;
export const MIN_COMBINE_IMAGES = 2;
export const MAX_COLLAGE_IMAGES = 9;
export const COLLAGE_CELL_SIZE = 300;

export type ImageLayoutDimensions = { width: number; height: number };
export type ImageLayoutPlacement = { x: number; y: number; width: number; height: number };
export type CombineLayoutMode = 'horizontal' | 'vertical' | 'grid';
export type CollageLayoutType = '2x1' | '1x2' | '2x2' | '3x1' | '1x3' | '3x2' | '2x3' | '3x3';

export const COLLAGE_LAYOUTS: Record<CollageLayoutType, { cols: number; rows: number }> = {
  '2x1': { cols: 2, rows: 1 },
  '1x2': { cols: 1, rows: 2 },
  '2x2': { cols: 2, rows: 2 },
  '3x1': { cols: 3, rows: 1 },
  '1x3': { cols: 1, rows: 3 },
  '3x2': { cols: 3, rows: 2 },
  '2x3': { cols: 2, rows: 3 },
  '3x3': { cols: 3, rows: 3 },
};

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function cumulativeOffsets(sizes: number[], spacing: number) {
  const offsets: number[] = [];
  let next = 0;
  for (const size of sizes) {
    offsets.push(next);
    next += size + spacing;
  }
  return offsets;
}

export function moveItemToIndex<T>(items: T[], fromIndex: number, toIndex: number) {
  if (
    !Number.isInteger(fromIndex) || !Number.isInteger(toIndex) ||
    fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length ||
    fromIndex === toIndex
  ) return items;

  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

function assertUsableDimensions(images: ImageLayoutDimensions[]) {
  for (const image of images) {
    if (!Number.isFinite(image.width) || !Number.isFinite(image.height) || image.width < 1 || image.height < 1) {
      throw new Error('Image dimensions must be positive finite numbers.');
    }
  }
}

export function calculateCombineLayout(images: ImageLayoutDimensions[], mode: CombineLayoutMode, spacing: number) {
  assertUsableDimensions(images);
  const gap = Math.max(0, spacing);
  if (images.length === 0) return { width: 0, height: 0, placements: [] as ImageLayoutPlacement[] };

  if (mode === 'horizontal') {
    const width = sum(images.map((image) => image.width)) + gap * (images.length - 1);
    const height = Math.max(...images.map((image) => image.height));
    let x = 0;
    const placements = images.map((image) => {
      const placement = { x, y: (height - image.height) / 2, width: image.width, height: image.height };
      x += image.width + gap;
      return placement;
    });
    return { width, height, placements };
  }

  if (mode === 'vertical') {
    const width = Math.max(...images.map((image) => image.width));
    const height = sum(images.map((image) => image.height)) + gap * (images.length - 1);
    let y = 0;
    const placements = images.map((image) => {
      const placement = { x: (width - image.width) / 2, y, width: image.width, height: image.height };
      y += image.height + gap;
      return placement;
    });
    return { width, height, placements };
  }

  const cols = Math.ceil(Math.sqrt(images.length));
  const rows = Math.ceil(images.length / cols);
  const columnWidths = Array.from({ length: cols }, (_, col) => Math.max(
    ...images.filter((_, index) => index % cols === col).map((image) => image.width),
  ));
  const rowHeights = Array.from({ length: rows }, (_, row) => Math.max(
    ...images.slice(row * cols, row * cols + cols).map((image) => image.height),
  ));
  const columnOffsets = cumulativeOffsets(columnWidths, gap);
  const rowOffsets = cumulativeOffsets(rowHeights, gap);
  const placements = images.map((image, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    return {
      x: columnOffsets[col] + (columnWidths[col] - image.width) / 2,
      y: rowOffsets[row] + (rowHeights[row] - image.height) / 2,
      width: image.width,
      height: image.height,
    };
  });

  return {
    width: sum(columnWidths) + gap * (cols - 1),
    height: sum(rowHeights) + gap * (rows - 1),
    placements,
  };
}

export function calculateCollageLayout(images: ImageLayoutDimensions[], layout: CollageLayoutType, spacing: number) {
  assertUsableDimensions(images);
  const config = COLLAGE_LAYOUTS[layout];
  const gap = Math.max(0, spacing);
  const capacity = config.cols * config.rows;
  const width = config.cols * COLLAGE_CELL_SIZE + (config.cols - 1) * gap;
  const height = config.rows * COLLAGE_CELL_SIZE + (config.rows - 1) * gap;
  const placements = images.slice(0, capacity).map((image, index) => {
    const col = index % config.cols;
    const row = Math.floor(index / config.cols);
    const cellX = col * (COLLAGE_CELL_SIZE + gap);
    const cellY = row * (COLLAGE_CELL_SIZE + gap);
    const scale = Math.min(COLLAGE_CELL_SIZE / image.width, COLLAGE_CELL_SIZE / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    return {
      x: cellX + (COLLAGE_CELL_SIZE - drawWidth) / 2,
      y: cellY + (COLLAGE_CELL_SIZE - drawHeight) / 2,
      width: drawWidth,
      height: drawHeight,
    };
  });

  return { width, height, capacity, filledSlots: Math.min(images.length, capacity), placements };
}

export function getImageLayoutOutputError(width: number, height: number) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) return 'The output size is not valid. Try smaller images or spacing.';
  if (width > MAX_IMAGE_LAYOUT_OUTPUT_SIDE || height > MAX_IMAGE_LAYOUT_OUTPUT_SIDE) return 'Use an output up to 8192 px on each side.';
  if (width * height > MAX_IMAGE_LAYOUT_OUTPUT_PIXELS) return 'Use a smaller output, up to 32 megapixels.';
  return '';
}

export function getImageLayoutCapacityError(count: number, layout: CollageLayoutType) {
  const capacity = COLLAGE_LAYOUTS[layout].cols * COLLAGE_LAYOUTS[layout].rows;
  if (count > capacity) return `This layout has ${capacity} slots. Choose a larger layout or remove ${count - capacity} image${count - capacity === 1 ? '' : 's'}.`;
  return '';
}

export function getImageLayoutAggregateError(images: ImageLayoutDimensions[]) {
  const pixels = images.reduce((total, image) => total + image.width * image.height, 0);
  if (pixels > MAX_IMAGE_LAYOUT_AGGREGATE_PIXELS) return 'Use fewer or smaller images. The combined decoded source limit is 64 megapixels.';
  return '';
}

export function getImageLayoutSourceBoundsError(width: number, height: number) {
  if (width > MAX_IMAGE_LAYOUT_SOURCE_SIDE || height > MAX_IMAGE_LAYOUT_SOURCE_SIDE) return 'Use source images up to 8192 px on each side.';
  if (width * height > MAX_IMAGE_LAYOUT_SOURCE_PIXELS) return 'Use source images up to 32 megapixels each.';
  return '';
}
