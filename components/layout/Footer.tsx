import Link from 'next/link';
import { Heart, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-royal-radial text-cielo-100">
      {/* Subtle gold glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oro to-transparent" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-oro/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-oro-light">
                Amar como Dios nos ama
              </span>
              <span className="mt-2 font-logo text-4xl tracking-wide text-cielo-100">
                ÁGAPE
              </span>
            </div>
            <p className="mt-5 max-w-xs font-serif text-lg italic leading-relaxed text-cielo-100/80">
              “Él sana a los de corazón herido y venda sus heridas”
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-oro-light">
              Salmo 147:3
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Pie de página">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-oro-light">
              Navegación
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-cielo-100/80">
              <li><Link href="/" className="transition-colors hover:text-oro-light">Tienda</Link></li>
              <li><Link href="/mision" className="transition-colors hover:text-oro-light">Nuestra misión</Link></li>
              <li><Link href="/#misterio-del-dia" className="transition-colors hover:text-oro-light">Misterio del Día</Link></li>
              <li><Link href="/#guia-rosario" className="transition-colors hover:text-oro-light">Cómo rezar el Rosario</Link></li>
              <li><Link href="/devoluciones" className="transition-colors hover:text-oro-light">Cambios y devoluciones</Link></li>
              <li><Link href="/privacidad" className="transition-colors hover:text-oro-light">Política de privacidad</Link></li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-oro-light">
              Contacto
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-cielo-100/80">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-oro-light" strokeWidth={1.75} />
                hola@agape.com.co
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-oro-light" strokeWidth={1.75} />
                @agape.pulseras
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-cielo-100/10 pt-8 text-center">
          <p className="flex items-center gap-1.5 text-xs text-cielo-100/60">
            Hecho con <Heart className="h-3.5 w-3.5 fill-oro text-oro" /> y fe ·{' '}
            {new Date().getFullYear()} Ágape
          </p>
          <p className="font-serif text-sm italic text-cielo-100/50">Amar como Dios nos ama</p>
        </div>
      </div>
    </footer>
  );
}
