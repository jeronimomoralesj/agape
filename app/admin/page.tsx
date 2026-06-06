'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Crown,
  Gem,
  LogOut,
  Package,
  Pencil,
  Plus,
  ReceiptText,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import type { Order, OrderStatus, Product } from '@/lib/types';
import { formatPrice } from '@/lib/types';
import ProductForm, { type ProductFormValues } from '@/components/admin/ProductForm';

type Tab = 'resumen' | 'productos' | 'pedidos';

const STATUS_LABEL: Record<OrderStatus, string> = {
  Pending: 'Pendiente',
  Processing: 'En proceso',
  Shipped: 'Enviado',
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-sky-50 text-sky-700 border-sky-200',
  Shipped: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('resumen');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products?all=true', { cache: 'no-store' }),
        fetch('/api/orders', { cache: 'no-store' }),
      ]);
      if (productsRes.ok) setProducts(await productsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const metrics = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const pending = orders.filter((o) => o.status === 'Pending').length;

    // Top-performing bracelets by units sold
    const unitsByProduct = new Map<string, { title: string; units: number; revenue: number }>();
    for (const order of orders) {
      for (const item of order.items) {
        const key = String(item.productId);
        const entry = unitsByProduct.get(key) ?? {
          title: item.title ?? 'Producto',
          units: 0,
          revenue: 0,
        };
        entry.units += item.quantity;
        entry.revenue += item.price * item.quantity;
        unitsByProduct.set(key, entry);
      }
    }
    const top = [...unitsByProduct.values()].sort((a, b) => b.units - a.units).slice(0, 5);
    const lowStock = products.filter((p) => p.isActive && p.stock <= 3);

    return { totalSales, pending, top, lowStock };
  }, [orders, products]);

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  const createProduct = async (values: ProductFormValues) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error('No se pudo crear el producto');
    setCreating(false);
    await loadData();
  };

  const updateProduct = async (values: ProductFormValues) => {
    if (!editing) return;
    const res = await fetch(`/api/products/${editing._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error('No se pudo actualizar el producto');
    setEditing(null);
    await loadData();
  };

  const deleteProduct = async (product: Product) => {
    if (!window.confirm(`¿Eliminar "${product.title}" definitivamente?`)) return;
    const res = await fetch(`/api/products/${product._id}`, { method: 'DELETE' });
    if (res.ok) await loadData();
  };

  const updateOrderStatus = async (order: Order, status: OrderStatus) => {
    const res = await fetch(`/api/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? { ...o, status } : o))
      );
    }
  };

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'resumen', label: 'Resumen', icon: <BarChart3 className="h-4 w-4" /> },
    { key: 'productos', label: 'Productos', icon: <Gem className="h-4 w-4" /> },
    { key: 'pedidos', label: 'Pedidos', icon: <ReceiptText className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-12 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="section-eyebrow">Panel de administración</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-royal">Ágape Admin</h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full border border-royal/15 px-5 py-2.5 text-sm font-semibold text-royal/70 transition-all hover:border-red-300 hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2 rounded-full border border-oro/20 bg-white/60 p-1.5 sm:w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors sm:flex-initial ${
              tab === t.key ? 'text-royal-ink' : 'text-royal/55 hover:text-royal'
            }`}
          >
            {tab === t.key && (
              <motion.span
                layoutId="admin-tab-pill"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-oro-light to-oro"
              />
            )}
            <span className="relative flex items-center gap-2">
              {t.icon}
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-oro/30 border-t-oro" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            {/* ────────────── RESUMEN ────────────── */}
            {tab === 'resumen' && (
              <div className="space-y-8">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      label: 'Ventas totales',
                      value: formatPrice(metrics.totalSales),
                      icon: <Wallet className="h-5 w-5" />,
                    },
                    {
                      label: 'Pedidos',
                      value: String(orders.length),
                      icon: <ReceiptText className="h-5 w-5" />,
                    },
                    {
                      label: 'Pendientes',
                      value: String(metrics.pending),
                      icon: <Package className="h-5 w-5" />,
                    },
                    {
                      label: 'Productos activos',
                      value: String(products.filter((p) => p.isActive).length),
                      icon: <Gem className="h-5 w-5" />,
                    },
                  ].map((card, i) => (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="rounded-3xl border border-oro/20 bg-white/75 p-6 shadow-card"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-oro/15 text-oro-deep">
                        {card.icon}
                      </span>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-royal/55">
                        {card.label}
                      </p>
                      <p className="mt-1 font-serif text-2xl font-bold text-royal">
                        {card.value}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                  {/* Top bracelets */}
                  <div className="rounded-3xl border border-oro/20 bg-white/75 p-6 shadow-card sm:p-8">
                    <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-royal">
                      <Crown className="h-5 w-5 text-oro-deep" />
                      Pulseras más vendidas
                    </h2>
                    {metrics.top.length === 0 ? (
                      <p className="mt-5 text-sm text-royal/55">
                        Aún no hay ventas registradas.
                      </p>
                    ) : (
                      <ul className="mt-5 space-y-3">
                        {metrics.top.map((item, index) => {
                          const max = metrics.top[0].units || 1;
                          return (
                            <li key={item.title + index}>
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-royal">{item.title}</span>
                                <span className="text-royal/55">{item.units} uds</span>
                              </div>
                              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cielo-100">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(item.units / max) * 100}%` }}
                                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 + index * 0.1 }}
                                  className="h-full rounded-full bg-gradient-to-r from-oro-light to-oro"
                                />
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {/* Low stock */}
                  <div className="rounded-3xl border border-oro/20 bg-white/75 p-6 shadow-card sm:p-8">
                    <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-royal">
                      <TrendingUp className="h-5 w-5 text-oro-deep" />
                      Inventario bajo
                    </h2>
                    {metrics.lowStock.length === 0 ? (
                      <p className="mt-5 text-sm text-royal/55">
                        Todo el inventario está saludable. ✨
                      </p>
                    ) : (
                      <ul className="mt-5 space-y-3">
                        {metrics.lowStock.map((p) => (
                          <li
                            key={p._id}
                            className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm"
                          >
                            <span className="font-semibold text-royal">{p.title}</span>
                            <span className="font-bold text-amber-700">
                              {p.stock} {p.stock === 1 ? 'unidad' : 'unidades'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ────────────── PRODUCTOS ────────────── */}
            {tab === 'productos' && (
              <div className="space-y-6">
                {creating || editing ? (
                  <ProductForm
                    initial={editing}
                    onSubmit={editing ? updateProduct : createProduct}
                    onCancel={() => {
                      setCreating(false);
                      setEditing(null);
                    }}
                  />
                ) : (
                  <button type="button" onClick={() => setCreating(true)} className="btn-gold">
                    <Plus className="h-4 w-4" />
                    Nueva pulsera
                  </button>
                )}

                <div className="overflow-hidden rounded-3xl border border-oro/20 bg-white/75 shadow-card">
                  {products.length === 0 ? (
                    <p className="p-8 text-center text-sm text-royal/55">
                      No hay productos todavía. Crea tu primera pulsera. ✨
                    </p>
                  ) : (
                    <ul className="divide-y divide-oro/15">
                      <AnimatePresence initial={false}>
                        {products.map((product) => (
                          <motion.li
                            key={product._id}
                            layout
                            exit={{ opacity: 0, x: 40 }}
                            className="flex flex-wrap items-center gap-4 px-5 py-4 sm:px-6"
                          >
                            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                              <Image
                                src={product.images[0] ?? '/brand/pulseras.jpeg'}
                                alt={product.title}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold text-royal">
                                {product.title}
                                {!product.isActive && (
                                  <span className="ml-2 rounded-full bg-royal/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-royal/60">
                                    Oculto
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-royal/55">
                                {product.category} · {formatPrice(product.price)} ·{' '}
                                {product.stock} en stock
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditing(product);
                                  setCreating(false);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                aria-label={`Editar ${product.title}`}
                                className="rounded-full border border-royal/15 p-2.5 text-royal/60 transition-colors hover:border-oro hover:text-oro-deep"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteProduct(product)}
                                aria-label={`Eliminar ${product.title}`}
                                className="rounded-full border border-royal/15 p-2.5 text-royal/60 transition-colors hover:border-red-300 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* ────────────── PEDIDOS ────────────── */}
            {tab === 'pedidos' && (
              <div className="overflow-hidden rounded-3xl border border-oro/20 bg-white/75 shadow-card">
                {orders.length === 0 ? (
                  <p className="p-8 text-center text-sm text-royal/55">
                    Aún no hay pedidos registrados.
                  </p>
                ) : (
                  <ul className="divide-y divide-oro/15">
                    {orders.map((order) => (
                      <li key={order._id} className="px-5 py-5 sm:px-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-mono text-sm font-bold text-royal">
                              {order.orderNumber}
                            </p>
                            <p className="mt-0.5 text-sm text-royal/70">
                              {order.customerDetails.name} · {order.customerDetails.phone}
                            </p>
                            <p className="text-xs text-royal/50">
                              {order.customerDetails.address}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-serif text-lg font-bold text-royal">
                              {formatPrice(order.total)}
                            </span>
                            <select
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus(order, e.target.value as OrderStatus)
                              }
                              className={`rounded-full border px-3 py-1.5 text-xs font-bold ${STATUS_STYLE[order.status]}`}
                            >
                              {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
                                <option key={s} value={s}>
                                  {STATUS_LABEL[s]}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <p className="mt-3 text-xs text-royal/55">
                          {order.items
                            .map((item) => `${item.quantity}× ${item.title ?? 'Producto'}`)
                            .join(' · ')}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
