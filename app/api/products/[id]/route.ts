import { NextResponse, type NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/models/Product';
import { pingIndexNow } from '@/lib/indexnow';
import { toPublicImages } from '@/lib/products';

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
    return NextResponse.json(toPublicImages(product));
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

    // The admin form receives lightweight URLs (/api/products/:id/image/:n)
    // instead of raw base64. When saving, swap those references back to the
    // stored base64 so existing images survive edits/reordering.
    let images = body.images;
    if (Array.isArray(images)) {
      const existing = await Product.findById(params.id).select('images').lean();
      const selfRef = new RegExp(`/api/products/${params.id}/image/(\\d+)$`);
      images = images.slice(0, 4).map((img: string) => {
        const match = typeof img === 'string' ? img.match(selfRef) : null;
        const original = match ? existing?.images?.[Number(match[1])] : undefined;
        return original ?? img;
      });
    }

    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        description: body.description,
        price: body.price,
        discount: body.discount ?? 0,
        images,
        stock: body.stock,
        isActive: body.isActive,
      },
      { new: true, runValidators: true }
    ).lean();
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    await pingIndexNow(['/', `/producto/${params.id}`, '/sitemap.xml']);
    return NextResponse.json(toPublicImages(product));
  } catch (error) {
    console.error('PUT /api/products/[id]', error);
    return NextResponse.json(
      {
        error: 'Error al actualizar el producto',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
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
