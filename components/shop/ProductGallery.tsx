'use client';

import SmartImage from '@/components/ui/SmartImage';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const gallery = images.length > 0 ? images : ['/brand/pulseras.jpeg'];
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Main image — crossfade between angles, subtle zoom on hover */}
      <div className="group relative aspect-square overflow-hidden rounded-[2rem] bg-cielo-100 shadow-luxe">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <SmartImage
              src={gallery[active]}
              alt={`${title} — vista ${active + 1}`}
              fill
              priority={active === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
            />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-oro/25" />
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {gallery.map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver imagen ${index + 1}`}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${
                active === index
                  ? 'ring-2 ring-oro shadow-aura-soft'
                  : 'opacity-60 ring-1 ring-royal/10 hover:opacity-100'
              }`}
            >
              <SmartImage src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
