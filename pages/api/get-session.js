import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20"
});

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (!session_id) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing session_id query parameter" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"]
    });

    return res.status(200).json({
      ok: true,
      session
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      error: err.message || "Error retrieving session"
    });
  }
}
