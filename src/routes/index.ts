import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoute from "./authRoute";
import postRoute from "./postRoute";
const router = Router();

router.use("/login", authRoute);
router.use("/user", userRoutes);
router.use("/posts", postRoute);

export default router;
