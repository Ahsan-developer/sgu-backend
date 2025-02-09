import { Router } from "express";
import { fetchAllUsers, registerUser } from "../controllers/userController";

const router = Router();

router.get("/", fetchAllUsers);
router.post("/register", registerUser);

export default router;
