import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductDetails from '@/components/shop/ProductDetails';
import { fetchProductById } from '@/lib/products';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchProductById(params.id);
  if (!product) return { title: 'Producto no encontrado' };
  return {
    title: product.title,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductoPage({ params }: Props) {
  const product = await fetchProductById(params.id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 lg:px-8">
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
