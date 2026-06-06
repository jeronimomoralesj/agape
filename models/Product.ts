import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    /** Discount percentage (0–90). Final price = price * (1 - discount/100) */
    discount: { type: Number, min: 0, max: 90, default: 0 },
    /** Up to 4 images: base64 data-URLs (admin uploads) or regular URLs */
    images: {
      type: [String],
      default: [],
      validate: [
        (arr: string[]) => arr.length <= 4,
        'Máximo 4 imágenes por producto',
      ],
    },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
    /** Product page views, incremented by /api/products/[id]/view */
    views: { type: Number, default: 0, min: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export type ProductDoc = InferSchemaType<typeof ProductSchema>;

// Reuse the compiled model across hot reloads / lambda invocations
const Product: Model<ProductDoc> =
  mongoose.models.Product || mongoose.model<ProductDoc>('Product', ProductSchema);

export default Product;
