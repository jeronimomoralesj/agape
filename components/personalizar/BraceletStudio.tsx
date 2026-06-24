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
  GOLD,
  GOLD_DEEP,
  GOLD_LIGHT,
  PRODUCT_LABELS,
  customTitle,
  type BeadOption,
  type CustomConfig,
  type ProductType,
} from '@/lib/customBracelet';

const EASE = [0.22, 1, 0.36, 1] as const;

/** A palette color plus its live inventory level and family. */
type PaletteBead = BeadOption & { kind: 'maria' | 'jesus'; stock: number };

type Family = 'maria' | 'jesus';
interface Piece {
  family: Family;
  x: number;
  y: number;
  r: number;
}
interface ArcStep {
  family: Family;
  r: number;
  weight: number;
}

// ───────────────────────── Geometry helpers ─────────────────────────

function loopPt(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  deg: number,
  taper = 0
): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  const sy = Math.sin(rad);
  // Narrow the loop toward the bottom for a softer, teardrop hang.
  const widthScale = 1 - taper * ((sy + 1) / 2);
  return { x: cx + rx * widthScale * Math.cos(rad), y: cy + ry * sy };
}

interface LoopOpts {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  startDeg: number;
  endDeg: number;
  taper?: number;
}

/** Distribute a weighted pattern of beads along an elliptical arc. */
function layoutLoop(pattern: ArcStep[], o: LoopOpts): Piece[] {
  const total = pattern.reduce((s, p) => s + p.weight, 0);
  const pieces: Piece[] = [];
  let cursor = 0;
  for (const p of pattern) {
    const t = (cursor + p.weight / 2) / total;
    const deg = o.startDeg + (o.endDeg - o.startDeg) * t;
    const { x, y } = loopPt(o.cx, o.cy, o.rx, o.ry, deg, o.taper ?? 0);
    pieces.push({ family: p.family, x, y, r: p.r });
    cursor += p.weight;
  }
  return pieces;
}

/** Closed SVG path tracing the (possibly tapered) loop the thread follows. */
function loopPath(o: { cx: number; cy: number; rx: number; ry: number; taper?: number }): string {
  const N = 72;
  let d = '';
  for (let i = 0; i <= N; i++) {
    const { x, y } = loopPt(o.cx, o.cy, o.rx, o.ry, (i / N) * 360, o.taper ?? 0);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return `${d}Z`;
}

function rep<T>(n: number, v: T): T[] {
  return Array.from({ length: n }, () => v);
}

// Bead radii.
const MARIA_R = 6.8;
const JESUS_R = 9.8;

/** Five decades: each = 1 Padre Nuestro intersection pepa + 10 Ave María pepas. */
function rosaryLoop(): ArcStep[] {
  const out: ArcStep[] = [];
  for (let d = 0; d < 5; d++) {
    out.push({ family: 'jesus', r: JESUS_R, weight: 1.55 });
    out.push(...rep(10, { family: 'maria' as Family, r: MARIA_R, weight: 1 }));
  }
  return out;
}

// ── Pulsera: a full ellipse of pepas (knot hidden at the back), medal below ──
const P_CX = 200;
const P_CY = 196;
const P_RX = 142;
const P_RY = 150;
const PULSERA_PIECES: Piece[] = layoutLoop(rosaryLoop(), {
  cx: P_CX,
  cy: P_CY,
  rx: P_RX,
  ry: P_RY,
  startDeg: 108,
  endDeg: 432,
});
const P_LOOP = loopPath({ cx: P_CX, cy: P_CY, rx: P_RX, ry: P_RY });
const P_MEDAL_Y = P_CY + P_RY; // bottom of the loop — medal hangs here

// ── Collar (rosario): a taller, teardrop ellipse + centerpiece + pendant ──
const C_CX = 200;
const C_CY = 205;
const C_RX = 140;
const C_RY = 178;
const C_TAPER = 0.22;
const COLLAR_LOOP_PIECES = layoutLoop(rosaryLoop(), {
  cx: C_CX,
  cy: C_CY,
  rx: C_RX,
  ry: C_RY,
  startDeg: 106,
  endDeg: 434,
  taper: C_TAPER,
});
const C_LOOP = loopPath({ cx: C_CX, cy: C_CY, rx: C_RX, ry: C_RY, taper: C_TAPER });
const C_MEDAL = loopPt(C_CX, C_CY, C_RX, C_RY, 90, C_TAPER); // bottom of the loop
// Pendant drop: 1 Jesús · 3 pepas · 1 Jesús · cross
const C_PENDANT: Piece[] = [
  { family: 'jesus', x: C_CX, y: C_MEDAL.y + 35, r: JESUS_R },
  { family: 'maria', x: C_CX, y: C_MEDAL.y + 61, r: MARIA_R },
  { family: 'maria', x: C_CX, y: C_MEDAL.y + 84, r: MARIA_R },
  { family: 'maria', x: C_CX, y: C_MEDAL.y + 107, r: MARIA_R },
  { family: 'jesus', x: C_CX, y: C_MEDAL.y + 133, r: JESUS_R },
];
const C_CROSS_Y = C_MEDAL.y + 163;

// ───────────────────────── Shared SVG bits ─────────────────────────

function SvgDefs() {
  return (
    <defs>
      <radialGradient id="facetHighlight" cx="32%" cy="28%" r="72%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
        <stop offset="45%" stopColor="rgba(255,255,255,0.12)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
      </radialGradient>
      <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={GOLD_LIGHT} />
        <stop offset="55%" stopColor={GOLD} />
        <stop offset="100%" stopColor={GOLD_DEEP} />
      </linearGradient>
    </defs>
  );
}

function Bead({
  piece,
  hex,
  light,
  index,
}: {
  piece: Piece;
  hex: string;
  light: boolean;
  index: number;
}) {
  const { x, y, r } = piece;
  const rim = light ? 'rgba(150,130,95,0.45)' : 'rgba(0,0,0,0.28)';
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, delay: index * 0.012 }}
    >
      <circle cx={x} cy={y} r={r} fill={hex} stroke={rim} strokeWidth={0.8} />
      <circle cx={x} cy={y} r={r} fill="url(#facetHighlight)" />
      <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.22} fill="rgba(255,255,255,0.85)" />
    </motion.g>
  );
}

