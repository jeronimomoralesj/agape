import { NextResponse, type NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/adminAuth';
import { pingIndexNow } from '@/lib/indexnow';

export const dynamic = 'force-dynamic';

// GET /api/blog            → published posts (public)
// GET /api/blog?countOnly  → { count } of published posts (public, drives the nav tab)
// GET /api/blog?all=true   → every post including drafts (admin only)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = request.nextUrl;

    if (searchParams.get('countOnly') === 'true') {
      const count = await BlogPost.countDocuments({ isPublished: true });
      return NextResponse.json({ count });
    }

    let includeDrafts = false;
    if (searchParams.get('all') === 'true') {
      const token = request.cookies.get(ADMIN_COOKIE)?.value;
      includeDrafts = await verifySessionToken(token);
    }

    const query = includeDrafts ? {} : { isPublished: true };
    const posts = await BlogPost.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('GET /api/blog', error);
    return NextResponse.json({ error: 'Error al cargar el blog' }, { status: 500 });
  }
}

// POST /api/blog — protected by middleware
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const post = await BlogPost.create({
      title: body.title,
      content: body.content,
      image: body.image ?? '',
      isPublished: body.isPublished ?? true,
    });
    if (post.isPublished) {
      await pingIndexNow(['/blog', `/blog/${post._id}`, '/sitemap.xml']);
    }
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('POST /api/blog', error);
    return NextResponse.json({ error: 'Error al crear la entrada' }, { status: 400 });
  }
}
