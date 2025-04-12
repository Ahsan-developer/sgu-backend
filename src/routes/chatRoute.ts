import { Router } from "express";
import {
  createChat,
  getUserChats,
  sendMessage,
  getMessages,
  getChat,
} from "../controllers/chatController";

import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/create", authenticateToken, createChat);
router.get("/all", authenticateToken, getUserChats);
router.get("/:chatId", authenticateToken, getChat);
router.post("/:chatId/message", authenticateToken, sendMessage);
router.get("/:chatId/messages", authenticateToken, getMessages);

export default router;
