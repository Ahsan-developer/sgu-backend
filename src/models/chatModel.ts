import { Schema, model, Types, Document } from "mongoose";

export interface IChat extends Document {
  participants: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
  },
  { timestamps: true }
);

export const Chat = model<IChat>("Chat", ChatSchema);
