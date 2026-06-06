import { dbConnect } from './db';
import BlogPostModel from '@/models/BlogPost';
import type { BlogPost } from './types';

/** Published posts, newest first. Degrades to [] if the DB is unreachable. */
export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  try {
    await dbConnect();
    const docs = await BlogPostModel.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(docs));
  } catch (error) {
    console.error('fetchPublishedPosts: base de datos no disponible', error);
    return [];
  }
}

export async function fetchPostById(id: string): Promise<BlogPost | null> {
  try {
    await dbConnect();
    const doc = await BlogPostModel.findOne({ _id: id, isPublished: true }).lean();
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  } catch (error) {
    console.error('fetchPostById: base de datos no disponible', error);
    return null;
  }
}

/** First ~160 chars of a post's content, for cards and meta descriptions. */
export function excerpt(content: string, length = 160): string {
  const text = content.replace(/\s+/g, ' ').trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