/** Render a list of pieces, coloring each by its family. */
function Beads({
  pieces,
  maria,
  jesus,
  offset = 0,
}: {
  pieces: Piece[];
  maria: { hex: string; light: boolean };
  jesus: { hex: string; light: boolean };
  offset?: number;
}) {
  return (
    <>
      {pieces.map((p, i) => {
        const fam = p.family === 'jesus' ? jesus : maria;
        return <Bead key={i + offset} piece={p} hex={fam.hex} light={fam.light} index={i + offset} />;
      })}
    </>
  );
}

function CrossCharm({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 3.5} y={y} width={7} height={48} rx={2.4} fill="url(#goldGradient)" stroke={GOLD_DEEP} strokeWidth={0.6} />
      <rect x={x - 16} y={y + 12} width={32} height={7} rx={2.4} fill="url(#goldGradient)" stroke={GOLD_DEEP} strokeWidth={0.6} />
      <circle cx={x} cy={y + 15.5} r={3.6} fill={GOLD_DEEP} />
    </g>
  );
}

/** Virgen Milagrosa charm (pulsera centerpiece). */
function VirgenCharm({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      {[-50, -25, 0, 25, 50].map((deg) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={cx + 15 * Math.cos(rad)}
            y1={cy + 18 * Math.sin(rad)}
            x2={cx + 20 * Math.cos(rad)}
            y2={cy + 23 * Math.sin(rad)}
            stroke={GOLD}
            strokeWidth={1.6}
            strokeLinecap="round"
            opacity={0.8}
          />
        );
      })}
      <ellipse cx={cx} cy={cy} rx={12} ry={16} fill="url(#goldGradient)" stroke={GOLD_DEEP} strokeWidth={1} />
      <ellipse cx={cx} cy={cy} rx={8} ry={12} fill="none" stroke={GOLD_DEEP} strokeWidth={0.9} opacity={0.65} />
      <path
        d={`M${cx},${cy - 7} c-2.5,3 -3.5,7 -3.5,10 q3.5,3 7,0 c0,-3 -1,-7 -3.5,-10 Z`}
        fill={GOLD_DEEP}
        opacity={0.75}
      />
    </g>
  );
}

