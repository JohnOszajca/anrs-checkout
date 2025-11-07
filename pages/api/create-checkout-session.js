import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20"
});

// IMPORTANT: this should be your deployed Vercel URL:
const YOUR_DOMAIN = "https://anrs-checkout.vercel.app";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { slug } = req.body || {};
    const eventSlug = slug || "test-event";

    // For now: hard-coded $10 test ticket
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 1000, // $10.00 in cents
            product_data: {
              name: `Test ticket for ${eventSlug}`
            }
          },
          quantity: 1
        }
      ],
      success_url: `${YOUR_DOMAIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/checkout/${eventSlug}?canceled=1`
    });

    return res.status(200).json({ ok: true, url: session.url });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, error: err.message || "Stripe error" });
  }
}
