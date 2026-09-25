import {
  detectGeometryMimeFromHeader,
  validateGeometryDimensions,
  validateGeometryFile,
  type GeometryValidation,
} from './image-geometry';

export type ImageRotationAngle = 90 | 180 | 270;
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

export const IMAGE_TRANSFORM_OUTPUT_MIME = 'image/png';
export const ACCEPTED_IMAGE_TRANSFORM_TYPES = '.png,.jpg,.jpeg,.webp,.gif,.svg,image/png,image/jpeg,image/webp,image/gif,image/svg+xml';

export function validateImageTransformDimensions(width: number, height: number): GeometryValidation {
  return validateGeometryDimensions(width, height);
}

export function validateImageTransformFile(file: File, detectedMimeType: string) {
  return validateGeometryFile(file, detectedMimeType);
}

export function verifyPngOutputSignature(header: Uint8Array) {
  return detectGeometryMimeFromHeader(header) === IMAGE_TRANSFORM_OUTPUT_MIME;
}

export function getImageTransformPlan(sourceWidth: number, sourceHeight: number, operation: ImageTransformOperation): ImageTransformPlan {
  if (operation.type === 'rotate') {
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
    if (operation.angle === 90) return { x: sourceHeight - 1 - y, y: x };
    if (operation.angle === 180) return { x: sourceWidth - 1 - x, y: sourceHeight - 1 - y };
    return { x: y, y: sourceWidth - 1 - x };
  }

  if (operation.direction === 'horizontal') return { x: sourceWidth - 1 - x, y };
  if (operation.direction === 'vertical') return { x, y: sourceHeight - 1 - y };
  return { x: sourceWidth - 1 - x, y: sourceHeight - 1 - y };
}
