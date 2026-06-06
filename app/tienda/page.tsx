import type { Metadata } from 'next';
import ShopGrid from '@/components/shop/ShopGrid';
import { Reveal } from '@/components/motion/Reveal';
import { fetchProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Tienda',
  description:
    'Explora la colección de pulseras Ágape: cristal y oro inspirados en los Misterios Gozosos, Dolorosos, Gloriosos y Luminosos.',
};

export const revalidate = 120;

export default async function TiendaPage() {
  const products = await fetchProducts();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pt-20 lg:px-8">
      <Reveal className="text-center">
        <p className="section-eyebrow">Tienda Ágape</p>
        <h1 className="mt-4 font-serif text-4xl font-bold text-royal sm:text-5xl lg:text-6xl">
          La Colección
        </h1>
        <div className="gold-divider mt-6" />
        <p className="mx-auto mt-5 max-w-xl text-balance text-royal/65">
          Cada colección honra un conjunto de Misterios del Santo Rosario. Encuentra la
          pieza que acompañe tu oración.
        </p>
      </Reveal>

      <div className="mt-14">
        <ShopGrid products={products} />
      </div>
    </div>
  );
}
