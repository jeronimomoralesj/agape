import { NextResponse, type NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/models/Product';
import { pingIndexNow } from '@/lib/indexnow';

export const dynamic = 'force-dynamic';

interface Params {
  params: { id: string };
}

// GET /api/products/:id
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id).lean();
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('GET /api/products/[id]', error);
    return NextResponse.json({ error: 'Error al cargar el producto' }, { status: 500 });
  }
}

// PUT /api/products/:id — protected by middleware
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const body = await request.json();
    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        description: body.description,
        price: body.price,
        discount: body.discount ?? 0,
        images: Array.isArray(body.images) ? body.images.slice(0, 4) : body.images,
        stock: body.stock,
        isActive: body.isActive,
      },
      { new: true, runValidators: true }
    ).lean();
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    await pingIndexNow(['/', `/producto/${params.id}`, '/sitemap.xml']);
    return NextResponse.json(product);
  } catch (error) {
    console.error('PUT /api/products/[id]', error);
    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 400 });
  }
}

// DELETE /api/products/:id — protected by middleware
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const product = await Product.findByIdAndDelete(params.id).lean();
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    await pingIndexNow(['/', '/sitemap.xml']);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/products/[id]', error);
    return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 });
  }
}
