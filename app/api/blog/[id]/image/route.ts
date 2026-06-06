import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

// GET /api/blog/:id/image — serves a post's base64 cover image as real bytes
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const post = await BlogPost.findById(params.id).select('image').lean();
    const image = post?.image;
    if (!image) {
      return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 });
    }
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
    console.error('GET /api/blog/[id]/image', error);
    return NextResponse.json({ error: 'Error al cargar la imagen' }, { status: 500 });
  }
}
