'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, Search, SearchX, Wand2, X } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/types';
import { BEADS, CORDS, CUSTOM_PRICE } from '@/lib/customBracelet';
import ProductCard from './ProductCard';

/** Always-present "build your own" tile with its own flow (/personalizar). */
function CustomBuilderCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href="/personalizar"
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-oro/40 bg-gradient-to-b from-white/90 via-cielo-100/70 to-oro/10 shadow-card transition-shadow duration-500 hover:shadow-luxe"
      >
        {/* Swatch mosaic */}
        <div className="relative flex aspect-[4/5] flex-col items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute -top-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-oro/15 blur-3xl" />
          <div className="grid max-w-[11rem] grid-cols-5 gap-2 transition-transform duration-700 group-hover:scale-105 sm:max-w-[13rem] sm:gap-2.5">
            {BEADS.slice(0, 10).map((bead) => (
              <span
                key={bead.id}
                className="aspect-square rounded-full shadow-sm"
                style={{
                  background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.7), rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.12)), ${bead.hex}`,
                }}
              />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            {CORDS.map((cord) => (
              <span
                key={cord.id}
                className="h-2 w-10 rounded-full"
                style={{ backgroundColor: cord.hex }}
              />
            ))}
          </div>
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-oro px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-royal-ink shadow-aura-soft sm:left-4 sm:top-4">
            <Wand2 className="h-3 w-3" />
            Personalizable
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3 sm:px-5 sm:pt-4">
          <h3 className="font-serif text-base font-semibold text-royal transition-colors duration-300 group-hover:text-oro-deep sm:text-lg">
            Crea tu pulsera o collar
          </h3>
          <p className="mt-1 hidden text-sm leading-relaxed text-royal/60 sm:block">
            Elige los colores de tus pepas María y Jesús. Con Virgen Milagrosa y crucifijo.
          </p>
          <p className="mt-2 font-serif text-lg font-bold text-royal sm:mt-3 sm:text-xl">
            Desde {formatPrice(CUSTOM_PRICE)}
          </p>
          <span className="btn-gold mt-auto w-full !px-3 !py-2.5 !text-xs">
            <Wand2 className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span className="truncate">Diseñar</span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

type Sort = 'recientes' | 'precio-asc' | 'precio-desc' | 'nombre';

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'nombre', label: 'Nombre A–Z' },
];

function normalize(text: string): string {
  // NFD + strip combining marks so "místico" matches "mistico"
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '');
}

export default function MarketplaceShop({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('recientes');

  const visible = useMemo(() => {
    let list = products;

    const q = normalize(query.trim());
    if (q) {
      list = list.filter(
        (p) => normalize(p.title).includes(q) || normalize(p.description).includes(q)
      );
    }

    const sorted = [...list];
    switch (sort) {
      case 'precio-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'precio-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'nombre':
        sorted.sort((a, b) => a.title.localeCompare(b.title, 'es'));
        break;
      default:
        sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    return sorted;
  }, [products, query, sort]);

  return (
    <section id="tienda" className="scroll-mt-24">
      {/* Toolbar: search + sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-royal/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar pulseras…"
            aria-label="Buscar pulseras"
            className="input-luxe !rounded-full !pl-11 !pr-10"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                onClick={() => setQuery('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-royal/40 transition-colors hover:bg-royal/5 hover:text-royal"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="relative sm:w-60">
          <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-royal/40" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Ordenar productos"
            className="input-luxe w-full appearance-none !rounded-full !pl-11 cursor-pointer"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      <div className="mt-4 flex justify-end">
        <span className="text-xs text-royal/50">
          {visible.length} {visible.length === 1 ? 'pieza' : 'piezas'}
        </span>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-7"
      >
        {/* Always-present custom builder tile */}
        <CustomBuilderCard />
        <AnimatePresence mode="popLayout">
          {visible.map((product, index) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
                delay: Math.min(index * 0.04, 0.25),
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-oro/10">
            <SearchX className="h-7 w-7 text-oro-deep" strokeWidth={1.5} />
          </span>
          <p className="font-serif text-xl text-royal">No encontramos esa pieza</p>
          <p className="max-w-sm text-sm text-royal/60">
            Intenta con otra palabra o explora toda la colección.
          </p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="btn-ghost !py-2.5 !text-xs"
          >
            Ver todo
          </button>
        </motion.div>
      )}
    </section>
  );
}
