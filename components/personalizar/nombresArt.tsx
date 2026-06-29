'use client';

/**
 * "Collar de Nombres" artwork.
 *
 * A hand-knotted name necklace: white letter beads spell each name, separated
 * by faceted color pepas (from the live stock) and threaded on metallic seed
 * beads. The same SVG drives the configurator preview AND the storefront tile,
 * so the marketing render always matches the real product.
 *
 * Pass `animate={false}` for the static storefront tile.
 */

import { motion } from 'framer-motion';
import { GOLD, GOLD_DEEP, GOLD_LIGHT } from '@/lib/customBracelet';
import type { PepaPaint } from './pulseraArt';

// ───────────────────────── Necklace drape geometry ─────────────────────────

// Beads sit on a circular arc whose centre is well above the canvas, giving a
// gentle "smile" drape. Angles are measured in SVG space (y grows downward),
// so 90° is the bottom-centre of the necklace.
const CX = 200;
const CY_TOP = 18;
const R = 212;
const A_LEFT = 140; // first (leftmost) bead
const A_RIGHT = 40; // last (rightmost) bead
const MIN_BEADS = 30; // keep short names looking like a full necklace

type Family = 'maria' | 'jesus';
type SeqBead =
  | { k: 'letter'; ch: string }
  | { k: 'accent'; fam: Family }
  | { k: 'seed' };

function pointAt(deg: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY_TOP + R * Math.sin(rad) };
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

  const pad = Math.max(MIN_BEADS - core.length, 8);
  const left = Math.ceil(pad / 2);
  const right = pad - left;
  const leftPad = Array.from({ length: left }, (_, j) => filler(left - 1 - j));
  const rightPad = Array.from({ length: right }, (_, j) => filler(j));
  return [...leftPad, ...core, ...rightPad];
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

function LetterBead({
  x,
  y,
  r,
  ch,
}: {
  x: number;
  y: number;
  r: number;
  ch: string;
}) {
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

/** Small silver clasp medallion that rides near the right of the thread. */
function ClaspMedal({ x, y, metalHex }: { x: number; y: number; metalHex: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={8} ry={10} fill={metalHex} stroke={GOLD_DEEP} strokeWidth={0.8} />
      <ellipse cx={x} cy={y} rx={8} ry={10} fill="url(#nSeed)" opacity={0.6} />
      <ellipse cx={x} cy={y} rx={4.5} ry={6.5} fill="none" stroke={GOLD_DEEP} strokeWidth={0.6} opacity={0.6} />
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
  const step = (A_LEFT - A_RIGHT) / Math.max(n - 1, 1);

  // Even angular spacing → uniform arc-length spacing. Size beads to fit.
  const arcLen = (R * (A_LEFT - A_RIGHT) * Math.PI) / 180;
  const spacing = arcLen / Math.max(n - 1, 1);
  const seedR = Math.max(2.4, Math.min(4, spacing * 0.34));
  const accentR = Math.max(4, Math.min(7.5, spacing * 0.5));
  const letterR = Math.max(5.5, Math.min(10, spacing * 0.56));

  const placed = seq.map((b, i) => ({ b, ...pointAt(A_LEFT - i * step), i }));

  // Thread: sampled arc + short tails rising to the clasp at top centre.
  const samples = 64;
  const arc = Array.from({ length: samples + 1 }, (_, k) => {
    const a = A_LEFT - (k / samples) * (A_LEFT - A_RIGHT);
    const p = pointAt(a);
    return `${k === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }).join(' ');
  const lEnd = pointAt(A_LEFT);
  const rEnd = pointAt(A_RIGHT);
  // Clasp medal rides midway along the right-hand tail (bead end → top clasp).
  const clasp = { x: (rEnd.x + CX) / 2, y: (rEnd.y + 12) / 2 };

  return (
    <svg
      viewBox="0 0 400 300"
      className="h-auto w-full drop-shadow-[0_18px_40px_rgba(30,58,138,0.18)]"
      role="img"
      aria-label={`Vista previa de tu collar de nombres ${clean.join(', ')}`}
    >
      <NombresDefs />

      {/* Thread + clasp tails */}
      <path
        d={`M${CX} 12 L${lEnd.x.toFixed(1)} ${lEnd.y.toFixed(1)} ${arc} L${CX} 12`}
        fill="none"
        stroke={metalHex}
        strokeWidth={1.6}
        strokeLinejoin="round"
        opacity={0.85}
      />
      <circle cx={CX} cy={12} r={4} fill="none" stroke={metalHex} strokeWidth={1.6} />
      <ClaspMedal x={clasp.x} y={clasp.y} metalHex={metalHex} />

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
              transition={{ duration: 0.3, delay: i * 0.01 }}
            >
              {inner}
            </motion.g>
          );
        })}
      </g>
    </svg>
  );
}
