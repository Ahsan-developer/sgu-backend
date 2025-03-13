import express from "express";
import * as postController from "../controllers/postController";
import { upload } from "../config/multerConfig";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", postController.getPosts);
router.get("/:userId", authenticateToken, postController.getUserPosts);
router.get("/:postId", authenticateToken, postController.getPostById);
router.post(
  "/create",
  authenticateToken,
  upload.single("image"),
  postController.createPost as any
);
router.put(
  "/:postId",
  authenticateToken,
  upload.single("image"),
  postController.updatePost
);
router.delete("/:postId", authenticateToken, postController.deletePost);

export default router;
