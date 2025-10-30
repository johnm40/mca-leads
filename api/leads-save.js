import db from "../db/connection.js";

export default function handler(req, res) {
  try {
    const leads = req.body.leads;

    const stmt = db.prepare(`
      INSERT INTO leads (business, phone, address, state, revenue, rating, website)
      VALUES (@business, @phone, @address, @state, @revenue, @rating, @website)
    `);

    leads.forEach(lead => stmt.run(lead));

    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB write failed" });
  }
}
