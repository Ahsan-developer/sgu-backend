import { Chat } from "../models/chatModel";
import { Message } from "../models/messageModel";
import { Types } from "mongoose";

export const ChatService = {
  async createChat(participantIds: Types.ObjectId[]) {
    return await Chat.create({ participants: participantIds });
  },

  async getChatsByUser(userId: string) {
    return await Chat.find({ participants: userId })
      .populate("participants")
      .sort({ updatedAt: -1 });
  },

  async sendMessage(chatId: string, senderId: string, content: string) {
    return await Message.create({
      chat: new Types.ObjectId(chatId),
      sender: new Types.ObjectId(senderId),
      content,
    });
  },

  async getMessagesByChat(chatId: string) {
    return await Message.find({ chat: chatId })
      .populate("sender", "name") // customize as needed
      .sort({ createdAt: 1 });
  },

  async getChatById(chatId: string) {
    return await Chat.findById(chatId).populate("participants");
  },
};
