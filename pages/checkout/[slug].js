import { useRouter } from "next/router";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleTestPayment() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/stripe-test");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ ok: false, error: err.message || "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Checkout – {slug || "Loading..."}</h1>
      <p>
        This page will eventually sell tickets for a specific event (like
        Franklin, Maryville, etc).
      </p>

      <hr style={{ margin: "2rem 0" }} />

      <h2>Stripe Test</h2>
      <p>
        Click the button below to ask the server to create a test PaymentIntent
        with Stripe (no real money).
      </p>

      <button
        onClick={handleTestPayment}
        disabled={loading}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          cursor: loading ? "default" : "pointer"
        }}
      >
        {loading ? "Talking to Stripe..." : "Run Stripe Test"}
      </button>

      {result && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3>Result:</h3>
          <pre
            style={{
              background: "#f3f3f3",
              padding: "1rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word"
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
