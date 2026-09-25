import {
  getGeometryExtension,
  normalizeGeometryMime,
  verifyGeometryOutputSignature,
  validateGeometryDimensions,
  validateGeometryFile,
  type GeometryOutputMime,
  type GeometryValidation,
} from './image-geometry';

export type ImageRotationAngle = 0 | 90 | 180 | 270;
export type ImageFlipDirection = 'horizontal' | 'vertical' | 'both';
export type ImageTransformOperation =
  | { type: 'rotate'; angle: ImageRotationAngle }
  | { type: 'flip'; direction: ImageFlipDirection };

export type ImageTransformPlan = {
  width: number;
  height: number;
  translateX: number;
  translateY: number;
  rotateRadians: number;
  scaleX: number;
  scaleY: number;
};

export const ACCEPTED_IMAGE_TRANSFORM_TYPES = '.png,.jpg,.jpeg,.webp,.gif,.svg,image/png,image/jpeg,image/webp,image/gif,image/svg+xml';

export type ImageTransformOutputFormat = {
  mimeType: GeometryOutputMime;
  extension: 'jpg' | 'png';
  label: 'JPEG' | 'PNG';
  quality?: number;
};

export function getImageTransformOutputFormat(sourceMimeType: string): ImageTransformOutputFormat {
  const mimeType: GeometryOutputMime = normalizeGeometryMime(sourceMimeType) === 'image/jpeg' ? 'image/jpeg' : 'image/png';
  return {
    mimeType,
    extension: getGeometryExtension(mimeType),
    label: mimeType === 'image/jpeg' ? 'JPEG' : 'PNG',
    ...(mimeType === 'image/jpeg' ? { quality: 0.9 } : {}),
  };
}

export function validateImageTransformDimensions(width: number, height: number): GeometryValidation {
  return validateGeometryDimensions(width, height);
}

export function validateImageTransformFile(file: File, detectedMimeType: string) {
  return validateGeometryFile(file, detectedMimeType);
}

export function verifyImageTransformOutputSignature(header: Uint8Array, mimeType: GeometryOutputMime) {
  return verifyGeometryOutputSignature(header, mimeType);
}

export function getImageTransformPlan(sourceWidth: number, sourceHeight: number, operation: ImageTransformOperation): ImageTransformPlan {
  if (operation.type === 'rotate') {
    if (operation.angle === 0) {
      return {
        width: sourceWidth,
        height: sourceHeight,
        translateX: 0,
        translateY: 0,
        rotateRadians: 0,
        scaleX: 1,
        scaleY: 1,
      };
    }
    if (operation.angle === 90) {
      return {
        width: sourceHeight,
        height: sourceWidth,
        translateX: sourceHeight,
        translateY: 0,
        rotateRadians: Math.PI / 2,
        scaleX: 1,
        scaleY: 1,
      };
    }
    if (operation.angle === 180) {
      return {
        width: sourceWidth,
        height: sourceHeight,
        translateX: sourceWidth,
        translateY: sourceHeight,
        rotateRadians: Math.PI,
        scaleX: 1,
        scaleY: 1,
      };
    }
    return {
      width: sourceHeight,
      height: sourceWidth,
      translateX: 0,
      translateY: sourceWidth,
      rotateRadians: (Math.PI * 3) / 2,
      scaleX: 1,
      scaleY: 1,
    };
  }

  if (operation.direction === 'horizontal') {
    return {
      width: sourceWidth,
      height: sourceHeight,
      translateX: sourceWidth,
      translateY: 0,
      rotateRadians: 0,
      scaleX: -1,
      scaleY: 1,
    };
  }
  if (operation.direction === 'vertical') {
    return {
      width: sourceWidth,
      height: sourceHeight,
      translateX: 0,
      translateY: sourceHeight,
      rotateRadians: 0,
      scaleX: 1,
      scaleY: -1,
    };
  }
  return {
    width: sourceWidth,
    height: sourceHeight,
    translateX: sourceWidth,
    translateY: sourceHeight,
    rotateRadians: 0,
    scaleX: -1,
    scaleY: -1,
  };
}

export function mapImageTransformPixel(
  sourceWidth: number,
  sourceHeight: number,
  x: number,
  y: number,
  operation: ImageTransformOperation,
) {
  if (operation.type === 'rotate') {
    if (operation.angle === 0) return { x, y };
    if (operation.angle === 90) return { x: sourceHeight - 1 - y, y: x };
    if (operation.angle === 180) return { x: sourceWidth - 1 - x, y: sourceHeight - 1 - y };
    return { x: y, y: sourceWidth - 1 - x };
  }

  if (operation.direction === 'horizontal') return { x: sourceWidth - 1 - x, y };
  if (operation.direction === 'vertical') return { x, y: sourceHeight - 1 - y };
  return { x: sourceWidth - 1 - x, y: sourceHeight - 1 - y };
}
