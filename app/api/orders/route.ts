import { NextResponse, type NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import {
  configPrice,
  customProductId,
  customTitle,
  findCord,
  findDije,
  findMetal,
  findSeparator,
  sanitizeNames,
  DEFAULT_DIJE_ID,
  MIN_NAMES,
  type CustomConfig,
  type ProductType,
} from '@/lib/customBracelet';
import { getPepas } from '@/lib/pepas';

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

    // Split personalized bracelets from catalog products
    const customItems = items.filter((i: { custom?: unknown }) => i.custom);
    const catalogItems = items.filter((i: { custom?: unknown }) => !i.custom);

    // Re-price every item server-side — never trust client prices
    const ids = catalogItems.map((i: { productId: string }) => i.productId);
    const products = await Product.find({ _id: { $in: ids }, isActive: true }).lean();
    const byId = new Map(products.map((p) => [String(p._id), p]));

    const orderItems = [];
    const stockDecrements = [];
    let total = 0;

    // Available pepa colors (admin-managed) — only needed for custom pieces
    const pepaMap =
      customItems.length > 0
        ? new Map((await getPepas(false)).map((p) => [p.id, p]))
        : new Map();

    // Custom "Crea tu pulsera / collar" items — validated against the live catalog
    for (const item of customItems) {
      const raw = item.custom ?? {};
      const type: ProductType =
        raw.type === 'collar'
          ? 'collar'
          : raw.type === 'nombres'
            ? 'nombres'
            : raw.type === 'colombia'
              ? 'colombia'
              : 'pulsera';

      // The "Pulsera Colombia" has fixed flag colors — only the separator varies.
      const separatorId: string | undefined =
        type === 'colombia' ? findSeparator(raw.separatorId).id : undefined;

      // Resolve the two colors, tolerating legacy single-list carts.
      const legacyFirst = Array.isArray(raw.beadIds) ? raw.beadIds[0] : raw.beadId;
      const mariaId: string | undefined = raw.mariaId ?? legacyFirst ?? separatorId;
      const jesusId: string | undefined =
        raw.jesusId ?? (Array.isArray(raw.beadIds) ? raw.beadIds[1] : undefined) ?? mariaId;
      const cordId: string | undefined =
        type === 'pulsera' || type === 'colombia' ? raw.cordId : undefined;
      // Collar centerpiece medal — fall back to the default for legacy carts.
      const dijeId: string | undefined =
        type === 'collar' ? (findDije(raw.dijeId)?.id ?? DEFAULT_DIJE_ID) : undefined;
      // Name necklace — clean the names server-side and pick a valid metal.
      const names = type === 'nombres' ? sanitizeNames(raw.names) : undefined;
      const metalId = type === 'nombres' ? findMetal(raw.metalId).id : undefined;

      // The Colombia edition has no admin-managed pepa colors to validate.
      const colorsOk =
        type === 'colombia' ||
        (!!mariaId && !!jesusId && pepaMap.has(mariaId) && pepaMap.has(jesusId));
      const cordOk = type !== 'pulsera' || !!findCord(cordId);
      const namesOk = type !== 'nombres' || (!!names && names.length >= MIN_NAMES);
      if (!colorsOk || !cordOk || !namesOk) {
        return NextResponse.json(
          { error: 'Configuración personalizada inválida' },
          { status: 400 }
        );
      }

      const quantity = Math.max(1, Math.min(Number(item.quantity) || 1, 10));
      const config: CustomConfig = {
        type,
        mariaId: mariaId!,
        jesusId: jesusId!,
        cordId,
        dijeId,
        names,
        metalId,
        separatorId,
      };
      const price = configPrice(config);
      orderItems.push({
        productId: customProductId(config),
        title: customTitle(config, (id) => pepaMap.get(id)),
        quantity,
        price,
      });
      total += price * quantity;
    }

    for (const item of catalogItems) {
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
        productId: String(product._id),
        title: product.title,
        quantity,
        price: unitPrice,
      });
      stockDecrements.push({ productId: product._id, quantity });
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

    // Decrement stock for catalog items only (custom pieces are made to order)
    await Promise.all(
      stockDecrements.map((item) =>
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
