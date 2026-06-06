import { ImageResponse } from 'next/og';
import { dbConnect } from '@/lib/db';
import Product from '@/models/Product';
import { absoluteUrl } from '@/lib/seo';

// Per-product share card: photo + price, branded for WhatsApp/social previews
export const alt = 'Pulsera Ágape de cristal y oro';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function formatCop(value: number): string {
  return `$${Math.round(value).toLocaleString('es-CO')}`;
}

interface LeanProduct {
  title: string;
  price: number;
  discount?: number;
  images?: string[];
}

export default async function ProductOgImage({ params }: { params: { id: string } }) {
  let product: LeanProduct | null = null;

  try {
    await dbConnect();
    product = (await Product.findById(params.id)
      .select('title price discount images')
      .lean()) as LeanProduct | null;
  } catch {
    /* fall through to branded fallback */
  }

  const title = product?.title ?? 'Pulseras de cristal y oro';
  const discount = product?.discount ?? 0;
  const price = product ? product.price : null;
  const salePrice = price !== null && discount > 0 ? Math.round(price * (1 - discount / 100)) : null;

  const rawImage = product?.images?.[0];
  const imageSrc = rawImage
    ? rawImage.startsWith('data:')
      ? rawImage // satori renders data-URIs directly
      : absoluteUrl(rawImage)
    : absoluteUrl('/brand/pulseras.jpeg');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(160deg, #E0F2FE 0%, #BAE2FB 100%)',
        }}
      >
        {/* Product photo */}
        <div style={{ display: 'flex', width: 560, height: 630, position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt=""
            width={560}
            height={630}
            style={{ width: 560, height: 630, objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 6,
              height: 630,
              background: 'linear-gradient(180deg, #E8CD6F 0%, #D4AF37 50%, #A8862A 100%)',
            }}
          />
          {discount > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 28,
                left: 28,
                background: '#D4AF37',
                color: '#091740',
                fontSize: 34,
                fontWeight: 700,
                padding: '10px 26px',
                borderRadius: 9999,
              }}
            >
              -{discount}%
            </div>
          )}
        </div>

        {/* Info panel */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 64px',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 320,
              height: 320,
              borderRadius: 9999,
              border: '3px solid rgba(212,175,55,0.4)',
            }}
          />

          <div style={{ fontSize: 58, fontWeight: 700, color: '#1E3A8A', letterSpacing: 4 }}>
            ÁGAPE
          </div>
          <div
            style={{
              fontSize: 19,
              letterSpacing: 8,
              color: '#0E7490',
              fontWeight: 700,
              marginTop: 6,
            }}
          >
            AMAR COMO DIOS NOS AMA
          </div>

          <div
            style={{
              width: 170,
              height: 4,
              background:
                'linear-gradient(90deg, #D4AF37 0%, rgba(212,175,55,0.15) 100%)',
              marginTop: 30,
              marginBottom: 30,
            }}
          />

          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: '#16306F',
              lineHeight: 1.15,
              maxHeight: 180,
              overflow: 'hidden',
            }}
          >
            {title.length > 52 ? `${title.slice(0, 52)}…` : title}
          </div>

          {price !== null && (
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 18,
                marginTop: 30,
              }}
            >
              <div style={{ fontSize: 56, fontWeight: 700, color: '#A8862A' }}>
                {formatCop(salePrice ?? price)}
              </div>
              {salePrice !== null && (
                <div
                  style={{
                    fontSize: 34,
                    color: 'rgba(22,48,111,0.45)',
                    textDecoration: 'line-through',
                  }}
                >
                  {formatCop(price)}
                </div>
              )}
              <div style={{ fontSize: 26, color: 'rgba(22,48,111,0.6)' }}>COP</div>
            </div>
          )}

          <div style={{ fontSize: 23, color: 'rgba(22,48,111,0.65)', marginTop: 28 }}>
            Cristal y baño de oro 18k · Envíos a toda Colombia 🇨🇴
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
