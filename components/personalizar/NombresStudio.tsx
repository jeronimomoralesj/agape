'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { formatPrice } from '@/lib/types';
import {
  BEADS,
  METALS,
  MAX_NAMES,
  MAX_NAME_LEN,
  customTitle,
  findMetal,
  nombresPrice,
  sanitizeName,
  type BeadOption,
  type CustomConfig,
} from '@/lib/customBracelet';
import { NombresCollarPreview } from './nombresArt';

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

export default function NombresStudio() {
  const { addCustomItem } = useCart();
  const [palette, setPalette] = useState<PaletteBead[]>(SEED_PALETTE);
  const [names, setNames] = useState<string[]>(['MARIA']);
  const [mariaId, setMariaId] = useState('champana');
  const [jesusId, setJesusId] = useState('peridoto-jesus');
  const [metalId, setMetalId] = useState(METALS[0].id);
  const [openStep, setOpenStep] = useState(1);
  const [added, setAdded] = useState(false);

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

  // Keep each selection valid as the live palette arrives.
  useEffect(() => {
    const firstAvailable = (opts: PaletteBead[]) =>
      opts.find((p) => p.stock > 0)?.id ?? opts[0]?.id;
    setMariaId((prev) =>
      mariaOptions.some((p) => p.id === prev && p.stock > 0) ? prev : firstAvailable(mariaOptions) ?? prev
    );
    setJesusId((prev) =>
      jesusOptions.some((p) => p.id === prev && p.stock > 0) ? prev : firstAvailable(jesusOptions) ?? prev
    );
  }, [mariaOptions, jesusOptions]);

  const mariaBead = useMemo(() => palette.find((p) => p.id === mariaId), [palette, mariaId]);
  const jesusBead = useMemo(() => palette.find((p) => p.id === jesusId), [palette, jesusId]);
  const metal = findMetal(metalId);

  const maria = { hex: mariaBead?.hex ?? '#EBD4BE', light: !!mariaBead?.light };
  const jesus = { hex: jesusBead?.hex ?? '#6BB343', light: !!jesusBead?.light };

  const validNames = useMemo(() => names.map(sanitizeName).filter(Boolean), [names]);
  const price = nombresPrice(validNames);

  // ── Name editing ──
  const updateName = (index: number, value: string) =>
    setNames((prev) => prev.map((n, i) => (i === index ? sanitizeName(value) : n)));
  const addName = () =>
    setNames((prev) => (prev.length >= MAX_NAMES ? prev : [...prev, '']));
  const removeName = (index: number) =>
    setNames((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));

  const handleAdd = () => {
    if (validNames.length === 0) return;
    const config: CustomConfig = {
      type: 'nombres',
      mariaId,
      jesusId,
      metalId,
      names: validNames,
    };
    addCustomItem(config, {
      title: customTitle(config, (id) => palette.find((b) => b.id === id)),
      mariaHex: maria.hex,
      jesusHex: jesus.hex,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const namesSummary = validNames.length
    ? validNames.map((n) => n.charAt(0) + n.slice(1).toLowerCase()).join(' · ')
    : 'Escribe al menos un nombre';

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
      {/* ── Live preview ── */}
      <div className="sticky top-14 z-20 min-w-0 self-start sm:top-16 lg:top-24">
        <div className="rounded-3xl border border-oro/20 bg-gradient-to-b from-white/90 to-cielo-100/80 p-3 shadow-luxe backdrop-blur-md sm:rounded-[2rem] sm:p-8">
          <div className="mx-auto max-w-[230px] sm:max-w-sm lg:max-w-md">
            <NombresCollarPreview maria={maria} jesus={jesus} metalHex={metal.hex} names={validNames} />
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
                <span className="text-[0.65rem] text-royal/55">Pepa pequeña</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  title={jesusBead?.name}
                  className="h-4 w-4 rounded-full ring-1 ring-royal/15"
                  style={{
                    background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.7), rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.12)), ${jesus.hex}`,
                  }}
                />
                <span className="text-[0.65rem] text-royal/55">Pepa grande</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  title={metal.name}
                  className="h-3.5 w-3.5 rounded-full ring-1 ring-royal/15"
                  style={{ backgroundColor: metal.hex }}
                />
                <span className="text-[0.65rem] text-royal/55">{metal.name}</span>
              </span>
            </div>
            <p className="mt-1.5 truncate px-2 text-[0.65rem] text-royal/55 sm:text-xs">
              {namesSummary}
            </p>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="min-w-0 space-y-4">
        {/* Step 1 — Names */}
        <Step
          number={1}
          title="Nombres"
          summary={`${validNames.length} de ${MAX_NAMES} · ${namesSummary}`}
          open={openStep === 1}
          onToggle={() => setOpenStep(openStep === 1 ? 0 : 1)}
        >
          <p className="mb-4 text-xs text-royal/55">
            Hasta {MAX_NAMES} nombres, máximo {MAX_NAME_LEN} letras cada uno. Solo letras.
          </p>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {names.map((name, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => updateName(index, e.target.value)}
                      maxLength={MAX_NAME_LEN}
                      placeholder={`Nombre ${index + 1}`}
                      aria-label={`Nombre ${index + 1}`}
                      className="input-luxe w-full !rounded-2xl uppercase tracking-[0.18em]"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[0.65rem] font-semibold text-royal/40">
                      {name.length}/{MAX_NAME_LEN}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeName(index)}
                    disabled={names.length <= 1}
                    aria-label={`Eliminar nombre ${index + 1}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-royal/50 transition-colors hover:bg-amber-500/10 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {names.length < MAX_NAMES && (
            <button
              type="button"
              onClick={addName}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-oro/40 px-4 py-3 text-sm font-semibold text-oro-deep transition-colors hover:bg-oro/5"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Añadir otro nombre
            </button>
          )}
        </Step>

        {/* Step 2 — Pepas pequeñas (maria) */}
        <Step
          number={2}
          title="Pepas de color · pequeñas"
          summary={mariaBead?.name ?? 'Elige un color'}
          open={openStep === 2}
          onToggle={() => setOpenStep(openStep === 2 ? 0 : 2)}
        >
          <p className="mb-4 text-xs text-royal/55">
            Color de las pepas pequeñas que acompañan a los nombres.
          </p>
          <ColorGrid options={mariaOptions} selectedId={mariaId} onSelect={setMariaId} />
        </Step>

        {/* Step 3 — Pepas grandes (jesus) */}
        <Step
          number={3}
          title="Pepas de color · grandes"
          summary={jesusBead?.name ?? 'Elige un color'}
          open={openStep === 3}
          onToggle={() => setOpenStep(openStep === 3 ? 0 : 3)}
        >
          <p className="mb-4 text-xs text-royal/55">
            Color de las pepas facetadas que separan cada nombre.
          </p>
          <ColorGrid options={jesusOptions} selectedId={jesusId} onSelect={setJesusId} />
        </Step>

        {/* Step 4 — Metal */}
        <Step
          number={4}
          title="Cuentas metálicas"
          summary={metal.name}
          open={openStep === 4}
          onToggle={() => setOpenStep(openStep === 4 ? 0 : 4)}
        >
          <p className="mb-4 text-xs text-royal/55">
            El acabado de las cuentas pequeñas que recorren todo el collar.
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-5">
            {METALS.map((option) => {
              const selected = metalId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMetalId(option.id)}
                  aria-pressed={selected}
                  className="group flex flex-col items-center gap-2"
                >
                  <span
                    className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${
                      selected
                        ? 'ring-2 ring-oro ring-offset-2 ring-offset-white shadow-aura-soft'
                        : 'ring-1 ring-royal/10 group-hover:ring-oro/50'
                    }`}
                    style={{
                      background: `radial-gradient(circle at 34% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0.15) 55%, rgba(0,0,0,0.15)), ${option.hex}`,
                    }}
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
            <button
              type="button"
              onClick={handleAdd}
              disabled={validNames.length === 0}
              className="btn-gold w-full !px-4 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4 shrink-0" strokeWidth={3} />
                  ¡Agregado con amor!
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
            {validNames.length === 0
              ? 'Escribe al menos un nombre para continuar'
              : `Collar de ${validNames.length} ${
                  validNames.length === 1 ? 'nombre' : 'nombres'
                } · Hecho a mano · Envíos a toda Colombia`}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
