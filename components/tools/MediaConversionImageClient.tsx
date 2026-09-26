'use client';
import ImageConverter from './media-conversion/ImageConverter';
export default function MediaConversionImageClient(props: Parameters<typeof ImageConverter>[0]) { return <ImageConverter {...props} />; }
