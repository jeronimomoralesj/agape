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
import { BEADS, type PepaKind } from './customBracelet';

export interface PepaRecord {
  _id: string;
  /** Stable id used in cart items / orders (the Mongo `slug`) */
  id: string;
  name: string;
  hex: string;
  light: boolean;
  /** Devotional family — María (small) or Jesús (intersection) */
  kind: PepaKind;
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
    // Older docs predate the field — default them to María.
    kind: doc.kind === 'jesus' ? 'jesus' : 'maria',
    stock: doc.stock ?? 0,
    isActive: doc.isActive ?? true,
  };
}

function seedDocs(kind: PepaKind, orderBase: number) {
  return BEADS.map((b, i) => ({
    slug: kind === 'jesus' ? `${b.id}-jesus` : b.id,
    name: b.name,
    hex: b.hex,
    light: !!b.light,
    kind,
    stock: 100,
    isActive: true,
    order: orderBase + i,
  }));
}

/**
 * Make sure both pepa families exist. Fresh installs get the full María +
 * Jesús palette; installs that predate the `kind` field (María only) get the
 * Jesús set backfilled so the configurator's second picker is never empty.
 */
export async function ensurePepasSeeded(): Promise<void> {
  const total = await Pepa.countDocuments();
  if (total === 0) {
    await Pepa.insertMany(
      [...seedDocs('maria', 0), ...seedDocs('jesus', BEADS.length)],
      { ordered: false }
    ).catch(() => {
      /* ignore races — another request may have seeded first */
    });
    return;
  }
  const jesusCount = await Pepa.countDocuments({ kind: 'jesus' });
  if (jesusCount === 0) {
    await Pepa.insertMany(seedDocs('jesus', total), { ordered: false }).catch(() => {
      /* ignore races / pre-existing slugs */
    });
  }
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
