import { NextResponse, type NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { pingIndexNow } from '@/lib/indexnow';

export const dynamic = 'force-dynamic';

interface Params {
  params: { id: string };
}

// GET /api/blog/:id — public (published posts only)
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const post = await BlogPost.findOne({ _id: params.id, isPublished: true }).lean();
    if (!post) {
      return NextResponse.json({ error: 'Entrada no encontrada' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error('GET /api/blog/[id]', error);
    return NextResponse.json({ error: 'Error al cargar la entrada' }, { status: 500 });
  }
}

// PUT /api/blog/:id — protected by middleware
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const body = await request.json();

    // The admin form receives the lightweight URL (/api/blog/:id/image) instead
    // of raw base64 — swap it back to the stored image when saving.
    let image: string = body.image ?? '';
    if (image.endsWith(`/api/blog/${params.id}/image`) || image === `/api/blog/${params.id}/image`) {
      const existing = await BlogPost.findById(params.id).select('image').lean();
      image = existing?.image ?? '';
    }

    const post = await BlogPost.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        content: body.content,
        image,
        isPublished: body.isPublished,
      },
      { new: true, runValidators: true }
    ).lean();
    if (!post) {
      return NextResponse.json({ error: 'Entrada no encontrada' }, { status: 404 });
    }
    await pingIndexNow(['/blog', `/blog/${params.id}`, '/sitemap.xml']);
    return NextResponse.json(post);
  } catch (error) {
    console.error('PUT /api/blog/[id]', error);
    return NextResponse.json({ error: 'Error al actualizar la entrada' }, { status: 400 });
  }
}

// DELETE /api/blog/:id — protected by middleware
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const post = await BlogPost.findByIdAndDelete(params.id).lean();
    if (!post) {
      return NextResponse.json({ error: 'Entrada no encontrada' }, { status: 404 });
    }
    await pingIndexNow(['/blog', '/sitemap.xml']);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/blog/[id]', error);
    return NextResponse.json({ error: 'Error al eliminar la entrada' }, { status: 500 });
  }
}
