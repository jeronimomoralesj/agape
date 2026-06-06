'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { formatPrice } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerDetails: form,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo crear el pedido');
      clearCart();
      router.push(`/checkout/gracias?orden=${encodeURIComponent(data.orderNumber)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !submitting) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-oro/10">
          <ShoppingBag className="h-8 w-8 text-oro-deep" strokeWidth={1.25} />
        </span>
        <h1 className="font-serif text-3xl font-bold text-royal">Tu carrito está vacío</h1>
        <p className="max-w-sm text-royal/65">
          Agrega una pulsera a tu carrito para finalizar tu pedido.
        </p>
        <Link href="/tienda" className="btn-gold mt-2">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-14 lg:px-8">
      <div className="text-center">
        <p className="section-eyebrow">Último paso</p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-royal sm:text-5xl">
          Finalizar pedido
        </h1>
        <div className="gold-divider mt-6" />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-5">
        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5 lg:col-span-3"
        >
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-royal">
              Nombre completo
            </label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="María Camila Pérez"
              className="input-luxe"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-royal">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="maria@correo.com"
                className="input-luxe"
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-royal">
                Teléfono / WhatsApp
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="300 123 4567"
                className="input-luxe"
              />
            </div>
          </div>
          <div>
            <label htmlFor="address" className="mb-1.5 block text-sm font-semibold text-royal">
              Dirección de envío
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              value={form.address}
              onChange={handleChange}
              placeholder="Calle, número, barrio, ciudad"
              className="input-luxe resize-none"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}

          <button type="submit" disabled={submitting} className="btn-gold w-full disabled:opacity-60">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creando tu pedido…
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Confirmar pedido
              </>
            )}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-royal/50">
            <Lock className="h-3.5 w-3.5" />
            Sin pago en línea por ahora — coordinamos el pago contra entrega.
          </p>
        </motion.form>

        {/* Summary */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="h-fit rounded-3xl border border-oro/20 bg-white/70 p-6 shadow-card lg:col-span-2 lg:sticky lg:top-28"
        >
          <h2 className="font-serif text-xl font-bold text-royal">Tu pedido</h2>
          <ul className="mt-5 space-y-4">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.image} alt={item.title} fill sizes="56px" className="object-cover" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold leading-snug text-royal">{item.title}</p>
                  <p className="text-xs text-royal/55">Cantidad: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-royal">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-oro/20 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.2em] text-royal/60">Total</span>
              <span className="font-serif text-2xl font-bold text-royal">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <p className="mt-2 text-xs text-royal/50">Envío coordinado por WhatsApp.</p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
