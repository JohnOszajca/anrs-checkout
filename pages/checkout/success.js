import { useRouter } from "next/router";

export default function SuccessPage() {
  const router = useRouter();
  const { session_id } = router.query;

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Payment successful ✅</h1>
      <p>
        In the real app, this is where we&apos;ll generate tickets, email them,
        and show an order summary.
      </p>
      {session_id && (
        <p>
          Stripe session id: <code>{session_id}</code>
        </p>
      )}
      <p style={{ marginTop: "1.5rem" }}>
        <a href="/checkout/test-event">Back to test checkout</a>
      </p>
    </main>
  );
}
