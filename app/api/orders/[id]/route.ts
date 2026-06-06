import { NextResponse, type NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/models/Order';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

// PATCH /api/orders/:id — update order status (admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    await dbConnect();
    const { status } = await request.json();
    if (!['Pending', 'Processing', 'Shipped'].includes(status)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
    }
    const order = await Order.findByIdAndUpdate(params.id, { status }, { new: true }).lean();
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error('PATCH /api/orders/[id]', error);
    return NextResponse.json({ error: 'Error al actualizar el pedido' }, { status: 500 });
  }
}
