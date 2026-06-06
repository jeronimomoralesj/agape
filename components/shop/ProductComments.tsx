'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MessageCircleHeart, Send } from 'lucide-react';

interface CommentItem {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ProductComments({ productId }: { productId: string }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/products/${productId}/comments`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => Array.isArray(data) && setComments(data))
      .catch(() => {});
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${productId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo publicar');
      setComments((prev) => [data, ...prev]);
      setName('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mx-auto mt-20 max-w-3xl">
      <div className="text-center">
        <p className="section-eyebrow flex items-center justify-center gap-2">
          <MessageCircleHeart className="h-4 w-4" />
          Comentarios
        </p>
        <h2 className="mt-3 font-serif text-3xl font-bold text-royal">
          Comparte tu experiencia
        </h2>
        <div className="gold-divider mt-5" />
      </div>

      {/* Form — always visible */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-10 space-y-4 rounded-3xl border border-oro/20 bg-white/75 p-6 shadow-card sm:p-8"
      >
        <div>
          <label htmlFor="comment-name" className="mb-1.5 block text-sm font-semibold text-royal">
            Tu nombre
          </label>
          <input
            id="comment-name"
            required
            minLength={2}
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="María Camila"
            className="input-luxe"
          />
        </div>
        <div>
          <label htmlFor="comment-message" className="mb-1.5 block text-sm font-semibold text-royal">
            Tu comentario
          </label>
          <textarea
            id="comment-message"
            required
            minLength={2}
            maxLength={500}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Me encantó la pulsera, los cristales son hermosos…"
            className="input-luxe resize-none"
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}

        <button type="submit" disabled={sending} className="btn-gold disabled:opacity-60">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Publicar comentario
        </button>
      </motion.form>

      {/* Comments list — rendered only when there are comments */}
      {comments.length > 0 && (
        <ul className="mt-10 space-y-4">
          <AnimatePresence initial={false}>
            {comments.map((comment) => (
              <motion.li
                key={comment._id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-4 rounded-2xl border border-oro/15 bg-white/70 p-5 shadow-card"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-oro-light to-oro font-serif text-lg font-bold text-royal-ink">
                  {comment.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <p className="font-semibold text-royal">{comment.name}</p>
                    <p className="text-xs text-royal/45">{formatDate(comment.createdAt)}</p>
                  </div>
                  <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-royal/75">
                    {comment.message}
                  </p>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
