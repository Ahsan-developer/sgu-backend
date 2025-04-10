import { Router } from "express";
import { ChatController } from "../controllers/chatController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/create", authenticateToken, ChatController.createChat);
router.get("/all", authenticateToken, ChatController.getChat);
router.get("/:chatId", authenticateToken, ChatController.getChat);
router.post("/:chatId/message", authenticateToken, ChatController.sendMessage);
router.get("/:chatId/messages", authenticateToken, ChatController.getMessages);

export default router;
