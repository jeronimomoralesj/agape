/**
 * Server-side helpers for pepa (bead) colors.
 *
 * The configurator and the orders API both read the available colors from
 * the database. The first time the collection is empty, it is seeded from the
 * original hardcoded palette in `customBracelet.ts` so nothing breaks during
 * the migration and existing orders keep resolving their bead ids.
 */
import { dbConnect } from './db';
import Pepa, { type PepaDoc } from '@/models/Pepa';
import { BEADS } from './customBracelet';

export interface PepaRecord {
  _id: string;
  /** Stable id used in cart items / orders (the Mongo `slug`) */
  id: string;
  name: string;
  hex: string;
  light: boolean;
  stock: number;
  isActive: boolean;
}

type LeanPepa = PepaDoc & { _id: unknown };

export function toPepaRecord(doc: LeanPepa): PepaRecord {
  return {
    _id: String(doc._id),
    id: doc.slug,
    name: doc.name,
    hex: doc.hex,
    light: !!doc.light,
    stock: doc.stock ?? 0,
    isActive: doc.isActive ?? true,
  };
}

/** Seed the original palette the first time the collection is empty. */
export async function ensurePepasSeeded(): Promise<void> {
  const count = await Pepa.estimatedDocumentCount();
  if (count > 0) return;
  await Pepa.insertMany(
    BEADS.map((b, i) => ({
      slug: b.id,
      name: b.name,
      hex: b.hex,
      light: !!b.light,
      stock: 100,
      isActive: true,
      order: i,
    })),
    { ordered: false }
  ).catch(() => {
    /* ignore races — another request may have seeded first */
  });
}

export async function getPepas(includeInactive = false): Promise<PepaRecord[]> {
  await dbConnect();
  await ensurePepasSeeded();
  const query = includeInactive ? {} : { isActive: true };
  const docs = await Pepa.find(query).sort({ order: 1, createdAt: 1 }).lean();
  return docs.map((d) => toPepaRecord(d as LeanPepa));
}

/** Kebab-case slug from a color name, accent-folded. */
export function slugifyPepa(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'pepa'
  );
}
