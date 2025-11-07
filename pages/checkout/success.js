import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const { session_id } = router.query;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    if (!session_id) return;

    async function fetchSession() {
      setLoading(true);
      setError("");
      setSessionData(null);

      try {
        const res = await fetch(
          `/api/get-session?session_id=${encodeURIComponent(session_id)}`
        );
        const data = await res.json();
        if (data.ok) {
          setSessionData(data.session);
        } else {
          setError(data.error || "Unknown error");
        }
      } catch (err) {
        setError(err.message || "Network error");
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [session_id]);

  const customerEmail = sessionData?.customer_details?.email || "";
  const amountTotal =
    typeof sessionData?.amount_total === "number"
      ? (sessionData.amount_total / 100).toFixed(2)
      : null;
  const currency = sessionData?.currency || "usd";
  const lineItems = sessionData?.line_items?.data || [];

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

      {loading && <p>Loading session details from Stripe...</p>}

      {error && (
        <p style={{ color: "red" }}>
          Error loading session details: {error}
        </p>
      )}

      {sessionData && (
        <div style={{ marginTop: "1.5rem" }}>
          <h2>Order summary (from Stripe)</h2>
          {customerEmail && <p>Customer email: {customerEmail}</p>}
          {amountTotal && (
            <p>
              Amount paid: {amountTotal} {currency.toUpperCase()}
            </p>
          )}

          {lineItems.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>Line items</h3>
              <ul>
                {lineItems.map((item) => (
                  <li key={item.id}>
                    {item.description} &times; {item.quantity} –{" "}
                    {(item.amount_total / 100).toFixed(2)}{" "}
                    {currency.toUpperCase()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: "1.5rem" }}>
            <h3>Raw session data (for debugging now)</h3>
            <pre
              style={{
                background: "#f3f3f3",
                padding: "1rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word"
              }}
            >
              {JSON.stringify(sessionData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <p style={{ marginTop: "1.5rem" }}>
        <a href="/checkout/test-event">Back to test checkout</a>
      </p>
    </main>
  );
}
