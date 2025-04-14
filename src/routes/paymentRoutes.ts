//@ts-nocheck
import express from "express";
import {
  createAccountLink,
  createCheckoutSession,
  handleStripeWebhook,
} from "../controllers/paymentController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/create-checkout-session",
  authenticateToken,
  createCheckoutSession
);
router.post("/stripe/connect", authenticateToken, createAccountLink);

export default router;
