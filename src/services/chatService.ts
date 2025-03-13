import Chat from "../models/chatModel";
import Message from "../models/messageModel";

// Service to create a new chat
export const createChatService = async (participants: string[]) => {
  return await Chat.create({ participants, messages: [] });
};

export const addMessageToChatService = async (
  chatId: string,
  participant_id: string,
  message: string
) => {
  const newMessage = await Message.create({ participant_id, message });
  return await Chat.findByIdAndUpdate(
    chatId,
    { $push: { messages: newMessage._id } },
    { new: true }
  ).populate("messages");
};

// Service to get all chats
export const getAllChatsService = async () => {
  return await Chat.find().populate("messages");
};
