'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import type { Category, Product } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import ProductCard from './ProductCard';

type Filter = 'Todos' | Category;
const FILTERS: Filter[] = ['Todos', ...CATEGORIES];

export default function ShopGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>('Todos');

  const visible = useMemo(
    () => (filter === 'Todos' ? products : products.filter((p) => p.category === filter)),
    [products, filter]
  );

  return (
    <div>
      {/* Filter pills with a gliding active indicator */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`relative rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-300 sm:px-6 ${
              filter === item ? 'text-royal-ink' : 'text-royal/60 hover:text-royal'
            }`}
          >
            {filter === item && (
              <motion.span
                layoutId="shop-filter-pill"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-oro-light to-oro shadow-aura-soft"
              />
            )}
            <span className="relative">{item}</span>
          </button>
        ))}
      </div>

      {/* Grid with layout-animated reflow */}
      <motion.div layout className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
        <AnimatePresence mode="popLayout">
          {visible.map((product, index) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: Math.min(index * 0.06, 0.4),
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-oro/10">
            <SearchX className="h-7 w-7 text-oro-deep" strokeWidth={1.5} />
          </span>
          <p className="font-serif text-xl text-royal">
            Aún no hay pulseras en esta colección
          </p>
          <p className="max-w-sm text-sm text-royal/60">
            Muy pronto nuevas piezas inspiradas en los Misterios {filter !== 'Todos' ? filter : ''} llegarán a la tienda.
          </p>
        </motion.div>
      )}
    </div>
  );
}
