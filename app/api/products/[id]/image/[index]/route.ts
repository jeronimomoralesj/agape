import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/models/Product';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products/:id/image/:index — serves a stored base64 product image
 * as real image bytes. This gives Google Shopping, social cards, and image
 * search a public, crawlable URL for admin-uploaded images.
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string; index: string } }
) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id).select('images').lean();
    const image = product?.images?.[Number(params.index)];
    if (!image) {
      return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 });
    }

    // Regular URL (e.g. /brand/pulseras.jpeg) → redirect to the asset
    if (!image.startsWith('data:')) {
      return NextResponse.redirect(absoluteUrl(image), 301);
    }

    const match = image.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: 'Formato de imagen inválido' }, { status: 422 });
    }

    const [, mime, base64] = match;
    const buffer = Buffer.from(base64, 'base64');
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mime,
        'Content-Length': String(buffer.length),
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('GET /api/products/[id]/image/[index]', error);
    return NextResponse.json({ error: 'Error al cargar la imagen' }, { status: 500 });
  }
}
