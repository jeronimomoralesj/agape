import { NextResponse, type NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// GET /api/orders — protected by middleware (admin only)
export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('GET /api/orders', error);
    return NextResponse.json({ error: 'Error al cargar los pedidos' }, { status: 500 });
  }
}

// POST /api/orders — public checkout (no payment gateway yet)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const { customerDetails, items } = body ?? {};
    if (
      !customerDetails?.name ||
      !customerDetails?.email ||
      !customerDetails?.phone ||
      !customerDetails?.address ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json({ error: 'Datos del pedido incompletos' }, { status: 400 });
    }

    // Re-price every item from the database — never trust client prices
    const ids = items.map((i: { productId: string }) => i.productId);
    const products = await Product.find({ _id: { $in: ids }, isActive: true }).lean();
    const byId = new Map(products.map((p) => [String(p._id), p]));

    const orderItems = [];
    let total = 0;
    for (const item of items) {
      const product = byId.get(String(item.productId));
      if (!product) {
        return NextResponse.json(
          { error: 'Uno de los productos ya no está disponible' },
          { status: 400 }
        );
      }
      const quantity = Math.max(1, Math.min(Number(item.quantity) || 1, product.stock));
      if (product.stock < 1) {
        return NextResponse.json(
          { error: `"${product.title}" está agotado` },
          { status: 400 }
        );
      }
      // Charge the discounted price when a discount is active
      const discount = (product as { discount?: number }).discount ?? 0;
      const unitPrice =
        discount > 0 ? Math.round(product.price * (1 - discount / 100)) : product.price;
      orderItems.push({
        productId: product._id,
        title: product.title,
        quantity,
        price: unitPrice,
      });
      total += unitPrice * quantity;
    }

    const orderNumber = `AGP-${Date.now().toString(36).toUpperCase()}${Math.floor(
      Math.random() * 900 + 100
    )}`;

    const order = await Order.create({
      orderNumber,
      customerDetails: {
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        address: customerDetails.address,
      },
      items: orderItems,
      total,
      status: 'Pending',
    });

    // Decrement stock for each purchased item
    await Promise.all(
      orderItems.map((item) =>
        Product.updateOne({ _id: item.productId }, { $inc: { stock: -item.quantity } })
      )
    );

    return NextResponse.json(
      { orderNumber: order.orderNumber, total: order.total },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/orders', error);
    return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 });
  }
}
