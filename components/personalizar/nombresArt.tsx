'use client';

/**
 * "Collar de Nombres" artwork.
 *
 * A hand-knotted name necklace laid out as a vertical elliptical loop: white
 * letter beads spell each name along the bottom, separated by faceted color
 * pepas (from the live stock) and threaded on metallic seed beads, with a
 * clasp medallion closing the loop at the top. The same SVG drives the
 * configurator preview AND the storefront tile, so the marketing render
 * always matches the real product.
 *
 * Pass `animate={false}` for the static storefront tile.
 */

import { motion } from 'framer-motion';
import { GOLD, GOLD_DEEP, GOLD_LIGHT } from '@/lib/customBracelet';
import type { PepaPaint } from './pulseraArt';

// ───────────────────────── Elliptical loop geometry ─────────────────────────

// Beads ride a vertical ellipse (taller than wide, like the real piece laid
// flat). Angles are SVG-space degrees (y grows downward): 90° is the bottom
// (where the names sit), 270° is the top (where the clasp closes the loop).
const CX = 200;
const CY = 215;
const RX = 146;
const RY = 192;
// Sweep from just right-of-top, clockwise through the bottom, to just
// left-of-top — leaving a small gap at the very top for the clasp. The span is
// centred on 90° so the names land dead-centre at the bottom.
const A_START = -68;
const A_END = 248;
const MIN_BEADS = 40; // keep short names looking like a full necklace

type Family = 'maria' | 'jesus';
type SeqBead =
  | { k: 'letter'; ch: string }
  | { k: 'accent'; fam: Family }
  | { k: 'seed' };

function ellipsePt(deg: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + RX * Math.cos(rad), y: CY + RY * Math.sin(rad) };
}

/**
 * Place `count` beads evenly **by arc length** along the ellipse sweep, so
 * spacing stays uniform despite the ellipse's varying curvature.
 */
function placeByArcLength(count: number): { x: number; y: number }[] {
  const STEPS = 900;
  const pts: { x: number; y: number }[] = [];
  const cum: number[] = [0];
  let prev = ellipsePt(A_START);
  pts.push(prev);
  for (let i = 1; i <= STEPS; i++) {
    const deg = A_START + ((A_END - A_START) * i) / STEPS;
    const p = ellipsePt(deg);
    const d = Math.hypot(p.x - prev.x, p.y - prev.y);
    cum.push(cum[i - 1] + d);
    pts.push(p);
    prev = p;
  }
  const total = cum[STEPS];
  const out: { x: number; y: number }[] = [];
  for (let b = 0; b < count; b++) {
    // Clamp to `total` so floating-point drift can't overshoot the last segment.
    const target =
      count === 1 ? total / 2 : Math.min((total * b) / (count - 1), total);
    // Walk the cumulative table to the segment containing `target`. `lo` stays
    // in [0, STEPS-1] so pts[lo + 1] is always defined.
    let lo = 0;
    while (lo < STEPS - 1 && cum[lo + 1] < target) lo++;
    const segLen = cum[lo + 1] - cum[lo] || 1;
    const t = Math.min(Math.max((target - cum[lo]) / segLen, 0), 1);
    out.push({
      x: pts[lo].x + (pts[lo + 1].x - pts[lo].x) * t,
      y: pts[lo].y + (pts[lo + 1].y - pts[lo].y) * t,
    });
  }
  return out;
}

/** Build the full bead run: names centred, color/seed filler on both sides. */
function buildSequence(names: string[]): SeqBead[] {
  const core: SeqBead[] = [];
  names.forEach((name, i) => {
    if (i > 0) {
      core.push({ k: 'seed' }, { k: 'accent', fam: 'jesus' }, { k: 'seed' });
    }
    for (const ch of name) core.push({ k: 'letter', ch });
  });
  if (core.length === 0) core.push({ k: 'accent', fam: 'jesus' });

  // Repeating side filler, outermost → inward: seed · seed · color pepa.
  const filler = (j: number): SeqBead =>
    j % 3 === 0 ? { k: 'accent', fam: 'maria' } : { k: 'seed' };

  const pad = Math.max(MIN_BEADS - core.length, 10);
  const left = Math.ceil(pad / 2);
  const right = pad - left;
  const leftPad = Array.from({ length: left }, (_, j) => filler(left - 1 - j));
  const rightPad = Array.from({ length: right }, (_, j) => filler(j));
  // Reading order is left → right, but the sweep runs right → left across the
  // bottom, so reverse to keep the names readable.
  return [...leftPad, ...core, ...rightPad].reverse();
}

// ───────────────────────── Bead primitives ─────────────────────────

function NombresDefs() {
  return (
    <defs>
      <radialGradient id="nFacet" cx="32%" cy="28%" r="72%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
        <stop offset="45%" stopColor="rgba(255,255,255,0.12)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
      </radialGradient>
      <radialGradient id="nSeed" cx="34%" cy="30%" r="75%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
        <stop offset="55%" stopColor="rgba(255,255,255,0.25)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
      </radialGradient>
      <linearGradient id="nGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={GOLD_LIGHT} />
        <stop offset="55%" stopColor={GOLD} />
        <stop offset="100%" stopColor={GOLD_DEEP} />
      </linearGradient>
    </defs>
  );
}

