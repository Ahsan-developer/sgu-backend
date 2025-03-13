import express from "express";
import {
  createChat,
  getAllChats,
  addMessageToChat,
} from "../controllers/chatController";

const router = express.Router();

router.get("/", getAllChats);
router.post("/create", createChat);
router.put("update/:id", addMessageToChat);

export default router;
