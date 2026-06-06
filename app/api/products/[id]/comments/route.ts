import { NextResponse, type NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db';
import Comment from '@/models/Comment';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

interface Params {
  params: { id: string };
}

// GET /api/products/:id/comments — public
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const comments = await Comment.find({ productId: params.id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return NextResponse.json(comments);
  } catch (error) {
    console.error('GET /api/products/[id]/comments', error);
    return NextResponse.json({ error: 'Error al cargar los comentarios' }, { status: 500 });
  }
}

// POST /api/products/:id/comments — public (anyone can leave a comment)
export async function POST(request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const body = await request.json();

    const name = String(body.name ?? '').trim().slice(0, 60);
    const message = String(body.message ?? '').trim().slice(0, 500);
    if (name.length < 2 || message.length < 2) {
      return NextResponse.json(
        { error: 'Escribe tu nombre y un comentario' },
        { status: 400 }
      );
    }

    const product = await Product.exists({ _id: params.id });
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const comment = await Comment.create({ productId: params.id, name, message });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('POST /api/products/[id]/comments', error);
    return NextResponse.json({ error: 'Error al publicar el comentario' }, { status: 500 });
  }
}
