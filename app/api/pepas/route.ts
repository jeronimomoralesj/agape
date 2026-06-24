import { NextResponse, type NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db';
import Pepa from '@/models/Pepa';
import { getPepas, slugifyPepa, toPepaRecord } from '@/lib/pepas';

function errorDetail(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export const dynamic = 'force-dynamic';

// GET /api/pepas            → active colors (public, used by the configurator)
// GET /api/pepas?all=true   → every color incl. inactive (admin)
export async function GET(request: NextRequest) {
  try {
    const includeInactive = request.nextUrl.searchParams.get('all') === 'true';
    const pepas = await getPepas(includeInactive);
    return NextResponse.json(pepas);
  } catch (error) {
    console.error('GET /api/pepas', error);
    return NextResponse.json(
      { error: 'Error al cargar los colores', detail: errorDetail(error) },
      { status: 500 }
    );
  }
}

// POST /api/pepas — protected by middleware
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Derive a stable, unique slug from the name
    const base = slugifyPepa(body.name || 'pepa');
    let slug = base;
    let n = 2;
    while (await Pepa.exists({ slug })) slug = `${base}-${n++}`;

    const order = await Pepa.estimatedDocumentCount();
    const pepa = await Pepa.create({
      slug,
      name: body.name,
      hex: body.hex,
      light: !!body.light,
      kind: body.kind === 'jesus' ? 'jesus' : 'maria',
      stock: Math.max(0, Number(body.stock) || 0),
      isActive: body.isActive ?? true,
      order,
    });
    return NextResponse.json(toPepaRecord(pepa.toObject()), { status: 201 });
  } catch (error) {
    console.error('POST /api/pepas', error);
    return NextResponse.json(
      { error: 'Error al crear el color', detail: errorDetail(error) },
      { status: 400 }
    );
  }
}
