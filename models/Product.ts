import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    category: {
      type: String,
      required: true,
      enum: ['Gozosos', 'Dolorosos', 'Gloriosos', 'Luminosos'],
    },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
    spiritualMeaning: { type: String, default: '' },
    materials: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export type ProductDoc = InferSchemaType<typeof ProductSchema>;

// Reuse the compiled model across hot reloads / lambda invocations
const Product: Model<ProductDoc> =
  mongoose.models.Product || mongoose.model<ProductDoc>('Product', ProductSchema);

export default Product;
