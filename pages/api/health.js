export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: "ANRS Checkout Service",
    ts: Date.now()
  });
}
