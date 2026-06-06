import { NextResponse, type NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/models/Product';
import { DEFAULT_DESCRIPTION, SITE_NAME, escapeXml } from '@/lib/seo';
import { finalPrice } from '@/lib/types';
import type { Product as ProductType } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * GET /feed/google-shopping.xml
 * RSS 2.0 product feed for Google Merchant Center (Google Shopping).
 * Register it in Merchant Center → Products → Feeds → Scheduled fetch.
 * Bing/Microsoft Shopping accepts the same format in Merchant Center de Microsoft.
 */
export async function GET(request: NextRequest) {
  // Base URL: prefer the configured canonical domain; otherwise derive it from
  // the request so the feed never emits localhost/invalid URLs.
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  const proto = request.headers.get('x-forwarded-proto') ?? 'https';
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const base = configured && !configured.includes('localhost')
    ? configured
    : `${proto}://${host}`;

  const productUrl = (p: { _id: string }) => `${base}/producto/${p._id}`;
  const productImageUrl = (p: { _id: string; images: string[] }, index: number) => {
    const image = p.images[index];
    if (!image) return `${base}/brand/pulseras.jpeg`;
    if (image.startsWith('data:')) return `${base}/api/products/${p._id}/image/${index}`;
    return image.startsWith('http') ? image : `${base}${image}`;
  };
  let products: ProductType[] = [];
  try {
    await dbConnect();
    const docs = await Product.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    products = JSON.parse(JSON.stringify(docs));
  } catch (error) {
    console.error('google-shopping feed: base de datos no disponible', error);
  }

  const items = products
    .map((product) => {
      const discounted = finalPrice(product);
      const hasDiscount = discounted < product.price;
      const extraImages = product.images
        .slice(1, 4)
        .map(
          (_, i) =>
            `      <g:additional_image_link>${escapeXml(
              productImageUrl(product, i + 1)
            )}</g:additional_image_link>`
        )
        .join('\n');

      return `    <item>
      <g:id>${escapeXml(product._id)}</g:id>
      <g:title>${escapeXml(product.title)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>${escapeXml(productUrl(product))}</g:link>
      <g:image_link>${escapeXml(productImageUrl(product, 0))}</g:image_link>
${extraImages ? `${extraImages}\n` : ''}      <g:availability>${
        product.stock > 0 ? 'in_stock' : 'out_of_stock'
      }</g:availability>
      <g:price>${product.price.toFixed(2)} COP</g:price>
${hasDiscount ? `      <g:sale_price>${discounted.toFixed(2)} COP</g:sale_price>\n` : ''}      <g:condition>new</g:condition>
      <g:brand>${SITE_NAME}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>191</g:google_product_category>
      <g:product_type>Joyería &gt; Pulseras religiosas</g:product_type>
      <g:gender>unisex</g:gender>
      <g:age_group>adult</g:age_group>
      <g:is_bundle>no</g:is_bundle>
      <g:shipping>
        <g:country>CO</g:country>
        <g:service>Estándar</g:service>
        <g:price>0.00 COP</g:price>
      </g:shipping>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml(`${SITE_NAME} — Pulseras católicas de cristal y oro`)}</title>
    <link>${base}</link>
    <description>${escapeXml(DEFAULT_DESCRIPTION)}</description>
${items}
  </channel>
</rss>
`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=900, s-maxage=3600', // crawlers refetch hourly
    },
  });
}
