import { Router } from "express";
import { fetchAllUsers, registerUser } from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/all", authenticateToken, fetchAllUsers);
router.post("/register", registerUser);

export default router;
