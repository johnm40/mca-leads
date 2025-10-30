import db from "../db/connection.js";

export default function handler(req, res) {
  try {
    const results = db.prepare("SELECT * FROM leads ORDER BY id DESC").all();
    res.status(200).json(results);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB read failed" });
  }
}
