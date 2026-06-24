'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Save, X } from 'lucide-react';
import type { Pepa } from '@/lib/types';

export interface PepaFormValues {
  name: string;
  hex: string;
  light: boolean;
  kind: 'maria' | 'jesus';
  stock: number;
  isActive: boolean;
}

const EMPTY: PepaFormValues = {
  name: '',
  hex: '#EBD4BE',
  light: false,
  kind: 'maria',
  stock: 0,
  isActive: true,
};

export default function PepaForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Pepa | null;
  onSubmit: (values: PepaFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<PepaFormValues>(
    initial
      ? {
          name: initial.name,
          hex: initial.hex,
          light: initial.light,
          kind: initial.kind,
          stock: initial.stock,
          isActive: initial.isActive,
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof PepaFormValues>(key: K, value: PepaFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const validHex = /^#([0-9a-fA-F]{6})$/.test(values.hex);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validHex) {
      setError('El color debe tener el formato #RRGGBB.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        ...values,
        name: values.name.trim(),
        stock: Math.max(0, Number(values.stock) || 0),
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
          {initial ? 'Editar color' : 'Nuevo color'}
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

      {/* ── Live swatch preview ── */}
      <div className="flex items-center gap-4">
        <span
          className="h-16 w-16 shrink-0 rounded-full ring-1 ring-royal/15"
          style={{
            background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.7), rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.12)), ${
              validHex ? values.hex : '#EBD4BE'
            }`,
          }}
        />
        <p className="text-sm text-royal/55">
          Así se verá la pepa en el configurador. {values.light && 'Con borde para tonos claros.'}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-royal">Nombre</label>
          <input
            required
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Champaña Suave"
            className="input-luxe"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-royal">Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={validHex ? values.hex : '#EBD4BE'}
              onChange={(e) => set('hex', e.target.value.toUpperCase())}
              className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-royal/15 bg-white p-1"
              aria-label="Selector de color"
            />
            <input
              value={values.hex}
              onChange={(e) => set('hex', e.target.value.toUpperCase())}
              placeholder="#EBD4BE"
              className="input-luxe font-mono"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-royal">
            Tipo de pepa
          </label>
          <div className="flex gap-2">
            {([
              { value: 'maria', label: 'Ave María', hint: 'pepas pequeñas' },
              { value: 'jesus', label: 'Padre Nuestro', hint: 'pepas de intersección' },
            ] as const).map((opt) => {
              const active = values.kind === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('kind', opt.value)}
                  aria-pressed={active}
                  className={`flex-1 rounded-2xl border px-4 py-3 text-left transition-colors ${
                    active
                      ? 'border-oro bg-oro/10 text-royal shadow-aura-soft'
                      : 'border-royal/15 text-royal/60 hover:border-oro/50'
                  }`}
                >
                  <span className="block text-sm font-semibold">{opt.label}</span>
                  <span className="block text-xs text-royal/50">{opt.hint}</span>
                </button>
              );
            })}
          </div>
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

        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-royal">
          <input
            type="checkbox"
            checked={values.light}
            onChange={(e) => set('light', e.target.checked)}
            className="h-4 w-4 accent-[#D4AF37]"
          />
          Tono claro (con borde)
        </label>

        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-royal">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => set('isActive', e.target.checked)}
            className="h-4 w-4 accent-[#D4AF37]"
          />
          Disponible en el configurador
        </label>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-gold disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {initial ? 'Guardar cambios' : 'Crear color'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancelar
        </button>
      </div>
    </motion.form>
  );
}