function Pepa({ x, y, r, hex, light }: { x: number; y: number; r: number; hex: string; light: boolean }) {
  const rim = light ? 'rgba(150,130,95,0.45)' : 'rgba(0,0,0,0.28)';
  return (
    <>
      <circle cx={x} cy={y} r={r} fill={hex} stroke={rim} strokeWidth={0.8} />
      <circle cx={x} cy={y} r={r} fill="url(#nFacet)" />
      <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.22} fill="rgba(255,255,255,0.85)" />
    </>
  );
}

function SeedBead({ x, y, r, hex }: { x: number; y: number; r: number; hex: string }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} fill={hex} stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.95} />
      <circle cx={x} cy={y} r={r} fill="url(#nSeed)" />
    </>
  );
}

function LetterBead({ x, y, r, ch }: { x: number; y: number; r: number; ch: string }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} fill="#F8F4EA" stroke="rgba(0,0,0,0.16)" strokeWidth={0.7} />
      <circle cx={x} cy={y} r={r} fill="url(#nFacet)" opacity={0.5} />
      <text
        x={x}
        y={y + r * 0.36}
        textAnchor="middle"
        fontSize={r * 1.15}
        fontWeight={700}
        fontFamily="Georgia, 'Times New Roman', serif"
        fill={GOLD_DEEP}
      >
        {ch}
      </text>
    </>
  );
}

/** Small silver clasp medallion that closes the loop at the top. */
function ClaspMedal({ x, y, metalHex }: { x: number; y: number; metalHex: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={8.5} ry={11} fill={metalHex} stroke={GOLD_DEEP} strokeWidth={0.9} />
      <ellipse cx={x} cy={y} rx={8.5} ry={11} fill="url(#nSeed)" opacity={0.6} />
      <ellipse cx={x} cy={y} rx={4.8} ry={7} fill="none" stroke={GOLD_DEEP} strokeWidth={0.6} opacity={0.6} />
    </g>
  );
}

// ───────────────────────── Preview ─────────────────────────

export function NombresCollarPreview({
  maria,
  jesus,
  metalHex,
  names,
  animate = true,
}: {
  maria: PepaPaint;
  jesus: PepaPaint;
  metalHex: string;
  names: string[];
  animate?: boolean;
}) {
  const clean = names.map((n) => n.toUpperCase()).filter(Boolean);
  const seq = buildSequence(clean.length ? clean : ['']);
  const n = seq.length;
  const positions = placeByArcLength(n);

  // Size beads to the local spacing so nothing overlaps.
  const spacing =
    n > 1
      ? Math.hypot(positions[1].x - positions[0].x, positions[1].y - positions[0].y)
      : 16;
  const seedR = Math.max(2.4, Math.min(4, spacing * 0.34));
  const accentR = Math.max(4, Math.min(7.5, spacing * 0.52));
  const letterR = Math.max(5.5, Math.min(10.5, spacing * 0.58));

  const placed = seq.map((b, i) => ({ b, ...positions[i], i }));

  // Thread: the elliptical sweep + two short tails meeting at the clasp.
  const start = ellipsePt(A_START);
  const end = ellipsePt(A_END);
  const claspY = CY - RY - 6;
  const arc = `M${start.x.toFixed(1)} ${start.y.toFixed(1)} A${RX} ${RY} 0 1 1 ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;

  return (
    <svg
      viewBox="0 0 400 440"
      className="h-auto w-full drop-shadow-[0_18px_40px_rgba(30,58,138,0.18)]"
      role="img"
      aria-label={`Vista previa de tu collar de nombres ${clean.join(', ')}`}
    >
      <NombresDefs />

      {/* Thread loop + clasp tails */}
      <path d={arc} fill="none" stroke={metalHex} strokeWidth={1.6} opacity={0.8} />
      <path
        d={`M${start.x.toFixed(1)} ${start.y.toFixed(1)} L${CX} ${claspY} L${end.x.toFixed(1)} ${end.y.toFixed(1)}`}
        fill="none"
        stroke={metalHex}
        strokeWidth={1.6}
        strokeLinejoin="round"
        opacity={0.8}
      />
      <ClaspMedal x={CX} y={claspY} metalHex={metalHex} />

      {/* Beads */}
      <g key={`${maria.hex}-${jesus.hex}-${metalHex}-${clean.join('')}`}>
        {placed.map(({ b, x, y, i }) => {
          const inner =
            b.k === 'letter' ? (
              <LetterBead x={x} y={y} r={letterR} ch={b.ch} />
            ) : b.k === 'accent' ? (
              <Pepa
                x={x}
                y={y}
                r={accentR}
                hex={b.fam === 'jesus' ? jesus.hex : maria.hex}
                light={b.fam === 'jesus' ? jesus.light : maria.light}
              />
            ) : (
              <SeedBead x={x} y={y} r={seedR} hex={metalHex} />
            );
          if (!animate) return <g key={i}>{inner}</g>;
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.008 }}
            >
              {inner}
            </motion.g>
          );
        })}
      </g>
    </svg>
  );
}
