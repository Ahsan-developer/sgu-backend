import { Request, Response } from "express";
import { ChatService } from "../services/chatService";
import { AuthenticatedUserRequest } from "../types";

export const ChatController = {
  async createChat(req: Request, res: Response) {
    try {
      const { participantIds } = req.body;
      const chat = await ChatService.createChat(participantIds);
      res.status(201).json(chat);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  },

  async getChats(req: AuthenticatedUserRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const chats = await ChatService.getChatsByUser(userId);
      res.status(200).json(chats);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  },

  async sendMessage(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const { content } = req.body;
      const { user } = req as AuthenticatedUserRequest;
      const senderId = user.id;
      const message = await ChatService.sendMessage(chatId, senderId, content);
      res.status(200).json(message);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  },

  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { chatId } = req.params;
      const messages = await ChatService.getMessagesByChat(chatId);
      res.status(200).json(messages);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  },

  async getChat(req: Request, res: Response): Promise<void> {
    try {
      const { chatId } = req.params;
      const chat = await ChatService.getChatById(chatId);
      if (!chat) res.status(404).json({ message: "Chat not found" });
      res.status(200).json(chat);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  },
};
