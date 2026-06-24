import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

/**
 * A pepa (bead) color available in the "Crea tu pulsera" configurator.
 * `slug` is the stable id used inside cart items and orders — it must NOT
 * change on rename, or existing orders/carts would lose their reference.
 */
const PepaSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    /** 6-digit hex color, e.g. #EBD4BE */
    hex: {
      type: String,
      required: true,
      match: [/^#([0-9a-fA-F]{6})$/, 'Color inválido (usa formato #RRGGBB)'],
    },
    /** true for translucent/light beads that need a visible rim */
    light: { type: Boolean, default: false },
    /** Devotional family: 'maria' = small pepas · 'jesus' = larger intersection pepas */
    kind: { type: String, enum: ['maria', 'jesus'], default: 'maria' },
    /** Units of this color currently in inventory */
    stock: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    /** Display order in the configurator / admin list */
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export type PepaDoc = InferSchemaType<typeof PepaSchema>;

const Pepa: Model<PepaDoc> =
  mongoose.models.Pepa || mongoose.model<PepaDoc>('Pepa', PepaSchema);

export default Pepa;
