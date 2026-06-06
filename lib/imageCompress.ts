/**
 * Reads an image file and returns a compressed base64 data-URL
 * (downscaled to ≤maxDim px, JPEG) so uploads stay well under
 * MongoDB's document limit and Vercel's request body limit.
 */
export async function fileToCompressedDataUrl(
  file: File,
  maxDim = 1000,
  quality = 0.82
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo procesar la imagen');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', quality);
}
