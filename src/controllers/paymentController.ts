import { Request, Response } from "express";
import stripe from "../config/stripe";
import { IPost } from "../models/postModel";

interface ProductType extends IPost {
  quantity?: number;
}

/**
 * @swagger
 * /api/payments/create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session
 *     description: Initiates a Stripe checkout session for payment processing.
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the product.
 *                     price:
 *                       type: number
 *                       description: Price of the product in cents.
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product.
 *                     vendorId:
 *                       type: string
 *                       description: Stripe Vendor ID (Stripe Connect).
 *     responses:
 *       200:
 *         description: Successfully created Stripe Checkout session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Stripe session ID.
 *       400:
 *         description: Bad request, missing required fields.
 *       500:
 *         description: Internal server error.
 */

export const createCheckoutSession = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Products array is required" });
    }

    const lineItems = products.map((product: ProductType) => ({
      price_data: {
        currency: "usd",
        product_data: { name: product.name },
        unit_amount: Math.round(product.price * 100), // Convert to cents safely
      },
      quantity: product.quantity ?? 1, // Default quantity to 1
    }));

    const amount = products.reduce(
      (total, product) => total + product.price * 100 * (product.quantity ?? 1),
      0
    );
    const platformFee = Math.round(amount * 0.05); // 5% Platform Fee
    console.log(`💸 Platform Fee (Cents): ${platformFee}`);
    const vendorIds = [...new Set(products.map((p) => p.creatorId))];
    // Explicitly create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        vendorIds: JSON.stringify(vendorIds),
        platformFee: platformFee,
      },
    });

    console.log(`🛒 PaymentIntent Created: ${paymentIntent.id}`);

    // Create the checkout session and attach the paymentIntent
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      payment_intent_data: {
        setup_future_usage: "off_session", // Save for later if needed
      },
      line_items: lineItems,
      success_url: `http://192.168.8.100:3000/api/payments/success`,
      cancel_url: `http://192.168.8.100:3000/api/payments/cancel`,
      metadata: {
        vendorIds: JSON.stringify(vendorIds),
        paymentIntentId: paymentIntent.id,
        platformFee: platformFee,
      },
    });

    console.log(`✅ Stripe Session Created: ${session}`, session);
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2023-10-16" }
    );
    res.json({
      sessionId: session.id,
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error) {
    console.error("❌ Stripe Checkout Error:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
