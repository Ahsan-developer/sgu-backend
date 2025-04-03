//@ts-nocheck
import express from "express";
import { createCheckoutSession } from "../controllers/paymentController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/create-checkout-session",
  authenticateToken,
  createCheckoutSession
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event type
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("✅ Payment successful for session:", session.id);

        // 1. Retrieve payment intent (if applicable)
        if (session.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent as string
          );
          console.log("💰 PaymentIntent:", paymentIntent.id);
        }

        // 2. Update your database (mark order as paid)
        // Example: updateOrderStatus(session.id, "paid");

        // 3. Process Vendor Payouts if needed (Stripe Connect)
        const vendorIds = JSON.parse(session.metadata?.vendorIds || "[]");
        console.log("📦 Vendors to pay:", vendorIds);

        // 4. Send confirmation email, notifications, etc.

        break;

      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

export default router;
