'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/shop/ProductCard';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';

export default function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="section-eyebrow">La colección</p>
          <h2 className="mt-4 font-serif text-4xl font-bold text-royal sm:text-5xl">
            Piezas que acompañan tu oración
          </h2>
          <div className="gold-divider mt-6" />
          <p className="mx-auto mt-5 max-w-xl text-royal/65">
            Cristales delicados y detalles en oro, inspirados en cada misterio del
            Santo Rosario.
          </p>
        </Reveal>

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-8">
          {products.map((product) => (
            <StaggerItem key={product._id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal delay={0.15} className="mt-14 text-center">
          <Link href="/tienda" className="btn-ghost group">
            Ver toda la colección
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
