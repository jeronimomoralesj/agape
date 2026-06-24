import { NextResponse, type NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db';
import Pepa from '@/models/Pepa';
import { toPepaRecord } from '@/lib/pepas';

export const dynamic = 'force-dynamic';

interface Params {
  params: { id: string };
}

// PUT /api/pepas/:id — protected by middleware.
// Note: the `slug` is intentionally left unchanged on rename so existing
// orders and carts keep resolving this color.
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const body = await request.json();

    const update: Record<string, unknown> = {};
    if (body.name !== undefined) update.name = body.name;
    if (body.hex !== undefined) update.hex = body.hex;
    if (body.light !== undefined) update.light = !!body.light;
    if (body.kind !== undefined) update.kind = body.kind === 'jesus' ? 'jesus' : 'maria';
    if (body.stock !== undefined) update.stock = Math.max(0, Number(body.stock) || 0);
    if (body.isActive !== undefined) update.isActive = body.isActive;

    const pepa = await Pepa.findByIdAndUpdate(params.id, update, {
      new: true,
      runValidators: true,
    }).lean();
    if (!pepa) {
      return NextResponse.json({ error: 'Color no encontrado' }, { status: 404 });
    }
    return NextResponse.json(toPepaRecord(pepa));
  } catch (error) {
    console.error('PUT /api/pepas/[id]', error);
    return NextResponse.json(
      {
        error: 'Error al actualizar el color',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }
}

// DELETE /api/pepas/:id — protected by middleware
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const pepa = await Pepa.findByIdAndDelete(params.id).lean();
    if (!pepa) {
      return NextResponse.json({ error: 'Color no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/pepas/[id]', error);
    return NextResponse.json({ error: 'Error al eliminar el color' }, { status: 500 });
  }
}
