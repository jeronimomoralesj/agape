import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import JsonLd from '@/components/seo/JsonLd';
import { excerpt, fetchPostById, formatPostDate } from '@/lib/blog';
import { SITE_URL, articleJsonLd, breadcrumbJsonLd, postImageUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPostById(params.id);
  if (!post) return { title: 'Entrada no encontrada', robots: { index: false } };
  const image = postImageUrl(post);
  return {
    title: post.title,
    description: excerpt(post.content),
    alternates: { canonical: `/blog/${post._id}` },
    openGraph: {
      type: 'article',
      locale: 'es_CO',
      url: `${SITE_URL}/blog/${post._id}`,
      title: post.title,
      description: excerpt(post.content),
      publishedTime: post.createdAt,
      ...(image ? { images: [{ url: image, alt: post.title }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: post.title,
      description: excerpt(post.content),
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await fetchPostById(params.id);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
      <JsonLd data={articleJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Tienda', url: SITE_URL },
          { name: 'Blog', url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${post._id}` },
        ])}
      />
      <Link
        href="/blog"
        className="group inline-flex items-center gap-2 text-sm font-medium text-royal/60 transition-colors hover:text-royal"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Volver al blog
      </Link>

      <header className="mt-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-oro-deep">
          {formatPostDate(post.createdAt)}
        </p>
        <h1 className="mt-4 text-balance font-serif text-4xl font-bold leading-tight text-royal sm:text-5xl">
          {post.title}
        </h1>
        <div className="gold-divider mt-7" />
      </header>

      {post.image && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl shadow-luxe">
          <SmartImage
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-10 whitespace-pre-line font-sans text-base leading-loose text-royal/80 sm:text-lg">
        {post.content}
      </div>

      <footer className="mt-14 border-t border-oro/20 pt-8 text-center">
        <p className="font-serif text-lg italic text-oro-deep">
          “Él sana a los de corazón herido y venda sus heridas” — Salmo 147:3
        </p>
        <Link href="/" className="btn-ghost mt-6">
          Visitar la tienda
        </Link>
      </footer>
    </article>
  );
}
