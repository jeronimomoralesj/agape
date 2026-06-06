'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import type { Product } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';

export interface ProductFormValues {
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  isActive: boolean;
  spiritualMeaning: string;
  materials: string;
}

const EMPTY: ProductFormValues = {
  title: '',
  description: '',
  price: 0,
  images: [''],
  category: 'Gozosos',
  stock: 0,
  isActive: true,
  spiritualMeaning: '',
  materials: '',
};

export default function ProductForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Product | null;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<ProductFormValues>(
    initial
      ? {
          title: initial.title,
          description: initial.description,
          price: initial.price,
          images: initial.images.length > 0 ? initial.images : [''],
          category: initial.category,
          stock: initial.stock,
          isActive: initial.isActive,
          spiritualMeaning: initial.spiritualMeaning ?? '',
          materials: initial.materials ?? '',
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const setImage = (index: number, url: string) =>
    setValues((v) => ({
      ...v,
      images: v.images.map((img, i) => (i === index ? url : img)),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        ...values,
        images: values.images.map((u) => u.trim()).filter(Boolean),
        price: Number(values.price),
        stock: Number(values.stock),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
      setSaving(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 rounded-3xl border border-oro/25 bg-white/85 p-6 shadow-card sm:p-8"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-2xl font-bold text-royal">
          {initial ? 'Editar pulsera' : 'Nueva pulsera'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancelar"
          className="rounded-full p-2 text-royal/50 transition-colors hover:bg-royal/5 hover:text-royal"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-royal">Nombre</label>
          <input
            required
            value={values.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Pulsera Misterios Gozosos"
            className="input-luxe"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-royal">Descripción</label>
          <textarea
            required
            rows={3}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Cristales celestes con dije de cruz bañado en oro…"
            className="input-luxe resize-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-royal">Precio (COP)</label>
          <input
            required
            type="number"
            min={0}
            step="any"
            value={values.price}
            onChange={(e) => set('price', Number(e.target.value))}
            className="input-luxe"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-royal">
            Inventario (unidades)
          </label>
          <input
            required
            type="number"
            min={0}
            value={values.stock}
            onChange={(e) => set('stock', Number(e.target.value))}
            className="input-luxe"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-royal">
            Categoría (Misterio)
          </label>
          <select
            value={values.category}
            onChange={(e) => set('category', e.target.value)}
            className="input-luxe"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                Misterios {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end pb-2">
          <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-royal">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
              className="h-4 w-4 accent-[#D4AF37]"
            />
            Visible en la tienda
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-royal">
            Imágenes (URLs)
          </label>
          <div className="space-y-2">
            {values.images.map((url, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={url}
                  onChange={(e) => setImage(index, e.target.value)}
                  placeholder="https://… o /brand/pulseras.jpeg"
                  className="input-luxe"
                />
                {values.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setValues((v) => ({
                        ...v,
                        images: v.images.filter((_, i) => i !== index),
                      }))
                    }
                    aria-label="Quitar imagen"
                    className="shrink-0 rounded-xl border border-red-200 px-3 text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setValues((v) => ({ ...v, images: [...v.images, ''] }))}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-oro-deep transition-colors hover:text-royal"
          >
            <Plus className="h-4 w-4" /> Agregar otra imagen
          </button>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-royal">
            Significado espiritual (opcional)
          </label>
          <textarea
            rows={2}
            value={values.spiritualMeaning}
            onChange={(e) => set('spiritualMeaning', e.target.value)}
            className="input-luxe resize-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-royal">
            Materiales (opcional)
          </label>
          <textarea
            rows={2}
            value={values.materials}
            onChange={(e) => set('materials', e.target.value)}
            className="input-luxe resize-none"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-gold disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {initial ? 'Guardar cambios' : 'Crear pulsera'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancelar
        </button>
      </div>
    </motion.form>
  );
}
