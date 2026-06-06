'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeartHandshake } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

export default function BrandStory() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-8">
        {/* Brand imagery */}
        <Reveal className="relative order-2 lg:order-1">
          <motion.div
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-luxe"
          >
            <Image
              src="/brand/pulseras.jpeg"
              alt="Pulseras Ágape de cristal y oro con dije de cruz"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-oro/30" />
          </motion.div>

          {/* Floating logo medallion */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-4 -top-6 h-28 w-28 overflow-hidden rounded-full border-2 border-oro/60 shadow-aura sm:-right-8 sm:h-36 sm:w-36"
          >
            <Image
              src="/brand/logo.jpeg"
              alt="Logotipo Ágape"
              fill
              sizes="144px"
              className="scale-[1.15] object-cover"
            />
          </motion.div>
        </Reveal>

        {/* Story copy */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="section-eyebrow flex items-center gap-2">
              <HeartHandshake className="h-4 w-4" />
              Nuestra promesa
            </p>
            <h2 className="mt-4 text-balance font-serif text-4xl font-bold text-royal sm:text-5xl">
              Más que una joya, una <span className="italic text-oro-deep">oración</span> en tu muñeca
            </h2>
            <div className="mt-7 space-y-5 leading-relaxed text-royal/70">
              <p>
                <span className="font-serif text-xl italic text-royal">Ágape</span> es el amor
                más alto: el amor con el que Dios nos ama. Cada pulsera nace de esa certeza
                — cristales delicados y componentes bañados en oro, ensamblados a mano como
                las cuentas de un rosario.
              </p>
              <p>
                Llevarla es recordar, en medio del día, que no caminamos solos:{' '}
                <em>“Él sana a los de corazón herido y venda sus heridas” (Salmo 147:3)</em>.
              </p>
            </div>
            <div className="mt-9">
              <Link href="/tienda" className="btn-gold">
                Encuentra tu pulsera
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
