'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Gem, Link2, ShoppingBag, Sparkles, Wand2 } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { formatPrice } from '@/lib/types';
import {
  BEADS,
  CHARMS,
  CORDS,
  CUSTOM_PRICE,
  GOLD,
  GOLD_DEEP,
  GOLD_LIGHT,
  type BeadOption,
} from '@/lib/customBracelet';

const EASE = [0.22, 1, 0.36, 1] as const;

// ───────────────────────── Geometry (matches IMG_6410 anatomy) ─────────────────────────

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
}

const PIECE_WEIGHT: Record<PieceKind, number> = { small: 1, ring: 0.52, large: 1.35 };
// Per side, cord → medal: 5 crystals, [gold ring, separator, gold ring], 5 crystals
const SIDE_PATTERN: PieceKind[] = [
  'small', 'small', 'small', 'small', 'small',
  'ring', 'large', 'ring',
  'small', 'small', 'small', 'small', 'small',
];

function layoutSide(startDeg: number, endDeg: number): Piece[] {
  const total = SIDE_PATTERN.reduce((sum, kind) => sum + PIECE_WEIGHT[kind], 0);
  const pieces: Piece[] = [];
  let cursor = 0;
  for (const kind of SIDE_PATTERN) {
    const w = PIECE_WEIGHT[kind];
    const t = (cursor + w / 2) / total;
    const deg = startDeg + (endDeg - startDeg) * t;
    const { x, y } = pt(deg);
    pieces.push({ kind, x, y });
    cursor += w;
  }
  return pieces;
}

// Right side: cord end (297°) sweeping clockwise to the medal (82°+360)
// Left side: cord end (243°) sweeping counterclockwise to the medal (98°)
const RIGHT_SIDE = layoutSide(297, 442);
const LEFT_SIDE = layoutSide(243, 98);
const ALL_PIECES = [...LEFT_SIDE, ...RIGHT_SIDE];

const CORD_END_L = pt(243);
const CORD_END_R = pt(297);

// ───────────────────────── Bead rendering ─────────────────────────

function BeadCircle({
  piece,
  index,
  bead,
}: {
  piece: Piece;
  index: number;
  bead: BeadOption;
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
  // Separators are smooth alabaster pieces, like the reference photo
  const fill = isLarge ? '#ECE2D0' : bead.hex;
  const rim = isLarge || bead.light ? 'rgba(150,130,95,0.45)' : 'rgba(0,0,0,0.28)';

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, delay: index * 0.022 }}
    >
      <circle cx={piece.x} cy={piece.y} r={r} fill={fill} stroke={rim} strokeWidth={0.8} />
      {/* facet highlight */}
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

// ───────────────────────── Charms ─────────────────────────

