'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun } from 'lucide-react';
import { getMysteryOfTheDay, type MysterySet } from '@/lib/mysteries';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';

const DAY_NAMES = [
  'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado',
];

export default function MisterioDelDia() {
  // Resolve on the client so the day matches the visitor's timezone
  const [mystery, setMystery] = useState<MysterySet | null>(null);
  const [dayName, setDayName] = useState('');

  useEffect(() => {
    const now = new Date();
    setMystery(getMysteryOfTheDay(now));
    setDayName(DAY_NAMES[now.getDay()]);
  }, []);

  return (
    <section id="misterio-del-dia" className="relative scroll-mt-24 py-24 sm:py-32">
      {/* soft golden halo */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-oro/10 blur-3xl" />

      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="section-eyebrow flex items-center justify-center gap-2">
            <Sun className="h-4 w-4" />
            Hoy es {dayName || '…'}
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold text-royal sm:text-5xl">
            {mystery ? mystery.name : 'Misterio del Día'}
          </h2>
          <div className="gold-divider mt-6" />
          <p className="mt-5 text-sm font-medium uppercase tracking-[0.3em] text-royal/60">
            {mystery?.days}
          </p>
          <p className="mx-auto mt-4 max-w-md font-serif text-lg italic text-royal/80">
            {mystery?.verse}
          </p>
        </Reveal>

        {mystery && (
          <StaggerGroup className="mt-12 space-y-3 text-left">
            {mystery.mysteries.map((text, index) => (
              <StaggerItem key={text}>
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="flex items-center gap-5 rounded-2xl border border-oro/20 bg-white/70 px-6 py-4 shadow-card backdrop-blur-sm"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-oro-light to-oro font-serif text-lg font-bold text-royal-ink shadow-aura-soft">
                    {index + 1}
                  </span>
                  <p className="font-serif text-base text-royal sm:text-lg">{text}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}

        <Reveal delay={0.2} className="mt-10">
          <p className="text-sm text-royal/60">
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
