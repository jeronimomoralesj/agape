import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    /** Optional cover image: base64 data-URL (admin upload) or regular URL */
    image: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export type BlogPostDoc = InferSchemaType<typeof BlogPostSchema>;

const BlogPost: Model<BlogPostDoc> =
  mongoose.models.BlogPost || mongoose.model<BlogPostDoc>('BlogPost', BlogPostSchema);

export default BlogPost;
