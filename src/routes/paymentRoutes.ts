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
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"];
//     let event: Stripe.Event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig!,
//         process.env.STRIPE_WEBHOOK_SECRET!
//       );
//     } catch (err: any) {
//       console.error("Webhook signature verification failed:", err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     try {
//       // Handle the event type
//       switch (event.type) {
//         case "checkout.session.completed":
//           await handleCheckoutSessionCompleted(
//             event.data.object as Stripe.Checkout.Session
//           );
//           break;

//         case "account.updated":
//           await handleAccountUpdated(event.data.object as Stripe.Account);
//           break;

//         case "account.external_account.created":
//           await handleBankAccountAdded(event.data.object);
//           break;

//         case "identity.verification_session.verified":
//           await handleIdentityVerified(event.data.object);
//           break;

//         case "account.application.deauthorized":
//           await handleAccountDeauthorized(event.data.object);
//           break;

//         default:
//           console.warn(`Unhandled event type: ${event.type}`);
//       }

//       res.json({ received: true });
//     } catch (error: any) {
//       console.error("Webhook handler error:", error);
//       res.status(500).json({ error: error.message });
//     }
//   }
// );

// // --- Handler Functions ---

// async function handleCheckoutSessionCompleted(
//   session: Stripe.Checkout.Session
// ) {
//   console.log("✅ Payment successful for session:", session.id);

//   // 1. Retrieve payment intent if applicable
//   if (session.payment_intent) {
//     const paymentIntent = await stripe.paymentIntents.retrieve(
//       session.payment_intent as string
//     );
//     console.log("💰 PaymentIntent:", paymentIntent.id);
//   }

//   // 2. Update database (mark order as paid)
//   await updateOrderStatus(session.id, "paid");

//   // 3. Process vendor payouts for Stripe Connect
//   if (session.metadata?.vendorIds) {
//     const vendorIds = JSON.parse(session.metadata.vendorIds);
//     console.log("📦 Vendors to pay:", vendorIds);
//     await processVendorPayouts(vendorIds, session.amount_total || 0);
//   }

//   // 4. Send notifications
//   await sendConfirmationEmail(session.customer_email, session.id);
// }

// async function handleAccountUpdated(account: Stripe.Account) {
//   console.log(`🔄 Stripe account updated: ${account.id}`);

//   const isOnboardingComplete =
//     account.charges_enabled && account.payouts_enabled;
//   const currentlyDue = account.requirements?.currently_due || [];

//   // Update user in database
//   await User.findOneAndUpdate(
//     { stripeAccountId: account.id },
//     {
//       stripeOnboardingComplete: isOnboardingComplete,
//       stripeRequirementsDue: currentlyDue,
//       lastStripeUpdate: new Date(),
//     }
//   );

//   if (isOnboardingComplete) {
//     console.log(`🎉 Onboarding complete for account: ${account.id}`);
//     await sendOnboardingCompleteNotification(account.id);
//   } else if (currentlyDue.length > 0) {
//     console.log(
//       `⚠️ Pending requirements for account ${account.id}:`,
//       currentlyDue
//     );
//     await sendOnboardingReminder(account.id, currentlyDue);
//   }
// }

// async function handleBankAccountAdded(externalAccount: any) {
//   const accountId = externalAccount.account;
//   console.log(`🏦 Bank account added to Stripe account: ${accountId}`);

//   await User.findOneAndUpdate(
//     { stripeAccountId: accountId },
//     { hasBankAccount: true, lastStripeUpdate: new Date() }
//   );
// }

// async function handleIdentityVerified(verificationSession: any) {
//   const accountId = verificationSession.metadata?.stripe_account;
//   if (!accountId) return;

//   console.log(`🆔 Identity verified for account: ${accountId}`);

//   await User.findOneAndUpdate(
//     { stripeAccountId: accountId },
//     { identityVerified: true, lastStripeUpdate: new Date() }
//   );
// }

// async function handleAccountDeauthorized(account: any) {
//   console.log(`🚫 Account deauthorized: ${account.id}`);

//   await User.findOneAndUpdate(
//     { stripeAccountId: account.id },
//     {
//       stripeOnboardingComplete: false,
//       stripeConnected: false,
//       deauthorizedAt: new Date(),
//     }
//   );
// }

// // --- Utility Functions ---

// async function updateOrderStatus(sessionId: string, status: string) {
//   // Implement your order status update logic
// }

// async function processVendorPayouts(vendorIds: string[], amount: number) {
//   // Implement vendor payout logic
// }

// async function sendConfirmationEmail(email: string | null, sessionId: string) {
//   if (!email) return;
//   // Implement email sending logic
// }

// async function sendOnboardingCompleteNotification(accountId: string) {
//   // Implement notification logic (email, push, etc.)
// }

// async function sendOnboardingReminder(
//   accountId: string,
//   requirements: string[]
// ) {
//   // Implement reminder logic
// }

export default router;
