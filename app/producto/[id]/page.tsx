import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductDetails from '@/components/shop/ProductDetails';
import ViewTracker from '@/components/shop/ViewTracker';
import JsonLd from '@/components/seo/JsonLd';
import { fetchProductById } from '@/lib/products';
import {
  SITE_URL,
  breadcrumbJsonLd,
  productImageUrl,
  productJsonLd,
  productUrl,
} from '@/lib/seo';
import { finalPrice } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchProductById(params.id);
  if (!product) return { title: 'Producto no encontrado', robots: { index: false } };

  const title = `${product.title} | Pulsera Católica de Cristal y Oro`;
  const description = `${product.description.slice(0, 140)} Compra en línea con envío a toda Colombia.`;
  const image = productImageUrl(product, 0);

  return {
    title,
    description,
    alternates: { canonical: `/producto/${product._id}` },
    openGraph: {
      type: 'website',
      locale: 'es_CO',
      url: productUrl(product),
      title,
      description,
      // og:image comes from app/producto/[id]/opengraph-image.tsx
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    other: {
      'product:price:amount': String(finalPrice(product)),
      'product:price:currency': 'COP',
      'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
    },
  };
}

export default async function ProductoPage({ params }: Props) {
  const product = await fetchProductById(params.id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 lg:px-8">
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Tienda', url: SITE_URL },
          { name: product.title, url: productUrl(product) },
        ])}
      />
      <ViewTracker productId={product._id} />
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-sm font-medium text-royal/60 transition-colors hover:text-royal"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Volver a la tienda
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} title={product.title} />
        <ProductDetails product={product} />
      </div>
    </div>
  );
}
