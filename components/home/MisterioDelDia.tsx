'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sun } from 'lucide-react';
import { MYSTERY_SETS, getMysteryOfTheDay } from '@/lib/mysteries';
import type { Category } from '@/lib/types';
import { Reveal } from '@/components/motion/Reveal';

const DAY_NAMES = [
  'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado',
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function MisterioDelDia() {
  const [selected, setSelected] = useState<Category>('Gozosos');
  const [todayKey, setTodayKey] = useState<Category | null>(null);
  const [dayName, setDayName] = useState('');

  // Resolve "today" on the client so it matches the visitor's timezone
  useEffect(() => {
    const now = new Date();
    const today = getMysteryOfTheDay(now);
    setSelected(today.key);
    setTodayKey(today.key);
    setDayName(DAY_NAMES[now.getDay()]);
  }, []);

  const active = MYSTERY_SETS.find((set) => set.key === selected) ?? MYSTERY_SETS[0];

  return (
    <section id="misterio-del-dia" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-oro/10 blur-3xl" />

      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="section-eyebrow flex items-center justify-center gap-2">
            <Sun className="h-4 w-4" />
            {dayName ? `Hoy es ${dayName}` : 'Misterios del Santo Rosario'}
          </p>
          <h2 className="mt-4 font-serif text-3xl font-bold text-royal sm:text-5xl">
            Los Misterios del Rosario
          </h2>
          <div className="gold-divider mt-6" />
          <p className="mx-auto mt-5 max-w-md text-sm text-royal/65 sm:text-base">
            Cada día de la semana contempla un conjunto de misterios. Toca cada colección
            para descubrirlos.
          </p>
        </Reveal>

        {/* Mystery set tabs */}
        <Reveal delay={0.1}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
            {MYSTERY_SETS.map((set) => {
              const isActive = selected === set.key;
              const isToday = todayKey === set.key;
              return (
                <button
                  key={set.key}
                  type="button"
                  onClick={() => setSelected(set.key)}
                  className={`relative rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 sm:px-5 ${
                    isActive ? 'text-royal-ink' : 'text-royal/60 hover:text-royal'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="mystery-tab-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-oro-light to-oro shadow-aura-soft"
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    {set.key}
                    {isToday && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[0.55rem] font-bold tracking-normal ${
                          isActive ? 'bg-royal-ink/15 text-royal-ink' : 'bg-oro/20 text-oro-deep'
                        }`}
                      >
                        HOY
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Active set content */}
        <div className="mt-10 min-h-[22rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-royal/55">
                {active.days}
              </p>
              <p className="mx-auto mt-3 max-w-md font-serif text-base italic text-royal/80 sm:text-lg">
                {active.verse}
              </p>

              <ul className="mt-8 space-y-2.5 text-left sm:space-y-3">
                {active.mysteries.map((text, index) => (
                  <motion.li
                    key={text}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.08 + index * 0.07 }}
                  >
                    <motion.div
                      whileHover={{ x: 6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className="flex items-center gap-4 rounded-2xl border border-oro/20 bg-white/70 px-4 py-3.5 shadow-card backdrop-blur-sm sm:gap-5 sm:px-6 sm:py-4"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-oro-light to-oro font-serif text-base font-bold text-royal-ink shadow-aura-soft sm:h-10 sm:w-10 sm:text-lg">
                        {index + 1}
                      </span>
                      <p className="font-serif text-sm text-royal sm:text-lg">{text}</p>
                    </motion.div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        <Reveal delay={0.15} className="mt-9">
          <p className="text-xs text-royal/60 sm:text-sm">
            Después de cada misterio se rezan{' '}
            <span className="font-semibold text-royal">1 Padre Nuestro</span>,{' '}
            <span className="font-semibold text-royal">10 Ave Marías</span> y{' '}
            <span className="font-semibold text-royal">1 Gloria</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
