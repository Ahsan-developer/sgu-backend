import { Schema, model, Types, Document } from "mongoose";

export interface IMessage extends Document {
  chat: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Message = model<IMessage>("Message", MessageSchema);
