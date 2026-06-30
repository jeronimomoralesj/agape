'use client';

/**
 * Shared "crea tu pulsera / collar" artwork.
 *
 * The same SVG geometry powers the live configurator preview AND the
 * "Crea tu pulsera o collar" tile on the storefront, so the marketing render
 * always matches the real product (single source of truth).
 *
 * Pass `animate={false}` for the static storefront tile; the configurator
 * leaves it on so beads stagger in as the customer changes colors.
 */

import { motion } from 'framer-motion';
import { COLOMBIA_FLAG, GOLD, GOLD_DEEP, GOLD_LIGHT } from '@/lib/customBracelet';

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

/** A pepa color reduced to what the canvas needs. */
export interface PepaPaint {
  hex: string;
  light: boolean;
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

/**
 * Pulsera loop: 5 Ave María groups separated by 4 Padre Nuestro pepas.
 * Unlike the collar, the pulsera is a near-closed ring, so a leading Padre
 * Nuestro would sit right beside the trailing group at the top seam and read
 * as a doubled bead — we drop it, leaving 4 evenly between the groups.
 */
function pulseraLoop(): ArcStep[] {
  const out: ArcStep[] = [];
  for (let d = 0; d < 5; d++) {
    if (d > 0) out.push({ family: 'jesus', r: JESUS_R, weight: 1.55 });
    out.push(...rep(10, { family: 'maria' as Family, r: MARIA_R, weight: 1 }));
  }
  return out;
}

// ── Pulsera: a full ellipse of pepas (knot hidden at the back), medal below ──
const P_CX = 200;
const P_CY = 196;
const P_RX = 142;
const P_RY = 150;
const PULSERA_PIECES: Piece[] = layoutLoop(pulseraLoop(), {
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
  animate = true,
}: {
  piece: Piece;
  hex: string;
  light: boolean;
  index: number;
  animate?: boolean;
}) {
  const { x, y, r } = piece;
  const rim = light ? 'rgba(150,130,95,0.45)' : 'rgba(0,0,0,0.28)';
  const inner = (
    <>
      <circle cx={x} cy={y} r={r} fill={hex} stroke={rim} strokeWidth={0.8} />
      <circle cx={x} cy={y} r={r} fill="url(#facetHighlight)" />
      <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.22} fill="rgba(255,255,255,0.85)" />
    </>
  );
  if (!animate) return <g>{inner}</g>;
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, delay: index * 0.012 }}
    >
      {inner}
    </motion.g>
  );
}

