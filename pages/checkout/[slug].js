import { useRouter } from "next/router";

export default function CheckoutPage() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Checkout – {slug || "Loading..."}</h1>
      <p>
        This is where people will eventually buy tickets for a specific event.
      </p>
      <p>
        For now, this is just a test page so we can make sure event-specific
        URLs are working.
      </p>
    </main>
  );
}
