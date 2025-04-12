import { Chat } from "../models/chatModel";
import { Message } from "../models/messageModel";
import { Types } from "mongoose";

export const ChatService = {
  async createChat(participantIds: Types.ObjectId[]) {
    // Sort participant IDs for consistent matching (regardless of order)
    const sortedIds = participantIds.map((id) => id.toString()).sort();

    const existingChat = await Chat.findOne({
      participants: { $all: sortedIds, $size: sortedIds.length },
    });

    if (existingChat) {
      return existingChat;
    }

    return await Chat.create({ participants: sortedIds });
  },

  async getChatsByUser(userId: string) {
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name") // only get participant names
      .sort({ updatedAt: -1 });

    const formattedChats = await Promise.all(
      chats.map(async (chat) => {
        // Get last message
        const lastMessage = await Message.findOne({ chat: chat._id })
          .sort({ createdAt: -1 })
          .lean();

        // Get the other participant (excluding the current user)
        const otherParticipant = (
          chat.participants as unknown as { _id: any; name: string }[]
        ).find((participant) => participant._id.toString() !== userId);

        return {
          chatId: chat._id,
          senderName: otherParticipant?.name || "Unknown",
          lastMessage: lastMessage
            ? {
                text: lastMessage.content,
                dateTime: lastMessage.createdAt,
              }
            : {
                text: "No message yet",
                dateTime: chat.updatedAt,
              },
        };
      })
    );
    return formattedChats;
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
      .sort({ createdAt: -1 });
  },

  async getChatById(chatId: string) {
    return await Chat.findById(chatId).populate("participants");
  },
};
