import express from "express";
import * as postController from "../controllers/postController";

const router = express.Router();

router.get("/", postController.getAllPosts);
router.get("/post/:userId", postController.getUserPosts);
router.get("/:postId", postController.getPostById);
router.post("/create", postController.createPost);
router.put("/:postId", postController.updatePost);
router.delete("/:postId", postController.deletePost);

export default router;
