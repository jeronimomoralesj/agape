'use client';

import SmartImage from '@/components/ui/SmartImage';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from './CartContext';
import { formatPrice } from '@/lib/types';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-royal-ink/40 backdrop-blur-sm"
            aria-hidden
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cielo-50 shadow-2xl"
            role="dialog"
            aria-label="Carrito de compras"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-oro/20 px-6 py-5">
              <h2 className="flex items-center gap-2 font-serif text-2xl font-bold text-royal">
                <ShoppingBag className="h-5 w-5 text-oro-deep" strokeWidth={1.75} />
                Tu Carrito
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="rounded-full p-2 text-royal/70 transition-all duration-300 hover:rotate-90 hover:bg-oro/15 hover:text-royal"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex h-full flex-col items-center justify-center gap-4 text-center"
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-oro/10">
                    <ShoppingBag className="h-8 w-8 text-oro-deep" strokeWidth={1.25} />
                  </span>
                  <p className="font-serif text-xl text-royal">Tu carrito está vacío</p>
                  <p className="max-w-[16rem] text-sm text-royal/60">
                    Descubre nuestras pulseras inspiradas en los Misterios del Rosario.
                  </p>
                  <Link href="/" onClick={closeCart} className="btn-gold mt-2">
                    Ir a la tienda
                  </Link>
                </motion.div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 80, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="flex gap-4 overflow-hidden rounded-2xl border border-oro/15 bg-white/70 p-3 shadow-card"
                      >
                        <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                          <SmartImage
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </span>
                        <div className="flex flex-1 flex-col justify-between py-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-serif text-sm font-semibold leading-snug text-royal">
                              {item.title}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              aria-label={`Quitar ${item.title}`}
                              className="rounded-full p-1 text-royal/40 transition-colors hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-full border border-royal/15 px-2 py-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                aria-label="Disminuir cantidad"
                                className="text-royal/60 transition-colors hover:text-oro-deep"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-5 text-center text-sm font-semibold text-royal">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                aria-label="Aumentar cantidad"
                                className="text-royal/60 transition-colors hover:text-oro-deep"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="text-sm font-bold text-royal">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-oro/20 bg-white/60 px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.2em] text-royal/60">
                    Subtotal
                  </span>
                  <motion.span
                    key={totalPrice}
                    initial={{ scale: 1.1, color: '#A8862A' }}
                    animate={{ scale: 1, color: '#16306F' }}
                    className="font-serif text-2xl font-bold"
                  >
                    {formatPrice(totalPrice)}
                  </motion.span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-gold w-full"
                >
                  Finalizar pedido
                </Link>
                <p className="mt-3 text-center text-xs text-royal/50">
                  Envíos a toda Colombia · Pago contra entrega
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