/** Render a list of pieces, coloring each by its family. */
function Beads({
  pieces,
  maria,
  jesus,
  offset = 0,
  animate = true,
}: {
  pieces: Piece[];
  maria: PepaPaint;
  jesus: PepaPaint;
  offset?: number;
  animate?: boolean;
}) {
  return (
    <>
      {pieces.map((p, i) => {
        const fam = p.family === 'jesus' ? jesus : maria;
        return (
          <Bead
            key={i + offset}
            piece={p}
            hex={fam.hex}
            light={fam.light}
            index={i + offset}
            animate={animate}
          />
        );
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

// ───────────────────────── Collar dijes (medals) ─────────────────────────

const DIJE_R = 19;

/** Gold disc base shared by every collar medal. */
function MedalDisc({ x, y, r = DIJE_R }: { x: number; y: number; r?: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} fill="url(#goldGradient)" stroke={GOLD_DEEP} strokeWidth={1.2} />
      <circle cx={x} cy={y} r={r - 3} fill="none" stroke={GOLD_DEEP} strokeWidth={0.7} opacity={0.5} />
    </>
  );
}

/** Virgen de Guadalupe — full figure inside a radiant mandorla. */
function DijeGuadalupe({ x, y }: { x: number; y: number }) {
  const r = DIJE_R;
  return (
    <g>
      {/* Mandorla of rays all around */}
      {Array.from({ length: 28 }).map((_, i) => {
        const a = (i / 28) * Math.PI * 2;
        const long = i % 2 === 0;
        return (
          <line
            key={i}
            x1={x + r * Math.cos(a)}
            y1={y + r * Math.sin(a)}
            x2={x + (r + (long ? 6 : 3.5)) * Math.cos(a)}
            y2={y + (r + (long ? 6 : 3.5)) * Math.sin(a)}
            stroke={GOLD}
            strokeWidth={long ? 1.8 : 1}
            strokeLinecap="round"
            opacity={0.85}
          />
        );
      })}
      <MedalDisc x={x} y={y} />
      {/* Mantle (cloak) tapering to the hem */}
      <path
        d={`M${x},${y - 12}
            C ${x - 7.5},${y - 6} ${x - 8.5},${y + 7} ${x - 6.5},${y + 12}
            L ${x + 6.5},${y + 12}
            C ${x + 8.5},${y + 7} ${x + 7.5},${y - 6} ${x},${y - 12} Z`}
        fill={GOLD_DEEP}
        opacity={0.82}
      />
      {/* Inner robe */}
      <path
        d={`M${x},${y - 7} C ${x - 3.5},${y - 4} ${x - 4},${y + 6} ${x - 3},${y + 11}
            L ${x + 3},${y + 11} C ${x + 4},${y + 6} ${x + 3.5},${y - 4} ${x},${y - 7} Z`}
        fill="url(#goldGradient)"
        opacity={0.9}
      />
      {/* Bowed, veiled head */}
      <circle cx={x} cy={y - 9} r={3.1} fill="url(#goldGradient)" stroke={GOLD_DEEP} strokeWidth={0.6} />
      <path d={`M${x - 3.2},${y - 9} a3.2,3.6 0 0 1 6.4,0`} fill="none" stroke={GOLD_DEEP} strokeWidth={0.8} />
      {/* Joined hands in prayer */}
      <path d={`M${x},${y - 4.5} l-1.8,4.5 l1.8,1.4 l1.8,-1.4 Z`} fill={GOLD_DEEP} opacity={0.85} />
    </g>
  );
}

/** Virgen Milagrosa — standing figure with grace radiating from the hands. */
function DijeMilagrosa({ x, y }: { x: number; y: number }) {
  const r = DIJE_R;
  return (
    <g>
      <MedalDisc x={x} y={y} />
      {/* Twelve stars around the inner rim */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle
            key={i}
            cx={x + (r - 5) * Math.cos(a)}
            cy={y + (r - 5) * Math.sin(a)}
            r={0.9}
            fill={GOLD_DEEP}
            opacity={0.7}
          />
        );
      })}
      {/* Rays of grace from the outstretched hands */}
      {[-1, 1].map((side) =>
        [0, 1, 2].map((j) => {
          const sx = x + side * 4.5;
          const sy = y - 1;
          const ang = (side * (28 + j * 18) * Math.PI) / 180;
          return (
            <line
              key={`${side}-${j}`}
              x1={sx}
              y1={sy}
              x2={sx + Math.sin(ang) * 9}
              y2={sy + Math.cos(ang) * 9}
              stroke={GOLD_DEEP}
              strokeWidth={0.9}
              strokeLinecap="round"
              opacity={0.6}
            />
          );
        })
      )}
      {/* Head with veil */}
      <circle cx={x} cy={y - 8.5} r={2.8} fill="url(#goldGradient)" stroke={GOLD_DEEP} strokeWidth={0.6} />
      {/* Robe + slightly outstretched arms */}
      <path
        d={`M${x},${y - 5.5}
            C ${x - 4.5},${y - 4} ${x - 5},${y - 1} ${x - 6},${y + 1}
            M${x},${y - 5.5}
            C ${x + 4.5},${y - 4} ${x + 5},${y - 1} ${x + 6},${y + 1}`}
        fill="none"
        stroke={GOLD_DEEP}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.85}
      />
      <path
        d={`M${x},${y - 6} C ${x - 4},${y - 2} ${x - 4.5},${y + 7} ${x - 3.5},${y + 11.5}
            L ${x + 3.5},${y + 11.5} C ${x + 4.5},${y + 7} ${x + 4},${y - 2} ${x},${y - 6} Z`}
        fill={GOLD_DEEP}
        opacity={0.82}
      />
    </g>
  );
}

/** San Benito de Nursia — the Cross of St. Benedict with C·S·P·B in the quarters. */
function DijeSanBenito({ x, y }: { x: number; y: number }) {
  const r = DIJE_R;
  const arm = r - 5.5;
  return (
    <g>
      <MedalDisc x={x} y={y} />
      {/* Beaded rim */}
      {Array.from({ length: 30 }).map((_, i) => {
        const a = (i / 30) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={x + (r - 1.5) * Math.cos(a)}
            cy={y + (r - 1.5) * Math.sin(a)}
            r={0.6}
            fill={GOLD_DEEP}
            opacity={0.55}
          />
        );
      })}
      {/* Bold cross */}
      <rect x={x - 1.7} y={y - arm} width={3.4} height={arm * 2} rx={1.1} fill={GOLD_DEEP} />
      <rect x={x - arm} y={y - 1.7} width={arm * 2} height={3.4} rx={1.1} fill={GOLD_DEEP} />
      <circle cx={x} cy={y} r={2.6} fill="url(#goldGradient)" stroke={GOLD_DEEP} strokeWidth={0.7} />
      {/* C · S · P · B in the quadrants */}
      {(
        [
          ['C', -1, -1],
          ['S', 1, -1],
          ['P', -1, 1],
          ['B', 1, 1],
        ] as const
      ).map(([ch, sx, sy]) => (
        <text
          key={ch}
          x={x + sx * 7.5}
          y={y + sy * 7.5 + 2}
          textAnchor="middle"
          fontSize={5}
          fontWeight={700}
          fontFamily="Georgia, 'Times New Roman', serif"
          fill={GOLD_DEEP}
          opacity={0.85}
        >
          {ch}
        </text>
      ))}
    </g>
  );
}

