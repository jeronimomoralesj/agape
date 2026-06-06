import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, createSessionToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

// POST /api/admin/login — exchanges the admin password for a signed session cookie
export async function POST(request: NextRequest) {
  const { password } = await request.json().catch(() => ({ password: '' }));
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD no está configurada en el servidor' },
      { status: 500 }
    );
  }

  if (password !== expected) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return response;
}

// DELETE /api/admin/login — logout
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}
