import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerDetails: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
    },
    items: [
      {
        // Product ObjectId as string, or "custom-…" for personalized bracelets
        productId: { type: String, required: true },
        title: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped'],
      default: 'Pending',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export type OrderDoc = InferSchemaType<typeof OrderSchema>;

const Order: Model<OrderDoc> =
  mongoose.models.Order || mongoose.model<OrderDoc>('Order', OrderSchema);

export default Order;
