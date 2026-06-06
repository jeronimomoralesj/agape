'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/types';
import { useCart } from '@/components/cart/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);

  const primaryImage = product.images[0] ?? '/brand/pulseras.jpeg';
  const secondaryImage = product.images[1]; // revealed on hover when available
  const soldOut = product.stock < 1;

  return (
    <motion.article
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative overflow-hidden rounded-3xl border border-oro/15 bg-white/80 shadow-card transition-shadow duration-500 hover:shadow-luxe"
    >
      <Link href={`/producto/${product._id}`} className="block">
        {/* Image with zoom + secondary-angle crossfade */}
        <div className="relative aspect-[4/5] overflow-hidden bg-cielo-100">
          <motion.div
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={primaryImage}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
            {secondaryImage && (
              <motion.div
                initial={false}
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Image
                  src={secondaryImage}
                  alt={`${product.title} — vista alternativa`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </motion.div>
            )}
          </motion.div>

          {/* Category ribbon */}
          <span className="absolute left-4 top-4 rounded-full border border-oro/40 bg-cielo-50/85 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-royal backdrop-blur-sm">
            {product.category}
          </span>

          {soldOut && (
            <span className="absolute right-4 top-4 rounded-full bg-royal-ink/85 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cielo-100">
              Agotado
            </span>
          )}

          {/* Hover veil: "Explorar significado" */}
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-royal-ink/70 via-royal-ink/10 to-transparent pb-6"
          >
            <motion.span
              animate={{ y: hovered ? 0 : 16, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 rounded-full border border-oro/60 bg-cielo-50/90 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-royal backdrop-blur-sm"
            >
              <Eye className="h-3.5 w-3.5" />
              Explorar significado
            </motion.span>
          </motion.div>
        </div>

        {/* Info */}
        <div className="px-5 pb-5 pt-4">
          <h3 className="line-clamp-1 font-serif text-lg font-semibold text-royal transition-colors duration-300 group-hover:text-oro-deep">
            {product.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-royal/60">
            {product.description}
          </p>
          <p className="mt-3 font-serif text-xl font-bold text-royal">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>

      {/* Quick add */}
      <div className="px-5 pb-5">
        <button
          type="button"
          disabled={soldOut}
          onClick={() => addItem(product)}
          className="btn-gold w-full !py-2.5 !text-xs disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={2} />
          {soldOut ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    </motion.article>
  );
}
