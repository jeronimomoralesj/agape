'use client';

import Image, { type ImageProps } from 'next/image';

/**
 * next/image can't run base64 data-URLs (admin uploads) through the optimizer.
 * This wrapper switches to `unoptimized` for data: sources and behaves like a
 * regular <Image> for everything else.
 */
export default function SmartImage(props: ImageProps) {
  const isDataUrl = typeof props.src === 'string' && props.src.startsWith('data:');
  return <Image {...props} unoptimized={isDataUrl || props.unoptimized} />;
}