/** Round "Ave María" centerpiece medal (collar). */
function MedalRound({ x, y, r = 18 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="url(#goldGradient)" stroke={GOLD_DEEP} strokeWidth={1.2} />
      <circle cx={x} cy={y} r={r - 4} fill="none" stroke={GOLD_DEEP} strokeWidth={0.9} opacity={0.6} />
      <circle cx={x} cy={y - 4.5} r={2.6} fill={GOLD_DEEP} opacity={0.8} />
      <path
        d={`M${x},${y - 2} c-3,2.4 -4,6 -4,9.5 q4,2.6 8,0 c0,-3.5 -1,-7.1 -4,-9.5 Z`}
        fill={GOLD_DEEP}
        opacity={0.75}
      />
    </g>
  );
}

// ───────────────────────── Pulsera preview ─────────────────────────

function PulseraCanvas({
  maria,
  jesus,
  cordHex,
}: {
  maria: { hex: string; light: boolean };
  jesus: { hex: string; light: boolean };
  cordHex: string;
}) {
  return (
    <svg
      viewBox="0 0 400 472"
      className="h-auto w-full drop-shadow-[0_18px_40px_rgba(30,58,138,0.18)]"
      role="img"
      aria-label="Vista previa de tu pulsera personalizada"
    >
      <SvgDefs />

      {/* Thread around the full loop — the knot sits hidden at the back */}
      <path d={P_LOOP} fill="none" stroke={cordHex} strokeWidth={2.4} strokeLinecap="round" opacity={0.95} />

      {/* Pepas — re-staggers when colors change */}
      <g key={`${maria.hex}-${jesus.hex}`}>
        <Beads pieces={PULSERA_PIECES} maria={maria} jesus={jesus} />
      </g>

      {/* Virgen Milagrosa · Jesús pepa · dangling crucifix */}
      <g>
        <circle cx={P_CX} cy={P_MEDAL_Y} r={2.4} fill="none" stroke={GOLD} strokeWidth={1.6} />
        <VirgenCharm cx={P_CX} cy={P_MEDAL_Y + 18} />
        <circle cx={P_CX} cy={P_MEDAL_Y + 35} r={2.4} fill="none" stroke={GOLD} strokeWidth={1.6} />
        <Bead
          piece={{ family: 'jesus', x: P_CX, y: P_MEDAL_Y + 49, r: JESUS_R }}
          hex={jesus.hex}
          light={jesus.light}
          index={0}
        />
        <circle cx={P_CX} cy={P_MEDAL_Y + 63} r={2.4} fill="none" stroke={GOLD} strokeWidth={1.6} />
        <CrossCharm x={P_CX} y={P_MEDAL_Y + 69} />
      </g>
    </svg>
  );
}

// ───────────────────────── Collar preview ─────────────────────────

function CollarCanvas({
  maria,
  jesus,
  cordHex,
}: {
  maria: { hex: string; light: boolean };
  jesus: { hex: string; light: boolean };
  cordHex: string;
}) {
  return (
    <svg
      viewBox="0 0 400 605"
      className="h-auto w-full drop-shadow-[0_18px_40px_rgba(30,58,138,0.18)]"
      role="img"
      aria-label="Vista previa de tu collar personalizado"
    >
      <SvgDefs />

      {/* The looped thread + pendant strand (fixed color) */}
      <path d={C_LOOP} fill="none" stroke={cordHex} strokeWidth={2.2} opacity={0.95} />
      <line
        x1={C_CX}
        y1={C_MEDAL.y}
        x2={C_CX}
        y2={C_CROSS_Y}
        stroke={cordHex}
        strokeWidth={2.2}
        strokeLinecap="round"
        opacity={0.95}
      />

      {/* Decenas + pepas de intersección + colgante */}
      <g key={`${maria.hex}-${jesus.hex}`}>
        <Beads pieces={COLLAR_LOOP_PIECES} maria={maria} jesus={jesus} />
        <Beads pieces={C_PENDANT} maria={maria} jesus={jesus} offset={COLLAR_LOOP_PIECES.length} />
      </g>

      {/* Centerpiece medal (Ave María) + crucifix */}
      <MedalRound x={C_MEDAL.x} y={C_MEDAL.y} />
      <CrossCharm x={C_CX} y={C_CROSS_Y} />
    </svg>
  );
}

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
              <CollarCanvas maria={maria} jesus={jesus} cordHex={cord.hex} />
            ) : (
              <PulseraCanvas maria={maria} jesus={jesus} cordHex={cord.hex} />
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
