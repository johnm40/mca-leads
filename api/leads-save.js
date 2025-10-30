import db from "../db/connection.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, address, phone, website, email, owner, revenue, filed } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO leads (name, address, phone, website, email, owner, revenue, filed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(name, address, phone, website, email, owner, revenue, filed);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB insert failed" });
  }
}
