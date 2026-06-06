import { NextResponse, type NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// GET /api/products?all=true
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = request.nextUrl;
    const includeInactive = searchParams.get('all') === 'true';

    const query: Record<string, unknown> = {};
    if (!includeInactive) query.isActive = true;

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET /api/products', error);
    return NextResponse.json({ error: 'Error al cargar los productos' }, { status: 500 });
  }
}

// POST /api/products — protected by middleware
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const product = await Product.create({
      title: body.title,
      description: body.description,
      price: body.price,
      discount: body.discount ?? 0,
      images: (body.images ?? []).slice(0, 4),
      stock: body.stock ?? 0,
      isActive: body.isActive ?? true,
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('POST /api/products', error);
    return NextResponse.json({ error: 'Error al crear el producto' }, { status: 400 });
  }
}