export type DijeId = 'guadalupe' | 'milagrosa' | 'san-benito';

/** Render the chosen collar centerpiece medal. */
function DijeMedal({ id, x, y }: { id: string; x: number; y: number }) {
  if (id === 'milagrosa') return <DijeMilagrosa x={x} y={y} />;
  if (id === 'san-benito') return <DijeSanBenito x={x} y={y} />;
  return <DijeGuadalupe x={x} y={y} />;
}

/** Standalone medal swatch for the dije picker. */
export function DijeSwatch({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 56 56" className="h-full w-full" role="img" aria-hidden="true">
      <SvgDefs />
      <DijeMedal id={id} x={28} y={28} />
    </svg>
  );
}

// ───────────────────────── Pulsera preview ─────────────────────────

export function PulseraPreview({
  maria,
  jesus,
  cordHex,
  animate = true,
}: {
  maria: PepaPaint;
  jesus: PepaPaint;
  cordHex: string;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 400 460"
      className="h-auto w-full drop-shadow-[0_18px_40px_rgba(30,58,138,0.18)]"
      role="img"
      aria-label="Vista previa de tu pulsera personalizada"
    >
      <SvgDefs />

      {/* Thread around the full loop — the knot sits hidden at the back */}
      <path d={P_LOOP} fill="none" stroke={cordHex} strokeWidth={2.4} strokeLinecap="round" opacity={0.95} />

      {/* Pepas — re-staggers when colors change */}
      <g key={`${maria.hex}-${jesus.hex}`}>
        <Beads pieces={PULSERA_PIECES} maria={maria} jesus={jesus} animate={animate} />
      </g>

      {/* Virgen Milagrosa + dangling crucifix */}
      <g>
        <circle cx={P_CX} cy={P_MEDAL_Y} r={2.4} fill="none" stroke={GOLD} strokeWidth={1.6} />
        <VirgenCharm cx={P_CX} cy={P_MEDAL_Y + 18} />
        <circle cx={P_CX} cy={P_MEDAL_Y + 38} r={2.4} fill="none" stroke={GOLD} strokeWidth={1.6} />
        <CrossCharm x={P_CX} y={P_MEDAL_Y + 44} />
      </g>
    </svg>
  );
}

// ───────────────────────── Pulsera Colombia preview ─────────────────────────
//
// Limited-edition tricolor bracelet: the flag colors (amarillo · azul · rojo)
// replace the devotional pepas, with a customer-chosen separator pepita (white
// or black) between each color. Same loop geometry + Virgen + cross as the
// regular pulsera, so it reads as one of the family.

interface ColorPiece {
  x: number;
  y: number;
  r: number;
  hex: string;
  light: boolean;
}
interface ColorStep {
  hex: string;
  light: boolean;
  r: number;
  weight: number;
}

const FLAG_BEAD_R = 5.2;
const SEP_BEAD_R = 4.0;

const [FLAG_Y, FLAG_B, FLAG_R] = COLOMBIA_FLAG.map((c) => c.hex);

/**
 * Two bead arrangements for the flag:
 *
 * 'bloques' (default) — symmetric blocks. From the cross at the bottom:
 *   10 amarillo · 10 azul · 10 rojo · 10 azul · 10 amarillo, a single rojo
 *   block at the top, amarillo flanking the cross, separators between blocks.
 *
 * 'repetido' — clockwise from the dije, the unit 4 amarillo · 3 azul · 3 rojo
 *   followed by a separator, repeated 5 times around the loop.
 */
