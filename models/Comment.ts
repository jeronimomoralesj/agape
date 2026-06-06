import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const CommentSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export type CommentDoc = InferSchemaType<typeof CommentSchema>;

const Comment: Model<CommentDoc> =
  mongoose.models.Comment || mongoose.model<CommentDoc>('Comment', CommentSchema);

export default Comment;
