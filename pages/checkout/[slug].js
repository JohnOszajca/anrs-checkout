import { useRouter } from "next/router";
import { useState, useMemo } from "react";
import { EVENTS } from "../../config/events";

export default function CheckoutPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const event = useMemo(() => {
    if (!slug) return null;
    return EVENTS[slug] || null;
  }, [slug]);

  // Old test button: calls /api/stripe-test
  async function handleTestPayment() {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/stripe-test");
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ ok: false, error: err.message || "Network error" });
    } finally {
      setTestLoading(false);
    }
  }

  // New button: create Checkout Session and redirect to Stripe
  async function handleStartCheckout() {
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug })
      });

      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(
          data.error || "Something went wrong starting checkout."
        );
      }
    } catch (err) {
      setCheckoutError(err.message || "Network error starting checkout.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  const eventTitle = event?.name || (slug ? `Checkout – ${slug}` : "Loading...");
  const priceDisplay =
    typeof event?.priceCents === "number"
      ? (event.priceCents / 100).toFixed(2)
      : null;
  const currency = event?.currency?.toUpperCase() || "USD";

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>{eventTitle}</h1>

      {event ? (
        <>
          <p>{event.description}</p>
          {priceDisplay && (
            <p>
              Ticket price: <strong>{priceDisplay} {currency}</strong>
            </p>
          )}
        </>
      ) : (
        <p>
          {slug
            ? "Unknown event slug. This page might not be configured yet."
            : "Loading event..."}
        </p>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Test Checkout Flow</h2>
      <p>
        This button will create a <strong>test</strong> ticket session for this event
        and redirect you to Stripe&apos;s hosted payment page (test mode only).
      </p>

      <button
        onClick={handleStartCheckout}
        disabled={checkoutLoading || !event}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          cursor: checkoutLoading ? "default" : "pointer",
          marginBottom: "0.75rem"
        }}
      >
        {checkoutLoading ? "Starting checkout..." : "Start test checkout"}
      </button>

      {checkoutError && (
        <p style={{ color: "red" }}>Error: {checkoutError}</p>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Stripe Connectivity Test</h2>
      <p>
        This is the previous test button that just calls <code>/api/stripe-test</code>.
      </p>

      <button
        onClick={handleTestPayment}
        disabled={testLoading}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          cursor: testLoading ? "default" : "pointer"
        }}
      >
        {testLoading ? "Talking to Stripe..." : "Run Stripe Test"}
      </button>

      {testResult && (
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
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
