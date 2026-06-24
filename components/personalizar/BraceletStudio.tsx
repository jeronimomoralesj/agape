'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { formatPrice } from '@/lib/types';
import {
  BEADS,
  CORDS,
  COLLAR_CORD,
  CUSTOM_PRICES,
  PRODUCT_LABELS,
  customTitle,
  type BeadOption,
  type CustomConfig,
  type ProductType,
} from '@/lib/customBracelet';
import { PulseraPreview, CollarPreview } from './pulseraArt';

const EASE = [0.22, 1, 0.36, 1] as const;

/** A palette color plus its live inventory level and family. */
type PaletteBead = BeadOption & { kind: 'maria' | 'jesus'; stock: number };

// ───────────────────────── Accordion step ─────────────────────────

function Step({
  number,
  title,
  summary,
  open,
  onToggle,
  children,
}: {
  number: number;
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border bg-white/80 shadow-card transition-colors duration-300 ${
        open ? 'border-oro/50' : 'border-oro/15'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-4 text-left sm:gap-4 sm:px-6 sm:py-5"
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif text-base font-bold transition-colors duration-300 ${
            open ? 'bg-gradient-to-br from-oro-light to-oro text-royal-ink shadow-aura-soft' : 'bg-cielo-100 text-royal/60'
          }`}
        >
          {number}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-base font-semibold text-royal sm:text-lg">
            {title}
          </span>
          <span className="block truncate text-xs text-royal/55">{summary}</span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-5 w-5 text-oro-deep" strokeWidth={1.75} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-6 sm:px-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ───────────────────────── Single-color picker ─────────────────────────

function ColorGrid({
  options,
  selectedId,
  onSelect,
}: {
  options: PaletteBead[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (options.length === 0) {
    return (
      <p className="rounded-2xl bg-cielo-100/70 px-4 py-3 text-sm text-royal/55">
        Pronto añadiremos colores para esta pepa. ✨
      </p>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-4">
      {options.map((option) => {
        const selected = option.id === selectedId;
        const soldOut = option.stock <= 0;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => !soldOut && onSelect(option.id)}
            disabled={soldOut}
            aria-pressed={selected}
            className={`group flex flex-col items-center gap-1.5 ${soldOut ? 'cursor-not-allowed' : ''}`}
          >
            <span
              className={`relative h-12 w-12 rounded-full transition-all duration-300 ${
                soldOut ? 'opacity-40 grayscale' : ''
              } ${
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
            <span className="text-center text-[0.65rem] font-medium leading-tight text-royal/70">
              {option.name}
            </span>
            {soldOut && (
              <span className="text-[0.6rem] font-bold uppercase tracking-wide text-amber-600">
                Agotado
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ───────────────────────── Studio ─────────────────────────

const SEED_PALETTE: PaletteBead[] = [
  ...BEADS.map((b) => ({ ...b, kind: 'maria' as const, stock: 1 })),
  ...BEADS.map((b) => ({ ...b, id: `${b.id}-jesus`, kind: 'jesus' as const, stock: 1 })),
];

export default function BraceletStudio() {
  const { addCustomItem } = useCart();
  const [productType, setProductType] = useState<ProductType>('pulsera');
  const [palette, setPalette] = useState<PaletteBead[]>(SEED_PALETTE);
  const [mariaId, setMariaId] = useState('champana');
  const [jesusId, setJesusId] = useState('esmeralda-jesus');
  const [cordId, setCordId] = useState('crema');
  const [openStep, setOpenStep] = useState(1);
  const [added, setAdded] = useState(false);

  // Deep-link the product line (e.g. /personalizar?tipo=collar).
  useEffect(() => {
    const tipo = new URLSearchParams(window.location.search).get('tipo');
    if (tipo === 'collar' || tipo === 'pulsera') setProductType(tipo);
  }, []);

  // Live, admin-managed palette (colors + stock + family).
  useEffect(() => {
    let active = true;
    fetch('/api/pepas', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PaletteBead[] | null) => {
        if (active && Array.isArray(data) && data.length > 0) setPalette(data);
      })
      .catch(() => {
        /* keep the static fallback palette */
      });
    return () => {
      active = false;
    };
  }, []);

  const mariaOptions = useMemo(() => palette.filter((p) => p.kind === 'maria'), [palette]);
  const jesusOptions = useMemo(() => palette.filter((p) => p.kind === 'jesus'), [palette]);

  // Keep each selection valid as the live palette arrives (a color may have
  // been removed or sold out in the admin since the seed was rendered).
  useEffect(() => {
    const firstAvailable = (opts: PaletteBead[]) =>
      opts.find((p) => p.stock > 0)?.id ?? opts[0]?.id;
    setMariaId((prev) =>
      mariaOptions.some((p) => p.id === prev && p.stock > 0)
        ? prev
        : firstAvailable(mariaOptions) ?? prev
    );
    setJesusId((prev) =>
      jesusOptions.some((p) => p.id === prev && p.stock > 0)
        ? prev
        : firstAvailable(jesusOptions) ?? prev
    );
  }, [mariaOptions, jesusOptions]);

  const mariaBead = useMemo(
    () => palette.find((p) => p.id === mariaId),
    [palette, mariaId]
  );
  const jesusBead = useMemo(
    () => palette.find((p) => p.id === jesusId),
    [palette, jesusId]
  );
  const cord = useMemo(
    () =>
      productType === 'collar'
        ? COLLAR_CORD
        : CORDS.find((c) => c.id === cordId) ?? CORDS[0],
    [productType, cordId]
  );

  const maria = { hex: mariaBead?.hex ?? '#EBD4BE', light: !!mariaBead?.light };
  const jesus = { hex: jesusBead?.hex ?? '#732911', light: !!jesusBead?.light };

  // Step numbering shifts because the collar has no cord step.
  const showCord = productType === 'pulsera';
  const stepMaria = showCord ? 2 : 1;
  const stepJesus = showCord ? 3 : 2;

  const handleAdd = () => {
    const config: CustomConfig = {
      type: productType,
      mariaId,
      jesusId,
      cordId: showCord ? cordId : undefined,
    };
    addCustomItem(config, {
      title: customTitle(config, (id) => palette.find((b) => b.id === id)),
      mariaHex: maria.hex,
      jesusHex: jesus.hex,
      cordHex: cord.hex,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const price = CUSTOM_PRICES[productType];

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
      {/* ── Live preview ── */}
      <div className="sticky top-14 z-20 min-w-0 self-start sm:top-16 lg:top-24">
        <div className="rounded-3xl border border-oro/20 bg-gradient-to-b from-white/90 to-cielo-100/80 p-3 shadow-luxe backdrop-blur-md sm:rounded-[2rem] sm:p-8">
          <div className="mx-auto max-w-[170px] sm:max-w-[280px] lg:max-w-sm">
            {productType === 'collar' ? (
              <CollarPreview maria={maria} jesus={jesus} cordHex={cord.hex} />
            ) : (
              <PulseraPreview maria={maria} jesus={jesus} cordHex={cord.hex} />
            )}
          </div>
          <div className="mt-2 text-center sm:mt-4">
            <div className="flex flex-wrap items-center justify-center gap-3 px-2">
              <span className="flex items-center gap-1.5">
                <span
                  title={mariaBead?.name}
                  className="h-3.5 w-3.5 rounded-full ring-1 ring-royal/15"
                  style={{
                    background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.7), rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.12)), ${maria.hex}`,
                  }}
                />
                <span className="text-[0.65rem] text-royal/55">Ave María</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  title={jesusBead?.name}
                  className="h-4 w-4 rounded-full ring-1 ring-royal/15"
                  style={{
                    background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.7), rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.12)), ${jesus.hex}`,
                  }}
                />
                <span className="text-[0.65rem] text-royal/55">Padre Nuestro</span>
              </span>
            </div>
            <p className="mt-1.5 truncate px-2 text-[0.65rem] text-royal/55 sm:text-xs">
              {productType === 'collar'
                ? `${COLLAR_CORD.name} · Rosario con crucifijo`
                : `Cordón ${cord.name} · Virgen Milagrosa`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="min-w-0 space-y-4">
        {/* Product line toggle */}
        <div className="grid grid-cols-2 gap-2 rounded-3xl border border-oro/20 bg-white/80 p-2 shadow-card">
          {(['pulsera', 'collar'] as ProductType[]).map((t) => {
            const active = productType === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setProductType(t);
                  setOpenStep(1);
                }}
                aria-pressed={active}
                className={`rounded-2xl px-4 py-3 font-serif text-base font-semibold transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-br from-oro-light to-oro text-royal-ink shadow-aura-soft'
                    : 'text-royal/55 hover:text-royal'
                }`}
              >
                {PRODUCT_LABELS[t]}
              </button>
            );
          })}
        </div>

        {/* Step — Cord (pulsera only) */}
        {showCord && (
          <Step
            number={1}
            title="Cordón ajustable"
            summary={`Cordón ${cord.name}`}
            open={openStep === 1}
            onToggle={() => setOpenStep(openStep === 1 ? 0 : 1)}
          >
            <div className="flex flex-wrap gap-4 sm:gap-5">
              {CORDS.map((option) => {
                const selected = cordId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setCordId(option.id);
                      setOpenStep(2);
                    }}
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
          </Step>
        )}

        {/* Step — Pepas Ave María */}
        <Step
          number={stepMaria}
          title="Pepas · Ave María"
          summary={mariaBead?.name ?? 'Elige un color'}
          open={openStep === stepMaria}
          onToggle={() => setOpenStep(openStep === stepMaria ? 0 : stepMaria)}
        >
          <p className="mb-4 text-xs text-royal/55">
            Color de las pepas pequeñas que recorren {productType === 'collar' ? 'el collar' : 'la pulsera'}.
          </p>
          <ColorGrid options={mariaOptions} selectedId={mariaId} onSelect={setMariaId} />
        </Step>

        {/* Step — Pepas Padre Nuestro */}
        <Step
          number={stepJesus}
          title="Pepas · Padre Nuestro"
          summary={jesusBead?.name ?? 'Elige un color'}
          open={openStep === stepJesus}
          onToggle={() => setOpenStep(openStep === stepJesus ? 0 : stepJesus)}
        >
          <p className="mb-4 text-xs text-royal/55">
            Color de las pepas de intersección, un poco más grandes.
          </p>
          <ColorGrid options={jesusOptions} selectedId={jesusId} onSelect={setJesusId} />
        </Step>

        {/* Price + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl border border-oro/25 bg-white/85 p-5 shadow-card sm:p-7"
        >
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-royal/55">
              Tu creación
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
            {productType === 'collar'
              ? 'Rosario con Ave María y crucifijo · Hecho a mano · Envíos a toda Colombia'
              : 'Con Virgen Milagrosa y crucifijo · Hecha a mano · Envíos a toda Colombia'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
