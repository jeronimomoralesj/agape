import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/adminAuth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Guard the admin area (the login page itself stays public)
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isPublicViewPing =
    request.method === 'POST' && /^\/api\/products\/[^/]+\/view$/.test(pathname);
  const isProtectedApi =
    !isPublicViewPing &&
    ((pathname.startsWith('/api/products') && request.method !== 'GET') ||
      (pathname.startsWith('/api/orders') && request.method === 'GET'));

  if (!isAdminPage && !isProtectedApi) return NextResponse.next();

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const valid = await verifySessionToken(token);
  if (valid) return NextResponse.next();

  if (isProtectedApi) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const loginUrl = new URL('/admin/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/api/products/:path*', '/api/products', '/api/orders'],
};