function colombiaLoop(patternId: string, sepHex: string, sepLight: boolean): ColorStep[] {
  const flag = (hex: string): ColorStep => ({ hex, light: false, r: FLAG_BEAD_R, weight: 1 });
  const sep = (): ColorStep => ({ hex: sepHex, light: sepLight, r: SEP_BEAD_R, weight: 0.7 });

  if (patternId === 'repetido') {
    const out: ColorStep[] = [];
    for (let i = 0; i < 5; i++) {
      out.push(
        ...rep(4, flag(FLAG_Y)),
        ...rep(3, flag(FLAG_B)),
        ...rep(3, flag(FLAG_R)),
        sep()
      );
    }
    return out;
  }

  return [
    sep(),
    ...rep(10, flag(FLAG_Y)),
    sep(),
    ...rep(10, flag(FLAG_B)),
    sep(),
    ...rep(10, flag(FLAG_R)),
    sep(),
    ...rep(10, flag(FLAG_B)),
    sep(),
    ...rep(10, flag(FLAG_Y)),
    sep(),
  ];
}

/** Distribute a weighted pattern of explicitly-colored beads along the loop. */
function layoutColorLoop(pattern: ColorStep[], o: LoopOpts): ColorPiece[] {
  const total = pattern.reduce((s, p) => s + p.weight, 0);
  const pieces: ColorPiece[] = [];
  let cursor = 0;
  for (const p of pattern) {
    const t = (cursor + p.weight / 2) / total;
    const deg = o.startDeg + (o.endDeg - o.startDeg) * t;
    const { x, y } = loopPt(o.cx, o.cy, o.rx, o.ry, deg, o.taper ?? 0);
    pieces.push({ x, y, r: p.r, hex: p.hex, light: p.light });
    cursor += p.weight;
  }
  return pieces;
}

export function PulseraColombiaPreview({
  separatorHex,
  separatorLight,
  cordHex,
  patternId = 'bloques',
  animate = true,
}: {
  separatorHex: string;
  separatorLight: boolean;
  cordHex: string;
  patternId?: string;
  animate?: boolean;
}) {
  const pieces = layoutColorLoop(colombiaLoop(patternId, separatorHex, separatorLight), {
    cx: P_CX,
    cy: P_CY,
    rx: P_RX,
    ry: P_RY,
    startDeg: 108,
    endDeg: 432,
  });
  return (
    <svg
      viewBox="0 0 400 460"
      className="h-auto w-full drop-shadow-[0_18px_40px_rgba(30,58,138,0.18)]"
      role="img"
      aria-label="Vista previa de la Pulsera Colombia edición limitada"
    >
      <SvgDefs />

      {/* Thread around the full loop — the knot sits hidden at the back */}
      <path d={P_LOOP} fill="none" stroke={cordHex} strokeWidth={2.4} strokeLinecap="round" opacity={0.95} />

      {/* Tricolor pepas — re-staggers when the pattern or separator changes */}
      <g key={`${patternId}-${separatorHex}`}>
        {pieces.map((p, i) => (
          <Bead
            key={i}
            piece={{ family: 'maria', x: p.x, y: p.y, r: p.r }}
            hex={p.hex}
            light={p.light}
            index={i}
            animate={animate}
          />
        ))}
      </g>

      {/* Virgen Milagrosa + dangling crucifix (same as the pulsera) */}
      <g>
        <circle cx={P_CX} cy={P_MEDAL_Y} r={2.4} fill="none" stroke={GOLD} strokeWidth={1.6} />
        <VirgenCharm cx={P_CX} cy={P_MEDAL_Y + 18} />
        <circle cx={P_CX} cy={P_MEDAL_Y + 38} r={2.4} fill="none" stroke={GOLD} strokeWidth={1.6} />
        <CrossCharm x={P_CX} y={P_MEDAL_Y + 44} />
      </g>
    </svg>
  );
}

// ───────────────────────── Collar preview ─────────────────────────

export function CollarPreview({
  maria,
  jesus,
  cordHex,
  dijeId = 'guadalupe',
  animate = true,
}: {
  maria: PepaPaint;
  jesus: PepaPaint;
  cordHex: string;
  dijeId?: string;
  animate?: boolean;
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
        <Beads pieces={COLLAR_LOOP_PIECES} maria={maria} jesus={jesus} animate={animate} />
        <Beads
          pieces={C_PENDANT}
          maria={maria}
          jesus={jesus}
          offset={COLLAR_LOOP_PIECES.length}
          animate={animate}
        />
      </g>

      {/* Centerpiece medal (customer's chosen dije) + crucifix */}
      <DijeMedal id={dijeId} x={C_MEDAL.x} y={C_MEDAL.y} />
      <CrossCharm x={C_CX} y={C_CROSS_Y} />
    </svg>
  );
}
