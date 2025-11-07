import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20"
});

export default async function handler(req, res) {
  try {
    // Create a tiny test PaymentIntent ($1.00 in USD, test mode)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100,            // amount in cents
      currency: "usd",
      payment_method_types: ["card"]
    });

    res.status(200).json({
      ok: true,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      error: err.message || "Stripe error"
    });
  }
}
