import db from "../db/connection.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;

  try {
    const stmt = db.prepare(`DELETE FROM leads WHERE id = ?`);
    stmt.run(id);

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "DB delete failed" });
  }
}
