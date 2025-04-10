import Stripe from "stripe";
import { Request, Response } from "express";
import stripe from "../config/stripe";
import { getPostById } from "./postService";
import { getUserById } from "./userService";

export const createCheckoutSession = async (products: any[]) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("Products array is required");
  }
  console.log(products, "products");
  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: { name: product.name },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: product.quantity ?? 1,
  }));

  const vendorProductInfo = products.map((p) => ({
    creatorId: p.creatorId,
    price: p.price,
    quantity: p.quantity ?? 1,
    postId: p._id,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: `http://192.168.8.100:3000/success`,
    cancel_url: `http://192.168.8.100:3000/cancel`,
    metadata: {
      vendorProductInfo: JSON.stringify(vendorProductInfo),
    },
  });

  return { sessionId: session.id, sessionUrl: session.url };
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  console.log(event, " event");
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const vendorProductInfo = JSON.parse(
      session.metadata?.vendorProductInfo || "[]"
    );
    const paymentIntentId = session.payment_intent as string;

    for (const item of vendorProductInfo) {
      const totalAmount = Math.round(item.price * 100 * (item.quantity ?? 1));
      const post = await getPostById(item.postId);
      const isPremium = post?.isPremium ?? false;

      const feePercent = isPremium ? 0.2 : 0.05;
      const appFee = Math.round(totalAmount * feePercent);
      const vendorAmount = totalAmount - appFee;

      const user = await getUserById(item.creatorId);
      if (!user?.stripeAccountId) {
        console.warn(`No Stripe account ID for user ${item.creatorId}`);
        continue;
      }

      await stripe.transfers.create({
        amount: vendorAmount,
        currency: "usd",
        destination: user.stripeAccountId,
        transfer_group: paymentIntentId,
      });

      console.log(`✅ Sent $${vendorAmount / 100} to ${user.stripeAccountId}`);
    }
  }

  res.status(200).json({ received: true });
};
