// Simple in-code configuration for events.
// Later, this will be replaced by a real database.

export const EVENTS = {
  "test-event": {
    slug: "test-event",
    name: "All Nashville Roadshow – Test Event",
    description: "Test checkout flow for ANRS custom ticketing.",
    currency: "usd",
    priceCents: 1000 // $10.00
  }

  // Example of what a real event might look like later:
  // "franklin-2026-10-10": {
  //   slug: "franklin-2026-10-10",
  //   name: "All Nashville Roadshow – Franklin, TN – Oct 10, 2026",
  //   description: "Outdoor festival show.",
  //   currency: "usd",
  //   priceCents: 7900 // $79.00
  // }
};
