import { dbConnect } from './db';
import ProductModel from '@/models/Product';
import type { Product } from './types';

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
    return JSON.parse(JSON.stringify(docs));
  } catch (error) {
    console.error('fetchProducts: base de datos no disponible', error);
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    await dbConnect();
    const doc = await ProductModel.findOne({ _id: id, isActive: true }).lean();
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  } catch (error) {
    console.error('fetchProductById: base de datos no disponible', error);
    return null;
  }
}
