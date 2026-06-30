'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { formatPrice } from '@/lib/types';
import {
  CORDS,
  COLOMBIA_EDITION,
  COLOMBIA_FLAG,
  COLOMBIA_PATTERNS,
  CUSTOM_PRICES,
  DEFAULT_PATTERN_ID,
  DEFAULT_SEPARATOR_ID,
  SEPARATORS,
  customTitle,
  findSeparator,
  type CustomConfig,
} from '@/lib/customBracelet';
import { PulseraColombiaPreview } from './pulseraArt';

export default function ColombiaStudio() {
  const { addCustomItem } = useCart();
  const [patternId, setPatternId] = useState(DEFAULT_PATTERN_ID);
  const [separatorId, setSeparatorId] = useState(DEFAULT_SEPARATOR_ID);
  const [cordId, setCordId] = useState(CORDS[0].id);
  const [added, setAdded] = useState(false);

  const separator = findSeparator(separatorId);
  const cord = CORDS.find((c) => c.id === cordId) ?? CORDS[0];

  const handleAdd = () => {
    const config: CustomConfig = {
      type: 'colombia',
      // Flag colors are fixed; mirror the separator into the pepa slots so the
      // shared cart/config plumbing always has defined values.
      mariaId: separatorId,
      jesusId: separatorId,
      separatorId,
      patternId,
      cordId,
    };
    addCustomItem(config, {
      title: customTitle(config),
      cordHex: cord.hex,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const price = CUSTOM_PRICES.colombia;

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
      {/* ── Live preview ── */}
      <div className="sticky top-14 z-20 min-w-0 self-start sm:top-16 lg:top-24">
        <div className="rounded-3xl border border-oro/20 bg-gradient-to-b from-white/90 to-cielo-100/80 p-3 shadow-luxe backdrop-blur-md sm:rounded-[2rem] sm:p-8">
          <div className="mx-auto max-w-[170px] sm:max-w-[280px] lg:max-w-sm">
            <PulseraColombiaPreview
              separatorHex={separator.hex}
              separatorLight={!!separator.light}
              cordHex={cord.hex}
              patternId={patternId}
            />
          </div>
          <div className="mt-2 text-center sm:mt-4">
            <div className="flex flex-wrap items-center justify-center gap-3 px-2">
              {COLOMBIA_FLAG.map((c) => (
                <span key={c.id} className="flex items-center gap-1.5">
                  <span
                    title={c.name}
                    className="h-3.5 w-3.5 rounded-full ring-1 ring-royal/15"
                    style={{
                      background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.7), rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.12)), ${c.hex}`,
                    }}
                  />
                  <span className="text-[0.65rem] text-royal/55">{c.name}</span>
                </span>
              ))}
            </div>
            <p className="mt-1.5 truncate px-2 text-[0.65rem] text-royal/55 sm:text-xs">
              Cordón {cord.name} · Virgen Milagrosa y crucifijo
            </p>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="min-w-0 space-y-4">
        {/* Limited-edition banner */}
        <div className="flex items-center gap-3 rounded-3xl border border-oro/30 bg-gradient-to-br from-oro/10 to-white/70 px-5 py-4 shadow-card">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-oro-light to-oro text-royal-ink shadow-aura-soft">
            <Star className="h-4 w-4" strokeWidth={2} />
          </span>
          <p className="text-sm font-semibold text-royal">
            {COLOMBIA_EDITION}
            <span className="mt-0.5 block text-xs font-normal text-royal/60">
              Lleva la bandera puesta hasta el final del Mundial. ¡Vamos, Colombia! 🇨🇴
            </span>
          </p>
        </div>

        {/* Pattern */}
        <div className="rounded-3xl border border-oro/20 bg-white/80 p-5 shadow-card sm:p-6">
          <h3 className="font-serif text-base font-semibold text-royal sm:text-lg">
            Diseño de la bandera
          </h3>
          <p className="mt-1 text-xs text-royal/55">Elige cómo se distribuyen los colores.</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {COLOMBIA_PATTERNS.map((option) => {
              const selected = patternId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPatternId(option.id)}
                  aria-pressed={selected}
                  className={`flex flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                    selected
                      ? 'border-oro bg-oro/10 shadow-aura-soft'
                      : 'border-royal/10 bg-white/60 hover:border-oro/50'
                  }`}
                >
                  <span className="flex items-center gap-2 font-serif text-sm font-semibold text-royal">
                    {selected && <Check className="h-4 w-4 text-oro-deep" strokeWidth={3} />}
                    {option.name}
                  </span>
                  <span className="text-[0.7rem] leading-snug text-royal/55">{option.detail}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Separator pepita */}
        <div className="rounded-3xl border border-oro/20 bg-white/80 p-5 shadow-card sm:p-6">
          <h3 className="font-serif text-base font-semibold text-royal sm:text-lg">
            Pepita separadora
          </h3>
          <p className="mt-1 text-xs text-royal/55">
            La pepita que separa cada color de la bandera. Elige blanca o negra.
          </p>
          <div className="mt-4 flex gap-4">
            {SEPARATORS.map((option) => {
              const selected = separatorId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSeparatorId(option.id)}
                  aria-pressed={selected}
                  className="group flex flex-col items-center gap-2"
                >
                  <span
                    className={`relative h-14 w-14 rounded-full transition-all duration-300 ${
                      selected
                        ? 'scale-110 ring-2 ring-oro ring-offset-2 ring-offset-white shadow-aura-soft'
                        : 'ring-1 ring-royal/10 group-hover:scale-105 group-hover:ring-oro/50'
                    }`}
                    style={{
                      background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.7), rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.12)), ${option.hex}`,
                    }}
                  >
                    {selected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-oro text-royal-ink shadow-aura-soft"
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </motion.span>
                    )}
                  </span>
                  <span className="text-xs font-medium text-royal/70">{option.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cord */}
        <div className="rounded-3xl border border-oro/20 bg-white/80 p-5 shadow-card sm:p-6">
          <h3 className="font-serif text-base font-semibold text-royal sm:text-lg">
            Cordón ajustable
          </h3>
          <p className="mt-1 text-xs text-royal/55">El color del cordón encerado.</p>
          <div className="mt-4 flex flex-wrap gap-4 sm:gap-5">
            {CORDS.map((option) => {
              const selected = cordId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setCordId(option.id)}
                  aria-pressed={selected}
                  className="group flex flex-col items-center gap-2"
                >
                  <span
                    className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${
                      selected
                        ? 'ring-2 ring-oro ring-offset-2 ring-offset-white shadow-aura-soft'
                        : 'ring-1 ring-royal/10 group-hover:ring-oro/50'
                    }`}
                    style={{ backgroundColor: option.hex }}
                  >
                    {selected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90"
                      >
                        <Check className="h-4 w-4 text-oro-deep" strokeWidth={3} />
                      </motion.span>
                    )}
                  </span>
                  <span className="text-xs font-medium text-royal/70">{option.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl border border-oro/25 bg-white/85 p-5 shadow-card sm:p-7"
        >
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-royal/55">
              Edición limitada
            </span>
            <span className="font-serif text-3xl font-bold text-oro-deep">
              {formatPrice(price)}
            </span>
          </div>
          <motion.div whileTap={{ scale: 0.97 }} className="mt-5">
            <button type="button" onClick={handleAdd} className="btn-gold w-full !px-4">
              {added ? (
                <>
                  <Check className="h-4 w-4 shrink-0" strokeWidth={3} />
                  ¡Agregada con amor!
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 shrink-0" strokeWidth={2} />
                  <span className="truncate">Añadir al carrito</span>
                </>
              )}
            </button>
          </motion.div>
          <p className="mt-3 text-center text-xs text-royal/50">
            Con Virgen Milagrosa y crucifijo · Hecha a mano · Envíos a toda Colombia
          </p>
        </motion.div>
      </div>
    </div>
  );
}
