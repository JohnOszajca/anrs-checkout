import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  try {
    const client = await pool.connect();

    const result = await client.query(
      "select slug, name, description, currency, price_cents from events order by slug"
    );

    client.release();

    res.status(200).json({
      ok: true,
      events: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      error: err.message || "Database query error"
    });
  }
}
