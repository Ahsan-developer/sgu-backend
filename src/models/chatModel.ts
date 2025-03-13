import mongoose, { Schema } from "mongoose";
import { IChat } from "../types";
import Message from "./messageModel";

const ChatModel: Schema = new mongoose.Schema(
  {
    participants: [
      {
        type: String,
        required: true,
      },
    ],
    messages: [Message],
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", ChatModel);

export default Chat;
