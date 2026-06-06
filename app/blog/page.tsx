import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';
import { excerpt, fetchPublishedPosts, formatPostDate } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Reflexiones, oración y fe — el blog de Ágape. Amar como Dios nos ama.',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await fetchPublishedPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-14 sm:px-6 lg:px-8">
      <Reveal className="text-center">
        <p className="section-eyebrow">Blog Ágape</p>
        <h1 className="mt-4 font-serif text-4xl font-bold text-royal sm:text-5xl">
          Reflexiones y fe
        </h1>
        <div className="gold-divider mt-6" />
      </Reveal>

      {posts.length === 0 ? (
        <div className="mt-20 flex flex-col items-center gap-4 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-oro/10">
            <BookOpen className="h-7 w-7 text-oro-deep" strokeWidth={1.5} />
          </span>
          <p className="font-serif text-xl text-royal">Aún no hay entradas</p>
          <p className="max-w-sm text-sm text-royal/60">
            Muy pronto compartiremos reflexiones y novedades aquí.
          </p>
        </div>
      ) : (
        <StaggerGroup className="mt-14 space-y-8">
          {posts.map((post) => (
            <StaggerItem key={post._id}>
              <Link
                href={`/blog/${post._id}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-oro/15 bg-white/80 shadow-card transition-shadow duration-500 hover:shadow-luxe sm:flex-row"
              >
                {post.image && (
                  <span className="relative aspect-[16/9] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-72">
                    <SmartImage
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 288px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </span>
                )}
                <span className="flex flex-1 flex-col justify-center p-6 sm:p-8">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-oro-deep">
                    {formatPostDate(post.createdAt)}
                  </span>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-royal transition-colors duration-300 group-hover:text-oro-deep">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-royal/65">
                    {excerpt(post.content)}
                  </p>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-royal/50 transition-colors group-hover:text-oro-deep">
                    Leer más →
                  </span>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
