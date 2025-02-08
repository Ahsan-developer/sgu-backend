import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoute from "./authRoute";

const router = Router();

router.use("/login", authRoute);
router.use("/users", userRoutes);

export default router;
