'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, Loader2, Save, Trash2, X } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import type { BlogPost } from '@/lib/types';
import { fileToCompressedDataUrl } from '@/lib/imageCompress';

export interface BlogFormValues {
  title: string;
  content: string;
  image: string;
  isPublished: boolean;
}

const EMPTY: BlogFormValues = {
  title: '',
  content: '',
  image: '',
  isPublished: true,
};

export default function BlogForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: BlogPost | null;
  onSubmit: (values: BlogFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<BlogFormValues>(
    initial
      ? {
          title: initial.title,
          content: initial.content,
          image: initial.image ?? '',
          isPublished: initial.isPublished,
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleFile = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setError(null);
    setProcessing(true);
    try {
      // Cover images can be a bit larger than product shots
      set('image', await fileToCompressedDataUrl(file, 1400, 0.82));
    } catch {
      setError('No se pudo leer la imagen. Intenta con otro archivo.');
    } finally {
      setProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
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
          {initial ? 'Editar entrada' : 'Nueva entrada'}
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

      {/* Cover image */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-royal">
          Imagen de portada <span className="font-normal text-royal/50">(opcional)</span>
        </label>
        {values.image ? (
          <div className="group relative aspect-[16/9] max-w-xl overflow-hidden rounded-2xl border border-oro/25">
            <SmartImage
              src={values.image}
              alt="Portada"
              fill
              sizes="576px"
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-royal-ink/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => set('image', '')}
                title="Eliminar imagen"
                className="rounded-full bg-white/90 p-2.5 text-red-500 transition-transform hover:scale-110"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={processing}
            className="flex aspect-[16/9] w-full max-w-xl flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-oro/40 text-oro-deep transition-all duration-300 hover:border-oro hover:bg-oro/5 disabled:opacity-50"
          >
            {processing ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <ImagePlus className="h-6 w-6" />
            )}
            <span className="text-xs font-semibold">
              {processing ? 'Procesando…' : 'Subir imagen de portada'}
            </span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFile(e.target.files)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-royal">Título</label>
        <input
          required
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="El poder de rezar el rosario en familia"
          className="input-luxe"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-royal">Contenido</label>
        <textarea
          required
          rows={12}
          value={values.content}
          onChange={(e) => set('content', e.target.value)}
          placeholder="Escribe aquí tu reflexión… Los saltos de línea se respetan al publicar."
          className="input-luxe resize-y"
        />
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-3 text-sm font-semibold text-royal">
        <input
          type="checkbox"
          checked={values.isPublished}
          onChange={(e) => set('isPublished', e.target.checked)}
          className="h-4 w-4 accent-[#D4AF37]"
        />
        Publicada (visible en el blog)
      </label>

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
          {initial ? 'Guardar cambios' : 'Crear entrada'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancelar
        </button>
      </div>
    </motion.form>
  );
}
