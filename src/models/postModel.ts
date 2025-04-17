import mongoose, { Schema, Document } from "mongoose";

export interface IRoommatePreferences {
  gender?: "male" | "female" | "any";
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  occupation?: string;
  location?: string;
  age?: number;
  availabilityDate?: Date;
}

export interface IPost extends Document {
  name: string;
  title: string;
  images: string[];
  description: string;
  category: string;
  price: number;
  stock: number;
  isPublished: boolean;
  status: "draft" | "published" | "archived" | "sold" | "rented";
  isPremium: boolean;
  creatorId: mongoose.Types.ObjectId | string;
  roommatePreferences?: IRoommatePreferences;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    images: { type: [String] },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    creatorId: { type: String, required: true },

    // Roommate-specific optional fields
    roommatePreferences: {
      gender: { type: String, enum: ["male", "female", "any"], default: "any" },
      petsAllowed: { type: Boolean },
      smokingAllowed: { type: Boolean },
      occupation: { type: String },
      location: { type: String },
      age: { type: Number },
      availabilityDate: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
