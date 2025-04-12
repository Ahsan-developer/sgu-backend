import { Request, Response } from "express";
import { ChatService } from "../services/chatService";
import { AuthenticatedUserRequest } from "../types";

export const createChat = async (req: Request, res: Response) => {
  try {
    const { participantIds } = req.body;
    const chat = await ChatService.createChat(participantIds);
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

export const getUserChats = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedUserRequest;
    const chats = await ChatService.getChatsByUser(user.id);
    res.status(200).json({ chats });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const { user } = req as AuthenticatedUserRequest;
    const senderId = user.id;
    const message = await ChatService.sendMessage(chatId, senderId, content);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const messages = await ChatService.getMessagesByChat(chatId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

export const getChat = async (req: Request, res: Response) => {
  try {
    const { chatId } = req?.params;
    const chat = await ChatService.getChatById(chatId);
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
