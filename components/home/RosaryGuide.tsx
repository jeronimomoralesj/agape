'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Cross, Sparkles } from 'lucide-react';
import { ROSARY_STEPS, ROSARY_AFTER_EACH } from '@/lib/mysteries';
import { Reveal } from '@/components/motion/Reveal';

const EASE = [0.22, 1, 0.36, 1] as const;

// Closed rosary loop, drawn clockwise starting at the medal (bottom center)
const LOOP_PATH =
  'M 200 368 C 120 345, 58 285, 66 205 C 73 130, 135 64, 200 56 C 265 64, 327 130, 334 205 C 342 285, 280 345, 200 368';
// Tail from the medal down toward the cross
const TAIL_PATH = 'M 200 372 C 200 398, 200 412, 200 436';

interface Bead {
  x: number;
  y: number;
  large: boolean;
}

/** Position of each numbered step marker. Steps 2–6 sit on the loop. */
const LOOP_MARKER_FRACTIONS: Record<number, number> = {
  2: 0.06, // Primer misterio — just left of the medal
  3: 0.26, // Segundo misterio
  4: 0.48, // Tercer misterio — top
  5: 0.7, // Cuarto misterio
  6: 0.9, // Quinto misterio
};

export default function RosaryGuide() {
  const loopRef = useRef<SVGPathElement>(null);
  const tailRef = useRef<SVGPathElement>(null);
  const [beads, setBeads] = useState<Bead[]>([]);
  const [markers, setMarkers] = useState<Record<number, { x: number; y: number }>>({});
  const [activeStep, setActiveStep] = useState(1);
  // Measured path lengths drive a dash-offset draw animation —
  // more reliable on mobile Safari than framer's pathLength trick.
  const [lengths, setLengths] = useState<{ loop: number; tail: number } | null>(null);

  // Lay out beads along the real path geometry after mount
  useEffect(() => {
    const loop = loopRef.current;
    const tail = tailRef.current;
    if (!loop || !tail) return;

    const loopLength = loop.getTotalLength();
    const computed: Bead[] = [];

    // 5 decades of 10 small beads + a large Padre Nuestro bead between decades
    const totalBeads = 55;
    for (let i = 0; i < totalBeads; i++) {
      const point = loop.getPointAtLength(((i + 0.5) / totalBeads) * loopLength);
      computed.push({ x: point.x, y: point.y, large: i % 11 === 0 });
    }

    // Tail beads (1 large + 3 small, like the brand diagram)
    const tailLength = tail.getTotalLength();
    [0.15, 0.45, 0.7, 0.92].forEach((f, i) => {
      const point = tail.getPointAtLength(f * tailLength);
      computed.push({ x: point.x, y: point.y, large: i === 0 });
    });

    setBeads(computed);

    const markerPositions: Record<number, { x: number; y: number }> = {};
    for (const [step, fraction] of Object.entries(LOOP_MARKER_FRACTIONS)) {
      const point = loop.getPointAtLength(fraction * loopLength);
      markerPositions[Number(step)] = { x: point.x, y: point.y };
    }
    markerPositions[7] = { x: 200, y: 368 }; // medal
    markerPositions[1] = { x: 200, y: 468 }; // cross
    setMarkers(markerPositions);
    setLengths({ loop: loopLength, tail: tailLength });
  }, []);

  return (
    <section
      id="guia-rosario"
      className="relative scroll-mt-24 overflow-hidden bg-royal-radial py-24 text-cielo-100 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oro to-transparent" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-oro/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
        {/* Copy + steps */}
        <div>
          <Reveal>
            <p className="section-eyebrow !text-oro-light flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Una guía para orar
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
              El camino del <span className="italic text-oro-light">Santo Rosario</span>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-cielo-100/75">
              Cada pulsera Ágape lleva en sí el ritmo de la oración. Recorre el camino:
              toca cada paso y descubre su lugar en el rosario.
            </p>
          </Reveal>

          <div className="mt-10 space-y-2">
            {ROSARY_STEPS.map((item, index) => (
              <motion.button
                key={item.step}
                type="button"
                onClick={() => setActiveStep(item.step)}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: index * 0.08 }}
                className={`flex w-full items-center gap-4 rounded-xl border px-5 py-3.5 text-left transition-all duration-300 ${
                  activeStep === item.step
                    ? 'border-oro bg-oro/15 shadow-aura-soft'
                    : 'border-cielo-100/10 bg-white/5 hover:border-oro/40 hover:bg-white/10'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-serif text-sm font-bold transition-colors duration-300 ${
                    activeStep === item.step
                      ? 'bg-oro text-royal-ink'
                      : 'bg-cielo-100/10 text-oro-light'
                  }`}
                >
                  {item.step}
                </span>
                <span className="font-sans text-sm sm:text-base">{item.label}</span>
              </motion.button>
            ))}
          </div>

          <Reveal delay={0.3} className="mt-8">
            <p className="rounded-xl border border-oro/30 bg-oro/10 px-5 py-4 text-sm italic text-oro-pale">
              {ROSARY_AFTER_EACH}
            </p>
          </Reveal>
        </div>

        {/* Interactive SVG rosary */}
        <Reveal className="mx-auto w-full max-w-md">
          <svg
            viewBox="0 0 400 520"
            className="h-auto w-full drop-shadow-[0_0_30px_rgba(212,175,55,0.15)]"
            role="img"
            aria-label="Diagrama interactivo del Santo Rosario"
          >
            {/* Invisible paths used only to measure geometry on mount */}
            <path ref={loopRef} d={LOOP_PATH} fill="none" stroke="none" />
            <path ref={tailRef} d={TAIL_PATH} fill="none" stroke="none" />

            {/* The thread — draws itself on scroll (dash-offset technique) */}
            {lengths && (
              <>
                <motion.path
                  d={LOOP_PATH}
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2.5"
                  strokeOpacity="0.7"
                  strokeLinecap="round"
                  strokeDasharray={lengths.loop}
                  initial={{ strokeDashoffset: lengths.loop }}
                  whileInView={{ strokeDashoffset: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 2.2, ease: 'easeInOut' }}
                />
                <motion.path
                  d={TAIL_PATH}
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2.5"
                  strokeOpacity="0.7"
                  strokeLinecap="round"
                  strokeDasharray={lengths.tail}
                  initial={{ strokeDashoffset: lengths.tail }}
                  whileInView={{ strokeDashoffset: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.8, ease: 'easeInOut', delay: 2.0 }}
                />
              </>
            )}

            {/* Beads */}
            {beads.map((bead, index) => (
              <motion.circle
                key={index}
                cx={bead.x}
                cy={bead.y}
                r={bead.large ? 6.5 : 4}
                fill={bead.large ? '#D4AF37' : '#E0F2FE'}
                fillOpacity={bead.large ? 0.95 : 0.8}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.025 }}
              />
            ))}

            {/* Medal */}
            <motion.ellipse
              cx={200}
              cy={368}
              rx={14}
              ry={18}
              fill="#E0F2FE"
              stroke="#D4AF37"
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 2.0 }}
            />

            {/* Cross */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 2.8 }}
            >
              <rect x={196.5} y={446} width={7} height={44} rx={2} fill="#D4AF37" />
              <rect x={184} y={458} width={32} height={7} rx={2} fill="#D4AF37" />
            </motion.g>

            {/* Step markers */}
            {Object.entries(markers).map(([step, pos]) => {
              const stepNumber = Number(step);
              const isActive = activeStep === stepNumber;
              return (
                <g
                  key={step}
                  onClick={() => setActiveStep(stepNumber)}
                  className="cursor-pointer"
                >
                  {/* generous invisible hit area for touch */}
                  <circle cx={pos.x} cy={pos.y} r={26} fill="transparent" />
                  {isActive && (
                    <motion.circle
                      cx={pos.x}
                      cy={pos.y}
                      r={20}
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="1.5"
                      initial={{ scale: 0.6, opacity: 0.9 }}
                      animate={{ scale: [0.7, 1.4], opacity: [0.9, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={14}
                    fill={isActive ? '#D4AF37' : '#16306F'}
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    animate={{ scale: isActive ? 1.15 : 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="700"
                    fill={isActive ? '#091740' : '#E8CD6F'}
                    style={{ pointerEvents: 'none' }}
                  >
                    {step}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Active step caption */}
          <motion.p
            key={activeStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 flex items-center justify-center gap-2 text-center font-serif text-lg italic text-oro-pale"
          >
            <Cross className="h-4 w-4 shrink-0 text-oro" />
            {ROSARY_STEPS.find((s) => s.step === activeStep)?.label}
          </motion.p>
        </Reveal>
      </div>
    </section>
  );
}
