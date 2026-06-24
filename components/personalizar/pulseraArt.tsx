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
import { GOLD, GOLD_DEEP, GOLD_LIGHT } from '@/lib/customBracelet';

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

// ───────────────────────── Collar preview ─────────────────────────

export function CollarPreview({
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

      {/* Centerpiece medal (Ave María) + crucifix */}
      <MedalRound x={C_MEDAL.x} y={C_MEDAL.y} />
      <CrossCharm x={C_CX} y={C_CROSS_Y} />
    </svg>
  );
}
