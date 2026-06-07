'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { formatPrice } from '@/lib/types';
import {
  BEADS,
  CORDS,
  CUSTOM_PRICE,
  GOLD,
  GOLD_DEEP,
  GOLD_LIGHT,
  MAX_BEAD_COLORS,
  type BeadOption,
} from '@/lib/customBracelet';

const EASE = [0.22, 1, 0.36, 1] as const;

// ───────────────────────── Geometry (matches the physical bracelet) ─────────────────────────

const CX = 200;
const CY = 235;
const R = 132;

function pt(deg: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
}

type PieceKind = 'small' | 'ring' | 'large';
interface Piece {
  kind: PieceKind;
  x: number;
  y: number;
  /** running index among the small crystals only (drives color alternation) */
  smallIndex: number;
}

const PIECE_WEIGHT: Record<PieceKind, number> = { small: 1, ring: 0.52, large: 1.35 };
// Per side, cord → medal: 5 pepas, [gold ring, separator, gold ring], 5 pepas
const SIDE_PATTERN: PieceKind[] = [
  'small', 'small', 'small', 'small', 'small',
  'ring', 'large', 'ring',
  'small', 'small', 'small', 'small', 'small',
];

function layoutSide(startDeg: number, endDeg: number, smallOffset: number): Piece[] {
  const total = SIDE_PATTERN.reduce((sum, kind) => sum + PIECE_WEIGHT[kind], 0);
  const pieces: Piece[] = [];
  let cursor = 0;
  let smallIndex = smallOffset;
  for (const kind of SIDE_PATTERN) {
    const w = PIECE_WEIGHT[kind];
    const t = (cursor + w / 2) / total;
    const deg = startDeg + (endDeg - startDeg) * t;
    const { x, y } = pt(deg);
    pieces.push({ kind, x, y, smallIndex: kind === 'small' ? smallIndex++ : -1 });
    cursor += w;
  }
  return pieces;
}

// Left side: cord end (243°) sweeping counterclockwise to the medal (98°)
// Right side: cord end (297°) sweeping clockwise to the medal (82°+360)
const LEFT_SIDE = layoutSide(243, 98, 0);
const RIGHT_SIDE = layoutSide(297, 442, 10);
const ALL_PIECES = [...LEFT_SIDE, ...RIGHT_SIDE];

const CORD_END_L = pt(243);
const CORD_END_R = pt(297);

// ───────────────────────── Bead rendering ─────────────────────────

function BeadCircle({
  piece,
  index,
  beads,
}: {
  piece: Piece;
  index: number;
  beads: BeadOption[];
}) {
  if (piece.kind === 'ring') {
    return (
      <motion.circle
        cx={piece.x}
        cy={piece.y}
        r={4}
        fill="none"
        stroke={GOLD}
        strokeWidth={3}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.022 }}
      />
    );
  }

  const isLarge = piece.kind === 'large';
  const r = isLarge ? 11 : 8;
  const bead = isLarge ? null : beads[piece.smallIndex % beads.length];
  // Separators are smooth alabaster pieces, like the reference photo
  const fill = isLarge ? '#ECE2D0' : bead!.hex;
  const rim = isLarge || bead?.light ? 'rgba(150,130,95,0.45)' : 'rgba(0,0,0,0.28)';

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, delay: index * 0.022 }}
    >
      <circle cx={piece.x} cy={piece.y} r={r} fill={fill} stroke={rim} strokeWidth={0.8} />
      <circle cx={piece.x} cy={piece.y} r={r} fill="url(#facetHighlight)" />
      {!isLarge && (
        <circle
          cx={piece.x - r * 0.3}
          cy={piece.y - r * 0.35}
          r={r * 0.22}
          fill="rgba(255,255,255,0.85)"
        />
      )}
    </motion.g>
  );
}

// ───────────────────────── Virgen Milagrosa charm (fixed) ─────────────────────────

