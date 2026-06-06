'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, Loader2, Save, Star, Trash2, X } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/types';

export const MAX_IMAGES = 4;

export interface ProductFormValues {
  title: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  stock: number;
  isActive: boolean;
}

const EMPTY: ProductFormValues = {
  title: '',
  description: '',
  price: 0,
  discount: 0,
  images: [],
  stock: 0,
  isActive: true,
};

/**
 * Reads an image file and returns a compressed base64 data-URL
 * (downscaled to ≤1000px, JPEG q0.82) so 4 images stay well under
 * MongoDB's document limit and Vercel's request body limit.
 */
async function fileToCompressedDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo procesar la imagen');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.82);
}

export default function ProductForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Product | null;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<ProductFormValues>(
    initial
      ? {
          title: initial.title,
          description: initial.description,
          price: initial.price,
          discount: initial.discount ?? 0,
          images: initial.images.slice(0, MAX_IMAGES),
          stock: initial.stock,
          isActive: initial.isActive,
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setProcessing(true);
    try {
      const room = MAX_IMAGES - values.images.length;
      const files = Array.from(fileList).slice(0, room);
      if (Array.from(fileList).length > room) {
        setError(`Máximo ${MAX_IMAGES} imágenes por producto.`);
      }
      const dataUrls: string[] = [];
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        dataUrls.push(await fileToCompressedDataUrl(file));
      }
      setValues((v) => ({
        ...v,
        images: [...v.images, ...dataUrls].slice(0, MAX_IMAGES),
      }));
    } catch {
      setError('No se pudo leer una de las imágenes. Intenta con otro archivo.');
    } finally {
      setProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) =>
    setValues((v) => ({ ...v, images: v.images.filter((_, i) => i !== index) }));

  const makeCover = (index: number) =>
    setValues((v) => {
      const images = [...v.images];
      const [img] = images.splice(index, 1);
      return { ...v, images: [img, ...images] };
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        ...values,
        price: Number(values.price),
        discount: Math.min(90, Math.max(0, Number(values.discount) || 0)),
        stock: Number(values.stock),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
      setSaving(false);
    }
  };

  const discountedPreview =
    values.discount > 0 && values.price > 0
      ? Math.round(values.price * (1 - values.discount / 100))
      : null;

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

      {/* ── Images ── */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-royal">
          Imágenes <span className="font-normal text-royal/50">({values.images.length}/{MAX_IMAGES} · la primera es la portada)</span>
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {values.images.map((src, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-oro/25"
            >
              <SmartImage
                src={src}
                alt={`Imagen ${index + 1}`}
                fill
                sizes="160px"
                className="object-cover"
              />
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-oro px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-royal-ink">
                  Portada
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-royal-ink/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeCover(index)}
                    title="Usar como portada"
                    className="rounded-full bg-white/90 p-2 text-oro-deep transition-transform hover:scale-110"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  title="Eliminar imagen"
                  className="rounded-full bg-white/90 p-2 text-red-500 transition-transform hover:scale-110"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {values.images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={processing}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-oro/40 text-oro-deep transition-all duration-300 hover:border-oro hover:bg-oro/5 disabled:opacity-50"
            >
              {processing ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <ImagePlus className="h-6 w-6" />
              )}
              <span className="px-2 text-center text-xs font-semibold">
                {processing ? 'Procesando…' : 'Subir imagen'}
              </span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="mt-2 text-xs text-royal/50">
          Las imágenes se comprimen y guardan automáticamente en la base de datos (base64).
        </p>
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
            Descuento (%)
          </label>
          <input
            type="number"
            min={0}
            max={90}
            value={values.discount}
            onChange={(e) => set('discount', Number(e.target.value))}
            className="input-luxe"
          />
          {discountedPreview !== null && (
            <p className="mt-1.5 text-xs font-semibold text-oro-deep">
              Precio final: {formatPrice(discountedPreview)}
            </p>
          )}
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

        <div className="flex items-center sm:col-span-2">
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
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || processing}
          className="btn-gold disabled:opacity-60"
        >
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
