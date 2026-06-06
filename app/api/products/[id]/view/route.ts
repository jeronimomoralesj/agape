import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// POST /api/products/:id/view — public, fired from the product page on mount.
// Counts a page view for the admin analytics.
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    await Product.updateOne({ _id: params.id }, { $inc: { views: 1 } });
    return NextResponse.json({ ok: true });
  } catch {
    // View tracking must never break the page
    return NextResponse.json({ ok: false });
  }
}
