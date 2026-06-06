'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Immersive hero. To swap the background later, replace HERO_MEDIA with a
 * <video autoPlay muted loop playsInline> or a different <Image src>.
 */
const HERO_MEDIA = (
  <Image
    src="/brand/pulseras.jpeg"
    alt="Pulseras Ágape de cristal y oro con cruz"
    fill
    priority
    sizes="100vw"
    className="object-cover object-center"
  />
);

export default function Hero() {
  return (
    <section className="relative flex min-h-[92svh] items-center justify-center overflow-hidden">
      {/* Background media + veils */}
      <div className="absolute inset-0">{HERO_MEDIA}</div>
      <div className="absolute inset-0 bg-gradient-to-b from-royal-ink/70 via-royal-ink/45 to-cielo-50" />
      <div className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-80 w-80 rounded-full bg-oro/20 blur-3xl sm:w-[34rem]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-28 text-center">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.45em] text-oro-light"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Pulseras con propósito
          <Sparkles className="h-3.5 w-3.5" />
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.35 }}
          className="mt-6 text-balance font-serif text-5xl font-bold leading-[1.08] text-white sm:text-6xl lg:text-7xl"
        >
          Amar como
          <span className="block bg-gradient-to-r from-oro-light via-oro-pale to-oro-light bg-clip-text italic text-transparent">
            Dios nos ama
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
          className="mx-auto mt-6 max-w-xl text-balance font-serif text-lg italic leading-relaxed text-cielo-100/90 sm:text-xl"
        >
          “Él sana a los de corazón herido y venda sus heridas”
          <span className="mt-2 block font-sans text-xs font-semibold uppercase not-italic tracking-[0.35em] text-oro-light">
            Salmo 147:3
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/tienda" className="btn-gold w-full sm:w-auto">
            Descubrir la colección
          </Link>
          <Link
            href="/#misterio-del-dia"
            className="btn-ghost w-full !border-cielo-100/40 !text-cielo-100 hover:!border-oro hover:!bg-white/10 sm:w-auto"
          >
            Misterio del día
          </Link>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6 text-royal/60" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
