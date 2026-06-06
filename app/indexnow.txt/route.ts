import { NextResponse } from 'next/server';

// Serves the IndexNow verification key at /indexnow.txt
export async function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return new NextResponse('IndexNow no configurado', { status: 404 });
  }
  return new NextResponse(key, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
