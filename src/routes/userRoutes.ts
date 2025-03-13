import { RequestHandler, Router } from "express";
import {
  fetchAllUsers,
  registerUser,
  getUser,
  updateUser,
  deleteUser,
  uploadProfilePicture,
} from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { upload } from "../config/multerConfig";

const router = Router();

router.get("/all", authenticateToken, fetchAllUsers);
router.post("/register", registerUser);
router.get("/me", authenticateToken, getUser as any);
router.put("/update/:id", authenticateToken, updateUser);
router.delete("/delete/:id", authenticateToken, deleteUser);
router.post(
  "/upload-profile",
  authenticateToken,
  upload.single("profilePicture"),
  uploadProfilePicture
);
export default router;
