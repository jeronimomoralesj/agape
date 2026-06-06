'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';

const BASE_LINKS = [
  { href: '/', label: 'Tienda' },
  { href: '/#misterio-del-dia', label: 'Misterios' },
  { href: '/#guia-rosario', label: 'Cómo Rezar' },
];

export default function Header() {
  const pathname = usePathname();
  const { totalItems, openCart, pulse } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasBlog, setHasBlog] = useState(false);

  // Only show the Blog tab when there is at least one published post.
  // Checked once per page load (not per navigation) to avoid extra requests.
  useEffect(() => {
    fetch('/api/blog?countOnly=true')
      .then((res) => (res.ok ? res.json() : { count: 0 }))
      .then((data) => setHasBlog((data?.count ?? 0) > 0))
      .catch(() => setHasBlog(false));
  }, []);

  const navLinks = hasBlog
    ? [...BASE_LINKS, { href: '/blog', label: 'Blog' }]
    : BASE_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-cielo-50/90 shadow-luxe backdrop-blur-xl'
          : 'bg-cielo-50/60 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20 lg:px-8">
        {/* Wordmark */}
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-logo text-2xl tracking-wide text-royal transition-colors duration-300 group-hover:text-royal-deep md:text-3xl">
            ÁGAPE
          </span>
          <span className="hidden text-[0.55rem] font-semibold uppercase tracking-[0.32em] text-oro-deep sm:block">
            Amar como Dios nos ama
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative font-sans text-sm font-medium tracking-wide transition-colors duration-300 ${
                pathname === link.href ? 'text-royal' : 'text-royal/70 hover:text-royal'
              }`}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-oro transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Cart button with bouncing badge */}
          <button
            type="button"
            onClick={openCart}
            aria-label="Abrir carrito de compras"
            className="relative rounded-full p-2.5 text-royal transition-all duration-300 hover:bg-oro/15 hover:text-oro-deep"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={pulse} // re-mounts on add → replays bounce
                  initial={{ scale: 0 }}
                  animate={{ scale: [0.6, 1.35, 1] }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-oro px-1 text-[0.65rem] font-bold text-royal-ink shadow-aura"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Hamburger that morphs into a close icon */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            className="relative h-10 w-10 rounded-full p-2.5 text-royal transition-colors duration-300 hover:bg-oro/15 md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {menuOpen ? (
                  <X className="h-5 w-5" strokeWidth={1.75} />
                ) : (
                  <Menu className="h-5 w-5" strokeWidth={1.75} />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-oro/20 bg-cielo-50/95 backdrop-blur-xl md:hidden"
          >
            <ul className="space-y-1 px-6 py-4">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * index, duration: 0.35 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-3 font-serif text-lg text-royal transition-colors hover:bg-oro/10 hover:text-oro-deep"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
