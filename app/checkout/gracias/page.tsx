'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake } from 'lucide-react';

function GraciasContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orden');

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      {/* Animated check halo */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-oro-light to-oro shadow-aura"
      >
        <HeartHandshake className="h-10 w-10 text-royal-ink" strokeWidth={1.5} />
        <motion.span
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border-2 border-oro"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="mt-8 font-serif text-4xl font-bold text-royal sm:text-5xl">
          ¡Gracias por tu pedido!
        </h1>
        {orderNumber && (
          <p className="mt-4 text-royal/70">
            Tu número de orden es{' '}
            <span className="rounded-full border border-oro/40 bg-oro/10 px-3 py-1 font-mono text-sm font-bold text-royal">
              {orderNumber}
            </span>
          </p>
        )}
        <p className="mx-auto mt-5 max-w-md text-balance leading-relaxed text-royal/65">
          Muy pronto nos pondremos en contacto contigo por WhatsApp para coordinar la
          entrega de tu pulsera.
        </p>
        <p className="mt-6 font-serif text-lg italic text-oro-deep">
          “Él sana a los de corazón herido y venda sus heridas” — Salmo 147:3
        </p>
        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/tienda" className="btn-gold">
            Seguir explorando
          </Link>
          <Link href="/" className="btn-ghost">
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={null}>
      <GraciasContent />
    </Suspense>
  );
}
