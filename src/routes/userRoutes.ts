import { Router } from "express";
import { fetchUsers, addUser } from "../controllers/userController";

const router = Router();

router.get("/", fetchUsers);
router.post("/", addUser);

export default router;
