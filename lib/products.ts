import { dbConnect } from './db';
import ProductModel from '@/models/Product';
import type { Product } from './types';

/**
 * Replaces stored base64 images with their lightweight public URLs
 * (/api/products/:id/image/:n). Keeps pages and API responses small —
 * shipping megabytes of base64 in JSON/HTML is what makes everything slow.
 */
export function toPublicImages<T extends { _id: unknown; images?: string[] }>(
  product: T
): T {
  return {
    ...product,
    images: (product.images ?? []).map((img, i) =>
      img.startsWith('data:') ? `/api/products/${String(product._id)}/image/${i}` : img
    ),
  };
}

/**
 * Server-side product fetch with graceful degradation: if the database is not
 * configured/reachable (e.g. first local run without .env.local) the storefront
 * still renders, just without products.
 */
export async function fetchProducts(limit?: number): Promise<Product[]> {
  try {
    await dbConnect();
    const query = ProductModel.find({ isActive: true }).sort({ createdAt: -1 });
    if (limit) query.limit(limit);
    const docs = await query.lean();
    return JSON.parse(JSON.stringify(docs)).map(toPublicImages);
  } catch (error) {
    console.error('fetchProducts: base de datos no disponible', error);
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    await dbConnect();
    const doc = await ProductModel.findOne({ _id: id, isActive: true }).lean();
    return doc ? toPublicImages(JSON.parse(JSON.stringify(doc))) : null;
  } catch (error) {
    console.error('fetchProductById: base de datos no disponible', error);
    return null;
  }
}
