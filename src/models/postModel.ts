import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  name: string;
  image: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  isPublished: boolean;
  status: "draft" | "published" | "archived";
  creatorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    creatorId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