function Charm({ charmId }: { charmId: string }) {
  const my = 374; // medal center y
  if (charmId === 'benito') {
    return (
      <g>
        <circle cx={CX} cy={my} r={14} fill="url(#goldGradient)" stroke={GOLD_DEEP} strokeWidth={1} />
        <circle cx={CX} cy={my} r={9} fill="none" stroke={GOLD_DEEP} strokeWidth={1} opacity={0.7} />
        <rect x={CX - 1.4} y={my - 7} width={2.8} height={14} rx={1} fill={GOLD_DEEP} />
        <rect x={CX - 7} y={my - 1.4} width={14} height={2.8} rx={1} fill={GOLD_DEEP} />
      </g>
    );
  }
  if (charmId === 'corazon') {
    return (
      <g>
        <path
          d={`M${CX},${my - 6} c-3.5,-8 -15,-7 -15,2 c0,8 10,11 15,18 c5,-7 15,-10 15,-18 c0,-9 -11.5,-10 -15,-2 Z`}
          fill="url(#goldGradient)"
          stroke={GOLD_DEEP}
          strokeWidth={1}
        />
        <path
          d={`M${CX - 2},${my + 2} q2,-4 6,-5`}
          fill="none"
          stroke="#FFF6DC"
          strokeWidth={1.4}
          strokeLinecap="round"
          opacity={0.8}
        />
      </g>
    );
  }
  // Virgen Milagrosa — oval medal with halo rays
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

function BraceletCanvas({
  bead,
  cordHex,
  charmId,
  canvasKey,
}: {
  bead: BeadOption;
  cordHex: string;
  charmId: string;
  canvasKey: number;
}) {
  return (
    <div className="group relative">
      {/* hover shimmer sweep (simulates facet reflections) */}
      <div className="pointer-events-none absolute inset-0 z-10 rounded-[2rem] bg-gold-sheen bg-[length:250%_100%] opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:animate-shimmer group-hover:opacity-100" />

      <motion.svg
        key={canvasKey} // re-mount on "Destello" → replay staggered assembly
        viewBox="0 0 400 470"
        className="h-auto w-full drop-shadow-[0_18px_40px_rgba(30,58,138,0.18)]"
        role="img"
        aria-label="Vista previa de tu pulsera personalizada"
        initial={{ opacity: 0, rotate: -2 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
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
        <motion.path
          d={`M ${CORD_END_L.x} ${CORD_END_L.y} A ${R} ${R} 0 1 0 ${CORD_END_R.x} ${CORD_END_R.y}`}
          fill="none"
          stroke={cordHex}
          strokeWidth={2.2}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          transition={{ duration: 0.5 }}
        />

        {/* Adjustable dual-strand cord with sliding knot */}
        <motion.g
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        >
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
          {/* sliding knot */}
          <rect x={190} y={47} width={20} height={15} rx={6} fill={cordHex} stroke="rgba(0,0,0,0.18)" strokeWidth={0.8} />
          <line x1={195} y1={49} x2={195} y2={61} stroke="rgba(0,0,0,0.15)" strokeWidth={1.2} />
          <line x1={200} y1={48} x2={200} y2={62} stroke="rgba(0,0,0,0.15)" strokeWidth={1.2} />
          <line x1={205} y1={49} x2={205} y2={61} stroke="rgba(0,0,0,0.15)" strokeWidth={1.2} />
          {/* cord tails */}
          <circle cx={254} cy={43} r={3.2} fill={cordHex} />
          <circle cx={146} cy={43} r={3.2} fill={cordHex} />
        </motion.g>

        {/* Crystals, separators and gold rings */}
        <g key={`${bead.id}`}>
          {ALL_PIECES.map((piece, index) => (
            <BeadCircle key={index} piece={piece} index={index} bead={bead} />
          ))}
        </g>

        {/* Focal charm + dangling crucifix */}
        <motion.g
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
        >
          {/* connection to the loop */}
          <circle cx={CX} cy={362} r={2.4} fill="none" stroke={GOLD} strokeWidth={1.6} />
          <Charm charmId={charmId} />
          {/* chain to crucifix */}
          <circle cx={CX} cy={394} r={2.4} fill="none" stroke={GOLD} strokeWidth={1.6} />
          <circle cx={CX} cy={400} r={2.4} fill="none" stroke={GOLD} strokeWidth={1.6} />
          {/* crucifix */}
          <rect x={CX - 3.5} y={404} width={7} height={48} rx={2.4} fill="url(#goldGradient)" stroke={GOLD_DEEP} strokeWidth={0.6} />
          <rect x={CX - 16} y={416} width={32} height={7} rx={2.4} fill="url(#goldGradient)" stroke={GOLD_DEEP} strokeWidth={0.6} />
          <circle cx={CX} cy={419.5} r={3.6} fill={GOLD_DEEP} />
        </motion.g>
      </motion.svg>
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
        className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif text-base font-bold transition-colors duration-300 ${
            open ? 'bg-gradient-to-br from-oro-light to-oro text-royal-ink shadow-aura-soft' : 'bg-cielo-100 text-royal/60'
          }`}
        >
          {number}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-lg font-semibold text-royal">{title}</span>
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
            <div className="px-5 pb-6 sm:px-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ───────────────────────── Studio ─────────────────────────

export default function BraceletStudio() {
  const { addCustomItem } = useCart();
  const [beadId, setBeadId] = useState('champana');
  const [cordId, setCordId] = useState('crema');
  const [charmId, setCharmId] = useState('milagrosa');
  const [openStep, setOpenStep] = useState(1);
  const [canvasKey, setCanvasKey] = useState(0);
  const [added, setAdded] = useState(false);

  const bead = useMemo(() => BEADS.find((b) => b.id === beadId) ?? BEADS[9], [beadId]);
  const cord = useMemo(() => CORDS.find((c) => c.id === cordId) ?? CORDS[0], [cordId]);
  const charm = useMemo(() => CHARMS.find((c) => c.id === charmId) ?? CHARMS[0], [charmId]);

  const handleAdd = () => {
    addCustomItem({ beadId, cordId, charmId });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* ── Live preview (sticky) ── */}
      <div className="sticky top-16 z-20 self-start lg:top-24">
        <div className="rounded-[2rem] border border-oro/20 bg-gradient-to-b from-white/85 to-cielo-100/70 p-4 shadow-luxe backdrop-blur-md sm:p-8">
          <div className="mx-auto max-w-[270px] sm:max-w-sm">
            <BraceletCanvas
              bead={bead}
              cordHex={cord.hex}
              charmId={charmId}
              canvasKey={canvasKey}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 sm:mt-5">
            <div className="min-w-0">
              <p className="truncate font-serif text-sm font-semibold text-royal sm:text-base">
                {bead.name}
              </p>
              <p className="truncate text-[0.7rem] text-royal/55 sm:text-xs">
                Cordón {cord.name} · {charm.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCanvasKey((k) => k + 1)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-oro/50 px-3.5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-oro-deep transition-all duration-300 hover:bg-oro/10 hover:shadow-aura-soft"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Destello
            </button>
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
          <div className="flex flex-wrap gap-4">
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

        {/* Step 2 — Crystal */}
        <Step
          number={2}
          title="Cristal principal"
          summary={bead.name}
          open={openStep === 2}
          onToggle={() => setOpenStep(openStep === 2 ? 0 : 2)}
        >
          <div className="grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-4">
            {BEADS.map((option) => {
              const selected = beadId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setBeadId(option.id);
                    setOpenStep(3);
                  }}
                  aria-pressed={selected}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <span
                    className={`relative h-12 w-12 rounded-full transition-all duration-300 ${
                      selected
                        ? 'ring-2 ring-oro ring-offset-2 ring-offset-white shadow-aura-soft scale-110'
                        : 'ring-1 ring-royal/10 group-hover:ring-oro/50 group-hover:scale-105'
                    }`}
                    style={{
                      background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.7), rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.12)), ${option.hex}`,
                    }}
                  >
                    {selected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-oro shadow-aura-soft"
                      >
                        <Check className="h-3 w-3 text-royal-ink" strokeWidth={3.5} />
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

        {/* Step 3 — Charm */}
        <Step
          number={3}
          title="Dije central"
          summary={charm.name}
          open={openStep === 3}
          onToggle={() => setOpenStep(openStep === 3 ? 0 : 3)}
        >
          <div className="space-y-3">
            {CHARMS.map((option) => {
              const selected = charmId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setCharmId(option.id)}
                  aria-pressed={selected}
                  className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 ${
                    selected
                      ? 'border-oro bg-oro/10 shadow-aura-soft'
                      : 'border-royal/10 bg-white/60 hover:border-oro/50'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                      selected ? 'bg-gradient-to-br from-oro-light to-oro text-royal-ink' : 'bg-cielo-100 text-oro-deep'
                    }`}
                  >
                    {option.id === 'corazon' ? (
                      <Gem className="h-5 w-5" strokeWidth={1.75} />
                    ) : option.id === 'benito' ? (
                      <Link2 className="h-5 w-5" strokeWidth={1.75} />
                    ) : (
                      <Wand2 className="h-5 w-5" strokeWidth={1.75} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-base font-semibold text-royal">
                      {option.name}
                    </span>
                    <span className="block text-xs text-royal/55">{option.description}</span>
                  </span>
                  {selected && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="h-5 w-5 text-oro-deep" strokeWidth={2.5} />
                    </motion.span>
                  )}
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
          className="rounded-3xl border border-oro/25 bg-white/85 p-6 shadow-card sm:p-7"
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
            <button type="button" onClick={handleAdd} className="btn-gold w-full">
              {added ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={3} />
                  ¡Agregada con amor!
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" strokeWidth={2} />
                  Añadir configuración personalizada
                </>
              )}
            </button>
          </motion.div>
          <p className="mt-3 text-center text-xs text-royal/50">
            Hecha a mano para ti · Elaboración de 5 a 8 días · Envíos a toda Colombia
          </p>
        </motion.div>
      </div>
    </div>
  );
}