function VirgenCharm() {
  const my = 374;
  return (
    <g>
      {[-50, -25, 0, 25, 50].map((deg) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={CX + 15 * Math.cos(rad)}
            y1={my + 18 * Math.sin(rad)}
            x2={CX + 20 * Math.cos(rad)}
            y2={my + 23 * Math.sin(rad)}
            stroke={GOLD}
            strokeWidth={1.6}
            strokeLinecap="round"
            opacity={0.8}
          />
        );
      })}
      <ellipse cx={CX} cy={my} rx={12} ry={16} fill="url(#goldGradient)" stroke={GOLD_DEEP} strokeWidth={1} />
      <ellipse cx={CX} cy={my} rx={8} ry={12} fill="none" stroke={GOLD_DEEP} strokeWidth={0.9} opacity={0.65} />
      <path
        d={`M${CX},${my - 7} c-2.5,3 -3.5,7 -3.5,10 q3.5,3 7,0 c0,-3 -1,-7 -3.5,-10 Z`}
        fill={GOLD_DEEP}
        opacity={0.75}
      />
    </g>
  );
}

// ───────────────────────── Live preview canvas ─────────────────────────

function BraceletCanvas({ beads, cordHex }: { beads: BeadOption[]; cordHex: string }) {
  return (
    <div className="group relative">
      {/* hover shimmer sweep (simulates facet reflections) */}
      <div className="pointer-events-none absolute inset-0 z-10 rounded-[2rem] bg-gold-sheen bg-[length:250%_100%] opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:animate-shimmer group-hover:opacity-100" />

      <svg
        viewBox="0 0 400 470"
        className="h-auto w-full drop-shadow-[0_18px_40px_rgba(30,58,138,0.18)]"
        role="img"
        aria-label="Vista previa de tu pulsera personalizada"
      >
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

        {/* Connecting thread around the loop */}
        <path
          d={`M ${CORD_END_L.x} ${CORD_END_L.y} A ${R} ${R} 0 1 0 ${CORD_END_R.x} ${CORD_END_R.y}`}
          fill="none"
          stroke={cordHex}
          strokeWidth={2.2}
          strokeLinecap="round"
          opacity={0.95}
        />

        {/* Adjustable dual-strand cord with sliding knot */}
        <g>
          <path
            d={`M ${CORD_END_L.x} ${CORD_END_L.y} C 152 82, 172 62, 206 55 S 242 48, 252 44`}
            fill="none"
            stroke={cordHex}
            strokeWidth={3.4}
            strokeLinecap="round"
          />
          <path
            d={`M ${CORD_END_R.x} ${CORD_END_R.y} C 248 82, 228 62, 194 55 S 158 48, 148 44`}
            fill="none"
            stroke={cordHex}
            strokeWidth={3.4}
            strokeLinecap="round"
          />
          <rect x={190} y={47} width={20} height={15} rx={6} fill={cordHex} stroke="rgba(0,0,0,0.18)" strokeWidth={0.8} />
          <line x1={195} y1={49} x2={195} y2={61} stroke="rgba(0,0,0,0.15)" strokeWidth={1.2} />
          <line x1={200} y1={48} x2={200} y2={62} stroke="rgba(0,0,0,0.15)" strokeWidth={1.2} />
          <line x1={205} y1={49} x2={205} y2={61} stroke="rgba(0,0,0,0.15)" strokeWidth={1.2} />
          <circle cx={254} cy={43} r={3.2} fill={cordHex} />
          <circle cx={146} cy={43} r={3.2} fill={cordHex} />
        </g>

        {/* Pepas, separators and gold rings — re-staggers when colors change */}
        <g key={beads.map((b) => b.id).join('-')}>
          {ALL_PIECES.map((piece, index) => (
            <BeadCircle key={index} piece={piece} index={index} beads={beads} />
          ))}
        </g>

        {/* Virgen Milagrosa + dangling crucifix */}
        <g>
          <circle cx={CX} cy={362} r={2.4} fill="none" stroke={GOLD} strokeWidth={1.6} />
          <VirgenCharm />
          <circle cx={CX} cy={394} r={2.4} fill="none" stroke={GOLD} strokeWidth={1.6} />
          <circle cx={CX} cy={400} r={2.4} fill="none" stroke={GOLD} strokeWidth={1.6} />
          <rect x={CX - 3.5} y={404} width={7} height={48} rx={2.4} fill="url(#goldGradient)" stroke={GOLD_DEEP} strokeWidth={0.6} />
          <rect x={CX - 16} y={416} width={32} height={7} rx={2.4} fill="url(#goldGradient)" stroke={GOLD_DEEP} strokeWidth={0.6} />
          <circle cx={CX} cy={419.5} r={3.6} fill={GOLD_DEEP} />
        </g>
      </svg>
    </div>
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

// ───────────────────────── Studio ─────────────────────────

export default function BraceletStudio() {
  const { addCustomItem } = useCart();
  const [beadIds, setBeadIds] = useState<string[]>(['champana']);
  const [cordId, setCordId] = useState('crema');
  const [openStep, setOpenStep] = useState(1);
  const [added, setAdded] = useState(false);

  const beads = useMemo(
    () => beadIds.map((id) => BEADS.find((b) => b.id === id)).filter(Boolean) as BeadOption[],
    [beadIds]
  );
  const cord = useMemo(() => CORDS.find((c) => c.id === cordId) ?? CORDS[0], [cordId]);

  const toggleBead = (id: string) => {
    setBeadIds((prev) => {
      if (prev.includes(id)) {
        // always keep at least one pepa selected
        return prev.length > 1 ? prev.filter((b) => b !== id) : prev;
      }
      if (prev.length >= MAX_BEAD_COLORS) return prev;
      return [...prev, id];
    });
  };

  const handleAdd = () => {
    addCustomItem({ beadIds, cordId });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const beadSummary = beads.map((b) => b.name).join(' + ');

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
      {/* ── Live preview (pinned on mobile, sticky column on desktop) ── */}
      <div className="sticky top-14 z-20 self-start sm:top-16 lg:top-24">
        <div className="rounded-3xl border border-oro/20 bg-gradient-to-b from-white/90 to-cielo-100/80 p-3 shadow-luxe backdrop-blur-md sm:rounded-[2rem] sm:p-8">
          <div className="mx-auto max-w-[180px] sm:max-w-[300px] lg:max-w-sm">
            <BraceletCanvas beads={beads} cordHex={cord.hex} />
          </div>
          <div className="mt-2 text-center sm:mt-4">
            <p className="truncate px-2 font-serif text-xs font-semibold text-royal sm:text-base">
              {beadSummary}
            </p>
            <p className="truncate px-2 text-[0.65rem] text-royal/55 sm:text-xs">
              Cordón {cord.name} · Virgen Milagrosa
            </p>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="space-y-4">
        {/* Step 1 — Cord */}
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

        {/* Step 2 — Pepas (multi-select) */}
        <Step
          number={2}
          title="Pepas"
          summary={`${beadSummary} (${beads.length}/${MAX_BEAD_COLORS})`}
          open={openStep === 2}
          onToggle={() => setOpenStep(openStep === 2 ? 0 : 2)}
        >
          <p className="mb-4 text-xs text-royal/55">
            Elige hasta {MAX_BEAD_COLORS} colores — se alternan a lo largo de la pulsera.
          </p>
          <div className="grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-4">
            {BEADS.map((option) => {
              const selectedIndex = beadIds.indexOf(option.id);
              const selected = selectedIndex !== -1;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleBead(option.id)}
                  aria-pressed={selected}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <span
                    className={`relative h-12 w-12 rounded-full transition-all duration-300 ${
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
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-oro text-[0.6rem] font-black text-royal-ink shadow-aura-soft"
                      >
                        {selectedIndex + 1}
                      </motion.span>
                    )}
                  </span>
                  <span className="text-center text-[0.65rem] font-medium leading-tight text-royal/70">
                    {option.name}
                  </span>
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
              {formatPrice(CUSTOM_PRICE)}
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
