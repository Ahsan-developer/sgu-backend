import mongoose, { Model, Schema } from "mongoose";
import { IMessage } from "../types";

const MessageModel: Schema = new mongoose.Schema({
  participant_id: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  MessageModel
);

export default Message;
